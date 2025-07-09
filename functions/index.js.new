import { setGlobalOptions } from "firebase-functions/v2";
import { onSchedule } from "firebase-functions/v2/scheduler";
import * as admin from "firebase-admin";
import { fetchWialonGPSData } from "./lib/wialon-gps.js";

// Initialize Firebase only if not already initialized
try {
  admin.initializeApp();
} catch (e) {
  console.log("Firebase already initialized");
}

// Set global options for all functions
setGlobalOptions({ maxInstances: 10 });

// Scheduled version that runs every 2 minutes
export const scheduledWialonGPSFetch = onSchedule(
  {
    schedule: "every 2 minutes",
    maxInstances: 1,
  },
  async (event) => {
    try {
      console.log("[scheduledWialonGPSFetch] Starting scheduled GPS data fetch");
      await fetchWialonGPSData();
      console.log("[scheduledWialonGPSFetch] Completed GPS data fetch");
    } catch (error) {
      console.error("[scheduledWialonGPSFetch] Failed to fetch GPS data:", error);
    }
  }
);
