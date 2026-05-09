import { Router } from "express";

import {
  createEntity,
  getEntities,
  getEntityById,
  deleteEntity
} from "../controllers/entity.controller";

const router = Router();


// CREATE
router.post("/", createEntity);


// GET ALL
router.get("/", getEntities);


// GET ONE
router.get("/:id", getEntityById);


// DELETE
router.delete("/:id", deleteEntity);


export default router;