import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import exerciseRoutes from "./routes/exercises";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/user";
import workoutRoutes from "./routes/workouts";
import sessionRoutes from "./routes/sessions";
import coachRoutes from "./routes/coach";

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint - responds immediately for Railway/load balancers
  app.get("/health", (_req, res) => {
    res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // API routes
  app.use("/api/auth", authRoutes);
  app.use("/api/user", userRoutes);
  app.use("/api/workouts", workoutRoutes);
  app.use("/api/sessions", sessionRoutes);
  app.use("/api/exercises", exerciseRoutes);
  app.use("/api/coach", coachRoutes);

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  const httpServer = createServer(app);

  return httpServer;
}
