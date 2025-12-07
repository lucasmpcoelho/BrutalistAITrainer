/**
 * Cleanup Script: Remove Old ExerciseDB Test Exercises
 * 
 * Deletes the 10 test exercises that were imported from the RapidAPI ExerciseDB
 * during early testing. These are identified by source: "exercisedb".
 * 
 * Usage:
 *   npx tsx server/scripts/cleanup-old-exercises.ts
 * 
 * Options:
 *   --dry-run    Preview without making changes
 */

import "dotenv/config";
import { db, isFirebaseConfigured } from "../config/firebase";

// Parse command line arguments
function parseArgs(): { dryRun: boolean } {
  const args = process.argv.slice(2);
  return {
    dryRun: args.includes("--dry-run"),
  };
}

async function cleanupOldExercises(): Promise<void> {
  const { dryRun } = parseArgs();

  console.log("===========================================");
  console.log("  Cleanup: Old ExerciseDB Test Exercises");
  console.log("===========================================");
  console.log(`Dry run: ${dryRun}`);
  console.log("-------------------------------------------\n");

  if (!isFirebaseConfigured() || !db) {
    console.error("[cleanup] ERROR: Firebase is not configured.");
    process.exit(1);
  }

  try {
    // Find all exercises with source: "exercisedb"
    const snapshot = await db
      .collection("exercises")
      .where("source", "==", "exercisedb")
      .get();

    console.log(`[cleanup] Found ${snapshot.size} exercises with source: "exercisedb"\n`);

    if (snapshot.size === 0) {
      console.log("[cleanup] No old exercises to delete. Done!");
      return;
    }

    // List exercises to be deleted
    console.log("[cleanup] Exercises to delete:");
    snapshot.docs.forEach((doc) => {
      const data = doc.data();
      console.log(`  - ${doc.id}: ${data.name} (${data.bodyPart})`);
    });
    console.log();

    if (dryRun) {
      console.log("[cleanup] DRY-RUN: No changes made.");
      console.log(`[cleanup] Would delete ${snapshot.size} exercises.`);
      return;
    }

    // Delete in batch
    const batch = db.batch();
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();
    console.log(`[cleanup] Successfully deleted ${snapshot.size} exercises.`);

  } catch (error) {
    console.error("[cleanup] Error:", error);
    process.exit(1);
  }

  console.log("\n===========================================");
  console.log("  Cleanup Complete!");
  console.log("===========================================\n");
}

cleanupOldExercises()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("[cleanup] Unhandled error:", error);
    process.exit(1);
  });





