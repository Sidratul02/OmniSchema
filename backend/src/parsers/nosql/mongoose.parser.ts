import { DatabaseSchema } from "../../schema-engine/schema.types";

export const generateMongooseSchema = (schema: DatabaseSchema): string => {
  let code = `const mongoose = require("mongoose");\nconst { Schema } = mongoose;\n\n`;

  schema.entities.forEach((entity) => {
    code += `const ${entity.name}Schema = new Schema({\n`;
    const fieldLines: string[] = [];

    entity.fields.forEach((field) => {
      let line = `  ${field.name}: {\n`;
      switch (field.datatype) {
        case "uuid":
        case "string":
        case "text":
          line += `    type: String`;
          break;
        case "number":
          line += `    type: Number`;
          break;
        case "boolean":
          line += `    type: Boolean`;
          break;
        case "date":
          line += `    type: Date`;
          break;
        case "json":
          line += `    type: Schema.Types.Mixed`;
          break;
        default:
          line += `    type: String`;
      }
      if (field.unique) line += `,\n    unique: true`;
      if (!field.nullable) line += `,\n    required: true`;
      line += `\n  }`;
      fieldLines.push(line);
    });

    // one-to-one: single ref
    schema.relations.forEach((relation) => {
      if (relation.type === "one-to-one" && relation.to === entity.id) {
        const fromEntity = schema.entities.find((e) => e.id === relation.from);
        if (fromEntity) {
          fieldLines.push(`  ${relation.from}_id: {\n    type: Schema.Types.ObjectId,\n    ref: "${fromEntity.name}",\n    unique: true\n  }`);
        }
      }
    });

    // one-to-many: FK ref on "to" side
    schema.relations.forEach((relation) => {
      if (relation.type === "one-to-many" && relation.to === entity.id) {
        const fromEntity = schema.entities.find((e) => e.id === relation.from);
        if (fromEntity) {
          fieldLines.push(`  ${relation.from}_id: {\n    type: Schema.Types.ObjectId,\n    ref: "${fromEntity.name}"\n  }`);
        }
      }
    });

    // many-to-many: array of refs on both sides
    schema.relations.forEach((relation) => {
      if (relation.type !== "many-to-many") return;
      if (relation.from === entity.id) {
        const toEntity = schema.entities.find((e) => e.id === relation.to);
        if (toEntity) {
          fieldLines.push(`  ${relation.to}_ids: [{\n    type: Schema.Types.ObjectId,\n    ref: "${toEntity.name}"\n  }]`);
        }
      }
    });

    code += fieldLines.join(",\n");
    code += `\n});\n\n`;
    code += `module.exports = mongoose.model("${entity.name}", ${entity.name}Schema);\n\n`;
  });

  return code;
};
