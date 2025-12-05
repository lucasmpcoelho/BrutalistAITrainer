import { Router, Request, Response } from "express";
import { storage } from "../storage";
import { insertWorkoutSchema, insertWorkoutExerciseSchema } from "../../shared/schema";
import { verifyFirebaseToken } from "../middleware/firebase-auth";
import { db } from "../config/firebase";
import { generateWorkoutProgram, type UserPreferences } from "../services/workout-generator";

const router = Router();

// Helper to get user ID from Firebase auth
function getUserId(req: Request): string | undefined {
  return req.firebaseUser?.uid;
}

// ============================================================================
// WORKOUT GENERATION
// ============================================================================

/**
 * POST /api/workouts/generate
 * Generate a personalized workout program based on user preferences from Firestore
 */
router.post("/generate", verifyFirebaseToken, async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    // Check if user already has workouts
    const existingWorkouts = await storage.getWorkouts(userId);
    if (existingWorkouts.length > 0) {
      return res.status(400).json({ 
        error: "User already has workouts. Delete existing workouts first or use update endpoints." 
      });
    }

    // Fetch user profile from Firestore to get preferences
    if (!db) {
      return res.status(500).json({ error: "Firestore not available" });
    }

    const userDoc = await db.collection("users").doc(userId).get();
    if (!userDoc.exists) {
      return res.status(404).json({ error: "User profile not found in Firestore" });
    }

    const userData = userDoc.data();
    const preferences: UserPreferences = {
      goal: userData?.preferences?.goal,
      frequency: userData?.preferences?.frequency,
      equipment: userData?.preferences?.equipment,
      experience: userData?.preferences?.experience,
      sessionLengthMin: userData?.preferences?.sessionLengthMin,
      workoutDays: userData?.preferences?.workoutDays,
    };

    console.log("[workouts/generate] Generating for user:", userId, "with preferences:", preferences);

    // Generate workout program
    const generatedWorkouts = await generateWorkoutProgram(preferences);

    if (generatedWorkouts.length === 0) {
      return res.status(500).json({ error: "Failed to generate workouts - no exercises found" });
    }

    // Create workouts and exercises in storage
    const createdWorkouts = [];
    for (const genWorkout of generatedWorkouts) {
      // Create the workout template
      const workout = await storage.createWorkout({
        userId,
        name: genWorkout.name,
        type: genWorkout.type,
        dayOfWeek: genWorkout.dayOfWeek,
        estimatedDurationMin: genWorkout.estimatedDurationMin,
        targetMuscles: genWorkout.targetMuscles,
        isActive: true,
      });

      // Add exercises to the workout
      for (const genExercise of genWorkout.exercises) {
        await storage.addWorkoutExercise({
          workoutId: workout.id,
          exerciseId: genExercise.exerciseId,
          exerciseName: genExercise.exerciseName,
          orderIndex: genExercise.orderIndex,
          targetSets: genExercise.targetSets,
          targetReps: genExercise.targetReps,
          targetRpe: genExercise.targetRpe,
          restSeconds: genExercise.restSeconds,
        });
      }

      // Fetch the workout with exercises to return
      const exercises = await storage.getWorkoutExercises(workout.id);
      createdWorkouts.push({ ...workout, exercises });
    }

    console.log(`[workouts/generate] Created ${createdWorkouts.length} workouts for user:`, userId);

    res.status(201).json({ 
      message: "Workout program generated successfully",
      workouts: createdWorkouts 
    });
  } catch (error) {
    console.error("[workouts/generate] Error:", error);
    res.status(500).json({ error: "Failed to generate workout program" });
  }
});

// ============================================================================
// WORKOUT TEMPLATE ROUTES
// ============================================================================

/**
 * DELETE /api/workouts/all
 * Delete all workouts for the current user and reset onboarding status
 * Used for "Reset Training Plan" feature
 * 
 * NOTE: This route MUST come before /:id to avoid being matched by the catch-all
 */
router.delete("/all", verifyFirebaseToken, async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Get all workouts for this user
    const workouts = await storage.getWorkouts(userId);
    
    // Delete all workouts (this will cascade to exercises)
    await Promise.all(workouts.map(w => storage.deleteWorkout(w.id)));

    // Reset onboardingCompleted in Firestore
    if (db) {
      await db.collection("users").doc(userId).update({ 
        onboardingCompleted: false 
      });
    }

    console.log(`[workouts/all] Deleted ${workouts.length} workouts for user:`, userId);

    res.json({ 
      message: "All workouts deleted and onboarding reset",
      deletedCount: workouts.length 
    });
  } catch (error) {
    console.error("[workouts/all] Error deleting all workouts:", error);
    res.status(500).json({ error: "Failed to delete workouts" });
  }
});

/**
 * GET /api/workouts
 * Get all workout templates for the current user
 */
router.get("/", verifyFirebaseToken, async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const workouts = await storage.getWorkouts(userId);
    
    // Fetch exercises for each workout
    const workoutsWithExercises = await Promise.all(
      workouts.map(async (workout) => {
        const exercises = await storage.getWorkoutExercises(workout.id);
        return { ...workout, exercises };
      })
    );
    
    res.json({ workouts: workoutsWithExercises });
  } catch (error) {
    console.error("[workouts] Get workouts error:", error);
    res.status(500).json({ error: "Failed to get workouts" });
  }
});

