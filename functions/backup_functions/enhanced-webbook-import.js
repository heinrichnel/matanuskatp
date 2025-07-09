"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.enhancedWebBookImport = void 0;
const https_1 = require("firebase-functions/v2/https");
const admin = __importStar(require("firebase-admin"));
// Initialize Firebase only once
if (!admin.apps.length) {
    admin.initializeApp();
}
const db = admin.firestore();
/**
 * Robust WebBook Import Webhook.
 * Receives a POST with { trips: [ ... ] } from Google Apps Script.
 */
exports.enhancedWebBookImport = (0, https_1.onRequest)(async (req, res) => {
    // --- CORS & Method Guard ---
    res.set("Access-Control-Allow-Origin", "*");
    if (req.method === "OPTIONS") {
        res.set("Access-Control-Allow-Methods", "GET, POST");
        res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
        res.status(204).send("");
        return;
    }
    if (req.method !== "POST") {
        res.status(405).json({
            error: "Method Not Allowed",
            message: "Only POST requests are supported",
        });
        return;
    }
    // --- Parse and Validate Payload ---
    const requestBody = req.body;
    if (!(requestBody === null || requestBody === void 0 ? void 0 : requestBody.trips) || !Array.isArray(requestBody.trips)) {
        res.status(400).json({
            error: "Invalid payload structure",
            message: "Missing or invalid 'trips' array in request body",
        });
        return;
    }
    const { trips } = requestBody;
    const targetCollection = "trips";
    const batch = db.batch();
    let imported = 0;
    let skipped = 0;
    const processingDetails = [];
    // --- Process each trip in the batch ---
    for (const trip of trips) {
        // Use loadRef as primary ID, fallback to id
        const loadRef = trip.loadRef || trip.id;
        if (!loadRef) {
            skipped++;
            processingDetails.push({
                status: "skipped",
                reason: "missing_loadRef",
            });
            continue;
        }
        // Check for duplicate by loadRef
        const tripRef = db.collection(targetCollection).doc(String(loadRef));
        const doc = await tripRef.get();
        if (doc.exists) {
            skipped++;
            processingDetails.push({ status: "skipped", reason: "already_exists", loadRef: String(loadRef) });
            continue;
        }
        // Normalize trip for Firestore
        const normalizedTrip = {
            id: trip.id || String(loadRef),
            fleetNumber: trip.fleetNumber || "",
            driverName: trip.driverName || "",
            clientType: trip.clientType || "external",
            clientName: trip.clientName || "",
            loadRef: String(loadRef),
            route: trip.route || "",
            startDate: trip.shippedDate || new Date().toISOString(),
            endDate: trip.deliveredDate || new Date().toISOString(),
            status: "active",
            baseRevenue: Number(trip.baseRevenue) || 0,
            revenueCurrency: trip.revenueCurrency || "ZAR",
            costs: Array.isArray(trip.costs) ? trip.costs : [],
            additionalCosts: Array.isArray(trip.additionalCosts) ? trip.additionalCosts : [],
            followUpHistory: Array.isArray(trip.followUpHistory) ? trip.followUpHistory : [],
            paymentStatus: trip.paymentStatus || "unpaid",
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            importSource: trip.importSource || req.headers["x-source"] || "webhook",
        };
        batch.set(tripRef, normalizedTrip);
        imported++;
        processingDetails.push({ status: "imported", loadRef: String(loadRef) });
    }
    // Commit Firestore batch if anything to write
    if (imported > 0) {
        await batch.commit();
    }
    res.status(200).json({
        imported,
        skipped,
        message: `Processed ${trips.length} trips. Imported: ${imported}, Skipped: ${skipped}`,
        processingDetails: processingDetails.length <= 10 ?
            processingDetails :
            `${processingDetails.length} trips processed`,
    });
});
//# sourceMappingURL=enhanced-webbook-import.js.map