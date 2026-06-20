import { Router } from "express";
import { prisma } from "../lib/prisma";
import { DEFAULT_PROJECT_ID } from "../constants/default-project";

const router = Router();


// CREATE
router.post("/", async (req, res) => {
  try {
    const { from, to, type } = req.body;

    const relation = await prisma.relation.create({
      data: { from, to, type, projectId: DEFAULT_PROJECT_ID }
    });

    return res.json({ success: true, data: relation });

  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: "Failed to create relation" });
  }
});


// GET ALL
router.get("/", async (_, res) => {
  try {
    const relations = await prisma.relation.findMany({
      where: { projectId: DEFAULT_PROJECT_ID }
    });

    return res.json({ success: true, data: relations });

  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: "Failed to fetch relations" });
  }
});


export default router;
