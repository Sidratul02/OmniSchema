import { DatabaseSchema } from "../../schema-engine/schema.types";

const mapDrizzleDatatype = (datatype: string) => {
  switch (datatype) {
    case "uuid": return "uuid";
    case "string": return "text";
    case "number": return "integer";
    case "boolean": return "boolean";
    case "json": return "json";
    default: return "text";
  }
};

export const generateDrizzle = (schema: DatabaseSchema): string => {
  let code = `import {\n  pgTable,\n  uuid,\n  text,\n  integer,\n  boolean,\n  json\n} from "drizzle-orm/pg-core";\n\n`;

  schema.entities.forEach((entity) => {
    code += `export const ${entity.name.toLowerCase()} = pgTable("${entity.name.toLowerCase()}", {\n`;
    const fieldLines: string[] = [];

    entity.fields.forEach((field) => {
      let line = `  ${field.name}: ${mapDrizzleDatatype(field.datatype)}("${field.name}")`;
      if (field.primary) line += ".primaryKey()";
      if (field.unique) line += ".unique()";
      if (!field.nullable) line += ".notNull()";
      fieldLines.push(line);
    });

    // one-to-one FK
    schema.relations.forEach((relation) => {
      if (relation.type === "one-to-one" && relation.to === entity.id) {
        fieldLines.push(`  ${relation.from}_id: uuid("${relation.from}_id").unique()`);
      }
    });

    // one-to-many FK
    schema.relations.forEach((relation) => {
      if (relation.type === "one-to-many" && relation.to === entity.id) {
        fieldLines.push(`  ${relation.from}_id: uuid("${relation.from}_id")`);
      }
    });

    code += fieldLines.join(",\n");
    code += `\n});\n\n`;
  });

  // many-to-many: junction tables
  schema.relations.forEach((relation) => {
    if (relation.type !== "many-to-many") return;
    const fromEntity = schema.entities.find((e) => e.id === relation.from);
    const toEntity = schema.entities.find((e) => e.id === relation.to);
    if (!fromEntity || !toEntity) return;

    const junctionName = `${relation.from}_${relation.to}`;
    code += `export const ${junctionName} = pgTable("${junctionName}", {\n`;
    code += `  ${relation.from}_id: uuid("${relation.from}_id").notNull(),\n`;
    code += `  ${relation.to}_id: uuid("${relation.to}_id").notNull()\n`;
    code += `});\n\n`;
  });

  return code;
};
