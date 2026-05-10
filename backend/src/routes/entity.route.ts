import { Router } from "express";
import { schemaStore } from "../schema-engine/schema.store";

import {
  createEntity,
  getEntities,
  getEntityById
} from "../controllers/entity.controller";

const router = Router();


// CREATE
router.post("/", createEntity);


// GET ALL
router.get("/", getEntities);


// GET ONE
router.get("/:id", getEntityById);


// DELETE
router.delete(
  "/:id",

  (req, res) => {

    const { id } = req.params;

    schemaStore.entities =
      schemaStore.entities.filter(
        (entity) =>
          entity.id !== id
      );

    schemaStore.relations =
      schemaStore.relations.filter(
        (relation) =>
          relation.from !== id &&
          relation.to !== id
      );

    return res.json({
      success: true
    });
  }
);


export default router;