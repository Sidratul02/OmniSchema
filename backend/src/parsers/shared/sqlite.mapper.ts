export const mapSQLiteDatatype = (
  datatype: string
) => {

  switch (datatype) {

    case "uuid":
      return "TEXT";

    case "string":
      return "TEXT";

    case "number":
      return "INTEGER";

    case "boolean":
      return "INTEGER";

    case "date":
      return "TEXT";

    case "json":
      return "TEXT";

    case "text":
      return "TEXT";

    default:
      return "TEXT";
  }
};