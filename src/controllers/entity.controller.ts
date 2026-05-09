import { Request, Response } from "express";
import { schemaStore } from "../schema-engine/schema.store";
import { Entity } from "../schema-engine/schema.types";


// CREATE ENTITY
export const createEntity = (
  req: Request,
  res: Response
) => {
  try {
    const entity: Entity = req.body;

    const alreadyExists = schemaStore.entities.find(
      (e) => e.id === entity.id
    );

    if (alreadyExists) {
      return res.status(400).json({
        success: false,
        message: "Entity already exists"
      });
    }

    schemaStore.entities.push(entity);

    return res.status(201).json({
      success: true,
      message: "Entity created",
      data: entity
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create entity"
    });
  }
};


// GET ALL ENTITIES
export const getEntities = (
  _: Request,
  res: Response
) => {
  return res.json({
    success: true,
    count: schemaStore.entities.length,
    data: schemaStore.entities
  });
};


// GET SINGLE ENTITY
export const getEntityById = (
  req: Request,
  res: Response
) => {
  const { id } = req.params;

  const entity = schemaStore.entities.find(
    (e) => e.id === id
  );

  if (!entity) {
    return res.status(404).json({
      success: false,
      message: "Entity not found"
    });
  }

  return res.json({
    success: true,
    data: entity
  });
};


// DELETE ENTITY
export const deleteEntity = (
  req: Request,
  res: Response
) => {
  const { id } = req.params;

  const entityIndex = schemaStore.entities.findIndex(
    (e) => e.id === id
  );

  if (entityIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "Entity not found"
    });
  }

  const deletedEntity =
    schemaStore.entities[entityIndex];

  schemaStore.entities.splice(entityIndex, 1);

  return res.json({
    success: true,
    message: "Entity deleted",
    data: deletedEntity
  });
};