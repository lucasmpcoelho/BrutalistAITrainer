/**
 * Workout Generator Service
 * 
 * Generates personalized workout programs based on user preferences.
 * Selects exercises from Firestore based on equipment, experience, and goals.
 */

import { db } from "../config/firebase";
import type { FirestoreExercise } from "../../shared/types/exercise";

// ============================================================================
// TYPES
// ============================================================================

export interface UserPreferences {
  goal?: string;           // "hypertrophy", "strength", "fat_loss", "general"
  frequency?: number;      // 3, 4, 5, or 6 days per week
  equipment?: string;      // "full_gym", "home_gym", "bodyweight"
  experience?: string;     // "beginner", "intermediate", "advanced"
  sessionLengthMin?: number; // 30, 45, 60, 90
  workoutDays?: number[];  // [1, 3, 5] for Mon/Wed/Fri (0=Sun, 6=Sat)
}

export interface GeneratedExercise {
  exerciseId: string;
  exerciseName: string;
  targetSets: number;
  targetReps: string;
  targetRpe: number | null;
  restSeconds: number;
  orderIndex: number;
}

export interface GeneratedWorkout {
  name: string;
  type: string;
  dayOfWeek: number;
  estimatedDurationMin: number;
  targetMuscles: string[];
  exercises: GeneratedExercise[];
}

// ============================================================================
// WORKOUT TEMPLATES
// ============================================================================

interface WorkoutTemplate {
  name: string;
  type: string;
  targetMuscles: string[];
  primaryBodyParts: string[];
  exerciseCount: { beginner: number; intermediate: number; advanced: number };
}

// Push/Pull/Legs split
const PPL_TEMPLATES: WorkoutTemplate[] = [
  {
    name: "PUSH",
    type: "push",
    targetMuscles: ["chest", "shoulders", "triceps"],
    primaryBodyParts: ["chest", "shoulders", "upper arms"],
    exerciseCount: { beginner: 4, intermediate: 5, advanced: 6 },
  },
  {
    name: "PULL", 
    type: "pull",
    targetMuscles: ["back", "biceps", "rear delts"],
    primaryBodyParts: ["back", "upper arms"],
    exerciseCount: { beginner: 4, intermediate: 5, advanced: 6 },
  },
  {
    name: "LEGS",
    type: "legs",
    targetMuscles: ["quads", "hamstrings", "glutes", "calves"],
    primaryBodyParts: ["upper legs", "lower legs"],
    exerciseCount: { beginner: 4, intermediate: 5, advanced: 6 },
  },
];

// Upper/Lower split
const UPPER_LOWER_TEMPLATES: WorkoutTemplate[] = [
  {
    name: "UPPER A",
    type: "upper",
    targetMuscles: ["chest", "back", "shoulders", "arms"],
    primaryBodyParts: ["chest", "back", "shoulders", "upper arms"],
    exerciseCount: { beginner: 5, intermediate: 6, advanced: 7 },
  },
  {
    name: "LOWER A",
    type: "lower",
    targetMuscles: ["quads", "hamstrings", "glutes", "calves"],
    primaryBodyParts: ["upper legs", "lower legs"],
    exerciseCount: { beginner: 4, intermediate: 5, advanced: 6 },
  },
  {
    name: "UPPER B",
    type: "upper",
    targetMuscles: ["chest", "back", "shoulders", "arms"],
    primaryBodyParts: ["chest", "back", "shoulders", "upper arms"],
    exerciseCount: { beginner: 5, intermediate: 6, advanced: 7 },
  },
  {
    name: "LOWER B",
    type: "lower",
    targetMuscles: ["quads", "hamstrings", "glutes", "calves"],
    primaryBodyParts: ["upper legs", "lower legs"],
    exerciseCount: { beginner: 4, intermediate: 5, advanced: 6 },
  },
];

// Full body (for 3-day beginners or time-constrained)
const FULL_BODY_TEMPLATE: WorkoutTemplate = {
  name: "FULL BODY",
  type: "full",
  targetMuscles: ["chest", "back", "shoulders", "legs", "core"],
  primaryBodyParts: ["chest", "back", "shoulders", "upper legs", "waist"],
  exerciseCount: { beginner: 5, intermediate: 6, advanced: 7 },
};

// ============================================================================
// EQUIPMENT MAPPING
// ============================================================================

// Equipment allowed for each user equipment preference
const EQUIPMENT_MAP: Record<string, string[]> = {
  full_gym: [
    "barbell", "dumbbell", "cable", "machine", "leverage machine",
    "smith machine", "ez barbell", "olympic barbell", "trap bar",
    "kettlebell", "body weight", "band", "resistance band",
    "medicine ball", "stability ball", "weighted"
  ],
  home_gym: [
    "barbell", "dumbbell", "kettlebell", "body weight", 
    "band", "resistance band", "medicine ball", "stability ball",
    "ez barbell", "weighted"
  ],
  bodyweight: [
    "body weight", "assisted"
  ],
};

