import { DatabaseSchema } from "../../schema-engine/schema.types";

const mapPrismaDatatype = (datatype: string) => {
  switch (datatype) {
    case "uuid":
    case "string":
    case "text":
      return "String";
    case "number":
      return "Int";
    case "boolean":
      return "Boolean";
    case "date":
      return "DateTime";
    case "json":
      return "Json";
    default:
      return "String";
  }
};

export const generatePrisma = (schema: DatabaseSchema): string => {
  let prisma = "";

  schema.entities.forEach((entity) => {
    prisma += `model ${entity.name} {\n`;

    entity.fields.forEach((field) => {
      let line = `  ${field.name} ${mapPrismaDatatype(field.datatype)}`;
      if (field.primary) line += " @id";
      if (field.unique) line += " @unique";
      prisma += line + "\n";
    });

    // one-to-one: FK side (to)
    schema.relations.forEach((relation) => {
      if (relation.type !== "one-to-one" || relation.to !== entity.id) return;
      const fromEntity = schema.entities.find((e) => e.id === relation.from);
      if (!fromEntity) return;
      const fkField = `${relation.from}_id`;
      prisma += `  ${fkField} String @unique\n`;
      prisma += `  ${fromEntity.name} ${fromEntity.name} @relation(fields: [${fkField}], references: [id])\n`;
    });

    // one-to-one: back-reference side (from)
    schema.relations.forEach((relation) => {
      if (relation.type !== "one-to-one" || relation.from !== entity.id) return;
      const toEntity = schema.entities.find((e) => e.id === relation.to);
      if (!toEntity) return;
      prisma += `  ${toEntity.name} ${toEntity.name}?\n`;
    });

    // one-to-many: FK side (to)
    schema.relations.forEach((relation) => {
      if (relation.type !== "one-to-many" || relation.to !== entity.id) return;
      const fromEntity = schema.entities.find((e) => e.id === relation.from);
      if (!fromEntity) return;
      const fkField = `${relation.from}_id`;
      prisma += `  ${fkField} String\n`;
      prisma += `  ${fromEntity.name} ${fromEntity.name} @relation(fields: [${fkField}], references: [id])\n`;
    });

    // one-to-many: list side (from)
    schema.relations.forEach((relation) => {
      if (relation.type !== "one-to-many" || relation.from !== entity.id) return;
      const toEntity = schema.entities.find((e) => e.id === relation.to);
      if (!toEntity) return;
      prisma += `  ${toEntity.name}s ${toEntity.name}[]\n`;
    });

    // many-to-many: implicit relation (both sides)
    schema.relations.forEach((relation) => {
      if (relation.type !== "many-to-many") return;
      if (relation.from === entity.id) {
        const toEntity = schema.entities.find((e) => e.id === relation.to);
        if (toEntity) prisma += `  ${toEntity.name}s ${toEntity.name}[]\n`;
      }
      if (relation.to === entity.id) {
        const fromEntity = schema.entities.find((e) => e.id === relation.from);
        if (fromEntity) prisma += `  ${fromEntity.name}s ${fromEntity.name}[]\n`;
      }
    });

    prisma += `}\n\n`;
  });

  return prisma;
};
