import { DatabaseSchema } from "../../schema-engine/schema.types";

const mapSequelizeDatatype = (datatype: string) => {
  switch (datatype) {
    case "uuid": return "DataTypes.UUID";
    case "string": return "DataTypes.STRING";
    case "number": return "DataTypes.INTEGER";
    case "boolean": return "DataTypes.BOOLEAN";
    case "date": return "DataTypes.DATE";
    case "text": return "DataTypes.TEXT";
    case "json": return "DataTypes.JSON";
    default: return "DataTypes.STRING";
  }
};

export const generateSequelize = (schema: DatabaseSchema): string => {
  let code = `const { DataTypes } = require("sequelize");\n\n`;

  schema.entities.forEach((entity) => {
    code += `const ${entity.name} = sequelize.define("${entity.name}", {\n`;
    const fieldLines: string[] = [];

    entity.fields.forEach((field) => {
      let line = `  ${field.name}: {\n    type: ${mapSequelizeDatatype(field.datatype)}`;
      if (field.primary) line += `,\n    primaryKey: true`;
      if (field.unique) line += `,\n    unique: true`;
      if (!field.nullable) line += `,\n    allowNull: false`;
      line += `\n  }`;
      fieldLines.push(line);
    });

    // one-to-one FK field
    schema.relations.forEach((relation) => {
      if (relation.type === "one-to-one" && relation.to === entity.id) {
        fieldLines.push(`  ${relation.from}_id: {\n    type: DataTypes.UUID,\n    unique: true\n  }`);
      }
    });

    // one-to-many FK field
    schema.relations.forEach((relation) => {
      if (relation.type === "one-to-many" && relation.to === entity.id) {
        fieldLines.push(`  ${relation.from}_id: {\n    type: DataTypes.UUID\n  }`);
      }
    });

    code += fieldLines.join(",\n");
    code += `\n});\n\n`;
  });

  // associations
  const associations: string[] = [];
  schema.relations.forEach((relation) => {
    const fromEntity = schema.entities.find((e) => e.id === relation.from);
    const toEntity = schema.entities.find((e) => e.id === relation.to);
    if (!fromEntity || !toEntity) return;

    if (relation.type === "one-to-one") {
      associations.push(`${fromEntity.name}.hasOne(${toEntity.name});`);
      associations.push(`${toEntity.name}.belongsTo(${fromEntity.name});`);
    } else if (relation.type === "one-to-many") {
      associations.push(`${fromEntity.name}.hasMany(${toEntity.name});`);
      associations.push(`${toEntity.name}.belongsTo(${fromEntity.name});`);
    } else if (relation.type === "many-to-many") {
      const through = `"${relation.from}_${relation.to}"`;
      associations.push(`${fromEntity.name}.belongsToMany(${toEntity.name}, { through: ${through} });`);
      associations.push(`${toEntity.name}.belongsToMany(${fromEntity.name}, { through: ${through} });`);
    }
  });

  if (associations.length > 0) {
    code += `// Associations\n${associations.join("\n")}\n`;
  }

  return code;
};
