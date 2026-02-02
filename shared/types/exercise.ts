/**
 * Exercise Types for Firestore
 * 
 * These types define the structure of exercise documents stored in Firestore,
 * synced from ExerciseDB.
 */

import { Timestamp } from "firebase-admin/firestore";

/**
 * Exercise document structure in Firestore
 * Collection: exercises/{exerciseId}
 */
export interface FirestoreExercise {
  /** Unique identifier (from ExerciseDB or free-exercise-db) */
  id: string;
  
  /** Exercise name */
  name: string;
  
  /** Equipment required (e.g., "barbell", "dumbbell", "body weight") */
  equipment: string;
  
  /** Body part targeted (e.g., "chest", "back", "legs") */
  bodyPart: string;
  
  /** Primary muscle targeted */
  target: string;
  
  /** Secondary muscles worked */
  secondaryMuscles: string[];
  
  /** Step-by-step instructions */
  instructions: string[];
  
  /** Public URL to image in Firebase Storage (static image or GIF) */
  gifUrl: string;
  
  /** Storage path for the image (e.g., "exercises/barbell-squat.jpg") */
  gifPath: string;
  
  /** Data source identifier */
  source: "exercisedb" | "free-exercise-db";
  
  /** When the exercise was synced */
  syncedAt: Timestamp;
  
  /** Optional: Category from free-exercise-db (strength, cardio, etc.) */
  category?: string;
  
  /** Optional: Difficulty level from free-exercise-db */
  level?: "beginner" | "intermediate" | "expert";
  
  /** Optional: Force type from free-exercise-db */
  force?: "push" | "pull" | "static" | null;
  
  /** Optional: Mechanic type from free-exercise-db */
  mechanic?: "compound" | "isolation" | null;
  
  /** Optional: Key form cue to show during workout (falls back to instructions[0]) */
  keyCue?: string;
}

/**
 * Exercise data as returned by the API (serialized)
 */
export interface Exercise {
  id: string;
  name: string;
  equipment: string;
  bodyPart: string;
  target: string;
  secondaryMuscles: string[];
  instructions: string[];
  gifUrl: string;
  source: string;
  /** Key form cue to show during workout */
  keyCue?: string;
}

/**
 * ExerciseDB API response format
 * Note: gifUrl is no longer provided by the RapidAPI version
 */
export interface ExerciseDBExercise {
  id: string;
  name: string;
  equipment: string;
  bodyPart: string;
  target: string;
  secondaryMuscles: string[];
  instructions: string[];
  gifUrl?: string; // Optional - not provided by RapidAPI version
}

/**
 * Free Exercise DB JSON format
 * Source: https://github.com/yuhonas/free-exercise-db
 */
export interface FreeExerciseDBExercise {
  id: string; // e.g., "3_4_Sit-Up", "Barbell_Squat"
  name: string;
  force: "push" | "pull" | "static" | null;
  level: "beginner" | "intermediate" | "expert";
  mechanic: "compound" | "isolation" | null;
  equipment: string | null;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  instructions: string[];
  category: string;
  images: string[]; // Relative paths like "3_4_Sit-Up/0.jpg"
}

/**
 * Body parts available in ExerciseDB
 */
export const BODY_PARTS = [
  "back",
  "cardio",
  "chest",
  "lower arms",
  "lower legs",
  "neck",
  "shoulders",
  "upper arms",
  "upper legs",
  "waist",
] as const;

export type BodyPart = typeof BODY_PARTS[number];

/**
 * Equipment types available in ExerciseDB
 */
export const EQUIPMENT_TYPES = [
  "assisted",
  "band",
  "barbell",
  "body weight",
  "bosu ball",
  "cable",
  "dumbbell",
  "elliptical machine",
  "ez barbell",
  "hammer",
  "kettlebell",
  "leverage machine",
  "medicine ball",
  "olympic barbell",
  "resistance band",
  "roller",
  "rope",
  "skierg machine",
  "sled machine",
  "smith machine",
  "stability ball",
  "stationary bike",
  "stepmill machine",
  "tire",
  "trap bar",
  "upper body ergometer",
  "weighted",
  "wheel roller",
] as const;

export type EquipmentType = typeof EQUIPMENT_TYPES[number];

