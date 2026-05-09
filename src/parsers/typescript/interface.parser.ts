import { schemaStore }
from "../../schema-engine/schema.store";


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


export const generateTypescriptInterfaces = (): string => {

  let code = "";

  schemaStore.entities.forEach((entity) => {

    code +=
`export interface ${entity.name} {\n`;

    entity.fields.forEach((field) => {

      code +=
`  ${field.name}: ${mapTypescriptDatatype(field.datatype)};\n`;

    });

    // RELATION FIELDS
    schemaStore.relations.forEach((relation) => {

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