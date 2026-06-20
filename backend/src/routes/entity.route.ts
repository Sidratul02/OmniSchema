import { Router } from "express";
import { prisma } from "../lib/prisma";
import { DEFAULT_PROJECT_ID } from "../constants/default-project";

const router = Router();


// CREATE
router.post("/", async (req, res) => {
  try {
    const { id, name, fields } = req.body;

    const existing = await prisma.entity.findUnique({ where: { id } });

    if (existing) {
      return res.json({ success: false, message: "Entity already exists" });
    }

    await prisma.entity.create({
      data: {
        id,
        name,
        projectId: DEFAULT_PROJECT_ID,
        fields: {
          create: fields.map((field: any) => ({
            name: field.name,
            datatype: field.datatype,
            primary: field.primary || false,
            unique: field.unique || false,
            nullable: field.nullable ?? true
          }))
        }
      }
    });

    return res.json({ success: true });

  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: "Failed to create entity" });
  }
});


// GET ALL
router.get("/", async (_, res) => {
  try {
    const entities = await prisma.entity.findMany({
      where: { projectId: DEFAULT_PROJECT_ID },
      include: { fields: true }
    });

    return res.json({ success: true, data: entities });

  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: "Failed to fetch entities" });
  }
});


// DELETE
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.field.deleteMany({ where: { entityId: id } });
    await prisma.relation.deleteMany({ where: { OR: [{ from: id }, { to: id }] } });
    await prisma.entity.delete({ where: { id } });

    return res.json({ success: true });

  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: "Failed to delete entity" });
  }
});


export default router;
