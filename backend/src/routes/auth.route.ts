import express from "express";
import {
  login,
  logout,
  signup,
  updateProfile,
  checkAuth,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { authRateLimiter } from "../middleware/rateLimiter.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  signupSchema,
  loginSchema,
  updateProfileSchema,
} from "../schemas/auth.schema.js";

const router = express.Router();

router.post("/signup", authRateLimiter, validate(signupSchema), signup);
router.post("/login", authRateLimiter, validate(loginSchema), login);
router.post("/logout", logout);
router.put(
  "/update-profile",
  authRateLimiter,
  protectRoute,
  validate(updateProfileSchema),
  updateProfile
);
router.get("/check", protectRoute, checkAuth);

export default router;
