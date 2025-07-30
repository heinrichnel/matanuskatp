/**
 * Type adapter functions to convert between different tyre and inspection types
 *
 * This file helps bridge the type differences between the data/tyreData.ts
 * and types/tyre.ts interfaces. It provides conversion functions that allow
 * the app to work with both sets of types when interacting with Firebase.
 */

import {
  TyreConditionStatus as TyreConditionStatusData,
  Tyre as TyreData,
  TyreType as TyreTypeData,
} from "../data/tyreData";
import { Tyre, TyreInspection } from "../types/tyre";
import { TyreInspectionRecord } from "../types/tyre-inspection";

/**
 * Convert a TyreData (from Firebase/data module) to the app's Tyre type
 */
export function convertTyreDataToTyre(tyreData: TyreData): Tyre {
  return {
    id: tyreData.id,
    serialNumber: tyreData.serialNumber,
    dotCode: tyreData.dotCode,
    manufacturingDate: tyreData.manufacturingDate,
    brand: tyreData.brand,
    model: tyreData.model,
    pattern: tyreData.pattern,
    size: {
      width: tyreData.size.width,
      aspectRatio: tyreData.size.aspectRatio,
      rimDiameter: tyreData.size.rimDiameter,
      displayString: tyreData.size.displayString,
    },
    loadIndex: tyreData.loadIndex,
    speedRating: tyreData.speedRating,
    type: tyreData.type as unknown as Tyre["type"], // Type assertion for compatibility
    purchaseDetails: {
      date: tyreData.purchaseDetails.date,
      cost: tyreData.purchaseDetails.cost,
      supplier: tyreData.purchaseDetails.supplier,
      warranty: tyreData.purchaseDetails.warranty,
      invoiceNumber: tyreData.purchaseDetails.invoiceNumber,
    },
    installation: tyreData.installation
      ? {
          vehicleId: tyreData.installation.vehicleId,
          position: tyreData.installation.position as unknown as Tyre["installation"]["position"],
          mileageAtInstallation: tyreData.installation.mileageAtInstallation,
          installationDate: tyreData.installation.installationDate,
          installedBy: tyreData.installation.installedBy,
        }
      : undefined,
    condition: {
      treadDepth: tyreData.condition.treadDepth,
      pressure: tyreData.condition.pressure,
      temperature: tyreData.condition.temperature,
      status: tyreData.condition.status as unknown as Tyre["condition"]["status"],
      lastInspectionDate: tyreData.condition.lastInspectionDate,
      nextInspectionDue: tyreData.condition.nextInspectionDue,
    },
    status: tyreData.status as unknown as Tyre["status"],
    mountStatus: tyreData.mountStatus as unknown as Tyre["mountStatus"],
    maintenanceHistory: {
      rotations: tyreData.maintenanceHistory.rotations.map((r) => ({
        id: r.id || crypto.randomUUID(),
        date: r.date,
        fromPosition:
          r.fromPosition as unknown as Tyre["maintenanceHistory"]["rotations"][0]["fromPosition"],
        toPosition:
          r.toPosition as unknown as Tyre["maintenanceHistory"]["rotations"][0]["toPosition"],
        mileage: r.mileage,
        technician: r.technician,
        notes: r.technician,
      })),
      repairs: tyreData.maintenanceHistory.repairs.map((r) => ({
        id: r.id || crypto.randomUUID(),
        date: r.date,
        type: r.type,
        description: r.description,
        cost: r.cost,
        technician: r.technician,
        notes: r.technician,
      })),
      inspections: tyreData.maintenanceHistory.inspections.map((i) => ({
        id: i.id || crypto.randomUUID(),
        date: i.date,
        inspector: i.inspector,
        treadDepth: i.treadDepth,
        pressure: i.pressure,
        temperature: i.temperature,
        condition: i.condition,
        notes: i.notes,
        images: i.images || [],
      })),
    },
    kmRun: tyreData.kmRun,
    kmRunLimit: tyreData.kmRunLimit,
    notes: tyreData.notes,
    location: tyreData.location as unknown as Tyre["location"],
    createdAt: tyreData.createdAt,
    updatedAt: tyreData.updatedAt,
  };
}

/**
 * Convert the app's Tyre type to TyreData (for Firebase/data module)
 */
