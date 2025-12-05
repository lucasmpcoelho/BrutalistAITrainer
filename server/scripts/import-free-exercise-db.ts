/**
 * Free Exercise DB Import Script
 * 
 * Imports exercises from the free-exercise-db GitHub repository into Firebase.
 * Downloads JSON data and images, uploads to Firebase Storage, writes to Firestore.
 * 
 * Source: https://github.com/yuhonas/free-exercise-db
 * 
 * Usage:
 *   npx tsx server/scripts/import-free-exercise-db.ts
 * 
 * Options:
 *   --pilot            Import only pilot subset (default)
 *   --full             Import all exercises
 *   --dry-run          Preview without making changes
 *   --skip-images      Skip image uploads (no images in Firestore docs)
 *   --use-github-urls  Use GitHub raw URLs instead of uploading to Storage
 *   --force            Overwrite existing exercises in Firestore
 */

import "dotenv/config";
import * as fs from "fs";
import * as path from "path";
import { db, bucket, isFirebaseConfigured } from "../config/firebase";
import {
  transformFreeExerciseDBExercise,
  getStoragePathForFreeDB,
  filterValidFreeExercises,
} from "../services/exercise-transformer";
import { FreeExerciseDBExercise, FirestoreExercise } from "../../shared/types/exercise";

// Configuration
const FIRESTORE_BATCH_SIZE = 500;
const IMAGE_UPLOAD_CONCURRENCY = 5;

// Repository paths (assumes cloned to this location)
const FREE_EXERCISE_DB_PATH = path.join(process.cwd(), "free-exercise-db");
const EXERCISES_JSON_PATH = path.join(FREE_EXERCISE_DB_PATH, "dist", "exercises.json");
const EXERCISES_IMAGES_PATH = path.join(FREE_EXERCISE_DB_PATH, "exercises");

/**
 * Pilot subset: Diverse selection of exercises covering multiple body parts and equipment
 * Selected to test the full pipeline before importing all 800+ exercises
 * Names must match exactly with free-exercise-db JSON
 */
const PILOT_EXERCISES = [
  // Chest (3)
  "Barbell Bench Press - Medium Grip",
  "Dumbbell Flyes",
  "Push-Ups - Close Triceps Position", // "Push-Ups" doesn't exist, using this variant
  
  // Back (3)
  "Bent Over Barbell Row",
  "Pullups", // Note: "Pullups" not "Pull-ups"
  "Seated Cable Rows",
  
  // Legs (4)
  "Barbell Squat",
  "Leg Press",
  "Romanian Deadlift",
  "Leg Extensions",
  
  // Shoulders (2)
  "Standing Military Press",
  "Side Lateral Raise",
  
  // Arms (3)
  "Barbell Curl",
  "Reverse Grip Triceps Pushdown", // Exact name from DB
  "Hammer Curls",
  
  // Core (2)
  "Plank",
  "Crunches",
  
  // Compound/Olympic (2)
  "Barbell Deadlift", // "Deadlift" doesn't exist, using "Barbell Deadlift"
  "Clean and Jerk",
];

// GitHub raw URL base for free-exercise-db images
const GITHUB_IMAGE_BASE_URL = "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises";

// Parse command line arguments
function parseArgs(): { pilot: boolean; dryRun: boolean; skipImages: boolean; useGithubUrls: boolean; force: boolean } {
  const args = process.argv.slice(2);
  let pilot = true; // Default to pilot mode
  let dryRun = false;
  let skipImages = false;
  let useGithubUrls = false;
  let force = false;

  for (const arg of args) {
    if (arg === "--full") {
      pilot = false;
    } else if (arg === "--pilot") {
      pilot = true;
    } else if (arg === "--dry-run") {
      dryRun = true;
    } else if (arg === "--skip-images") {
      skipImages = true;
    } else if (arg === "--use-github-urls") {
      useGithubUrls = true;
    } else if (arg === "--force") {
      force = true;
    }
  }

  return { pilot, dryRun, skipImages, useGithubUrls, force };
}

