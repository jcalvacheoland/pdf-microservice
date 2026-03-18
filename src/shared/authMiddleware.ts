import { Request, Response, NextFunction } from "express";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.headers["x-api-key"];

  if (!token || token !== process.env.API_TOKEN) {
    return res.status(403).json({ error: "Unauthorized" });
  }

  next();
}
