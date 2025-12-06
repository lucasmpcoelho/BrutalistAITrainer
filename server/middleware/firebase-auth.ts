/**
 * Firebase Authentication Middleware
 * 
 * Verifies Firebase ID tokens for protected API routes.
 * Attaches the decoded token to req.user.
 */

import { Request, Response, NextFunction } from "express";
import { firebaseAdmin, isFirebaseConfigured } from "../config/firebase";

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      firebaseUser?: {
        uid: string;
        email?: string;
        name?: string;
        picture?: string;
      };
    }
  }
}

/**
 * Middleware to verify Firebase ID token
 * Token should be passed in Authorization header as: Bearer <token>
 */
export async function verifyFirebaseToken(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  // Skip verification if Firebase is not configured
  if (!isFirebaseConfigured() || !firebaseAdmin) {
    console.warn("[firebase-auth] Firebase not configured, skipping authentication");
    next();
    return;
  }

  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ 
      error: "Unauthorized",
      message: "No valid authorization token provided" 
    });
    return;
  }

  const token = authHeader.split("Bearer ")[1];
  
  try {
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);
    
    req.firebaseUser = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      name: decodedToken.name,
      picture: decodedToken.picture,
    };
    
    next();
  } catch (error) {
    console.error("[firebase-auth] Token verification failed:", error);
    res.status(401).json({ 
      error: "Unauthorized",
      message: "Invalid or expired token" 
    });
  }
}

/**
 * Optional authentication middleware
 * Attaches user if token is valid, but doesn't require it
 */
export async function optionalFirebaseAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  // Skip verification if Firebase is not configured
  if (!isFirebaseConfigured() || !firebaseAdmin) {
    next();
    return;
  }

  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    // No token provided, continue without user
    next();
    return;
  }

  const token = authHeader.split("Bearer ")[1];
  
  try {
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);
    
    req.firebaseUser = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      name: decodedToken.name,
      picture: decodedToken.picture,
    };
  } catch (error) {
    // Invalid token, continue without user
    console.warn("[firebase-auth] Invalid token, continuing without auth");
  }
  
  next();
}

/**
 * Helper to require authentication in route handlers
 * Use this at the start of a handler if you need to ensure authentication
 */
export function requireAuth(req: Request, res: Response): boolean {
  if (!req.firebaseUser) {
    res.status(401).json({ 
      error: "Unauthorized",
      message: "Authentication required" 
    });
    return false;
  }
  return true;
}




