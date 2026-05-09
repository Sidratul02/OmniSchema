import { Request, Response } from "express";

import { generateMongooseSchema }
from "../parsers/nosql/mongoose.parser";

export const generateMongoose = (
  _: Request,
  res: Response
) => {

  const code = generateMongooseSchema();

  return res.json({
    success: true,
    code
  });
};