import { Router } from "express";
import { prisma } from "../lib/prisma";
import { getUserProject } from "../lib/project";
import { authenticate } from "../middleware/auth.middleware";
import { createRelationSchema, parseBody } from "../validators/schemas";

const router = Router();

router.use(authenticate);

// POST /relation
router.post("/", async (req, res) => {
  try {
    const parsed = parseBody(createRelationSchema, req.body);

    if (!parsed.success) {
      return res.status(400).json({ success: false, message: parsed.message });
    }

    const { from, to, type } = parsed.data;
    const project = await getUserProject(req.userId!);

    const entityIds = new Set(
      (await prisma.entity.findMany({
        where: { projectId: project.id },
        select: { id: true }
      })).map((e) => e.id)
    );

    if (!entityIds.has(from) || !entityIds.has(to)) {
      return res.status(400).json({ success: false, message: "Invalid entity reference" });
    }

    if (from === to) {
      return res.status(400).json({ success: false, message: "Cannot relate an entity to itself" });
    }

    // Prevent duplicate relations of the same type between the same entities
    const duplicate = await prisma.relation.findFirst({
      where: { from, to, type, projectId: project.id }
    });

    if (duplicate) {
      return res.status(409).json({ success: false, message: "This relation already exists" });
    }

    const relation = await prisma.relation.create({
      data: { from, to, type, projectId: project.id }
    });

    return res.status(201).json({ success: true, data: relation });
  } catch (error) {
    console.error("[Create Relation Error]", error);
    return res.status(500).json({ success: false, message: "Failed to create relation" });
  }
});

// GET /relation
router.get("/", async (req, res) => {
  try {
    const project = await getUserProject(req.userId!);

    const relations = await prisma.relation.findMany({
      where: { projectId: project.id }
    });

    return res.json({ success: true, data: relations });
  } catch (error) {
    console.error("[Fetch Relations Error]", error);
    return res.status(500).json({ success: false, message: "Failed to fetch relations" });
  }
});

// DELETE /relation/:id
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const project = await getUserProject(req.userId!);

    const existing = await prisma.relation.findFirst({
      where: { id, projectId: project.id }
    });

    if (!existing) {
      return res.status(404).json({ success: false, message: "Relation not found" });
    }

    await prisma.relation.delete({ where: { id } });

    return res.json({ success: true });
  } catch (error) {
    console.error("[Delete Relation Error]", error);
    return res.status(500).json({ success: false, message: "Failed to delete relation" });
  }
});

export default router;
