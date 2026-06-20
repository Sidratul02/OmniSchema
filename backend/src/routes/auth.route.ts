import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";
import { DEFAULT_PROJECT_ID } from "../constants/default-project";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "omnischema-secret";


// ENSURE DEFAULT PROJECT EXISTS
const ensureDefaultProject = async () => {
  const existing = await prisma.project.findUnique({
    where: { id: DEFAULT_PROJECT_ID }
  });

  if (!existing) {
    await prisma.project.create({
      data: { id: DEFAULT_PROJECT_ID, name: "Default Project" }
    });
  }
};


// SIGNUP
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.json({ success: false, message: "All fields are required" });
    }

    const existing = await prisma.user.findUnique({ where: { email } });

    if (existing) {
      return res.json({ success: false, message: "Email already in use" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, password: hashed }
    });

    await ensureDefaultProject();

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });

    return res.json({
      success: true,
      token,
      user: { id: user.id, name: user.name, email: user.email }
    });

  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: "Signup failed" });
  }
});


// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.json({ success: false, message: "All fields are required" });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    await ensureDefaultProject();

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });

    return res.json({
      success: true,
      token,
      user: { id: user.id, name: user.name, email: user.email }
    });

  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: "Login failed" });
  }
});


export default router;
