import fs from "node:fs";
import { type Server } from "node:http";
import path from "node:path";

import express, { type Express, type Request } from "express";

import runApp from "./app";

export async function serveStatic(app: Express, server: Server) {
  // Try multiple possible paths for the static files
  const possiblePaths = [
    path.resolve(process.cwd(), "dist", "public"), // Standard build output
    path.resolve(process.cwd(), "public"), // Alternative location
  ];

  console.log(`[serveStatic] Current working directory: ${process.cwd()}`);
  
  let distPath: string | null = null;
  
  for (const testPath of possiblePaths) {
    console.log(`[serveStatic] Checking path: ${testPath} (exists: ${fs.existsSync(testPath)})`);
    if (fs.existsSync(testPath)) {
      distPath = testPath;
      console.log(`[serveStatic] Found static files at: ${distPath}`);
      break;
    }
  }

  if (!distPath) {
    // Log what directories do exist for debugging
    const distDir = path.resolve(process.cwd(), "dist");
    console.log(`[serveStatic] dist/ exists: ${fs.existsSync(distDir)}`);
    if (fs.existsSync(distDir)) {
      try {
        const distContents = fs.readdirSync(distDir);
        console.log(`[serveStatic] Contents of dist/: ${distContents.join(", ")}`);
      } catch (e) {
        console.log(`[serveStatic] Could not read dist/: ${e}`);
      }
    }
    
    const error = `Could not find the build directory. Checked: ${possiblePaths.join(", ")}. Current dir: ${process.cwd()}`;
    console.error(`[serveStatic] ERROR: ${error}`);
    throw new Error(error);
  }
  
  console.log(`[serveStatic] Using static files path: ${distPath}`);

  const indexPath = path.resolve(distPath, "index.html");
  if (!fs.existsSync(indexPath)) {
    const error = `Could not find index.html at: ${indexPath}`;
    console.error(`[serveStatic] ERROR: ${error}`);
    throw new Error(error);
  }

  console.log(`[serveStatic] Serving static files from: ${distPath}`);
  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist (SPA routing)
  app.get("*", (_req, res) => {
    res.sendFile(indexPath, (err) => {
      if (err) {
        console.error(`[serveStatic] Error sending index.html:`, err);
        if (!res.headersSent) {
          res.status(500).send("Internal Server Error");
        }
      }
    });
  });
}

(async () => {
  try {
    console.log("[index-prod] Starting production server...");
    console.log(`[index-prod] NODE_ENV: ${process.env.NODE_ENV}`);
    console.log(`[index-prod] PORT: ${process.env.PORT || 'not set'}`);
    console.log(`[index-prod] Working directory: ${process.cwd()}`);
    
    await runApp(serveStatic);
    
    console.log("[index-prod] Server startup completed successfully");
  } catch (error) {
    console.error("[index-prod] Fatal error starting server:", error);
    if (error instanceof Error) {
      console.error("[index-prod] Error stack:", error.stack);
    }
    process.exit(1);
  }
})();
