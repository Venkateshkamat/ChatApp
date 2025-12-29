import jwt from "jsonwebtoken";
import type { Response } from "express";
import type { Types } from "mongoose";

import { config } from "dotenv";

config();

export const generateToken = (
  userId: string | Types.ObjectId,
  res: Response
): string => {
  const token: string = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true, //prevents XSS attacks
    sameSite: "strict", //CSRF attacks cross site request forgery attacks
    secure: process.env.NODE_ENV !== "development",
  });
  return token;
};
