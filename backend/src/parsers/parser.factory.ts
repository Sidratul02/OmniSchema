import { generatePostgresSQL }
from "./sql/postgres.parser";

import { generateMongooseSchema }
from "./nosql/mongoose.parser";

import { generateMySQL }
from "./sql/mysql.parser";

import { generateSQLite }
from "./sql/sqlite.parser";

import { generatePrisma }
from "./orm/prisma.parser";

import { generateDrizzle }
from "./orm/drizzle.parser";

import { generateTypescriptInterfaces }
from "./typescript/interface.parser";

import { generateSequelize }
from "./orm/sequelize.parser";
import { DatabaseSchema }
from "../schema-engine/schema.types";

export class ParserFactory {

  static generate(
    type: string,
    schema: DatabaseSchema
  ) {

    switch(type) {

      case "postgres":
        return generatePostgresSQL(schema);

      case "mongoose":
        return generateMongooseSchema(schema);

      case "mysql":
        return generateMySQL(schema);

      case "sqlite":
        return generateSQLite(schema);

      case "prisma":
        return generatePrisma(schema);

      case "drizzle":
        return generateDrizzle(schema);
 
      case "typescript":
        return generateTypescriptInterfaces(schema);

      case "sequelize":
       return generateSequelize(schema); 
      default:
        throw new Error(
          "Unsupported parser"
        );
    }
  }
}