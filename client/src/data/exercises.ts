/**
 * DEPRECATED: Legacy exercise database
 * 
 * This module has been superseded by the Firestore-backed API.
 * All exercises are now fetched from:
 * - GET /api/exercises - list/search exercises
 * - GET /api/exercises/:id - get single exercise
 * - GET /api/exercises/:id/alternatives - get alternatives
 * 
 * Use the following hooks instead:
 * - useExercise(id) - fetch single exercise from @/hooks/use-exercise
 * - useExercises(filters) - fetch list from @/hooks/use-exercises
 * - useExerciseAlternatives(id) - fetch alternatives from @/hooks/use-exercise
 * 
 * This file is kept only for type definitions that may still be needed.
 * 
 * @deprecated Use API hooks instead (useExercise, useExercises)
 */

// Legacy type definitions - kept for backwards compatibility during migration
export interface ExerciseCue {
  text: string;
  isAvoid?: boolean;
}

export interface ExerciseData {
  id: string;
  name: string;
  type: "compound" | "accessory" | "isolation";
  equipment: string;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  cues: ExerciseCue[];
  alternatives: string[]; // IDs of alternative exercises
}

/**
 * @deprecated Use useExercises() hook instead
 * Legacy exercise database - no longer used, kept for reference only
 */
export const EXERCISES: Record<string, ExerciseData> = {};

/**
 * @deprecated Use useExercise(id) hook instead
 */
export function getExercise(id: string): ExerciseData | undefined {
  console.warn("[DEPRECATED] getExercise is deprecated. Use useExercise hook instead.");
  return EXERCISES[id];
}

/**
 * @deprecated Use useExerciseAlternatives(id) hook instead
 */
export function getAlternatives(exerciseId: string): ExerciseData[] {
  console.warn("[DEPRECATED] getAlternatives is deprecated. Use useExerciseAlternatives hook instead.");
  return [];
}

/**
 * @deprecated Exercise IDs are now formatted differently in the API
 */
export function nameToId(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "-");
}
