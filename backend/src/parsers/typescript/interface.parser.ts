import { schemaStore }
from "../../schema-engine/schema.store";
import { DatabaseSchema }
from "../../schema-engine/schema.types";


const mapTypescriptDatatype = (
  datatype: string
) => {

  switch (datatype) {

    case "uuid":
      return "string";

    case "string":
      return "string";

    case "number":
      return "number";

    case "boolean":
      return "boolean";

    default:
      return "string";
  }
};


export const generateTypescriptInterfaces = (
  schema: DatabaseSchema = schemaStore
): string => {

  let code = "";

  schema.entities.forEach((entity) => {

    code +=
`export interface ${entity.name} {\n`;

    entity.fields.forEach((field) => {

      code +=
`  ${field.name}: ${mapTypescriptDatatype(field.datatype)};\n`;

    });

    // RELATION FIELDS
    schema.relations.forEach((relation) => {

      if (
        relation.type === "one-to-many" &&
        relation.to.toLowerCase() ===
        entity.name.toLowerCase()
      ) {

        code +=
`  ${relation.from}_id: string;\n`;

      }

    });

    code += `}\n\n`;

  });

  return code;
};