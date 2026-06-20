import { schemaStore }
from "../../schema-engine/schema.store";
import { DatabaseSchema }
from "../../schema-engine/schema.types";

import { mapSQLiteDatatype }
from "../shared/sqlite.mapper";


export const generateSQLite = (
  schema: DatabaseSchema = schemaStore
): string => {

  let sql = "";

  schema.entities.forEach((entity) => {

    sql += `CREATE TABLE ${entity.name.toLowerCase()} (\n`;

    const fieldLines: string[] = [];

    // NORMAL FIELDS
    entity.fields.forEach((field) => {

      let line = `  ${field.name} `;

      // DATATYPE MAPPING
      line += mapSQLiteDatatype(
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
    schema.relations.forEach((relation) => {

      // one-to-many
      if (
        relation.type === "one-to-many" &&
        relation.to.toLowerCase() ===
        entity.name.toLowerCase()
      ) {

        const foreignKeyField =
          `  ${relation.from}_id TEXT REFERENCES ${relation.from}(id)`;

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