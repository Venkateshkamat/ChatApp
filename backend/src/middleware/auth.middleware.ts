import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import type { Request, Response, NextFunction } from "express";
import type { IUser } from "../models/user.model.js";

interface JWTPayload {
  userId: string;
}

interface AuthRequest extends Request {
  user?: IUser;
}

export const protectRoute = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      res
        .status(401)
        .json({ message: "Unauthorised access - No token provided!" });
      return;
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      res.status(500).json({ message: "JWT_SECRET is not configured" });
      return;
    }

    const decoded = jwt.verify(token, jwtSecret);

    if (
      typeof decoded === "string" ||
      !decoded ||
      typeof decoded !== "object" ||
      !("userId" in decoded) ||
      typeof decoded.userId !== "string"
    ) {
      res.status(401).json({ message: "Token is invalid" });
      return;
    }

    const payload = decoded as JWTPayload;

    const user = (await User.findById(payload.userId).select(
      "-password"
    )) as IUser;

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    req.user = user as IUser;

    next();
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.log("Error in the protectRoute middleware", errorMessage);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};
