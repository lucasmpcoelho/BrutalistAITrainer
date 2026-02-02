/**
 * Workout Generator Service
 * 
 * Generates personalized workout programs based on user preferences.
 * Selects exercises from Firestore based on equipment, experience, and goals.
 * Implements "Focus Tracks" (Strength, Hypertrophy, Endurance) for specialized programming.
 */

import { db } from "../config/firebase";
import type { FirestoreExercise } from "../../shared/types/exercise";
import { dataConnectStorage } from "../storage-dataconnect.js";

// ============================================================================
// TYPES
// ============================================================================

export interface UserPreferences {
  goal?: string;           // "hypertrophy", "strength", "fat_loss", "general", "endurance"
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
  notes?: string;
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
  baseExerciseCount: number; // Scaled dynamically later
}

// Push/Pull/Legs split (Default for 3, 5, 6 days)
const PPL_TEMPLATES: WorkoutTemplate[] = [
  {
    name: "PUSH",
    type: "push",
    targetMuscles: ["chest", "shoulders", "triceps"],
    primaryBodyParts: ["chest", "shoulders", "upper arms"],
    baseExerciseCount: 5,
  },
  {
    name: "PULL",
    type: "pull",
    targetMuscles: ["back", "biceps", "rear delts"],
    primaryBodyParts: ["back", "upper arms"],
    baseExerciseCount: 5,
  },
  {
    name: "LEGS",
    type: "legs",
    targetMuscles: ["quads", "hamstrings", "glutes", "calves"],
    primaryBodyParts: ["upper legs", "lower legs"],
    baseExerciseCount: 5,
  },
];

// Upper/Lower split (Default for 4 days)
const UPPER_LOWER_TEMPLATES: WorkoutTemplate[] = [
  {
    name: "UPPER A",
    type: "upper",
    targetMuscles: ["chest", "back", "shoulders", "arms"],
    primaryBodyParts: ["chest", "back", "shoulders", "upper arms"],
    baseExerciseCount: 6,
  },
  {
    name: "LOWER A",
    type: "lower",
    targetMuscles: ["quads", "hamstrings", "glutes", "calves"],
    primaryBodyParts: ["upper legs", "lower legs"],
    baseExerciseCount: 5,
  },
  {
    name: "UPPER B",
    type: "upper",
    targetMuscles: ["chest", "back", "shoulders", "arms"],
    primaryBodyParts: ["chest", "back", "shoulders", "upper arms"],
    baseExerciseCount: 6,
  },
  {
    name: "LOWER B",
    type: "lower",
    targetMuscles: ["quads", "hamstrings", "glutes", "calves"],
    primaryBodyParts: ["upper legs", "lower legs"],
    baseExerciseCount: 5,
  },
];

// Full body (Alternative for 2-3 days)
const FULL_BODY_TEMPLATE: WorkoutTemplate = {
  name: "FULL BODY",
  type: "full",
  targetMuscles: ["chest", "back", "shoulders", "legs", "core"],
  primaryBodyParts: ["chest", "back", "shoulders", "upper legs", "waist"],
  baseExerciseCount: 6,
};

// ============================================================================
// EQUIPMENT MAPPING & FALLBACKS
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

// Essential equipment checks for compound movements
const REQUIRED_EQUIPMENT: Record<string, string[]> = {
  "barbell squat": ["rack", "barbell"],
  "bench press": ["bench", "barbell"],
  "deadlift": ["barbell"],
};

// ============================================================================
// FOCUS TRACKS (ARCHETYPES)
// ============================================================================

interface RepScheme {
  compound: { sets: number; reps: string; rpe: number; rest: number };
  isolation: { sets: number; reps: string; rpe: number; rest: number };
  notes: string;
}

