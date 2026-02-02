/**
 * AI Coach Tools (Gemini Function Calling)
 * 
 * Implements executable functions that the AI can call to
 * make changes to the user's workout or retrieve information.
 * 
 * Tools accept human-friendly parameters (exercise names, day names)
 * and handle ID lookups internally.
 * 
 * Reference: https://ai.google.dev/gemini-api/docs/function-calling
 */

import { Tool, FunctionDeclaration, SchemaType } from "@google/generative-ai";
import { dataConnectStorage } from "../storage-dataconnect.js";
import { db } from "../config/firebase.js";
import type { FirestoreExercise } from "../../shared/types/exercise.js";
import { regenerateProgramWithConstraints } from "./workout-generator.js";

// Day name to number mapping
const DAY_NAME_TO_NUMBER: Record<string, number> = {
  "sunday": 0, "sun": 0,
  "monday": 1, "mon": 1,
  "tuesday": 2, "tue": 2, "tues": 2,
  "wednesday": 3, "wed": 3,
  "thursday": 4, "thu": 4, "thurs": 4,
  "friday": 5, "fri": 5,
  "saturday": 6, "sat": 6,
};

function parseDayOfWeek(day: string | number): number | null {
  if (typeof day === "number") return day >= 0 && day <= 6 ? day : null;
  const normalized = day.toLowerCase().trim();
  return DAY_NAME_TO_NUMBER[normalized] ?? null;
}

// ============================================================================
// TOOL DEFINITIONS (Schema for Gemini)
// ============================================================================

/**
 * Tool: swap_exercise
 * Replaces an exercise in the user's workout with an alternative
 */
const swapExerciseTool: FunctionDeclaration = {
  name: "swap_exercise",
  description: "Replace an exercise in the user's weekly workout plan with a different exercise. Use exercise NAMES (not IDs) - the system will find the correct exercise. Works for any day of the week.",
  parameters: {
    type: SchemaType.OBJECT,
    properties: {
      currentExerciseName: {
        type: SchemaType.STRING,
        description: "The name of the exercise to replace (e.g., 'Bench Press', 'Squat'). Must match an exercise in the user's plan.",
      },
      dayOfWeek: {
        type: SchemaType.STRING,
        description: "The day of the week (e.g., 'Monday', 'Tuesday', 'Wed'). Use 'today' for current day.",
      },
      newExerciseName: {
        type: SchemaType.STRING,
        description: "The name of the replacement exercise (e.g., 'Dumbbell Press', 'Leg Press'). Will search exercise database.",
      },
      reason: {
        type: SchemaType.STRING,
        description: "Brief explanation for why this swap is being made",
      },
    },
    required: ["currentExerciseName", "dayOfWeek", "newExerciseName"],
  },
};

/**
 * Tool: adjust_volume
 * Modifies sets, reps, or rest periods for an exercise
 */
const adjustVolumeTool: FunctionDeclaration = {
  name: "adjust_volume",
  description: "Adjust the training volume (sets, reps, or rest time) for a specific exercise. Use exercise NAME and day - the system handles the lookup.",
  parameters: {
    type: SchemaType.OBJECT,
    properties: {
      exerciseName: {
        type: SchemaType.STRING,
        description: "The name of the exercise to modify (e.g., 'Bench Press')",
      },
      dayOfWeek: {
        type: SchemaType.STRING,
        description: "The day of the week (e.g., 'Monday', 'today')",
      },
      targetSets: {
        type: SchemaType.NUMBER,
        description: "New number of sets (optional)",
      },
      targetReps: {
        type: SchemaType.STRING,
        description: "New rep range, e.g. '8-12' or '5' (optional)",
      },
      restSeconds: {
        type: SchemaType.NUMBER,
        description: "New rest period in seconds (optional)",
      },
      reason: {
        type: SchemaType.STRING,
        description: "Brief explanation for the adjustment",
      },
    },
    required: ["exerciseName", "dayOfWeek"],
  },
};

/**
 * Tool: explain_exercise
 * Retrieves detailed information about an exercise including form cues
 */
const explainExerciseTool: FunctionDeclaration = {
  name: "explain_exercise",
  description: "Get detailed information about an exercise including instructions, muscles worked, and form cues. Use this to provide accurate technique guidance.",
  parameters: {
    type: SchemaType.OBJECT,
    properties: {
      exerciseName: {
        type: SchemaType.STRING,
        description: "The name of the exercise to explain (e.g., 'Deadlift', 'Pull-up')",
      },
    },
    required: ["exerciseName"],
  },
};