export function convertTyreToTyreData(tyre: Tyre): TyreData {
  return {
    id: tyre.id,
    serialNumber: tyre.serialNumber,
    dotCode: tyre.dotCode,
    manufacturingDate: tyre.manufacturingDate,
    brand: tyre.brand,
    model: tyre.model,
    pattern: tyre.pattern,
    size: {
      width: tyre.size.width,
      aspectRatio: tyre.size.aspectRatio,
      rimDiameter: tyre.size.rimDiameter,
      displayString: tyre.size.displayString,
    },
    loadIndex: tyre.loadIndex,
    speedRating: tyre.speedRating,
    type: tyre.type as unknown as TyreTypeData,
    purchaseDetails: {
      date: tyre.purchaseDetails.date,
      cost: tyre.purchaseDetails.cost,
      supplier: tyre.purchaseDetails.supplier,
      warranty: tyre.purchaseDetails.warranty,
      invoiceNumber: tyre.purchaseDetails.invoiceNumber,
    },
    installation: tyre.installation
      ? {
          vehicleId: tyre.installation.vehicleId,
          position: String(tyre.installation.position),
          mileageAtInstallation: tyre.installation.mileageAtInstallation,
          installationDate: tyre.installation.installationDate,
          installedBy: tyre.installation.installedBy,
        }
      : {
          vehicleId: "",
          position: "",
          mileageAtInstallation: 0,
          installationDate: "",
          installedBy: "",
        },
    condition: {
      treadDepth: tyre.condition.treadDepth,
      pressure: tyre.condition.pressure,
      temperature: tyre.condition.temperature,
      status: tyre.condition.status as unknown as TyreConditionStatusData,
      lastInspectionDate: tyre.condition.lastInspectionDate,
      nextInspectionDue: tyre.condition.nextInspectionDue,
    },
    status: tyre.status as unknown as TyreData["status"],
    mountStatus: tyre.mountStatus as unknown as TyreData["mountStatus"],
    maintenanceHistory: {
      rotations: tyre.maintenanceHistory.rotations.map((r) => ({
        id: r.id,
        date: r.date,
        fromPosition: String(r.fromPosition),
        toPosition: String(r.toPosition),
        mileage: r.mileage,
        technician: r.technician || "",
      })),
      repairs: tyre.maintenanceHistory.repairs.map((r) => ({
        id: r.id,
        date: r.date,
        type: r.type,
        description: r.description,
        cost: r.cost,
        technician: r.technician,
      })),
      inspections: tyre.maintenanceHistory.inspections.map((i) => ({
        id: i.id,
        date: i.date,
        inspector: i.inspector,
        treadDepth: i.treadDepth,
        pressure: i.pressure,
        temperature: i.temperature,
        condition: i.condition,
        notes: i.notes,
        images: i.images,
      })),
    },
    kmRun: tyre.kmRun,
    kmRunLimit: tyre.kmRunLimit,
    notes: tyre.notes,
    location: tyre.location as unknown as TyreData["location"],
    createdAt: tyre.createdAt,
    updatedAt: tyre.updatedAt,
  };
}

/**
 * Convert TyreInspectionRecord to TyreInspection
 */
export function convertInspectionRecordToInspection(record: TyreInspectionRecord): TyreInspection {
  return {
    id: record.id,
    date: record.inspectionDate,
    inspector: record.inspectorName,
    treadDepth: record.treadDepth,
    pressure: record.pressure,
    temperature: 0, // Not in TyreInspectionRecord, default value
    condition: record.condition,
    notes: record.notes || "",
    images: record.photos,
  };
}

/**
 * Convert TyreInspection to TyreInspectionRecord
 */
export function convertInspectionToRecord(
  inspection: TyreInspection,
  vehicleId: string
): TyreInspectionRecord {
  return {
    id: inspection.id,
    vehicleId: vehicleId,
    vehicleName: "Unknown", // Would need to be filled in based on context
    position: "Unknown", // Would need to be filled in based on context
    inspectorName: inspection.inspector,
    currentOdometer: 0, // Default value, not in TyreInspection
    previousOdometer: 0, // Default value, not in TyreInspection
    distanceTraveled: 0, // Default value, not in TyreInspection
    treadDepth: inspection.treadDepth,
    pressure: inspection.pressure,
    condition: inspection.condition as any,
    damage: "", // Default value, not in TyreInspection
    notes: inspection.notes,
    photos: inspection.images || [],
    location: "", // Default value, not in TyreInspection
    inspectionDate: inspection.date,
    signature: "", // Default value, not in TyreInspection
    createdAt: new Date().toISOString(),
  };
}

/**
 * Convert array of TyreData to array of Tyre
 */
export function convertTyreDataArrayToTyreArray(tyreDataArray: TyreData[]): Tyre[] {
  return tyreDataArray.map(convertTyreDataToTyre);
}

/**
 * Convert array of TyreInspectionRecords to array of TyreInspection
 */
export function convertInspectionRecordsToInspections(
  records: TyreInspectionRecord[]
): TyreInspection[] {
  return records.map(convertInspectionRecordToInspection);
}