/**
 * Check if the free-exercise-db repository is cloned
 */
function checkRepositoryExists(): boolean {
  if (!fs.existsSync(FREE_EXERCISE_DB_PATH)) {
    console.error(`[import] ERROR: free-exercise-db repository not found at ${FREE_EXERCISE_DB_PATH}`);
    console.error(`[import] Please clone the repository first:`);
    console.error(`         git clone https://github.com/yuhonas/free-exercise-db.git`);
    return false;
  }

  if (!fs.existsSync(EXERCISES_JSON_PATH)) {
    console.error(`[import] ERROR: exercises.json not found at ${EXERCISES_JSON_PATH}`);
    console.error(`[import] Make sure the repository is properly cloned with the dist folder.`);
    return false;
  }

  return true;
}

/**
 * Load exercises from the JSON file
 */
function loadExercises(): FreeExerciseDBExercise[] {
  console.log(`[import] Loading exercises from ${EXERCISES_JSON_PATH}...`);
  const data = fs.readFileSync(EXERCISES_JSON_PATH, "utf-8");
  const exercises = JSON.parse(data) as FreeExerciseDBExercise[];
  console.log(`[import] Loaded ${exercises.length} exercises from JSON`);
  return exercises;
}

/**
 * Filter exercises for pilot subset
 */
function filterPilotExercises(exercises: FreeExerciseDBExercise[]): FreeExerciseDBExercise[] {
  const pilotSet = new Set(PILOT_EXERCISES.map(name => name.toLowerCase()));
  
  const filtered = exercises.filter(ex => 
    pilotSet.has(ex.name.toLowerCase())
  );
  
  console.log(`[import] Pilot filter: ${filtered.length}/${PILOT_EXERCISES.length} exercises found`);
  
  // Report missing exercises
  const foundNames = new Set(filtered.map(ex => ex.name.toLowerCase()));
  const missing = PILOT_EXERCISES.filter(name => !foundNames.has(name.toLowerCase()));
  if (missing.length > 0) {
    console.warn(`[import] Warning: ${missing.length} pilot exercises not found in dataset:`);
    missing.forEach(name => console.warn(`  - ${name}`));
  }
  
  return filtered;
}

/**
 * Find the first available image for an exercise
 * Image paths in the JSON are like "3_4_Sit-Up/0.jpg"
 * Images are stored in free-exercise-db/exercises/{id}/0.jpg
 */
function findExerciseImage(exercise: FreeExerciseDBExercise): string | null {
  if (!exercise.images || exercise.images.length === 0) {
    return null;
  }

  // Get the first image path (e.g., "3_4_Sit-Up/0.jpg")
  const relativePath = exercise.images[0];
  
  // Images are in the exercises folder
  const fullPath = path.join(EXERCISES_IMAGES_PATH, relativePath);

  if (fs.existsSync(fullPath)) {
    return fullPath;
  }

  // Try with the exercise id directly
  const altPath = path.join(EXERCISES_IMAGES_PATH, exercise.id, "0.jpg");
  if (fs.existsSync(altPath)) {
    return altPath;
  }

  return null;
}

/**
 * Upload image to Firebase Storage
 */
async function uploadImageToStorage(
  exerciseId: string,
  imagePath: string
): Promise<{ url: string; path: string }> {
  const imageBuffer = fs.readFileSync(imagePath);
  const extension = path.extname(imagePath).slice(1) || "jpg";
  const storagePath = getStoragePathForFreeDB(exerciseId, extension);
  
  const file = bucket!.file(storagePath);

  await file.save(imageBuffer, {
    metadata: {
      contentType: `image/${extension === "jpg" ? "jpeg" : extension}`,
      cacheControl: "public, max-age=31536000", // Cache for 1 year
    },
  });

  // Make the file publicly accessible
  await file.makePublic();

  // Get the public URL
  const url = `https://storage.googleapis.com/${bucket!.name}/${storagePath}`;

  return { url, path: storagePath };
}

/**
 * Check if exercise already exists in Firestore
 */
