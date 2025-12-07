import { Router, Request, Response, NextFunction } from "express";
import { storage } from "../storage";
import { insertUserSchema } from "../../shared/schema";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";

const router = Router();
const scryptAsync = promisify(scrypt);

// ============================================================================
// PASSWORD UTILITIES
// ============================================================================

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${salt}:${derivedKey.toString("hex")}`;
}

async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  const [salt, key] = hashedPassword.split(":");
  const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer;
  const keyBuffer = Buffer.from(key, "hex");
  return timingSafeEqual(derivedKey, keyBuffer);
}

// ============================================================================
// SESSION TYPES
// ============================================================================

declare module "express-session" {
  interface SessionData {
    userId: string;
    username: string;
  }
}

// ============================================================================
// AUTH MIDDLEWARE
// ============================================================================

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session?.userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

// ============================================================================
// AUTH ROUTES
// ============================================================================

/**
 * POST /api/auth/register
 * Create a new user account
 */
router.post("/register", async (req: Request, res: Response) => {
  try {
    // Validate input
    const parsed = insertUserSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ 
        error: "Invalid input", 
        details: parsed.error.flatten().fieldErrors 
      });
    }

    const { username, password, email, name } = parsed.data;

    // Check if username already exists
    const existingUser = await storage.getUserByUsername(username);
    if (existingUser) {
      return res.status(409).json({ error: "Username already taken" });
    }

    // Check if email already exists (if provided)
    if (email) {
      const existingEmail = await storage.getUserByEmail(email);
      if (existingEmail) {
        return res.status(409).json({ error: "Email already registered" });
      }
    }

    // Hash password and create user
    const hashedPassword = await hashPassword(password);
    const user = await storage.createUser({
      username,
      password: hashedPassword,
      email: email || undefined,
      name: name || undefined,
    });

    // Set session
    req.session.userId = user.id;
    req.session.username = user.username;

    // Return user without password
    const { password: _, ...safeUser } = user;
    res.status(201).json({ user: safeUser });
  } catch (error) {
    console.error("[auth] Registration error:", error);
    res.status(500).json({ error: "Failed to register user" });
  }
});

/**
 * POST /api/auth/login
 * Authenticate user and create session
 */
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Username and password required" });
    }

    // Find user
    const user = await storage.getUserByUsername(username);
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Verify password
    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Set session
    req.session.userId = user.id;
    req.session.username = user.username;

    // Return user without password
    const { password: _, ...safeUser } = user;
    res.json({ user: safeUser });
  } catch (error) {
    console.error("[auth] Login error:", error);
    res.status(500).json({ error: "Failed to login" });
  }
});

/**
 * POST /api/auth/logout
 * Destroy session and logout user
 */
router.post("/logout", (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("[auth] Logout error:", err);
      return res.status(500).json({ error: "Failed to logout" });
    }
    res.clearCookie("connect.sid");
    res.json({ message: "Logged out successfully" });
  });
});

/**
 * GET /api/auth/me
 * Get current authenticated user
 */
router.get("/me", async (req: Request, res: Response) => {
  if (!req.session?.userId) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  try {
    const user = await storage.getUser(req.session.userId);
    if (!user) {
      // Session exists but user doesn't - clear session
      req.session.destroy(() => {});
      return res.status(401).json({ error: "User not found" });
    }

    // Return user without password
    const { password: _, ...safeUser } = user;
    res.json({ user: safeUser });
  } catch (error) {
    console.error("[auth] Get user error:", error);
    res.status(500).json({ error: "Failed to get user" });
  }
});

export default router;





