import { schemaStore } from "../../schema-engine/schema.store";
import { mapSQLDatatype } from "../shared/datatype.mapper";

export const generatePostgresSQL = (): string => {

  let code = "";

  schemaStore.entities.forEach((entity) => {

    code += `CREATE TABLE ${entity.name} (\n`;

    const fieldLines: string[] = [];

    entity.fields.forEach((field) => {

      let line = `  ${field.name} `;

      line += mapSQLDatatype(field.datatype);

      if (field.primary) {
        line += " PRIMARY KEY";
      }

      if (field.unique) {
        line += " UNIQUE";
      }

      if (!field.nullable) {
        line += " NOT NULL";
      }

      fieldLines.push(line);
    });

    code += fieldLines.join(",\n");
    code += `\n);\n\n`;
  });

  return code;
};