// ============================================================================
// REP SCHEMES BY GOAL
// ============================================================================

interface RepScheme {
  compound: { sets: number; reps: string; rpe: number; rest: number };
  isolation: { sets: number; reps: string; rpe: number; rest: number };
}

const REP_SCHEMES: Record<string, RepScheme> = {
  strength: {
    compound: { sets: 5, reps: "3-5", rpe: 8, rest: 180 },
    isolation: { sets: 3, reps: "8-10", rpe: 7, rest: 90 },
  },
  hypertrophy: {
    compound: { sets: 4, reps: "6-10", rpe: 8, rest: 120 },
    isolation: { sets: 3, reps: "10-15", rpe: 9, rest: 60 },
  },
  fat_loss: {
    compound: { sets: 3, reps: "10-15", rpe: 7, rest: 60 },
    isolation: { sets: 3, reps: "12-20", rpe: 8, rest: 45 },
  },
  general: {
    compound: { sets: 3, reps: "8-12", rpe: 7, rest: 90 },
    isolation: { sets: 3, reps: "10-15", rpe: 8, rest: 60 },
  },
};

// ============================================================================
// EXERCISE SELECTION
// ============================================================================

async function fetchExercisesFromFirestore(
  bodyParts: string[],
  allowedEquipment: string[],
  experienceLevel: string
): Promise<FirestoreExercise[]> {
  if (!db) {
    console.warn("[workout-generator] Firestore not available, returning empty exercises");
    return [];
  }

  const exercises: FirestoreExercise[] = [];
  
  // Query exercises for each body part
  for (const bodyPart of bodyParts) {
    try {
      const snapshot = await db
        .collection("exercises")
        .where("bodyPart", "==", bodyPart)
        .limit(50)
        .get();
      
      snapshot.docs.forEach((doc) => {
        const data = doc.data() as FirestoreExercise;
        
        // Filter by equipment
        if (allowedEquipment.includes(data.equipment.toLowerCase())) {
          // Filter by experience level (allow exercises at or below user's level)
          const levelOrder = { beginner: 1, intermediate: 2, expert: 3 };
          const userLevel = levelOrder[experienceLevel as keyof typeof levelOrder] || 2;
          const exerciseLevel = levelOrder[data.level as keyof typeof levelOrder] || 2;
          
          if (exerciseLevel <= userLevel) {
            exercises.push(data);
          }
        }
      });
    } catch (error) {
      console.error(`[workout-generator] Error fetching exercises for ${bodyPart}:`, error);
    }
  }

  return exercises;
}

