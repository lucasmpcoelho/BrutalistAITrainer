/**
 * Exercise Sync Script
 * 
 * One-time script to sync exercises from ExerciseDB to Firebase.
 * Downloads GIFs to Firebase Storage and stores metadata in Firestore.
 * 
 * Usage:
 *   npx tsx server/scripts/sync-exercises.ts
 * 
 * Options:
 *   --batch-size=500    Number of exercises per batch
 *   --start-offset=0    Resume from a specific offset
 *   --dry-run           Preview without making changes
 */

import "dotenv/config";
import { db, bucket, isFirebaseConfigured } from "../config/firebase";
import {
  fetchExercisesInBatches,
  downloadExerciseGif,
  isExerciseDBConfigured,
} from "../services/exercisedb";
import {
  transformExercise,
  getStoragePath,
  filterValidExercises,
} from "../services/exercise-transformer";
import { ExerciseDBExercise, FirestoreExercise } from "../../shared/types/exercise";

// Configuration
const DEFAULT_BATCH_SIZE = 500;
const GIF_DOWNLOAD_CONCURRENCY = 5; // Parallel GIF downloads
const FIRESTORE_BATCH_SIZE = 500; // Max Firestore batch size

// Parse command line arguments
function parseArgs(): { batchSize: number; startOffset: number; dryRun: boolean } {
  const args = process.argv.slice(2);
  let batchSize = DEFAULT_BATCH_SIZE;
  let startOffset = 0;
  let dryRun = false;

  for (const arg of args) {
    if (arg.startsWith("--batch-size=")) {
      batchSize = parseInt(arg.split("=")[1], 10);
    } else if (arg.startsWith("--start-offset=")) {
      startOffset = parseInt(arg.split("=")[1], 10);
    } else if (arg === "--dry-run") {
      dryRun = true;
    }
  }

  return { batchSize, startOffset, dryRun };
}

/**
 * Upload GIF to Firebase Storage and return public URL
 */
async function uploadGifToStorage(
  exerciseId: string,
  gifData: Buffer
): Promise<{ url: string; path: string }> {
  const storagePath = getStoragePath(exerciseId);
  const file = bucket.file(storagePath);

  await file.save(gifData, {
    metadata: {
      contentType: "image/gif",
      cacheControl: "public, max-age=31536000", // Cache for 1 year
    },
  });

  // Make the file publicly accessible
  await file.makePublic();

  // Get the public URL
  const url = `https://storage.googleapis.com/${bucket.name}/${storagePath}`;

  return { url, path: storagePath };
}

/**
 * Process exercises in parallel with concurrency limit
 * Note: GIF downloading is skipped if gifUrl is not available (RapidAPI limitation)
 */
async function processExercisesWithConcurrency(
  exercises: ExerciseDBExercise[],
  concurrency: number,
  dryRun: boolean
): Promise<FirestoreExercise[]> {
  const results: FirestoreExercise[] = [];
  const errors: { id: string; error: string }[] = [];

  // Process in chunks based on concurrency
  for (let i = 0; i < exercises.length; i += concurrency) {
    const chunk = exercises.slice(i, i + concurrency);
    
    const chunkResults = await Promise.allSettled(
      chunk.map(async (exercise) => {
        try {
          if (dryRun) {
            // In dry-run mode, just create a mock result
            return transformExercise(
              exercise,
              exercise.gifUrl ? `[DRY-RUN] ${exercise.gifUrl}` : "",
              exercise.gifUrl ? getStoragePath(exercise.id) : ""
            );
          }

          // Check if GIF URL is available (RapidAPI no longer provides this)
          if (exercise.gifUrl) {
            // Download GIF from ExerciseDB
            const gifData = await downloadExerciseGif(exercise.gifUrl);

            // Upload to Firebase Storage
            const { url, path } = await uploadGifToStorage(exercise.id, gifData);

            // Transform to our schema with GIF
            return transformExercise(exercise, url, path);
          } else {
            // No GIF available - store metadata only
            return transformExercise(exercise, "", "");
          }
        } catch (error) {
          throw { id: exercise.id, error: (error as Error).message };
        }
      })
    );

    // Collect results and errors
    for (const result of chunkResults) {
      if (result.status === "fulfilled") {
        results.push(result.value);
      } else {
        errors.push(result.reason);
      }
    }

    // Progress update
    const processed = Math.min(i + concurrency, exercises.length);
    console.log(`[sync] Processed ${processed}/${exercises.length} exercises`);
  }

  // Report errors
  if (errors.length > 0) {
    console.error(`[sync] Failed to process ${errors.length} exercises:`);
    errors.forEach(({ id, error }) => console.error(`  - ${id}: ${error}`));
  }

  return results;
}

