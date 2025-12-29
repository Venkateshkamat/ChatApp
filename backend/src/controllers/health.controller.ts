import type { Request, Response } from "express";

export const healthCheck = (req: Request, res: Response): void => {
  res.status(200).json({ 
    status: "ok", 
    message: "Health looks good",
    timestamp: new Date().toISOString()
  });
};