async function exerciseExists(exerciseId: string): Promise<boolean> {
  if (!db) return false;
  
  const doc = await db.collection("exercises").doc(exerciseId).get();
  return doc.exists;
}

/**
 * Get GitHub raw URL for an exercise image
 */
function getGithubImageUrl(exercise: FreeExerciseDBExercise): string {
  if (!exercise.images || exercise.images.length === 0) {
    return "";
  }
  // Image path like "Barbell_Squat/0.jpg" -> full GitHub URL
  const imagePath = exercise.images[0];
  return `${GITHUB_IMAGE_BASE_URL}/${imagePath}`;
}

/**
 * Process exercises with concurrency limit
 */
async function processExercises(
  exercises: FreeExerciseDBExercise[],
  concurrency: number,
  dryRun: boolean,
  skipImages: boolean,
  useGithubUrls: boolean,
  force: boolean
): Promise<FirestoreExercise[]> {
  const results: FirestoreExercise[] = [];
  const errors: { name: string; error: string }[] = [];
  const skipped: string[] = [];

  // Process in chunks based on concurrency
  for (let i = 0; i < exercises.length; i += concurrency) {
    const chunk = exercises.slice(i, i + concurrency);

    const chunkResults = await Promise.allSettled(
      chunk.map(async (exercise) => {
        // Use the id from the JSON (e.g., "Barbell_Squat")
        const exerciseId = exercise.id;
        
        try {
          // Check if already exists (idempotency) - skip unless --force
          if (!dryRun && !force && await exerciseExists(exerciseId)) {
            skipped.push(exercise.name);
            return null;
          }

          if (dryRun) {
            // In dry-run mode, just create a mock result
            const mockUrl = useGithubUrls 
              ? getGithubImageUrl(exercise)
              : `[DRY-RUN] https://storage.example.com/${exerciseId}.jpg`;
            return transformFreeExerciseDBExercise(
              exercise,
              mockUrl,
              useGithubUrls ? "" : getStoragePathForFreeDB(exerciseId)
            );
          }

          let storageUrl = "";
          let storagePath = "";

          if (useGithubUrls) {
            // Use GitHub raw URLs directly (no upload needed)
            storageUrl = getGithubImageUrl(exercise);
            // No storage path since we're using GitHub
          } else if (!skipImages) {
            // Find and upload image to Firebase Storage
            const imagePath = findExerciseImage(exercise);
            if (imagePath) {
              const uploadResult = await uploadImageToStorage(exerciseId, imagePath);
              storageUrl = uploadResult.url;
              storagePath = uploadResult.path;
              console.log(`[import] Uploaded image for: ${exercise.name}`);
            } else {
              console.warn(`[import] No image found for: ${exercise.name}`);
            }
          }

          // Transform to our schema
          return transformFreeExerciseDBExercise(exercise, storageUrl, storagePath);
        } catch (error) {
          throw { name: exercise.name, error: (error as Error).message };
        }
      })
    );

    // Collect results and errors
    for (const result of chunkResults) {
      if (result.status === "fulfilled" && result.value) {
        results.push(result.value);
      } else if (result.status === "rejected") {
        errors.push(result.reason);
      }
    }

    // Progress update
    const processed = Math.min(i + concurrency, exercises.length);
    console.log(`[import] Processed ${processed}/${exercises.length} exercises`);
  }

  // Report skipped exercises
  if (skipped.length > 0) {
    console.log(`[import] Skipped ${skipped.length} exercises (already exist in Firestore)`);
  }

  // Report errors
  if (errors.length > 0) {
    console.error(`[import] Failed to process ${errors.length} exercises:`);
    errors.forEach(({ name, error }) => console.error(`  - ${name}: ${error}`));
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
    console.log(`[import] DRY-RUN: Would write ${exercises.length} exercises to Firestore`);
    console.log(`[import] Sample exercises:`);
    exercises.slice(0, 3).forEach(ex => {
      console.log(`  - ${ex.name} (${ex.id}): ${ex.bodyPart} / ${ex.target}`);
    });
    return;
  }

  if (!db) {
    console.error("[import] ERROR: Firestore not initialized");
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
    console.log(`[import] Wrote batch ${Math.floor(i / FIRESTORE_BATCH_SIZE) + 1} to Firestore`);
  }
}

