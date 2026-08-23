import { DatabaseSchema } from "../../schema-engine/schema.types";

const mapTypescriptDatatype = (datatype: string) => {
  switch (datatype) {
    case "uuid":
    case "string":
    case "text":
      return "string";
    case "number":
      return "number";
    case "boolean":
      return "boolean";
    case "date":
      return "Date";
    case "json":
      return "Record<string, unknown>";
    default:
      return "string";
  }
};

export const generateTypescriptInterfaces = (schema: DatabaseSchema): string => {
  let code = "";

  schema.entities.forEach((entity) => {
    code += `export interface ${entity.name} {\n`;

    entity.fields.forEach((field) => {
      const tsType = mapTypescriptDatatype(field.datatype);
      const optional = field.nullable ? "?" : "";
      code += `  ${field.name}${optional}: ${tsType};\n`;
    });

    // one-to-one FK
    schema.relations.forEach((relation) => {
      if (relation.type === "one-to-one" && relation.to === entity.id) {
        code += `  ${relation.from}_id: string;\n`;
      }
    });

    // one-to-many FK
    schema.relations.forEach((relation) => {
      if (relation.type === "one-to-many" && relation.to === entity.id) {
        code += `  ${relation.from}_id: string;\n`;
      }
    });

    // many-to-many: array of IDs
    schema.relations.forEach((relation) => {
      if (relation.type !== "many-to-many") return;
      if (relation.from === entity.id) {
        code += `  ${relation.to}_ids: string[];\n`;
      }
      if (relation.to === entity.id) {
        code += `  ${relation.from}_ids: string[];\n`;
      }
    });

    code += `}\n\n`;
  });

  return code;
};
