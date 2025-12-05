import { Router, Request, Response } from "express";
import { storage } from "../storage";
import { insertSessionSchema, insertSetSchema } from "../../shared/schema";
import { verifyFirebaseToken } from "../middleware/firebase-auth";

const router = Router();

// Helper to get user ID from Firebase auth
function getUserId(req: Request): string | undefined {
  return req.firebaseUser?.uid;
}

// ============================================================================
// SESSION ROUTES
// ============================================================================

/**
 * GET /api/sessions
 * Get user's workout sessions (completed and in-progress)
 */
router.get("/", verifyFirebaseToken, async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const limit = parseInt(req.query.limit as string) || 50;
    const sessions = await storage.getSessions(userId, limit);
    res.json({ sessions });
  } catch (error) {
    console.error("[sessions] Get sessions error:", error);
    res.status(500).json({ error: "Failed to get sessions" });
  }
});

/**
 * GET /api/sessions/:id
 * Get a single session with its sets
 */
router.get("/:id", verifyFirebaseToken, async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const session = await storage.getSession(req.params.id);
    
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }
    
    if (session.userId !== userId) {
      return res.status(403).json({ error: "Access denied" });
    }
    
    const sets = await storage.getSets(session.id);
    res.json({ session: { ...session, sets } });
  } catch (error) {
    console.error("[sessions] Get session error:", error);
    res.status(500).json({ error: "Failed to get session" });
  }
});

/**
 * POST /api/sessions
 * Start a new workout session
 */
router.post("/", verifyFirebaseToken, async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const parsed = insertSessionSchema.safeParse({
      ...req.body,
      userId,
      status: "in_progress",
    });
    
    if (!parsed.success) {
      return res.status(400).json({ 
        error: "Invalid input", 
        details: parsed.error.flatten().fieldErrors 
      });
    }
    
    const session = await storage.createSession(parsed.data);
    res.status(201).json({ session });
  } catch (error) {
    console.error("[sessions] Create session error:", error);
    res.status(500).json({ error: "Failed to create session" });
  }
});

/**
 * PUT /api/sessions/:id
 * Update a session (e.g., complete it)
 */
router.put("/:id", verifyFirebaseToken, async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const session = await storage.getSession(req.params.id);
    
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }
    
    if (session.userId !== userId) {
      return res.status(403).json({ error: "Access denied" });
    }
    
    // If completing the session, calculate stats
    const updates: Record<string, any> = { ...req.body };
    
    if (req.body.status === "completed" && session.status !== "completed") {
      const sets = await storage.getSets(session.id);
      
      // Calculate total volume
      const totalVolume = sets.reduce((sum, set) => {
        return sum + (set.weight * set.reps);
      }, 0);
      
      // Calculate duration
      const durationSeconds = session.startedAt 
        ? Math.floor((Date.now() - new Date(session.startedAt).getTime()) / 1000)
        : 0;
      
      // Count unique exercises
      const uniqueExercises = new Set(sets.map(s => s.exerciseId)).size;
      
      updates.completedAt = new Date();
      updates.durationSeconds = durationSeconds;
      updates.totalVolume = totalVolume;
      updates.exerciseCount = uniqueExercises;
      updates.setCount = sets.length;
      
      // Update streak
      await updateStreak(userId);
    }
    
    const updated = await storage.updateSession(req.params.id, updates);
    res.json({ session: updated });
  } catch (error) {
    console.error("[sessions] Update session error:", error);
    res.status(500).json({ error: "Failed to update session" });
  }
});

/**
 * POST /api/sessions/:id/sets
 * Log a set in a session
 */
