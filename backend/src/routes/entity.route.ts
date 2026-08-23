import { Router } from "express";
import { prisma } from "../lib/prisma";
import { getUserProject } from "../lib/project";
import { authenticate } from "../middleware/auth.middleware";
import { createEntitySchema, parseBody, updateEntitySchema } from "../validators/schemas";

const router = Router();

router.use(authenticate);

// POST /entity
router.post("/", async (req, res) => {
  try {
    const parsed = parseBody(createEntitySchema, req.body);

    if (!parsed.success) {
      return res.status(400).json({ success: false, message: parsed.message });
    }

    const { id, name, fields } = parsed.data;
    const safeId = id.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "");

    if (!safeId) {
      return res.status(400).json({ success: false, message: "Invalid entity id" });
    }

    const project = await getUserProject(req.userId!);

    const existing = await prisma.entity.findFirst({
      where: { id: safeId, projectId: project.id }
    });

    if (existing) {
      return res.status(409).json({ success: false, message: "Entity already exists" });
    }

    await prisma.entity.create({
      data: {
        id: safeId,
        name,
        projectId: project.id,
        fields: {
          create: fields.map((field) => ({
            name: field.name,
            datatype: field.datatype,
            primary: field.primary || false,
            unique: field.unique || false,
            nullable: field.nullable ?? true
          }))
        }
      }
    });

    return res.status(201).json({ success: true });
  } catch (error) {
    console.error("[Create Entity Error]", error);
    return res.status(500).json({ success: false, message: "Failed to create entity" });
  }
});

// GET /entity
router.get("/", async (req, res) => {
  try {
    const project = await getUserProject(req.userId!);

    const entities = await prisma.entity.findMany({
      where: { projectId: project.id },
      include: { fields: true },
      orderBy: { name: "asc" }
    });

    return res.json({ success: true, data: entities });
  } catch (error) {
    console.error("[Fetch Entities Error]", error);
    return res.status(500).json({ success: false, message: "Failed to fetch entities" });
  }
});

// PUT /entity/:id
router.put("/:id", async (req, res) => {
  try {
    const parsed = parseBody(updateEntitySchema, req.body);

    if (!parsed.success) {
      return res.status(400).json({ success: false, message: parsed.message });
    }

    const { id } = req.params;
    const project = await getUserProject(req.userId!);

    const existing = await prisma.entity.findFirst({
      where: { id, projectId: project.id }
    });

    if (!existing) {
      return res.status(404).json({ success: false, message: "Entity not found" });
    }

    const { name, fields } = parsed.data;

    // Use a transaction to ensure atomicity
    await prisma.$transaction([
      prisma.field.deleteMany({ where: { entityId: id } }),
      prisma.entity.update({
        where: { id },
        data: {
          name,
          fields: {
            create: fields.map((field) => ({
              name: field.name,
              datatype: field.datatype,
              primary: field.primary || false,
              unique: field.unique || false,
              nullable: field.nullable ?? true
            }))
          }
        }
      })
    ]);

    return res.json({ success: true });
  } catch (error) {
    console.error("[Update Entity Error]", error);
    return res.status(500).json({ success: false, message: "Failed to update entity" });
  }
});

// DELETE /entity/:id
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const project = await getUserProject(req.userId!);

    const existing = await prisma.entity.findFirst({
      where: { id, projectId: project.id }
    });

    if (!existing) {
      return res.status(404).json({ success: false, message: "Entity not found" });
    }

    // Use a transaction to ensure atomicity
    await prisma.$transaction([
      prisma.field.deleteMany({ where: { entityId: id } }),
      prisma.relation.deleteMany({
        where: { projectId: project.id, OR: [{ from: id }, { to: id }] }
      }),
      prisma.entity.delete({ where: { id } })
    ]);

    return res.json({ success: true });
  } catch (error) {
    console.error("[Delete Entity Error]", error);
    return res.status(500).json({ success: false, message: "Failed to delete entity" });
  }
});

export default router;
