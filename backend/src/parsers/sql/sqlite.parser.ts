import { DatabaseSchema } from "../../schema-engine/schema.types";
import { mapSQLiteDatatype } from "../shared/sqlite.mapper";

export const generateSQLite = (schema: DatabaseSchema): string => {
  let sql = "";

  schema.entities.forEach((entity) => {
    sql += `CREATE TABLE ${entity.name.toLowerCase()} (\n`;
    const fieldLines: string[] = [];

    entity.fields.forEach((field) => {
      let line = `  ${field.name} ${mapSQLiteDatatype(field.datatype)}`;
      if (field.primary) line += " PRIMARY KEY";
      if (field.unique) line += " UNIQUE";
      if (!field.nullable) line += " NOT NULL";
      fieldLines.push(line);
    });

    // one-to-one: FK on the "to" side
    schema.relations.forEach((relation) => {
      if (relation.type === "one-to-one" && relation.to === entity.id) {
        fieldLines.push(`  ${relation.from}_id TEXT UNIQUE REFERENCES ${relation.from}(id)`);
      }
    });

    // one-to-many: FK on the "to" side
    schema.relations.forEach((relation) => {
      if (relation.type === "one-to-many" && relation.to === entity.id) {
        fieldLines.push(`  ${relation.from}_id TEXT REFERENCES ${relation.from}(id)`);
      }
    });

    sql += fieldLines.join(",\n");
    sql += `\n);\n\n`;
  });

  // many-to-many: junction tables
  schema.relations.forEach((relation) => {
    if (relation.type !== "many-to-many") return;
    const fromEntity = schema.entities.find((e) => e.id === relation.from);
    const toEntity = schema.entities.find((e) => e.id === relation.to);
    if (!fromEntity || !toEntity) return;

    const junctionTable = `${relation.from}_${relation.to}`;
    sql += `CREATE TABLE ${junctionTable} (\n`;
    sql += `  ${relation.from}_id TEXT REFERENCES ${fromEntity.name.toLowerCase()}(id),\n`;
    sql += `  ${relation.to}_id TEXT REFERENCES ${toEntity.name.toLowerCase()}(id),\n`;
    sql += `  PRIMARY KEY (${relation.from}_id, ${relation.to}_id)\n`;
    sql += `);\n\n`;
  });

  return sql;
};
