import { schemaStore }
from "../../schema-engine/schema.store";
import { DatabaseSchema }
from "../../schema-engine/schema.types";


const mapPrismaDatatype = (
  datatype: string
) => {

  switch (datatype) {

    case "uuid":
      return "String";

    case "string":
      return "String";

    case "number":
      return "Int";

    case "boolean":
      return "Boolean";

    default:
      return "String";
  }
};


export const generatePrisma = (
  schema: DatabaseSchema = schemaStore
): string => {

  let prisma = "";

  schema.entities.forEach((entity) => {

    prisma += `model ${entity.name} {\n`;

    entity.fields.forEach((field) => {

      let line =
        `  ${field.name} `;

      line += mapPrismaDatatype(
        field.datatype
      );

      // PRIMARY KEY
      if (field.primary) {
        line += " @id";
      }

      // UNIQUE
      if (field.unique) {
        line += " @unique";
      }

      prisma += line + "\n";
    });

    // RELATIONS
    schema.relations.forEach((relation) => {

      if (
        relation.type === "one-to-many" &&
        relation.to.toLowerCase() ===
        entity.name.toLowerCase()
      ) {

        prisma +=
          `  ${relation.from}_id String\n`;

        prisma +=
          `  ${relation.from} ${relation.from} @relation(fields: [${relation.from}_id], references: [id])\n`;
      }

    });

    prisma += `}\n\n`;

  });

  return prisma;
};