import { Router } from "express";

import {
  createRelation,
  getRelations
}
from "../controllers/relation.controller";

const router = Router();

router.post("/", createRelation);

router.get("/", getRelations);

export default router;