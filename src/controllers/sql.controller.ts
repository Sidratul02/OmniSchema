import { Request, Response } from "express";

import { generatePostgresSQL }
from "../parsers/sql/postgres.parser";

export const generateSQL = (
  _: Request,
  res: Response
) => {

  const sql = generatePostgresSQL();

  return res.json({
    success: true,
    sql
  });
};