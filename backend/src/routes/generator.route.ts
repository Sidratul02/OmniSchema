import { Router } from "express";
import { prisma } from "../lib/prisma";
import { DEFAULT_PROJECT_ID } from "../constants/default-project";
import { ParserFactory } from "../parsers/parser.factory";

const router = Router();


router.get("/:type", async (req, res) => {
  try {
    const { type } = req.params;

    const entities = await prisma.entity.findMany({
      where: { projectId: DEFAULT_PROJECT_ID },
      include: { fields: true }
    });

    const relations = await prisma.relation.findMany({
      where: { projectId: DEFAULT_PROJECT_ID }
    });

    const code = ParserFactory.generate(type, { entities, relations } as any);

    return res.json({ success: true, code });

  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, message: "Failed to generate schema" });
  }
});


export default router;
