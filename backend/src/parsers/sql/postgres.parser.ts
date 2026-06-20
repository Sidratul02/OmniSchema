import { schemaStore } from "../../schema-engine/schema.store";
import { DatabaseSchema } from "../../schema-engine/schema.types";
import { mapSQLDatatype } from "../shared/datatype.mapper";
export const generatePostgresSQL = (
  schema: DatabaseSchema = schemaStore
): string => {

  let code = "";

  schema.entities.forEach((entity) => {

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

  schema.relations.forEach((relation) => {
    if (relation.type !== "one-to-many") {
      return;
    }

    const fromEntity = schema.entities.find(
      (entity) => entity.id === relation.from
    );
    const toEntity = schema.entities.find(
      (entity) => entity.id === relation.to
    );
    if (!fromEntity || !toEntity) {
      return;
    }

    code += `ALTER TABLE ${toEntity.name} ADD COLUMN ${fromEntity.name.toLowerCase()}_id UUID REFERENCES ${fromEntity.name}(id);\n`;
  });

  return code;
};
