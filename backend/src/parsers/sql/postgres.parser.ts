import { DatabaseSchema } from "../../schema-engine/schema.types";
import { mapSQLDatatype } from "../shared/datatype.mapper";

const getPrimaryKeyField = (entity: DatabaseSchema["entities"][number]) =>
  entity.fields.find((field) => field.primary)?.name || "id";

export const generatePostgresSQL = (schema: DatabaseSchema): string => {
  let code = "";

  schema.entities.forEach((entity) => {
    code += `CREATE TABLE ${entity.name} (\n`;
    const fieldLines: string[] = [];

    entity.fields.forEach((field) => {
      let line = `  ${field.name} ${mapSQLDatatype(field.datatype)}`;
      if (field.primary) line += " PRIMARY KEY";
      if (field.unique) line += " UNIQUE";
      if (!field.nullable) line += " NOT NULL";
      fieldLines.push(line);
    });

    // one-to-one: FK on the "to" side
    schema.relations.forEach((relation) => {
      if (relation.type === "one-to-one" && relation.to === entity.id) {
        const fromEntity = schema.entities.find((e) => e.id === relation.from);
        if (fromEntity) {
          const pk = getPrimaryKeyField(fromEntity);
          fieldLines.push(`  ${relation.from}_id UUID UNIQUE REFERENCES ${fromEntity.name}(${pk})`);
        }
      }
    });

    // one-to-many: FK on the "to" side
    schema.relations.forEach((relation) => {
      if (relation.type === "one-to-many" && relation.to === entity.id) {
        const fromEntity = schema.entities.find((e) => e.id === relation.from);
        if (fromEntity) {
          const pk = getPrimaryKeyField(fromEntity);
          fieldLines.push(`  ${relation.from}_id UUID REFERENCES ${fromEntity.name}(${pk})`);
        }
      }
    });

    code += fieldLines.join(",\n");
    code += `\n);\n\n`;
  });

  // many-to-many: junction tables
  schema.relations.forEach((relation) => {
    if (relation.type !== "many-to-many") return;
    const fromEntity = schema.entities.find((e) => e.id === relation.from);
    const toEntity = schema.entities.find((e) => e.id === relation.to);
    if (!fromEntity || !toEntity) return;

    const fromPk = getPrimaryKeyField(fromEntity);
    const toPk = getPrimaryKeyField(toEntity);
    const junctionTable = `${relation.from}_${relation.to}`;

    code += `CREATE TABLE ${junctionTable} (\n`;
    code += `  ${relation.from}_id UUID REFERENCES ${fromEntity.name}(${fromPk}),\n`;
    code += `  ${relation.to}_id UUID REFERENCES ${toEntity.name}(${toPk}),\n`;
    code += `  PRIMARY KEY (${relation.from}_id, ${relation.to}_id)\n`;
    code += `);\n\n`;
  });

  return code;
};
