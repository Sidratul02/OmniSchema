import { schemaStore } from "../../schema-engine/schema.store";
import { mapMySQLDatatype } from "../shared/mysql.mapper";

export const generateMySQL = (): string => {

  let sql = "";

  schemaStore.entities.forEach((entity) => {

    sql += `CREATE TABLE ${entity.name.toLowerCase()} (\n`;

    const fieldLines: string[] = [];

    // NORMAL FIELDS
    entity.fields.forEach((field) => {

      let line = `  ${field.name} `;

      // DATATYPE MAPPING
      line += mapMySQLDatatype(
        field.datatype
      );

      // PRIMARY KEY
      if (field.primary) {
        line += " PRIMARY KEY";
      }

      // UNIQUE
      if (field.unique) {
        line += " UNIQUE";
      }

      // NOT NULL
      if (!field.nullable) {
        line += " NOT NULL";
      }

      fieldLines.push(line);
    });


    // RELATION FIELDS
    schemaStore.relations.forEach((relation) => {

      // one-to-many
      if (
        relation.type === "one-to-many" &&
        relation.to.toLowerCase() ===
        entity.name.toLowerCase()
      ) {

        const foreignKeyField =
          `  ${relation.from}_id CHAR(36) REFERENCES ${relation.from}(id)`;

        fieldLines.push(
          foreignKeyField
        );
      }

    });

    sql += fieldLines.join(",\n");

    sql += `\n);\n\n`;

  });

  return sql;
};