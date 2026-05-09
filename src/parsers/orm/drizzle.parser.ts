import { schemaStore }
from "../../schema-engine/schema.store";


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


export const generateDrizzle = (): string => {

  let code = "";

  code +=
`import {
  pgTable,
  uuid,
  text,
  integer,
  boolean
} from "drizzle-orm/pg-core";\n\n`;


  schemaStore.entities.forEach((entity) => {

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
    schemaStore.relations.forEach((relation) => {

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