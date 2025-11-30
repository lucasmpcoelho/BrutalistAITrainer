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
  
  if (fs.existsSync(distPath)) {
    const files = fs.readdirSync(distPath);
    console.log(`[serveStatic] Files in dist/public: ${files.join(", ")}`);
  } else {
    // Try alternative paths
    const altPath1 = path.resolve(process.cwd(), "public");
    console.log(`[serveStatic] Trying alternative path 1: ${altPath1} (exists: ${fs.existsSync(altPath1)})`);
  }

  if (!fs.existsSync(distPath)) {
    const error = `Could not find the build directory: ${distPath}, make sure to build the client first. Current dir: ${process.cwd()}`;
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
  
  // Serve static files
  app.use(express.static(distPath, {
    index: false, // Don't serve index.html automatically, we'll handle it in catch-all
  }));

  // Fall through to index.html for all routes (SPA routing)
  app.get("*", (_req, res) => {
    console.log(`[serveStatic] Catch-all route hit for: ${_req.originalUrl}`);
    res.sendFile(indexPath, (err) => {
      if (err) {
        console.error(`[serveStatic] Error sending index.html:`, err);
        if (!res.headersSent) {
          res.status(500).send("Internal Server Error");
        }
      } else {
        console.log(`[serveStatic] Successfully sent index.html for: ${_req.originalUrl}`);
      }
    });
  });
}

(async () => {
  await runApp(serveStatic);
})();
