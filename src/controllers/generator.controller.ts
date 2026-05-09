import { RequestHandler } from "express";

import { ParserFactory }
from "../parsers/parser.factory";

export const generateSchema: RequestHandler<{ type: string }> = (
  req,
  res
) => {

  try {

    const { type } = req.params;

    const result =
      ParserFactory.generate(type);

    return res.json({
      success: true,
      code: result
    });

  } catch(error) {

    return res.status(400).json({
      success: false,
      message: "Unsupported parser"
    });
  }
};