import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../lib/jwt";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const token = header.slice(7);

  try {
    const payload = jwt.verify(token, JWT_SECRET) as { userId: string };
    if (!payload.userId) {
      return res.status(401).json({ success: false, message: "Invalid token payload" });
    }
    req.userId = payload.userId;
    next();
  } catch (err) {
    const message = err instanceof jwt.TokenExpiredError
      ? "Token expired, please log in again"
      : "Invalid or expired token";
    return res.status(401).json({ success: false, message });
  }
};
