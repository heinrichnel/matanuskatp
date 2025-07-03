import { onRequest } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";

// Ensure Firebase is initialized
try {
  admin.initializeApp();
} catch (e) {
  console.log("Firebase already initialized");
}

const db = admin.firestore();

interface TripData {
  loadRef: string;
  status?: string;
  shippedStatus?: boolean;
  shippedDate?: string;
  deliveredStatus?: boolean;
  deliveredDate?: string;
  completedStatus?: boolean;
  inProgress?: boolean;
  isCompleted?: boolean;
  isDelivered?: boolean;
  isShipped?: boolean;
  importSource?: string;
  [key: string]: any;
}

interface ProcessingDetail {
  status: 'imported' | 'skipped' | 'error';
  reason?: string;
  loadRef?: string;
  transformedStatus?: string;
  field?: string;
  trip?: TripData;
}

interface ValidationError {
  trip: TripData;
  missingField: string;
  message: string;
}

export const enhancedWebBookImport = onRequest(async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');

    if (req.method === 'OPTIONS') {
        res.set('Access-Control-Allow-Methods', 'GET, POST');
        res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        res.status(204).send('');
        return;
    }

    if (req.method !== 'POST') {
        res.status(405).json({
            error: 'Method Not Allowed',
            message: 'Only POST requests are supported'
        });
        return;
    }

    console.log("[enhancedWebBookImport] Request headers:", JSON.stringify(req.headers, null, 2));

    try {
        const requestBody = req.body;
        console.log("[enhancedWebBookImport] Received payload:", JSON.stringify(requestBody, null, 2));

        if (requestBody.name && requestBody.bucket && requestBody.contentType) {
            console.error("[enhancedWebBookImport] Received Cloud Storage object metadata instead of trips data");
            res.status(400).json({
                error: 'Invalid payload structure',
                message: 'Received Cloud Storage object metadata instead of trips data',
                expected: 'The webhook expects a trips array, not Cloud Storage metadata',
                received: 'Cloud Storage metadata with bucket, name, and contentType'
            });
            return;
        }

        if (!requestBody.trips) {
            console.error("[enhancedWebBookImport] Missing trips array in payload:", JSON.stringify(requestBody, null, 2));
            res.status(400).json({
                error: 'Invalid payload structure',
                message: 'Missing trips array in request body',
                expected: { trips: [] },
                received: requestBody
            });
            return;
        }

        if (!Array.isArray(requestBody.trips)) {
            console.error("[enhancedWebBookImport] trips is not an array:", typeof requestBody.trips);
            res.status(400).json({
                error: 'Invalid payload structure',
                message: 'trips property must be an array',
                expected: { trips: [] },
                received: { trips: requestBody.trips }
            });
            return;
        }

        const { trips } = requestBody as { trips: TripData[] };
        const batch = db.batch();
        const targetCollection = 'trips';
        console.log(`[enhancedWebBookImport] Targeting collection: '${targetCollection}'`);

        let imported = 0;
        let skipped = 0;
        const processingDetails: ProcessingDetail[] = [];
        const validationErrors: ValidationError[] = [];

        const promises = trips.map(async (trip: TripData) => {
            const timestamp = new Date().toISOString();
            console.log(`[enhancedWebBookImport][${timestamp}] Processing trip:`, JSON.stringify(trip, null, 2));

            if (!trip.loadRef) {
                const errorMsg = `Missing required field in trip: loadRef`;
                console.error(`[enhancedWebBookImport] ${errorMsg}`);

                validationErrors.push({
                    trip,
                    missingField: 'loadRef',
                    message: errorMsg
                });

                skipped++;
                processingDetails.push({
                    status: 'error',
                    reason: 'missing_required_field',
                    field: 'loadRef',
                    trip
                });
                return;
            }

            // >>>>>>>>>>>>>>>> HIER IS DIE SKOONMAAK <<<<<<<<<<<<<<<<<<<
            const safeLoadRef = String(trip.loadRef).replace(/[\/\\#?]/g, '-');
            const tripRef = db.collection(targetCollection).doc(safeLoadRef);

            console.log(`[enhancedWebBookImport] Trip ${trip.loadRef} status fields:`, {
                rawStatus: trip.status,
                shippedStatus: trip.shippedStatus,
                deliveredStatus: trip.deliveredStatus,
                completedStatus: trip.completedStatus,
                inProgress: trip.inProgress,
                isCompleted: trip.isCompleted,
                isDelivered: trip.isDelivered,
                isShipped: trip.isShipped
            });

            const doc = await tripRef.get();

            if (doc.exists) {
                console.log(`[enhancedWebBookImport] Trip already exists, skipping: ${trip.loadRef}`);
                skipped++;
                processingDetails.push({
                    status: 'skipped',
                    reason: 'already_exists',
                    loadRef: trip.loadRef
                });
            } else {
                const transformedTrip = { ...trip };

                console.log(`[enhancedWebBookImport][${timestamp}] Processing trip ${trip.loadRef} status transformation:`, {
                    beforeTransform: {
                        rawStatus: trip.status,
                        shippedStatus: trip.shippedStatus,
                        shippedDate: trip.shippedDate,
                        deliveredStatus: trip.deliveredStatus,
                        deliveredDate: trip.deliveredDate,
                        completedStatus: trip.completedStatus,
                        inProgress: trip.inProgress
                    }
                });

                if (trip.shippedStatus === true && trip.shippedDate) {
                    transformedTrip.shippedAt = trip.shippedDate;
                }

                if (trip.deliveredStatus === true && trip.deliveredDate) {
                    transformedTrip.deliveredAt = trip.deliveredDate;
                }

                let updatedStatus = trip.status || 'active';

                if (trip.completedStatus === true) {
                    updatedStatus = 'completed';
                } else if (trip.deliveredStatus === true) {
                    updatedStatus = 'delivered';
                } else if (trip.shippedStatus === true) {
                    updatedStatus = 'shipped';
                }

                transformedTrip.status = updatedStatus;

                transformedTrip.importedVia = 'enhancedWebBookImport';
                transformedTrip.importedAt = timestamp;
                transformedTrip.importSource = trip.importSource || (req.headers['x-source'] as string) || 'webhook';

                console.log(`[enhancedWebBookImport][${timestamp}] Trip ${trip.loadRef} after transformation:`, {
                    afterTransform: {
                        status: transformedTrip.status,
                        shippedAt: transformedTrip.shippedAt,
                        deliveredAt: transformedTrip.deliveredAt
                    }
                });

                batch.set(tripRef, transformedTrip);
                imported++;
                processingDetails.push({
                    status: 'imported',
                    loadRef: trip.loadRef,
                    transformedStatus: transformedTrip.status
                });
            }
        });

        await Promise.all(promises);

        if (imported > 0) {
            console.log(`[enhancedWebBookImport] Committing batch with ${imported} trips`);
            await batch.commit();
            console.log(`[enhancedWebBookImport] Batch commit successful`);
        } else {
            console.log(`[enhancedWebBookImport] No trips to import, skipping batch commit`);
        }

        const response = {
            imported,
            skipped,
            message: `Import process finished. Processed ${trips.length} trips. Imported: ${imported}, Skipped: ${skipped}`,
            processingDetails: processingDetails.length <= 10
                ? processingDetails
                : `${processingDetails.length} trips processed`,
            validationErrors: validationErrors.length > 0 ? validationErrors : undefined
        };

        console.log(`[enhancedWebBookImport] Import finished:`, response);
        res.status(200).json(response);
    } catch (error) {
        console.error("[enhancedWebBookImport] Error processing request:", error);
        console.error("[enhancedWebBookImport] Request body:", JSON.stringify(req.body, null, 2));
        console.error("[enhancedWebBookImport] Stack trace:", error instanceof Error ? error.stack : 'No stack trace');
        res.status(500).json({
            error: 'Internal Server Error',
            message: error instanceof Error ? error.message : 'Unknown error',
            timestamp: new Date().toISOString(),
            requestId: req.headers['x-request-id'] || 'unknown'
        });
    }
});

export const importTripsFromWebBook = enhancedWebBookImport;