const FOCUS_TRACKS: Record<string, RepScheme> = {
  strength: {
    compound: { sets: 5, reps: "3-5", rpe: 8.5, rest: 180 },
    isolation: { sets: 3, reps: "6-10", rpe: 8, rest: 120 },
    notes: "Focus on heavy weight and perfect form. Rest fully.",
  },
  hypertrophy: {
    compound: { sets: 4, reps: "8-12", rpe: 8, rest: 90 },
    isolation: { sets: 3, reps: "12-15", rpe: 9, rest: 60 },
    notes: "Focus on time under tension and muscle contraction.",
  },
  fat_loss: {
    compound: { sets: 3, reps: "12-15", rpe: 7.5, rest: 60 },
    isolation: { sets: 3, reps: "15-20", rpe: 8, rest: 45 },
    notes: "Keep heart rate up. Short rests.",
  },
  endurance: {
    compound: { sets: 3, reps: "15-20", rpe: 7, rest: 45 },
    isolation: { sets: 2, reps: "20+", rpe: 8, rest: 30 },
    notes: "Focus on muscular endurance. Minimize rest.",
  },
  general: {
    compound: { sets: 3, reps: "8-10", rpe: 8, rest: 90 },
    isolation: { sets: 3, reps: "10-12", rpe: 8, rest: 60 },
    notes: "Balanced approach for strength and fitness.",
  },
};

