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

export class ParserFactory {

  static generate(type: string) {

    switch(type) {

      case "postgres":
        return generatePostgresSQL();

      case "mongoose":
        return generateMongooseSchema();

      case "mysql":
        return generateMySQL();

      case "sqlite":
        return generateSQLite();

      case "prisma":
        return generatePrisma();

      case "drizzle":
        return generateDrizzle();
 
      case "typescript":
        return generateTypescriptInterfaces();

      case "sequelize":
       return generateSequelize(); 
      default:
        throw new Error(
          "Unsupported parser"
        );
    }
  }
}