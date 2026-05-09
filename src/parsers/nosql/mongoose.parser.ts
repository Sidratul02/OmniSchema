import { schemaStore } from "../../schema-engine/schema.store";

export const generateMongooseSchema = (): string => {

  let code = "";

  schemaStore.entities.forEach((entity) => {

    code += `const mongoose = require("mongoose");\n\n`;

    code += `const ${entity.name}Schema = new mongoose.Schema({\n`;

    const fieldLines = entity.fields.map((field) => {

      let line = `  ${field.name}: {\n`;

      // TYPE MAPPING
      switch (field.datatype) {

        case "uuid":
        case "string":
          line += `    type: String`;
          break;

        case "number":
          line += `    type: Number`;
          break;

        case "boolean":
          line += `    type: Boolean`;
          break;

        default:
          line += `    type: String`;
      }

      // UNIQUE
      if (field.unique) {
        line += `,\n    unique: true`;
      }

      // REQUIRED
      if (!field.nullable) {
        line += `,\n    required: true`;
      }

      line += `\n  }`;

      return line;
    });

    code += fieldLines.join(",\n");

    code += `\n});\n\n`;

    code += `module.exports = mongoose.model("${entity.name}", ${entity.name}Schema);\n\n`;
  });

  return code;
};