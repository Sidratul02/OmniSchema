import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";
import { prisma } from "../lib/prisma";
import { createUserProject } from "../lib/project";
import { JWT_SECRET } from "../lib/jwt";
import { loginSchema, parseBody, signupSchema } from "../validators/schemas";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: "Too many attempts, please try again later" },
  standardHeaders: true,
  legacyHeaders: false
});

// POST /auth/signup
router.post("/signup", authLimiter, async (req, res) => {
  try {
    const parsed = parseBody(signupSchema, req.body);

    if (!parsed.success) {
      return res.status(400).json({ success: false, message: parsed.message });
    }

    const { name, password } = parsed.data;
    const email = parsed.data.email.toLowerCase();

    const existing = await prisma.user.findUnique({ where: { email } });

    if (existing) {
      return res.status(409).json({ success: false, message: "Email already in use" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, password: hashed }
    });

    await createUserProject(user.id, `${name}'s Project`);

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });

    return res.status(201).json({
      success: true,
      token,
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (error) {
    console.error("[Signup Error]", error);
    return res.status(500).json({ success: false, message: "Signup failed" });
  }
});

// POST /auth/login
router.post("/login", authLimiter, async (req, res) => {
  try {
    const parsed = parseBody(loginSchema, req.body);

    if (!parsed.success) {
      return res.status(400).json({ success: false, message: parsed.message });
    }

    const email = parsed.data.email.toLowerCase();
    const { password } = parsed.data;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });

    return res.json({
      success: true,
      token,
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (error) {
    console.error("[Login Error]", error);
    return res.status(500).json({ success: false, message: "Login failed" });
  }
});

// GET /auth/me
router.get("/me", authenticate, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId! },
      select: { id: true, name: true, email: true, createdAt: true }
    });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.json({ success: true, user });
  } catch (error) {
    console.error("[Get Me Error]", error);
    return res.status(500).json({ success: false, message: "Failed to fetch user" });
  }
});

export default router;
