/**
 * Exercise API Routes
 * 
 * Endpoints for fetching exercise data from Firestore.
 */

import { Router, Request, Response } from "express";
import { db, isFirebaseConfigured } from "../config/firebase";
import { Exercise, FirestoreExercise } from "../../shared/types/exercise";

const router = Router();

/**
 * Extended Exercise type for API response (includes optional free-exercise-db fields)
 */
interface ExtendedExercise extends Exercise {
  category?: string;
  level?: "beginner" | "intermediate" | "expert";
  force?: "push" | "pull" | "static" | null;
  mechanic?: "compound" | "isolation" | null;
}

/**
 * Transform Firestore document to API response
 */
function toExercise(doc: FirestoreExercise): ExtendedExercise {
  return {
    id: doc.id,
    name: doc.name,
    equipment: doc.equipment,
    bodyPart: doc.bodyPart,
    target: doc.target,
    secondaryMuscles: doc.secondaryMuscles,
    instructions: doc.instructions,
    gifUrl: doc.gifUrl,
    source: doc.source,
    // Optional fields from free-exercise-db
    ...(doc.category && { category: doc.category }),
    ...(doc.level && { level: doc.level }),
    ...(doc.force !== undefined && { force: doc.force }),
    ...(doc.mechanic !== undefined && { mechanic: doc.mechanic }),
  };
}

/**
 * GET /api/exercises
 * List exercises with optional filtering
 * 
 * Query params:
 * - search: Search by name (partial match)
 * - bodyPart: Filter by body part
 * - target: Filter by target muscle
 * - equipment: Filter by equipment
 * - limit: Max results (default: 50, max: 100)
 * - offset: Pagination offset
 */
router.get("/", async (req: Request, res: Response) => {
  try {
    if (!isFirebaseConfigured() || !db) {
      return res.status(503).json({ 
        error: "Firebase not configured",
        message: "Exercise database is not available" 
      });
    }

    const { search, bodyPart, target, equipment, limit = "50", offset = "0" } = req.query;
    
    const limitNum = Math.min(parseInt(limit as string, 10) || 50, 100);
    const offsetNum = parseInt(offset as string, 10) || 0;

    let query = db.collection("exercises").orderBy("name");

    // Apply filters (Firestore only allows one inequality per query)
    if (bodyPart) {
      query = db.collection("exercises")
        .where("bodyPart", "==", bodyPart)
        .orderBy("name");
    } else if (target) {
      query = db.collection("exercises")
        .where("target", "==", target)
        .orderBy("name");
    } else if (equipment) {
      query = db.collection("exercises")
        .where("equipment", "==", equipment)
        .orderBy("name");
    }

    // Fetch with pagination
    const snapshot = await query.offset(offsetNum).limit(limitNum).get();

    let exercises = snapshot.docs.map((doc) => 
      toExercise(doc.data() as FirestoreExercise)
    );

    // Client-side search filter (Firestore doesn't support partial text search)
    if (search && typeof search === "string") {
      const searchLower = search.toLowerCase();
      exercises = exercises.filter((ex) =>
        ex.name.toLowerCase().includes(searchLower)
      );
    }

    res.json({
      exercises,
      count: exercises.length,
      offset: offsetNum,
      limit: limitNum,
    });
  } catch (error) {
    console.error("[exercises] Error listing exercises:", error);
    res.status(500).json({ error: "Failed to fetch exercises" });
  }
});

/**
 * GET /api/exercises/by-body-part/:part
 * Get exercises for a specific body part
 */
router.get("/by-body-part/:part", async (req: Request, res: Response) => {
  try {
    if (!isFirebaseConfigured() || !db) {
      return res.status(503).json({ 
        error: "Firebase not configured",
        message: "Exercise database is not available" 
      });
    }

    const { part } = req.params;
    const { limit = "50", offset = "0" } = req.query;

    const limitNum = Math.min(parseInt(limit as string, 10) || 50, 100);
    const offsetNum = parseInt(offset as string, 10) || 0;

    const snapshot = await db
      .collection("exercises")
      .where("bodyPart", "==", part.toLowerCase())
      .orderBy("name")
      .offset(offsetNum)
      .limit(limitNum)
      .get();

    const exercises = snapshot.docs.map((doc) =>
      toExercise(doc.data() as FirestoreExercise)
    );

    res.json({
      bodyPart: part,
      exercises,
      count: exercises.length,
      offset: offsetNum,
      limit: limitNum,
    });
  } catch (error) {
    console.error("[exercises] Error fetching by body part:", error);
    res.status(500).json({ error: "Failed to fetch exercises" });
  }
});

