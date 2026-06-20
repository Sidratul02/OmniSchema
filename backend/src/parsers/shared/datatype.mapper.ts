export const mapSQLDatatype = (
  datatype: string
) => {

  switch (datatype) {

    case "uuid":
      return "UUID";

    case "string":
      return "TEXT";

    case "number":
      return "INTEGER";

    case "boolean":
      return "BOOLEAN";

    case "date":
      return "TIMESTAMP";

    case "json":
      return "JSONB";

    case "text":
      return "TEXT";

    default:
      return "TEXT";
  }
};