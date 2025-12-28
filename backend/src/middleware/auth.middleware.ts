import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import type { Request, Response, NextFunction } from "express";
import type { IUser } from "../models/user.model.js";

interface JWTPayload {
  userId: string;
}

export const protectRoute = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | undefined> => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorised access - No token provided!" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as JWTPayload;

    if (!decoded) {
      return res.status(401).json({ message: "Token is invalid" });
    }

    const user = (await User.findById(decoded.userId).select(
      "-password"
    )) as IUser;

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user as IUser;

    next();
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.log("Error in the protectRoute middleware", errorMessage);
    return res.status(500).json({ message: "Internal server error" });
  }
};