/**
 * Tool: get_alternatives
 * Finds alternative exercises for a given exercise
 */
const getAlternativesTool: FunctionDeclaration = {
  name: "get_alternatives",
  description: "Find alternative exercises that target the same muscle group. Use exercise NAME - the system handles the lookup.",
  parameters: {
    type: SchemaType.OBJECT,
    properties: {
      exerciseName: {
        type: SchemaType.STRING,
        description: "The name of the exercise to find alternatives for (e.g., 'Bench Press')",
      },
      limit: {
        type: SchemaType.NUMBER,
        description: "Maximum number of alternatives to return (default: 5)",
      },
    },
    required: ["exerciseName"],
  },
};

/**
 * Tool: search_exercises
 * Finds exercises in the database based on a search query
 */
const searchExercisesTool: FunctionDeclaration = {
  name: "search_exercises",
  description: "Search for exercises by name or body part. Use this when you need to find an exercise but don't know the exact name, or when looking for options to present to the user.",
  parameters: {
    type: SchemaType.OBJECT,
    properties: {
      query: {
        type: SchemaType.STRING,
        description: "The search query (e.g., 'chest press', 'dumbbell legs', 'back isolation')",
      },
      limit: {
        type: SchemaType.NUMBER,
        description: "Maximum results to return (default: 5)",
      },
    },
    required: ["query"],
  },
};

/**
 * Tool: regenerate_program
 * Regenerates the user's workout program with new constraints
 */
const regenerateProgramTool: FunctionDeclaration = {
  name: "regenerate_program",
  description: "Regenerate the user's entire workout program with new constraints. Use when the user's situation changes significantly: traveling with limited equipment, wanting to focus on specific muscles, dealing with an injury, or returning to normal training. ALWAYS confirm with the user before calling this tool.",
  parameters: {
    type: SchemaType.OBJECT,
    properties: {
      temporaryEquipment: {
        type: SchemaType.ARRAY,
        items: { type: SchemaType.STRING },
        description: "Override equipment access temporarily (e.g., ['dumbbell', 'bench', 'body weight']). Leave empty to use user's saved equipment preference.",
      },
      focusMuscles: {
        type: SchemaType.ARRAY,
        items: { type: SchemaType.STRING },
        description: "Muscle groups to prioritize (e.g., ['chest', 'triceps']). Will increase volume for these muscles.",
      },
      excludeMuscles: {
        type: SchemaType.ARRAY,
        items: { type: SchemaType.STRING },
        description: "Muscle groups to avoid due to injury or preference (e.g., ['shoulders', 'lower back']).",
      },
      isTemporary: {
        type: SchemaType.BOOLEAN,
        description: "If true, the original program will be saved and can be restored later. Set to true for travel, short-term changes. Set to false for permanent changes.",
      },
      durationDays: {
        type: SchemaType.NUMBER,
        description: "For temporary changes, how many days until auto-restore (optional). E.g., 14 for a 2-week trip.",
      },
      reason: {
        type: SchemaType.STRING,
        description: "Brief explanation for the regeneration (e.g., 'User is traveling with hotel gym only')",
      },
    },
    required: ["isTemporary", "reason"],
  },
};