function selectExercisesForWorkout(
  exercises: FirestoreExercise[],
  count: number,
  goal: string
): GeneratedExercise[] {
  // Prioritize compound movements first
  const compounds = exercises.filter(e => e.mechanic === "compound");
  const isolations = exercises.filter(e => e.mechanic === "isolation" || e.mechanic === null);

  const selected: GeneratedExercise[] = [];
  const usedIds = new Set<string>();
  
  const scheme = REP_SCHEMES[goal] || REP_SCHEMES.general;
  
  // Select 60% compound, 40% isolation (roughly)
  const compoundCount = Math.ceil(count * 0.6);
  const isolationCount = count - compoundCount;

  // Shuffle arrays for variety
  const shuffledCompounds = shuffleArray([...compounds]);
  const shuffledIsolations = shuffleArray([...isolations]);

  // Add compound exercises
  for (const exercise of shuffledCompounds) {
    if (selected.length >= compoundCount) break;
    if (usedIds.has(exercise.id)) continue;
    
    usedIds.add(exercise.id);
    selected.push({
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      targetSets: scheme.compound.sets,
      targetReps: scheme.compound.reps,
      targetRpe: scheme.compound.rpe,
      restSeconds: scheme.compound.rest,
      orderIndex: selected.length,
    });
  }

  // Add isolation exercises
  for (const exercise of shuffledIsolations) {
    if (selected.length >= count) break;
    if (usedIds.has(exercise.id)) continue;
    
    usedIds.add(exercise.id);
    selected.push({
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      targetSets: scheme.isolation.sets,
      targetReps: scheme.isolation.reps,
      targetRpe: scheme.isolation.rpe,
      restSeconds: scheme.isolation.rest,
      orderIndex: selected.length,
    });
  }

  // If we still need more, add from either pool
  const remaining = [...shuffledCompounds, ...shuffledIsolations].filter(
    e => !usedIds.has(e.id)
  );
  for (const exercise of remaining) {
    if (selected.length >= count) break;
    
    usedIds.add(exercise.id);
    const isCompound = exercise.mechanic === "compound";
    const exScheme = isCompound ? scheme.compound : scheme.isolation;
    
    selected.push({
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      targetSets: exScheme.sets,
      targetReps: exScheme.reps,
      targetRpe: exScheme.rpe,
      restSeconds: exScheme.rest,
      orderIndex: selected.length,
    });
  }

  return selected;
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// ============================================================================
// WORKOUT GENERATION
// ============================================================================

function getWorkoutTemplates(frequency: number): WorkoutTemplate[] {
  switch (frequency) {
    case 3:
      return PPL_TEMPLATES; // Push, Pull, Legs
    case 4:
      return UPPER_LOWER_TEMPLATES; // Upper A, Lower A, Upper B, Lower B
    case 5:
      // PPL + Upper + Lower
      return [
        PPL_TEMPLATES[0], // Push
        PPL_TEMPLATES[1], // Pull
        PPL_TEMPLATES[2], // Legs
        UPPER_LOWER_TEMPLATES[0], // Upper
        UPPER_LOWER_TEMPLATES[1], // Lower
      ];
    case 6:
      // PPL x2
      return [
        { ...PPL_TEMPLATES[0], name: "PUSH A" },
        { ...PPL_TEMPLATES[1], name: "PULL A" },
        { ...PPL_TEMPLATES[2], name: "LEGS A" },
        { ...PPL_TEMPLATES[0], name: "PUSH B" },
        { ...PPL_TEMPLATES[1], name: "PULL B" },
        { ...PPL_TEMPLATES[2], name: "LEGS B" },
      ];
    default:
      return PPL_TEMPLATES;
  }
}

function getDefaultWorkoutDays(frequency: number): number[] {
  switch (frequency) {
    case 3:
      return [1, 3, 5]; // Mon, Wed, Fri
    case 4:
      return [1, 2, 4, 5]; // Mon, Tue, Thu, Fri
    case 5:
      return [1, 2, 3, 4, 5]; // Mon-Fri
    case 6:
      return [1, 2, 3, 4, 5, 6]; // Mon-Sat
    default:
      return [1, 3, 5];
  }
}

function estimateDuration(exercises: GeneratedExercise[]): number {
  // Estimate: ~4 min per set (including rest) + 5 min warmup
  const totalSets = exercises.reduce((sum, ex) => sum + ex.targetSets, 0);
  return Math.round(totalSets * 4 + 5);
}

function adjustExerciseCountForSessionLength(
  baseCount: number,
  sessionLengthMin: number
): number {
  // Rough estimate: each exercise takes ~8-10 min including all sets and rest
  const maxExercises = Math.floor((sessionLengthMin - 5) / 8); // 5 min for warmup
  return Math.min(baseCount, Math.max(3, maxExercises));
}

// ============================================================================
// MAIN GENERATION FUNCTION
// ============================================================================

export async function generateWorkoutProgram(
  preferences: UserPreferences
): Promise<GeneratedWorkout[]> {
  const {
    goal = "general",
    frequency = 3,
    equipment = "full_gym",
    experience = "intermediate",
    sessionLengthMin = 60,
    workoutDays,
  } = preferences;

  console.log("[workout-generator] Generating program with preferences:", preferences);

  // Get workout templates based on frequency
  const templates = getWorkoutTemplates(frequency);
  
  // Get workout days (user-selected or default)
  const days = workoutDays && workoutDays.length === frequency 
    ? workoutDays 
    : getDefaultWorkoutDays(frequency);
  
  // Get allowed equipment
  const allowedEquipment = EQUIPMENT_MAP[equipment] || EQUIPMENT_MAP.full_gym;
  
  // Map experience level
  const experienceLevel = experience === "beginner" ? "beginner" 
    : experience === "advanced" ? "expert" 
    : "intermediate";

  const generatedWorkouts: GeneratedWorkout[] = [];

  for (let i = 0; i < templates.length; i++) {
    const template = templates[i];
    const dayOfWeek = days[i % days.length]; // Cycle through days if more workouts than days
    
    // Fetch exercises from Firestore
    const exercises = await fetchExercisesFromFirestore(
      template.primaryBodyParts,
      allowedEquipment,
      experienceLevel
    );
    
    console.log(`[workout-generator] Found ${exercises.length} exercises for ${template.name}`);

    // Determine exercise count based on experience and session length
    const baseCount = template.exerciseCount[experience as keyof typeof template.exerciseCount] 
      || template.exerciseCount.intermediate;
    const exerciseCount = adjustExerciseCountForSessionLength(baseCount, sessionLengthMin);
    
    // Select exercises for this workout
    const selectedExercises = selectExercisesForWorkout(exercises, exerciseCount, goal);
    
    generatedWorkouts.push({
      name: template.name,
      type: template.type,
      dayOfWeek,
      estimatedDurationMin: estimateDuration(selectedExercises),
      targetMuscles: template.targetMuscles,
      exercises: selectedExercises,
    });
  }

  console.log(`[workout-generator] Generated ${generatedWorkouts.length} workouts`);
  
  return generatedWorkouts;
}

export default {
  generateWorkoutProgram,
};



