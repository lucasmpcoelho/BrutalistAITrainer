/**
 * Firebase Admin SDK Configuration
 * 
 * This module initializes the Firebase Admin SDK for server-side operations.
 * It provides access to Firestore and Firebase Storage.
 * 
 * Required environment variables:
 * - FIREBASE_PROJECT_ID: Your Firebase project ID
 * - FIREBASE_CLIENT_EMAIL: Service account email
 * - FIREBASE_PRIVATE_KEY: Service account private key (with newlines)
 * - FIREBASE_STORAGE_BUCKET: Storage bucket name (e.g., "project-id.appspot.com")
 */

import admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

// Helper to check if Firebase is properly configured
export function isFirebaseConfigured(): boolean {
  return !!(
    process.env.FIREBASE_PROJECT_ID &&
    process.env.FIREBASE_CLIENT_EMAIL &&
    process.env.FIREBASE_PRIVATE_KEY &&
    process.env.FIREBASE_STORAGE_BUCKET
  );
}

// Check for required environment variables (only warn, don't block startup)
const requiredEnvVars = [
  "FIREBASE_PROJECT_ID",
  "FIREBASE_CLIENT_EMAIL", 
  "FIREBASE_PRIVATE_KEY",
  "FIREBASE_STORAGE_BUCKET",
] as const;

if (!isFirebaseConfigured()) {
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      console.warn(`[firebase] Warning: ${envVar} is not set`);
    }
  }
}

// Track if Firebase is properly initialized
let firebaseInitialized = false;

// Initialize Firebase Admin SDK (only if credentials are available)
if (!admin.apps.length && isFirebaseConfigured()) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // Private key comes with escaped newlines from env, need to replace
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      }),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    });
    firebaseInitialized = true;
    console.log("[firebase] Admin SDK initialized successfully");
  } catch (error) {
    console.error("[firebase] Failed to initialize Admin SDK:", error);
    // Don't throw - allow server to start without Firebase
  }
} else if (!isFirebaseConfigured()) {
  console.warn("[firebase] Skipping initialization - credentials not configured");
}

// Export initialized services (will be undefined if not initialized)
export const firebaseAdmin = firebaseInitialized ? admin : undefined;
export const db = firebaseInitialized ? getFirestore() : undefined;
export const storage = firebaseInitialized ? getStorage() : undefined;
export const bucket = firebaseInitialized && storage ? storage.bucket() : undefined;

export default {
  admin: firebaseAdmin,
  db,
  storage,
  bucket,
  isFirebaseConfigured,
};