// Export all tool declarations for Gemini
export const COACH_TOOLS: Tool = {
  functionDeclarations: [
    swapExerciseTool,
    adjustVolumeTool,
    explainExerciseTool,
    getAlternativesTool,
    searchExercisesTool,
    regenerateProgramTool,
  ],
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Find an exercise in Firestore by name (fuzzy match)
 */
async function findExerciseByName(name: string): Promise<FirestoreExercise | null> {
  if (!db) return null;

  // Try exact match first (case-insensitive via lowercase ID convention)
  const normalizedId = name.replace(/[^a-zA-Z0-9]/g, "_");
  const exactDoc = await db.collection("exercises").doc(normalizedId).get();
  if (exactDoc.exists) {
    return exactDoc.data() as FirestoreExercise;
  }

  // Fall back to search by name field
  const snapshot = await db.collection("exercises")
    .where("name", ">=", name)
    .where("name", "<=", name + "\uf8ff")
    .limit(5)
    .get();

  if (!snapshot.empty) {
    // Find best match (case-insensitive)
    const nameLower = name.toLowerCase();
    for (const doc of snapshot.docs) {
      const exercise = doc.data() as FirestoreExercise;
      if (exercise.name.toLowerCase() === nameLower) {
        return exercise;
      }
    }
    // Return first result if no exact match
    return snapshot.docs[0].data() as FirestoreExercise;
  }

  return null;
}

/**
 * Find a workout exercise by name and day for a user
 */
async function findWorkoutExercise(
  userId: string,
  exerciseName: string,
  dayOfWeek: number
): Promise<{ workoutExerciseId: string; exerciseId: string; workoutId: string } | null> {
  try {
    // Get all workouts for the user
    const workouts = await dataConnectStorage.getWorkouts(userId);
    const workout = workouts.find(w => w.dayOfWeek === dayOfWeek && w.isActive);

    if (!workout) {
      return null;
    }

    // Get exercises for this workout
    const exercises = await dataConnectStorage.getWorkoutExercises(workout.id);

    // Find the exercise by name (case-insensitive)
    const nameLower = exerciseName.toLowerCase();
    const exercise = exercises.find(e =>
      e.exerciseName.toLowerCase() === nameLower ||
      e.exerciseName.toLowerCase().includes(nameLower) ||
      nameLower.includes(e.exerciseName.toLowerCase())
    );

    if (!exercise) {
      return null;
    }

    return {
      workoutExerciseId: exercise.id,
      exerciseId: exercise.exerciseId,
      workoutId: workout.id,
    };
  } catch (error) {
    console.error("[ai-tools] findWorkoutExercise error:", error);
    return null;
  }
}

// ============================================================================
// TOOL EXECUTION HANDLERS
// ============================================================================

export interface ToolResult {
  success: boolean;
  message: string;
  data?: unknown;
}

// Store userId for tool execution (set by executeTool)
let currentUserId: string | null = null;

/**
 * Execute swap_exercise tool
 */
async function executeSwapExercise(args: {
  currentExerciseName: string;
  dayOfWeek: string;
  newExerciseName: string;
  reason?: string;
}): Promise<ToolResult> {
  try {
    if (!currentUserId) {
      return { success: false, message: "User context not available" };
    }

    // Parse day of week
    let dayNum: number;
    if (args.dayOfWeek.toLowerCase() === "today") {
      dayNum = new Date().getDay();
    } else {
      const parsed = parseDayOfWeek(args.dayOfWeek);
      if (parsed === null) {
        return { success: false, message: `Invalid day: ${args.dayOfWeek}. Use day names like Monday, Tuesday, etc.` };
      }
      dayNum = parsed;
    }

    // Find the current exercise in the user's workout
    const currentExercise = await findWorkoutExercise(currentUserId, args.currentExerciseName, dayNum);
    if (!currentExercise) {
      return {
        success: false,
        message: `Could not find "${args.currentExerciseName}" in the workout for ${args.dayOfWeek}. Check the exercise name matches exactly.`
      };
    }

    // Find the new exercise in the database
    const newExercise = await findExerciseByName(args.newExerciseName);
    if (!newExercise) {
      return {
        success: false,
        message: `Could not find "${args.newExerciseName}" in the exercise database. Try a different exercise name.`
      };
    }

    // Execute the swap
    await dataConnectStorage.updateWorkoutExercise(currentExercise.workoutExerciseId, {
      exerciseId: newExercise.id,
      exerciseName: newExercise.name,
    });

    return {
      success: true,
      message: `Swapped "${args.currentExerciseName}" for "${newExercise.name}" on ${args.dayOfWeek}${args.reason ? `. Reason: ${args.reason}` : ""}`,
      data: {
        oldExercise: args.currentExerciseName,
        newExercise: newExercise.name,
        day: args.dayOfWeek,
      },
    };
  } catch (error) {
    console.error("[ai-tools] swap_exercise error:", error);
    return {
      success: false,
      message: `Failed to swap exercise: ${error}`,
    };
  }
}

/**
 * Execute adjust_volume tool
 */
async function executeAdjustVolume(args: {
  exerciseName: string;
  dayOfWeek: string;
  targetSets?: number;
  targetReps?: string;
  restSeconds?: number;
  reason?: string;
}): Promise<ToolResult> {
  try {
    if (!currentUserId) {
      return { success: false, message: "User context not available" };
    }

    // Parse day of week
    let dayNum: number;
    if (args.dayOfWeek.toLowerCase() === "today") {
      dayNum = new Date().getDay();
    } else {
      const parsed = parseDayOfWeek(args.dayOfWeek);
      if (parsed === null) {
        return { success: false, message: `Invalid day: ${args.dayOfWeek}` };
      }
      dayNum = parsed;
    }

    // Find the exercise in the user's workout
    const exercise = await findWorkoutExercise(currentUserId, args.exerciseName, dayNum);
    if (!exercise) {
      return {
        success: false,
        message: `Could not find "${args.exerciseName}" in the workout for ${args.dayOfWeek}`
      };
    }

    // Build updates
    const updates: Record<string, unknown> = {};
    if (args.targetSets !== undefined) updates.targetSets = args.targetSets;
    if (args.targetReps !== undefined) updates.targetReps = args.targetReps;
    if (args.restSeconds !== undefined) updates.restSeconds = args.restSeconds;

    if (Object.keys(updates).length === 0) {
      return {
        success: false,
        message: "No volume changes specified. Provide targetSets, targetReps, or restSeconds.",
      };
    }

    await dataConnectStorage.updateWorkoutExercise(exercise.workoutExerciseId, updates);

    const changes: string[] = [];
    if (args.targetSets) changes.push(`${args.targetSets} sets`);
    if (args.targetReps) changes.push(`${args.targetReps} reps`);
    if (args.restSeconds) changes.push(`${args.restSeconds}s rest`);

    return {
      success: true,
      message: `Updated ${args.exerciseName} on ${args.dayOfWeek}: ${changes.join(", ")}${args.reason ? `. ${args.reason}` : ""}`,
      data: updates,
    };
  } catch (error) {
    console.error("[ai-tools] adjust_volume error:", error);
    return {
      success: false,
      message: `Failed to adjust volume: ${error}`,
    };
  }
}

/**
 * Execute explain_exercise tool
 */
async function executeExplainExercise(args: {
  exerciseName: string;
}): Promise<ToolResult> {
  try {
    const exercise = await findExerciseByName(args.exerciseName);

    if (!exercise) {
      return {
        success: false,
        message: `Could not find exercise "${args.exerciseName}" in the database`,
      };
    }

    return {
      success: true,
      message: "Exercise details retrieved",
      data: {
        name: exercise.name,
        bodyPart: exercise.bodyPart,
        target: exercise.target,
        equipment: exercise.equipment,
        secondaryMuscles: exercise.secondaryMuscles,
        instructions: exercise.instructions,
        level: exercise.level,
        category: exercise.category,
      },
    };
  } catch (error) {
    console.error("[ai-tools] explain_exercise error:", error);
    return {
      success: false,
      message: `Failed to get exercise details: ${error}`,
    };
  }
}

/**
 * Execute get_alternatives tool
 */
async function executeGetAlternatives(args: {
  exerciseName: string;
  limit?: number;
}): Promise<ToolResult> {
  try {
    if (!db) {
      return { success: false, message: "Database not available" };
    }

    // Find the original exercise
    const exercise = await findExerciseByName(args.exerciseName);
    if (!exercise) {
      return { success: false, message: `Could not find exercise "${args.exerciseName}"` };
    }

    const limitNum = args.limit || 5;

    // Find alternatives with same target muscle
    const snapshot = await db.collection("exercises")
      .where("target", "==", exercise.target)
      .limit(limitNum + 5)
      .get();

    const alternatives = snapshot.docs
      .map(d => d.data() as FirestoreExercise)
      .filter(ex => ex.id !== exercise.id)
      .slice(0, limitNum)
      .map(ex => ({
        name: ex.name,
        equipment: ex.equipment,
        bodyPart: ex.bodyPart,
      }));

    return {
      success: true,
      message: `Found ${alternatives.length} alternatives for ${exercise.name} (targets: ${exercise.target})`,
      data: {
        originalExercise: exercise.name,
        targetMuscle: exercise.target,
        alternatives,
      },
    };
  } catch (error) {
    console.error("[ai-tools] get_alternatives error:", error);
    return {
      success: false,
      message: `Failed to get alternatives: ${error}`,
    };
  }
}

/**
 * Execute search_exercises tool
 */
async function executeSearchExercises(args: {
  query: string;
  limit?: number;
}): Promise<ToolResult> {
  try {
    if (!db) {
      return { success: false, message: "Database not available" };
    }

    const limitNum = args.limit || 5;
    const queryLower = args.query.toLowerCase();

    // 1. Try body part match first
    const bodyParts = ["chest", "back", "shoulders", "arms", "legs", "core", "cardio"];
    const matchedBodyPart = bodyParts.find(bp => queryLower.includes(bp));

    let queryFn = db.collection("exercises");
    let initialQuery: FirebaseFirestore.Query<FirebaseFirestore.DocumentData> | FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData> = queryFn;

    if (matchedBodyPart) {
      initialQuery = queryFn.where("bodyPart", "==", matchedBodyPart);
    }

    // Fetch more to filter in memory
    const snapshot = await initialQuery.limit(50).get();

    // 2. Filter by text match in memory (Firestore doesn't do substring search)
    let results = snapshot.docs
      .map(d => d.data() as FirestoreExercise)
      .filter(ex => {
        // If we matched body part, we already filtered by it.
        // If query was just "chest", we return all chest exercises.
        // If query was "dumbbell chest", we filter by "dumbbell" too.
        if (matchedBodyPart && queryLower === matchedBodyPart) return true;

        const searchTerms = queryLower.split(" ");
        return searchTerms.every(term =>
          ex.name.toLowerCase().includes(term) ||
          ex.equipment.toLowerCase().includes(term) ||
          ex.target.toLowerCase().includes(term) ||
          ex.bodyPart.toLowerCase().includes(term)
        );
      });

    // 3. Sort by relevance (exact matches first)
    results.sort((a, b) => {
      const aName = a.name.toLowerCase();
      const bName = b.name.toLowerCase();
      const aExact = aName === queryLower ? 1 : 0;
      const bExact = bName === queryLower ? 1 : 0;
      return bExact - aExact;
    });

    // 4. Limit results
    results = results.slice(0, limitNum);

    if (results.length === 0) {
      return {
        success: true, // Not an error, just no results
        message: `No exercises found matching "${args.query}". Try a different term.`,
        data: { results: [] }
      };
    }

    return {
      success: true,
      message: `Found ${results.length} exercises matching "${args.query}"`,
      data: {
        results: results.map(ex => ({
          name: ex.name,
          equipment: ex.equipment,
          bodyPart: ex.bodyPart,
          target: ex.target
        }))
      }
    };

  } catch (error) {
    console.error("[ai-tools] search_exercises error:", error);
    return {
      success: false,
      message: `Search failed: ${error}`,
    };
  }
}

/**
 * Execute regenerate_program tool
 */
async function executeRegenerateProgram(args: {
  temporaryEquipment?: string[];
  focusMuscles?: string[];
  excludeMuscles?: string[];
  isTemporary: boolean;
  durationDays?: number;
  reason: string;
}): Promise<ToolResult> {
  try {
    if (!currentUserId) {
      return { success: false, message: "User context not available" };
    }

    console.log("[ai-tools] Regenerating program for user:", currentUserId, args);

    const result = await regenerateProgramWithConstraints(currentUserId, {
      temporaryEquipment: args.temporaryEquipment,
      focusMuscles: args.focusMuscles,
      excludeMuscles: args.excludeMuscles,
      isTemporary: args.isTemporary,
      durationDays: args.durationDays,
      reason: args.reason,
    });

    if (!result.success) {
      return {
        success: false,
        message: result.message || "Failed to regenerate program",
      };
    }

    return {
      success: true,
      message: `Program regenerated successfully! ${result.message}`,
      data: {
        workoutsCreated: result.workoutsCreated,
        isTemporary: args.isTemporary,
        changes: result.changes,
      },
    };
  } catch (error) {
    console.error("[ai-tools] regenerate_program error:", error);
    return {
      success: false,
      message: `Failed to regenerate program: ${error}`,
    };
  }
}

// ============================================================================
// MAIN TOOL EXECUTOR
// ============================================================================

/**
 * Execute a tool call from the AI
 * @param toolName - Name of the tool to execute
 * @param args - Arguments from the AI
 * @param userId - Current user's ID for context
 */
export async function executeTool(
  toolName: string,
  args: Record<string, unknown>,
  userId?: string
): Promise<ToolResult> {
  console.log(`[ai-tools] Executing tool: ${toolName}`, args);

  // Set user context for tools that need it
  currentUserId = userId || null;

  try {
    switch (toolName) {
      case "swap_exercise":
        return await executeSwapExercise(args as Parameters<typeof executeSwapExercise>[0]);

      case "adjust_volume":
        return await executeAdjustVolume(args as Parameters<typeof executeAdjustVolume>[0]);

      case "explain_exercise":
        return await executeExplainExercise(args as Parameters<typeof executeExplainExercise>[0]);

      case "get_alternatives":
        return await executeGetAlternatives(args as Parameters<typeof executeGetAlternatives>[0]);

      case "search_exercises":
        return await executeSearchExercises(args as Parameters<typeof executeSearchExercises>[0]);

      case "regenerate_program":
        return await executeRegenerateProgram(args as Parameters<typeof executeRegenerateProgram>[0]);

      default:
        return {
          success: false,
          message: `Unknown tool: ${toolName}`,
        };
    }
  } finally {
    // Clear user context after execution
    currentUserId = null;
  }
}