/**
 * Write exercises to Firestore in batches
 */
async function writeToFirestore(
  exercises: FirestoreExercise[],
  dryRun: boolean
): Promise<void> {
  if (dryRun) {
    console.log(`[sync] DRY-RUN: Would write ${exercises.length} exercises to Firestore`);
    return;
  }

  const collectionRef = db.collection("exercises");
  
  // Firestore batch writes are limited to 500 operations
  for (let i = 0; i < exercises.length; i += FIRESTORE_BATCH_SIZE) {
    const batch = db.batch();
    const chunk = exercises.slice(i, i + FIRESTORE_BATCH_SIZE);

    for (const exercise of chunk) {
      const docRef = collectionRef.doc(exercise.id);
      batch.set(docRef, exercise);
    }

    await batch.commit();
    console.log(`[sync] Wrote batch ${Math.floor(i / FIRESTORE_BATCH_SIZE) + 1} to Firestore`);
  }
}

/**
 * Create Firestore indexes for common queries
 */
async function logIndexRecommendations(): Promise<void> {
  console.log("\n[sync] Recommended Firestore indexes:");
  console.log("  - exercises: bodyPart (Ascending), name (Ascending)");
  console.log("  - exercises: target (Ascending), name (Ascending)");
  console.log("  - exercises: equipment (Ascending), name (Ascending)");
  console.log("\nCreate these in Firebase Console > Firestore > Indexes\n");
}

/**
 * Main sync function
 */
async function syncExercises(): Promise<void> {
  const { batchSize, startOffset, dryRun } = parseArgs();

  console.log("===========================================");
  console.log("  IRON_AI Exercise Sync Script");
  console.log("===========================================");
  console.log(`Batch size: ${batchSize}`);
  console.log(`Start offset: ${startOffset}`);
  console.log(`Dry run: ${dryRun}`);
  console.log("-------------------------------------------\n");

  // Check configuration
  if (!isFirebaseConfigured()) {
    console.error("[sync] ERROR: Firebase is not configured. Check environment variables.");
    process.exit(1);
  }

  if (!isExerciseDBConfigured()) {
    console.error("[sync] ERROR: ExerciseDB API is not configured. Check EXERCISEDB_API_KEY.");
    process.exit(1);
  }

  console.log("[sync] Configuration verified. Starting sync...\n");

  const startTime = Date.now();
  let totalProcessed = 0;
  let totalWritten = 0;

  try {
    // Fetch all exercises in batches
    console.log("[sync] Fetching exercises from ExerciseDB...");
    
    const allExercises = await fetchExercisesInBatches(
      batchSize,
      (batch, batchIndex, total) => {
        console.log(`[sync] Received batch ${batchIndex + 1}: ${batch.length} exercises (total: ${total})`);
      }
    );

    // Apply start offset if resuming
    const exercisesToProcess = startOffset > 0 
      ? allExercises.slice(startOffset) 
      : allExercises;

    console.log(`\n[sync] Total exercises to process: ${exercisesToProcess.length}`);

    // Filter valid exercises
    const validExercises = filterValidExercises(exercisesToProcess);
    console.log(`[sync] Valid exercises after filtering: ${validExercises.length}`);

    // Process exercises (download GIFs, upload to Storage)
    console.log("\n[sync] Processing exercises (downloading GIFs, uploading to Storage)...");
    const processedExercises = await processExercisesWithConcurrency(
      validExercises,
      GIF_DOWNLOAD_CONCURRENCY,
      dryRun
    );
    totalProcessed = processedExercises.length;

    // Write to Firestore
    console.log("\n[sync] Writing to Firestore...");
    await writeToFirestore(processedExercises, dryRun);
    totalWritten = processedExercises.length;

    // Log index recommendations
    await logIndexRecommendations();

  } catch (error) {
    console.error("[sync] Fatal error:", error);
    process.exit(1);
  }

  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log("===========================================");
  console.log("  Sync Complete!");
  console.log("===========================================");
  console.log(`Total processed: ${totalProcessed}`);
  console.log(`Total written: ${totalWritten}`);
  console.log(`Duration: ${duration}s`);
  console.log("-------------------------------------------\n");

  if (dryRun) {
    console.log("This was a DRY RUN. No changes were made.");
    console.log("Run without --dry-run to sync for real.\n");
  }
}

// Run the script
syncExercises()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("[sync] Unhandled error:", error);
    process.exit(1);
  });

