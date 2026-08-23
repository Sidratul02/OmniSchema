import { Router } from "express";
import { prisma } from "../lib/prisma";
import { authenticate } from "../middleware/auth.middleware";
import { z } from "zod";
import { parseBody } from "../validators/schemas";

const router = Router();

router.use(authenticate);

const createProjectSchema = z.object({
  name: z.string().trim().min(1, "Project name is required").max(100)
});

const renameProjectSchema = z.object({
  name: z.string().trim().min(1, "Project name is required").max(100)
});

// GET /project
router.get("/", async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      where: { userId: req.userId! },
      orderBy: { createdAt: "asc" },
      include: {
        _count: { select: { entities: true, relations: true } }
      }
    });

    return res.json({ success: true, data: projects });
  } catch (error) {
    console.error("[Fetch Projects Error]", error);
    return res.status(500).json({ success: false, message: "Failed to fetch projects" });
  }
});

// POST /project
router.post("/", async (req, res) => {
  try {
    const parsed = parseBody(createProjectSchema, req.body);

    if (!parsed.success) {
      return res.status(400).json({ success: false, message: parsed.message });
    }

    const project = await prisma.project.create({
      data: { name: parsed.data.name, userId: req.userId! }
    });

    return res.status(201).json({ success: true, data: project });
  } catch (error) {
    console.error("[Create Project Error]", error);
    return res.status(500).json({ success: false, message: "Failed to create project" });
  }
});

// PATCH /project/:id — rename a project
router.patch("/:id", async (req, res) => {
  try {
    const parsed = parseBody(renameProjectSchema, req.body);

    if (!parsed.success) {
      return res.status(400).json({ success: false, message: parsed.message });
    }

    const { id } = req.params;

    const existing = await prisma.project.findFirst({
      where: { id, userId: req.userId! }
    });

    if (!existing) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    const updated = await prisma.project.update({
      where: { id },
      data: { name: parsed.data.name }
    });

    return res.json({ success: true, data: updated });
  } catch (error) {
    console.error("[Rename Project Error]", error);
    return res.status(500).json({ success: false, message: "Failed to rename project" });
  }
});

// DELETE /project/:id
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await prisma.project.findFirst({
      where: { id, userId: req.userId! }
    });

    if (!existing) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    // Prevent deleting the last project
    const count = await prisma.project.count({ where: { userId: req.userId! } });

    if (count <= 1) {
      return res.status(400).json({ success: false, message: "Cannot delete your only project" });
    }

    await prisma.project.delete({ where: { id } });

    return res.json({ success: true });
  } catch (error) {
    console.error("[Delete Project Error]", error);
    return res.status(500).json({ success: false, message: "Failed to delete project" });
  }
});

export default router;