/**
 * GET /api/workouts/:id
 * Get a single workout with its exercises
 */
router.get("/:id", verifyFirebaseToken, async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const workout = await storage.getWorkout(req.params.id);
    
    if (!workout) {
      return res.status(404).json({ error: "Workout not found" });
    }
    
    // Verify ownership
    if (workout.userId !== userId) {
      return res.status(403).json({ error: "Access denied" });
    }
    
    const exercises = await storage.getWorkoutExercises(workout.id);
    res.json({ workout: { ...workout, exercises } });
  } catch (error) {
    console.error("[workouts] Get workout error:", error);
    res.status(500).json({ error: "Failed to get workout" });
  }
});

/**
 * POST /api/workouts
 * Create a new workout template
 */
router.post("/", verifyFirebaseToken, async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const parsed = insertWorkoutSchema.safeParse({
      ...req.body,
      userId,
    });
    
    if (!parsed.success) {
      return res.status(400).json({ 
        error: "Invalid input", 
        details: parsed.error.flatten().fieldErrors 
      });
    }
    
    const workout = await storage.createWorkout(parsed.data);
    res.status(201).json({ workout });
  } catch (error) {
    console.error("[workouts] Create workout error:", error);
    res.status(500).json({ error: "Failed to create workout" });
  }
});

/**
 * PUT /api/workouts/:id
 * Update a workout template
 */
router.put("/:id", verifyFirebaseToken, async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const workout = await storage.getWorkout(req.params.id);
    
    if (!workout) {
      return res.status(404).json({ error: "Workout not found" });
    }
    
    if (workout.userId !== userId) {
      return res.status(403).json({ error: "Access denied" });
    }
    
    const updated = await storage.updateWorkout(req.params.id, req.body);
    res.json({ workout: updated });
  } catch (error) {
    console.error("[workouts] Update workout error:", error);
    res.status(500).json({ error: "Failed to update workout" });
  }
});

/**
 * DELETE /api/workouts/:id
 * Delete a workout template
 */
router.delete("/:id", verifyFirebaseToken, async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const workout = await storage.getWorkout(req.params.id);
    
    if (!workout) {
      return res.status(404).json({ error: "Workout not found" });
    }
    
    if (workout.userId !== userId) {
      return res.status(403).json({ error: "Access denied" });
    }
    
    await storage.deleteWorkout(req.params.id);
    res.json({ message: "Workout deleted" });
  } catch (error) {
    console.error("[workouts] Delete workout error:", error);
    res.status(500).json({ error: "Failed to delete workout" });
  }
});

// ============================================================================
// WORKOUT EXERCISE ROUTES
// ============================================================================

/**
 * POST /api/workouts/:id/exercises
 * Add an exercise to a workout
 */
router.post("/:id/exercises", verifyFirebaseToken, async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const workout = await storage.getWorkout(req.params.id);
    
    if (!workout) {
      return res.status(404).json({ error: "Workout not found" });
    }
    
    if (workout.userId !== userId) {
      return res.status(403).json({ error: "Access denied" });
    }
    
    const parsed = insertWorkoutExerciseSchema.safeParse({
      ...req.body,
      workoutId: req.params.id,
    });
    
    if (!parsed.success) {
      return res.status(400).json({ 
        error: "Invalid input", 
        details: parsed.error.flatten().fieldErrors 
      });
    }
    
    const exercise = await storage.addWorkoutExercise(parsed.data);
    res.status(201).json({ exercise });
  } catch (error) {
    console.error("[workouts] Add exercise error:", error);
    res.status(500).json({ error: "Failed to add exercise" });
  }
});

/**
 * PUT /api/workouts/:workoutId/exercises/:exerciseId
 * Update an exercise in a workout
 */
router.put("/:workoutId/exercises/:exerciseId", verifyFirebaseToken, async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const workout = await storage.getWorkout(req.params.workoutId);
    
    if (!workout) {
      return res.status(404).json({ error: "Workout not found" });
    }
    
    if (workout.userId !== userId) {
      return res.status(403).json({ error: "Access denied" });
    }
    
    const updated = await storage.updateWorkoutExercise(req.params.exerciseId, req.body);
    
    if (!updated) {
      return res.status(404).json({ error: "Exercise not found" });
    }
    
    res.json({ exercise: updated });
  } catch (error) {
    console.error("[workouts] Update exercise error:", error);
    res.status(500).json({ error: "Failed to update exercise" });
  }
});

/**
 * DELETE /api/workouts/:workoutId/exercises/:exerciseId
 * Remove an exercise from a workout
 */
router.delete("/:workoutId/exercises/:exerciseId", verifyFirebaseToken, async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const workout = await storage.getWorkout(req.params.workoutId);
    
    if (!workout) {
      return res.status(404).json({ error: "Workout not found" });
    }
    
    if (workout.userId !== userId) {
      return res.status(403).json({ error: "Access denied" });
    }
    
    const deleted = await storage.removeWorkoutExercise(req.params.exerciseId);
    
    if (!deleted) {
      return res.status(404).json({ error: "Exercise not found" });
    }
    
    res.json({ message: "Exercise removed" });
  } catch (error) {
    console.error("[workouts] Remove exercise error:", error);
    res.status(500).json({ error: "Failed to remove exercise" });
  }
});

export default router;

