/**
 * Firebase Data Connect Client
 * 
 * This file provides the Data Connect client instance for the frontend.
 * The SDK functions are auto-generated when you run:
 *   firebase dataconnect:sdk:generate
 * 
 * Imports from the generated SDK in dataconnect-generated/js/
 */

import { getDataConnect, connectDataConnectEmulator } from "firebase/data-connect";
import { app } from "./firebase";

// Data Connect service configuration
const DATA_CONNECT_SERVICE = "iron-ai-db";
const DATA_CONNECT_LOCATION = "us-central1";

// Initialize Data Connect
let dataConnect: ReturnType<typeof getDataConnect> | undefined;

if (app) {
  dataConnect = getDataConnect(app, {
    connector: "default",
    location: DATA_CONNECT_LOCATION,
    service: DATA_CONNECT_SERVICE,
  });

  // Connect to emulator in development
  if (import.meta.env.DEV) {
    const emulatorHost = import.meta.env.VITE_DATA_CONNECT_EMULATOR_HOST || "localhost:9399";
    try {
      connectDataConnectEmulator(dataConnect, emulatorHost.split(":")[0], parseInt(emulatorHost.split(":")[1]));
      console.log("[dataconnect] Connected to emulator at", emulatorHost);
    } catch (e) {
      // Already connected to emulator
    }
  }

  console.log("[dataconnect] Client initialized");
} else {
  console.warn("[dataconnect] Firebase app not initialized");
}

export { dataConnect };

// Re-export generated SDK functions when available
// These will be available after running: firebase dataconnect:sdk:generate
// 
// Example usage after SDK generation:
// import { getUserWorkouts, createWorkout } from "@iron-ai/dataconnect";
//
// const workouts = await getUserWorkouts({ userId: "user123" });
// await createWorkout({ userId: "user123", name: "Push Day", type: "push" });



