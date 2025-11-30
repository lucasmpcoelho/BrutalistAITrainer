import { type Server } from "node:http";

import express, { type Express, type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export const app = express();

declare module 'http' {
  interface IncomingMessage {
    rawBody: unknown
  }
}
app.use(express.json({
  verify: (req, _res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const reqPath = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  // Log ALL incoming requests for debugging
  console.log(`[request] ${req.method} ${reqPath}`);

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    // Log all requests, not just /api
    let logLine = `${req.method} ${reqPath} ${res.statusCode} in ${duration}ms`;
    if (capturedJsonResponse && reqPath.startsWith("/api")) {
      logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
    }

    if (logLine.length > 80) {
      logLine = logLine.slice(0, 79) + "…";
    }

    log(logLine);
  });

  next();
});

export default async function runApp(
  setup: (app: Express, server: Server) => Promise<void>,
) {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    console.error(`[error-handler] Error: ${message}`, err);
    res.status(status).json({ message });
    // Note: Don't throw here - it crashes the process after sending response
  });

  // importantly run the final setup after setting up all the other routes so
  // the catch-all route doesn't interfere with the other routes
  await setup(app, server);

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);
  
  console.log(`[runApp] Starting server on port ${port}`);
  console.log(`[runApp] PORT env var: ${process.env.PORT || 'not set (using default 5000)'}`);
  
  // Note: We are NOT passing "0.0.0.0" as the host argument.
  // This allows Node.js to accept connections on both IPv4 (0.0.0.0) and IPv6 (::).
  // Railway's load balancer may communicate via IPv6, so this is safer.
  server.listen(port, () => {
    log(`serving on port ${port}`);
    const address = server.address();
    console.log(`[runApp] Server successfully started and listening on port ${port}`);
    console.log(`[runApp] Bound address: ${JSON.stringify(address)}`);
  });
  
  server.on('error', (err: any) => {
    console.error(`[runApp] Server error:`, err);
    if (err.code === 'EADDRINUSE') {
      console.error(`[runApp] Port ${port} is already in use`);
    }
  });
}
