import { Router, Request, Response } from "express";
import { storage } from "../storage";
import { updateUserProfileSchema } from "../../shared/schema";
import { verifyFirebaseToken } from "../middleware/firebase-auth";

const router = Router();

// Helper to get user ID from Firebase auth
function getUserId(req: Request): string | undefined {
  return req.firebaseUser?.uid;
}

/**
 * GET /api/user/profile
 * Get current user's profile
 */
router.get("/profile", verifyFirebaseToken, async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const user = await storage.getUser(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Return user without password
    const { password: _, ...safeUser } = user;
    res.json({ user: safeUser });
  } catch (error) {
    console.error("[user] Get profile error:", error);
    res.status(500).json({ error: "Failed to get profile" });
  }
});

/**
 * PUT /api/user/profile
 * Update user's profile (including onboarding preferences)
 */
router.put("/profile", verifyFirebaseToken, async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    // Validate input
    const parsed = updateUserProfileSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ 
        error: "Invalid input", 
        details: parsed.error.flatten().fieldErrors 
      });
    }

    const updatedUser = await storage.updateUserProfile(userId, parsed.data);
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Return user without password
    const { password: _, ...safeUser } = updatedUser;
    res.json({ user: safeUser });
  } catch (error) {
    console.error("[user] Update profile error:", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
});

/**
 * GET /api/user/streak
 * Get user's current streak
 */
router.get("/streak", verifyFirebaseToken, async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const streak = await storage.getStreak(userId);
    res.json({ 
      streak: streak || { 
        currentStreak: 0, 
        longestStreak: 0, 
        lastWorkoutDate: null,
        streakStartDate: null
      } 
    });
  } catch (error) {
    console.error("[user] Get streak error:", error);
    res.status(500).json({ error: "Failed to get streak" });
  }
});

/**
 * GET /api/user/personal-records
 * Get user's personal records (optionally filtered by exercise)
 */
router.get("/personal-records", verifyFirebaseToken, async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const exerciseId = req.query.exerciseId as string | undefined;
    const records = await storage.getPersonalRecords(userId, exerciseId);
    res.json({ records });
  } catch (error) {
    console.error("[user] Get personal records error:", error);
    res.status(500).json({ error: "Failed to get personal records" });
  }
});

/**
 * GET /api/user/achievements
 * Get user's earned achievements
 */
router.get("/achievements", verifyFirebaseToken, async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const achievements = await storage.getUserAchievements(userId);
    res.json({ achievements });
  } catch (error) {
    console.error("[user] Get achievements error:", error);
    res.status(500).json({ error: "Failed to get achievements" });
  }
});

export default router;