/**
 * GET /api/exercises/by-target/:target
 * Get exercises for a specific target muscle
 */
router.get("/by-target/:target", async (req: Request, res: Response) => {
  try {
    if (!isFirebaseConfigured() || !db) {
      return res.status(503).json({ 
        error: "Firebase not configured",
        message: "Exercise database is not available" 
      });
    }

    const { target } = req.params;
    const { limit = "50", offset = "0" } = req.query;

    const limitNum = Math.min(parseInt(limit as string, 10) || 50, 100);
    const offsetNum = parseInt(offset as string, 10) || 0;

    const snapshot = await db
      .collection("exercises")
      .where("target", "==", target.toLowerCase())
      .orderBy("name")
      .offset(offsetNum)
      .limit(limitNum)
      .get();

    const exercises = snapshot.docs.map((doc) =>
      toExercise(doc.data() as FirestoreExercise)
    );

    res.json({
      target,
      exercises,
      count: exercises.length,
      offset: offsetNum,
      limit: limitNum,
    });
  } catch (error) {
    console.error("[exercises] Error fetching by target:", error);
    res.status(500).json({ error: "Failed to fetch exercises" });
  }
});

/**
 * GET /api/exercises/:id/alternatives
 * Get alternative exercises for the same target muscle
 * 
 * NOTE: This route MUST come before /:id to avoid being matched by the catch-all
 */
router.get("/:id/alternatives", async (req: Request, res: Response) => {
  try {
    if (!isFirebaseConfigured() || !db) {
      return res.status(503).json({ 
        error: "Firebase not configured",
        message: "Exercise database is not available" 
      });
    }

    const { id } = req.params;
    const { limit = "5" } = req.query;

    const limitNum = Math.min(parseInt(limit as string, 10) || 5, 10);

    // Get the original exercise
    const doc = await db.collection("exercises").doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({ error: "Exercise not found" });
    }

    const exercise = doc.data() as FirestoreExercise;

    // Find alternatives with the same target muscle
    // NOTE: Sorting is done in memory to avoid requiring a Firestore composite index
    const snapshot = await db
      .collection("exercises")
      .where("target", "==", exercise.target)
      .limit(limitNum + 10) // Fetch extra to have buffer after filtering
      .get();

    const alternatives = snapshot.docs
      .map((doc) => toExercise(doc.data() as FirestoreExercise))
      .filter((ex) => ex.id !== id) // Exclude the original
      .sort((a, b) => a.name.localeCompare(b.name)) // Sort by name in memory
      .slice(0, limitNum);

    res.json({
      exerciseId: id,
      target: exercise.target,
      alternatives,
      count: alternatives.length,
    });
  } catch (error) {
    console.error("[exercises] Error fetching alternatives:", error);
    res.status(500).json({ error: "Failed to fetch alternatives" });
  }
});

/**
 * GET /api/exercises/:id
 * Get a single exercise by ID
 * 
 * NOTE: This catch-all route MUST come after more specific routes like /:id/alternatives
 */
router.get("/:id", async (req: Request, res: Response) => {
  try {
    if (!isFirebaseConfigured() || !db) {
      return res.status(503).json({ 
        error: "Firebase not configured",
        message: "Exercise database is not available" 
      });
    }

    const { id } = req.params;

    const doc = await db.collection("exercises").doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({ error: "Exercise not found" });
    }

    const exercise = toExercise(doc.data() as FirestoreExercise);
    res.json(exercise);
  } catch (error) {
    console.error("[exercises] Error fetching exercise:", error);
    res.status(500).json({ error: "Failed to fetch exercise" });
  }
});

export default router;