// ============================================================================
// EXERCISE SELECTION LOGIC
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
  goal: string,
  experience: string
): GeneratedExercise[] {
  // Categorize
  const compounds = exercises.filter(e => e.mechanic === "compound" || (e.mechanic === null && e.equipment === "barbell"));
  const isolations = exercises.filter(e => e.mechanic === "isolation" || (e.mechanic === null && e.equipment !== "barbell"));

  const selected: GeneratedExercise[] = [];
  const usedIds = new Set<string>();

  // Get Track (Archetype)
  const track = FOCUS_TRACKS[goal] || FOCUS_TRACKS.general;

  // Dynamic Volume Adjustment
  // Beginners: -1 set per exercise
  // Advanced: +1 set per exercise
  const setModifier = experience === "beginner" ? -1 : experience === "advanced" ? 1 : 0;

  // Compound/Isolation Split: ~50-60% Compound
  const compoundCount = Math.ceil(count * 0.55);

  // Shuffle arrays for variety
  const shuffledCompounds = shuffleArray([...compounds]);
  const shuffledIsolations = shuffleArray([...isolations]);

  // Add compound exercises
  for (const exercise of shuffledCompounds) {
    if (selected.length >= compoundCount) break;
    if (usedIds.has(exercise.id)) continue;

    usedIds.add(exercise.id);
    const sets = Math.max(2, track.compound.sets + setModifier);

    selected.push({
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      targetSets: sets,
      targetReps: track.compound.reps,
      targetRpe: track.compound.rpe,
      restSeconds: track.compound.rest,
      orderIndex: selected.length,
      notes: track.notes,
    });
  }

  // Add isolation exercises
  for (const exercise of shuffledIsolations) {
    if (selected.length >= count) break;
    if (usedIds.has(exercise.id)) continue;

    usedIds.add(exercise.id);
    const sets = Math.max(2, track.isolation.sets + setModifier);

    selected.push({
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      targetSets: sets,
      targetReps: track.isolation.reps,
      targetRpe: track.isolation.rpe,
      restSeconds: track.isolation.rest,
      orderIndex: selected.length,
    });
  }

  // Backfill if needed
  const remaining = [...shuffledCompounds, ...shuffledIsolations].filter(
    e => !usedIds.has(e.id)
  );
  for (const exercise of remaining) {
    if (selected.length >= count) break;

    usedIds.add(exercise.id);
    const isCompound = exercise.mechanic === "compound";
    const baseScheme = isCompound ? track.compound : track.isolation;
    const sets = Math.max(2, baseScheme.sets + setModifier);

    selected.push({
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      targetSets: sets,
      targetReps: baseScheme.reps,
      targetRpe: baseScheme.rpe,
      restSeconds: baseScheme.rest,
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
  // Accurate Estimate: Set time + Rest time + 5min Warmup
  const totalSets = exercises.reduce((sum, ex) => sum + ex.targetSets, 0);
  const totalRest = exercises.reduce((sum, ex) => sum + (ex.targetSets * ex.restSeconds), 0);
  const setDurationSeconds = 45; // Approx time under tension per set

  const totalSeconds = (totalSets * setDurationSeconds) + totalRest + (300); // +5 min warmup
  return Math.round(totalSeconds / 60);
}

function calculateTargetExerciseCount(
  baseCount: number,
  sessionLengthMin: number,
  experience: string
): number {
  // Adjust base count by experience
  const expMod = experience === "beginner" ? -1 : experience === "advanced" ? 1 : 0;
  let target = baseCount + expMod;

  // Cap based on time constraint
  // Approx 8-10 mins per exercise
  const maxExercises = Math.floor((sessionLengthMin - 5) / 8);
  return Math.min(target, Math.max(3, maxExercises));
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

  console.log("[workout-generator] Generating program with Focus Track:", goal);

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

    // Calculate target exercise count (Dynamic)
    const exerciseCount = calculateTargetExerciseCount(
      template.baseExerciseCount,
      sessionLengthMin,
      experience
    );

    // Select exercises for this workout with Focus Track nuances
    const selectedExercises = selectExercisesForWorkout(
      exercises,
      exerciseCount,
      goal,
      experience
    );

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

// ============================================================================
// REGENERATE PROGRAM WITH CONSTRAINTS
// ============================================================================

export interface RegenerateConstraints {
  temporaryEquipment?: string[];
  focusMuscles?: string[];
  excludeMuscles?: string[];
  isTemporary: boolean;
  durationDays?: number;
  reason: string;
}

export interface RegenerateResult {
  success: boolean;
  message: string;
  workoutsCreated?: number;
  changes?: string[];
}

/**
 * Regenerate a user's workout program with new constraints
 * Called by AI Coach when user's situation changes
 */
export async function regenerateProgramWithConstraints(
  userId: string,
  constraints: RegenerateConstraints
): Promise<RegenerateResult> {
  console.log("[workout-generator] Regenerating program with constraints:", constraints);

  try {
    // 1. Get user profile
    const user = await dataConnectStorage.getUser(userId);
    if (!user) {
      return { success: false, message: "User not found" };
    }

    // 2. Get existing workouts
    const existingWorkouts = await dataConnectStorage.getWorkouts(userId);
    
    // 3. If temporary, archive existing workouts instead of deleting
    if (constraints.isTemporary && existingWorkouts.length > 0) {
      console.log("[workout-generator] Archiving existing workouts for later restore");
      for (const workout of existingWorkouts) {
        // Mark as inactive (archived) but don't delete
        await dataConnectStorage.updateWorkout(workout.id, { 
          isActive: false,
          // Store restore date in name suffix if durationDays provided
          name: constraints.durationDays 
            ? `${workout.name} [ARCHIVED:${Date.now()}:${constraints.durationDays}]`
            : `${workout.name} [ARCHIVED:${Date.now()}]`
        });
      }
    } else {
      // Permanent change - deactivate old workouts
      for (const workout of existingWorkouts) {
        await dataConnectStorage.updateWorkout(workout.id, { isActive: false });
      }
    }

    // 4. Build new preferences with constraints applied
    const newPreferences: UserPreferences = {
      goal: user.goal || "general",
      frequency: user.frequency || 3,
      equipment: user.equipment || "full_gym",
      experience: user.experience || "intermediate",
      sessionLengthMin: user.sessionLengthMin || 60,
    };

    // Override equipment if specified
    if (constraints.temporaryEquipment && constraints.temporaryEquipment.length > 0) {
      // Map to closest equipment category or use custom
      const equipmentSet = new Set(constraints.temporaryEquipment.map(e => e.toLowerCase()));
      
      if (equipmentSet.has("barbell") || equipmentSet.has("cable") || equipmentSet.has("machine")) {
        newPreferences.equipment = "full_gym";
      } else if (equipmentSet.has("dumbbell") || equipmentSet.has("kettlebell")) {
        newPreferences.equipment = "home_gym";
      } else if (equipmentSet.size === 1 && (equipmentSet.has("body weight") || equipmentSet.has("bodyweight"))) {
        newPreferences.equipment = "bodyweight";
      } else {
        newPreferences.equipment = "home_gym"; // Default fallback
      }
    }

    // 5. Generate new workouts
    let generatedWorkouts = await generateWorkoutProgram(newPreferences);

    // 6. Apply focus muscle filter (increase volume)
    if (constraints.focusMuscles && constraints.focusMuscles.length > 0) {
      const focusSet = new Set(constraints.focusMuscles.map(m => m.toLowerCase()));
      
      generatedWorkouts = generatedWorkouts.map(workout => {
        // Check if this workout targets any focus muscles
        const hasFocusMuscle = workout.targetMuscles.some(m => 
          focusSet.has(m.toLowerCase())
        );
        
        if (hasFocusMuscle) {
          // Increase sets for exercises targeting focus muscles
          return {
            ...workout,
            exercises: workout.exercises.map(ex => ({
              ...ex,
              targetSets: ex.targetSets + 1, // Add 1 set
            })),
          };
        }
        return workout;
      });
    }

    // 7. Apply exclude muscle filter
    if (constraints.excludeMuscles && constraints.excludeMuscles.length > 0) {
      const excludeSet = new Set(constraints.excludeMuscles.map(m => m.toLowerCase()));
      
      generatedWorkouts = generatedWorkouts.map(workout => ({
        ...workout,
        exercises: workout.exercises.filter(ex => {
          // This is a simplification - ideally we'd check the exercise's target muscle
          // For now, filter based on workout's target muscles
          return !workout.targetMuscles.some(m => excludeSet.has(m.toLowerCase()));
        }),
      }));
    }

    // 8. Save new workouts to database
    let workoutsCreated = 0;
    for (const workout of generatedWorkouts) {
      // Create workout
      const created = await dataConnectStorage.createWorkout({
        userId,
        name: workout.name,
        type: workout.type,
        dayOfWeek: workout.dayOfWeek,
        estimatedDurationMin: workout.estimatedDurationMin,
        targetMuscles: workout.targetMuscles,
        isActive: true,
      });

      // Add exercises
      for (const exercise of workout.exercises) {
        await dataConnectStorage.addWorkoutExercise({
          workoutId: created.id,
          exerciseId: exercise.exerciseId,
          exerciseName: exercise.exerciseName,
          orderIndex: exercise.orderIndex,
          targetSets: exercise.targetSets,
          targetReps: exercise.targetReps,
          targetRpe: exercise.targetRpe,
          restSeconds: exercise.restSeconds,
          notes: exercise.notes,
        });
      }

      workoutsCreated++;
    }

    // 9. Build summary of changes
    const changes: string[] = [];
    if (constraints.temporaryEquipment) {
      changes.push(`Equipment: ${constraints.temporaryEquipment.join(", ")}`);
    }
    if (constraints.focusMuscles) {
      changes.push(`Focus: ${constraints.focusMuscles.join(", ")} (+1 set)`);
    }
    if (constraints.excludeMuscles) {
      changes.push(`Avoiding: ${constraints.excludeMuscles.join(", ")}`);
    }
    if (constraints.isTemporary) {
      changes.push(constraints.durationDays 
        ? `Temporary (${constraints.durationDays} days)`
        : "Temporary (until restored)"
      );
    }

    return {
      success: true,
      message: `Created ${workoutsCreated} new workouts. ${constraints.reason}`,
      workoutsCreated,
      changes,
    };

  } catch (error) {
    console.error("[workout-generator] regenerateProgramWithConstraints error:", error);
    return {
      success: false,
      message: `Failed to regenerate program: ${error}`,
    };
  }
}

export default {
  generateWorkoutProgram,
  regenerateProgramWithConstraints,
};
