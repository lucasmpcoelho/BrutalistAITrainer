/**
 * Exercise Data Transformer
 * 
 * Transforms ExerciseDB API responses and free-exercise-db JSON to our Firestore schema.
 */

import { Timestamp } from "firebase-admin/firestore";
import { ExerciseDBExercise, FirestoreExercise, FreeExerciseDBExercise } from "../../shared/types/exercise";

/**
 * Transform an ExerciseDB exercise to our Firestore schema
 */
export function transformExercise(
  exercise: ExerciseDBExercise,
  storageUrl: string,
  storagePath: string
): FirestoreExercise {
  return {
    id: exercise.id,
    name: normalizeExerciseName(exercise.name),
    equipment: exercise.equipment,
    bodyPart: exercise.bodyPart,
    target: exercise.target,
    secondaryMuscles: exercise.secondaryMuscles || [],
    instructions: exercise.instructions || [],
    gifUrl: storageUrl,
    gifPath: storagePath,
    source: "exercisedb",
    syncedAt: Timestamp.now(),
  };
}

/**
 * Normalize exercise name for consistent display
 * - Capitalize first letter of each word
 * - Fix common formatting issues
 */
export function normalizeExerciseName(name: string): string {
  return name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

/**
 * Generate a consistent storage path for an exercise GIF
 */
export function getStoragePath(exerciseId: string): string {
  return `exercises/${exerciseId}.gif`;
}

/**
 * Validate an exercise has all required fields
 * Note: gifUrl is optional since RapidAPI ExerciseDB no longer provides it
 */
export function isValidExercise(exercise: ExerciseDBExercise): boolean {
  return !!(
    exercise.id &&
    exercise.name &&
    exercise.equipment &&
    exercise.bodyPart &&
    exercise.target
  );
}

/**
 * Filter and validate a batch of exercises
 */
export function filterValidExercises(
  exercises: ExerciseDBExercise[]
): ExerciseDBExercise[] {
  const valid = exercises.filter(isValidExercise);
  
  if (valid.length < exercises.length) {
    console.log(
      `[transformer] Filtered out ${exercises.length - valid.length} invalid exercises`
    );
  }
  
  return valid;
}

/**
 * Map primaryMuscles to a bodyPart category
 * free-exercise-db uses primaryMuscles, we need to derive bodyPart
 */
const MUSCLE_TO_BODY_PART: Record<string, string> = {
  // Chest
  chest: "chest",
  // Back
  lats: "back",
  "middle back": "back",
  "lower back": "back",
  traps: "back",
  // Shoulders
  shoulders: "shoulders",
  // Arms
  biceps: "upper arms",
  triceps: "upper arms",
  forearms: "lower arms",
  // Legs
  quadriceps: "upper legs",
  hamstrings: "upper legs",
  glutes: "upper legs",
  calves: "lower legs",
  adductors: "upper legs",
  abductors: "upper legs",
  // Core
  abdominals: "waist",
  // Neck
  neck: "neck",
};

/**
 * Generate a stable ID from exercise name
 */
export function generateExerciseId(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Collapse multiple hyphens
    .replace(/^-|-$/g, ""); // Remove leading/trailing hyphens
}

/**
 * Generate a storage path for free-exercise-db images
 */
export function getStoragePathForFreeDB(exerciseId: string, extension: string = "jpg"): string {
  return `exercises/${exerciseId}.${extension}`;
}

/**
 * Transform a free-exercise-db exercise to our Firestore schema
 */
export function transformFreeExerciseDBExercise(
  exercise: FreeExerciseDBExercise,
  storageUrl: string,
  storagePath: string
): FirestoreExercise {
  // Derive bodyPart from primaryMuscles
  const primaryMuscle = exercise.primaryMuscles[0]?.toLowerCase() || "";
  const bodyPart = MUSCLE_TO_BODY_PART[primaryMuscle] || "waist"; // Default to waist if unknown

  // Derive target from primary muscle (first one)
  const target = exercise.primaryMuscles[0]?.toLowerCase() || "";

  // Use the id from the JSON (e.g., "Barbell_Squat") or generate from name as fallback
  const exerciseId = exercise.id || generateExerciseId(exercise.name);

  return {
    id: exerciseId,
    name: normalizeExerciseName(exercise.name),
    equipment: exercise.equipment || "body only",
    bodyPart,
    target,
    secondaryMuscles: exercise.secondaryMuscles || [],
    instructions: exercise.instructions || [],
    gifUrl: storageUrl,
    gifPath: storagePath,
    source: "free-exercise-db",
    syncedAt: Timestamp.now(),
    category: exercise.category,
    level: exercise.level,
    force: exercise.force,
    mechanic: exercise.mechanic,
  };
}

/**
 * Validate a free-exercise-db exercise has required fields
 */
export function isValidFreeExercise(exercise: FreeExerciseDBExercise): boolean {
  return !!(
    exercise.name &&
    exercise.primaryMuscles &&
    exercise.primaryMuscles.length > 0 &&
    exercise.instructions &&
    exercise.instructions.length > 0
  );
}

/**
 * Filter and validate a batch of free-exercise-db exercises
 */
export function filterValidFreeExercises(
  exercises: FreeExerciseDBExercise[]
): FreeExerciseDBExercise[] {
  const valid = exercises.filter(isValidFreeExercise);

  if (valid.length < exercises.length) {
    console.log(
      `[transformer] Filtered out ${exercises.length - valid.length} invalid free-exercise-db exercises`
    );
  }

  return valid;
}

export default {
  transformExercise,
  transformFreeExerciseDBExercise,
  normalizeExerciseName,
  getStoragePath,
  getStoragePathForFreeDB,
  generateExerciseId,
  isValidExercise,
  isValidFreeExercise,
  filterValidExercises,
  filterValidFreeExercises,
};

