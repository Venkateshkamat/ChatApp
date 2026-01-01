import { rateLimit } from "express-rate-limit";

export const generalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  message: "Too many requests from this IP, try again in 15 mins",
  standardHeaders: true,
  legacyHeaders: false,
});
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  message:
    "Too many login/signup/authorization requests from this IP, try again after a while",
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
});
export const messageRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  limit: 20,
  message: "Too many message requests from this IP, slow down lad",
  standardHeaders: true,
  legacyHeaders: false,
});