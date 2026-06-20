import { schemaStore }
from "../../schema-engine/schema.store";
import { DatabaseSchema }
from "../../schema-engine/schema.types";


const mapDrizzleDatatype = (
  datatype: string
) => {

  switch (datatype) {

    case "uuid":
      return "uuid";

    case "string":
      return "text";

    case "number":
      return "integer";

    case "boolean":
      return "boolean";

    default:
      return "text";
  }
};


export const generateDrizzle = (
  schema: DatabaseSchema = schemaStore
): string => {

  let code = "";

  code +=
`import {
  pgTable,
  uuid,
  text,
  integer,
  boolean
} from "drizzle-orm/pg-core";\n\n`;


  schema.entities.forEach((entity) => {

    code +=
`export const ${entity.name.toLowerCase()} = pgTable("${entity.name.toLowerCase()}", {\n`;

    const fieldLines: string[] = [];

    entity.fields.forEach((field) => {

      let line =
        `  ${field.name}: `;

      const drizzleType =
        mapDrizzleDatatype(
          field.datatype
        );

      line +=
        `${drizzleType}("${field.name}")`;

      // PRIMARY KEY
      if (field.primary) {
        line += ".primaryKey()";
      }

      // UNIQUE
      if (field.unique) {
        line += ".unique()";
      }

      // NOT NULL
      if (!field.nullable) {
        line += ".notNull()";
      }

      fieldLines.push(line);
    });


    // RELATIONS
    schema.relations.forEach((relation) => {

      if (
        relation.type === "one-to-many" &&
        relation.to.toLowerCase() ===
        entity.name.toLowerCase()
      ) {

        fieldLines.push(
`  ${relation.from}_id: uuid("${relation.from}_id")`
        );
      }

    });

    code += fieldLines.join(",\n");

    code += `\n});\n\n`;

  });

  return code;
};