/**
 * Log summary of imported exercises
 */
function logSummary(exercises: FirestoreExercise[]): void {
  // Group by body part
  const byBodyPart: Record<string, number> = {};
  const byEquipment: Record<string, number> = {};

  for (const ex of exercises) {
    byBodyPart[ex.bodyPart] = (byBodyPart[ex.bodyPart] || 0) + 1;
    byEquipment[ex.equipment] = (byEquipment[ex.equipment] || 0) + 1;
  }

  console.log("\n[import] Summary by body part:");
  Object.entries(byBodyPart)
    .sort((a, b) => b[1] - a[1])
    .forEach(([part, count]) => console.log(`  - ${part}: ${count}`));

  console.log("\n[import] Summary by equipment:");
  Object.entries(byEquipment)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10) // Top 10
    .forEach(([equip, count]) => console.log(`  - ${equip}: ${count}`));
}

/**
 * Main import function
 */
async function importFreeExerciseDB(): Promise<void> {
  const { pilot, dryRun, skipImages, useGithubUrls, force } = parseArgs();

  console.log("===========================================");
  console.log("  IRON_AI Free Exercise DB Import");
  console.log("===========================================");
  console.log(`Mode: ${pilot ? "PILOT (subset)" : "FULL (all exercises)"}`);
  console.log(`Dry run: ${dryRun}`);
  console.log(`Skip images: ${skipImages}`);
  console.log(`Use GitHub URLs: ${useGithubUrls}`);
  console.log(`Force overwrite: ${force}`);
  console.log("-------------------------------------------\n");

  // Check configuration
  if (!isFirebaseConfigured()) {
    console.error("[import] ERROR: Firebase is not configured. Check environment variables.");
    process.exit(1);
  }

  if (!checkRepositoryExists()) {
    process.exit(1);
  }

  console.log("[import] Configuration verified. Starting import...\n");

  const startTime = Date.now();
  let totalProcessed = 0;
  let totalWritten = 0;

  try {
    // Load exercises
    let exercises = loadExercises();

    // Filter valid exercises
    exercises = filterValidFreeExercises(exercises);
    console.log(`[import] Valid exercises after filtering: ${exercises.length}`);

    // Apply pilot filter if in pilot mode
    if (pilot) {
      exercises = filterPilotExercises(exercises);
    }

    console.log(`\n[import] Exercises to process: ${exercises.length}`);

    // Process exercises
    const imageSource = useGithubUrls ? "GitHub URLs" : skipImages ? "none" : "Firebase Storage";
    console.log(`\n[import] Processing exercises (image source: ${imageSource})...`);
    const processedExercises = await processExercises(
      exercises,
      IMAGE_UPLOAD_CONCURRENCY,
      dryRun,
      skipImages,
      useGithubUrls,
      force
    );
    totalProcessed = processedExercises.length;

    // Write to Firestore
    console.log("\n[import] Writing to Firestore...");
    await writeToFirestore(processedExercises, dryRun);
    totalWritten = processedExercises.length;

    // Log summary
    logSummary(processedExercises);

  } catch (error) {
    console.error("[import] Fatal error:", error);
    process.exit(1);
  }

  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log("\n===========================================");
  console.log("  Import Complete!");
  console.log("===========================================");
  console.log(`Total processed: ${totalProcessed}`);
  console.log(`Total written: ${totalWritten}`);
  console.log(`Duration: ${duration}s`);
  console.log("-------------------------------------------\n");

  if (dryRun) {
    console.log("This was a DRY RUN. No changes were made.");
    console.log("Run without --dry-run to import for real.\n");
  }
}

// Run the script
importFreeExerciseDB()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("[import] Unhandled error:", error);
    process.exit(1);
  });

