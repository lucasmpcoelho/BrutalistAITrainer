import fs from "node:fs";
import { type Server } from "node:http";
import path from "node:path";

import express, { type Express, type Request } from "express";

import runApp from "./app";

export async function serveStatic(app: Express, server: Server) {
  // Resolve from project root (where npm start runs)
  // Build output: dist/index.js (server) and dist/public/ (client)
  const distPath = path.resolve(process.cwd(), "dist", "public");

  console.log(`[serveStatic] Current working directory: ${process.cwd()}`);
  console.log(`[serveStatic] Looking for static files at: ${distPath}`);
  console.log(`[serveStatic] Directory exists: ${fs.existsSync(distPath)}`);

  if (!fs.existsSync(distPath)) {
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
    
    const error = `Could not find the build directory: ${distPath}. Current dir: ${process.cwd()}`;
    console.error(`[serveStatic] ERROR: ${error}`);
    throw new Error(error);
  }

  const indexPath = path.resolve(distPath, "index.html");
  if (!fs.existsSync(indexPath)) {
    const error = `Could not find index.html at: ${indexPath}`;
    console.error(`[serveStatic] ERROR: ${error}`);
    throw new Error(error);
  }

  console.log(`[serveStatic] Serving static files from: ${distPath}`);
  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use("*", (_req, res) => {
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
    await runApp(serveStatic);
  } catch (error) {
    console.error("[index-prod] Fatal error starting server:", error);
    process.exit(1);
  }
})();