router.post("/:id/sets", verifyFirebaseToken, async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const session = await storage.getSession(req.params.id);
    
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }
    
    if (session.userId !== userId) {
      return res.status(403).json({ error: "Access denied" });
    }
    
    if (session.status !== "in_progress") {
      return res.status(400).json({ error: "Session is not in progress" });
    }
    
    const parsed = insertSetSchema.safeParse({
      ...req.body,
      sessionId: req.params.id,
    });
    
    if (!parsed.success) {
      return res.status(400).json({ 
        error: "Invalid input", 
        details: parsed.error.flatten().fieldErrors 
      });
    }
    
    // Check for PR before creating the set
    const isPR = await checkForPR(
      userId,
      parsed.data.exerciseId,
      parsed.data.weight,
      parsed.data.reps
    );
    
    const set = await storage.createSet({
      ...parsed.data,
      isPR,
    });
    
    // If it's a PR, record it
    if (isPR) {
      await storage.createPersonalRecord({
        userId,
        exerciseId: parsed.data.exerciseId,
        exerciseName: parsed.data.exerciseName,
        recordType: "max_weight",
        value: parsed.data.weight,
        weight: parsed.data.weight,
        reps: parsed.data.reps,
        setId: set.id,
      });
    }
    
    res.status(201).json({ set, isPR });
  } catch (error) {
    console.error("[sessions] Log set error:", error);
    res.status(500).json({ error: "Failed to log set" });
  }
});

/**
 * GET /api/sessions/:id/sets
 * Get all sets in a session
 */
router.get("/:id/sets", verifyFirebaseToken, async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const session = await storage.getSession(req.params.id);
    
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }
    
    if (session.userId !== userId) {
      return res.status(403).json({ error: "Access denied" });
    }
    
    const sets = await storage.getSets(session.id);
    res.json({ sets });
  } catch (error) {
    console.error("[sessions] Get sets error:", error);
    res.status(500).json({ error: "Failed to get sets" });
  }
});

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Check if a set is a new personal record
 */
async function checkForPR(
  userId: string,
  exerciseId: string,
  weight: number,
  reps: number
): Promise<boolean> {
  const records = await storage.getPersonalRecords(userId, exerciseId);
  
  // If no previous records, this is a PR
  if (records.length === 0) {
    return true;
  }
  
  // Check if this weight beats the max weight for similar rep range
  const maxWeightRecord = records.find(r => r.recordType === "max_weight");
  if (maxWeightRecord && weight > maxWeightRecord.value) {
    return true;
  }
  
  return false;
}

/**
 * Update user's workout streak
 */
async function updateStreak(userId: string): Promise<void> {
  try {
    const streak = await storage.getStreak(userId);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (!streak) {
      // First workout ever
      await storage.updateStreak(userId, {
        currentStreak: 1,
        longestStreak: 1,
        lastWorkoutDate: new Date(),
        streakStartDate: new Date(),
      });
      return;
    }
    
    const lastWorkout = streak.lastWorkoutDate ? new Date(streak.lastWorkoutDate) : null;
    
    if (!lastWorkout) {
      // First workout
      await storage.updateStreak(userId, {
        currentStreak: 1,
        longestStreak: Math.max(1, streak.longestStreak),
        lastWorkoutDate: new Date(),
        streakStartDate: new Date(),
      });
      return;
    }
    
    lastWorkout.setHours(0, 0, 0, 0);
    const daysSinceLastWorkout = Math.floor(
      (today.getTime() - lastWorkout.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    if (daysSinceLastWorkout === 0) {
      // Already worked out today, no change
      return;
    } else if (daysSinceLastWorkout === 1) {
      // Consecutive day, increment streak
      const newStreak = streak.currentStreak + 1;
      await storage.updateStreak(userId, {
        currentStreak: newStreak,
        longestStreak: Math.max(newStreak, streak.longestStreak),
        lastWorkoutDate: new Date(),
      });
    } else {
      // Streak broken, start new
      await storage.updateStreak(userId, {
        currentStreak: 1,
        lastWorkoutDate: new Date(),
        streakStartDate: new Date(),
      });
    }
  } catch (error) {
    console.error("[sessions] Update streak error:", error);
  }
}

export default router;

