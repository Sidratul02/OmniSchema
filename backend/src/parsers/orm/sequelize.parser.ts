import { schemaStore }
from "../../schema-engine/schema.store";
import { DatabaseSchema }
from "../../schema-engine/schema.types";


const mapSequelizeDatatype = (
  datatype: string
) => {

  switch (datatype) {

    case "uuid":
      return "DataTypes.UUID";

    case "string":
      return "DataTypes.STRING";

    case "number":
      return "DataTypes.INTEGER";

    case "boolean":
      return "DataTypes.BOOLEAN";

    default:
      return "DataTypes.STRING";
  }
};


export const generateSequelize = (
  schema: DatabaseSchema = schemaStore
): string => {

  let code = "";

  code +=
`const { DataTypes } = require("sequelize");\n\n`;

  schema.entities.forEach((entity) => {

    code +=
`const ${entity.name} = sequelize.define("${entity.name}", {\n`;

    const fieldLines: string[] = [];

    entity.fields.forEach((field) => {

      let line =
`  ${field.name}: {
    type: ${mapSequelizeDatatype(field.datatype)}`;

      // PRIMARY KEY
      if (field.primary) {
        line += `,
    primaryKey: true`;
      }

      // UNIQUE
      if (field.unique) {
        line += `,
    unique: true`;
      }

      // ALLOW NULL
      if (!field.nullable) {
        line += `,
    allowNull: false`;
      }

      line += `
  }`;

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
`  ${relation.from}_id: {
    type: DataTypes.UUID
  }`
        );
      }

    });

    code += fieldLines.join(",\n");

    code += `\n});\n\n`;

  });

  return code;
};