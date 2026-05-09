import { Request, Response } from "express";

import { schemaStore }
from "../schema-engine/schema.store";

import { Relation }
from "../schema-engine/schema.types";


export const createRelation = (
  req: Request,
  res: Response
) => {

  const relation: Relation = req.body;

  schemaStore.relations.push(relation);

  return res.json({
    success: true,
    message: "Relation created",
    data: relation
  });
};


export const getRelations = (
  _: Request,
  res: Response
) => {

  return res.json({
    success: true,
    data: schemaStore.relations
  });
};