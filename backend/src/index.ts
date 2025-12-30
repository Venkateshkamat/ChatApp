import express from "express";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";
import { config } from "dotenv";
import { connectDB } from "./lib/db.js";
import { app, server } from "./lib/socket.js";
import type { Request, Response, NextFunction } from "express";
import { healthCheck } from "./controllers/health.controller.js";
import {
  authRateLimiter,
  generalRateLimiter,
  messageRateLimiter,
} from "./middleware/rateLimiter.middleware.js";

config();

app.set("trust proxy", true);

const PORT = process.env.PORT!;
const __dirname = path.resolve();

app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [process.env.CLIENT_URL, "http://localhost:5173"].filter(
  (origin): origin is string => origin !== undefined
);

app.use(
  cors({
    origin: allowedOrigins.length > 0 ? allowedOrigins : true,
    credentials: true,
  })
);

//rate limiter
app.use("/api", generalRateLimiter);
app.use("/api/message", messageRateLimiter);
app.use("/health", generalRateLimiter);

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);
app.use("/health", healthCheck);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("/*wildcard", (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  if (err) {
    res.status(500).json({
      msg: "Caught by global catch",
      err: err,
    });
  }
});

server.listen(PORT, (): void => {
  console.log("server is running on PORT:" + PORT);
  connectDB();
});
