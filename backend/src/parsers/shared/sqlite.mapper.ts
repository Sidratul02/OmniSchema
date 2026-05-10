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

    default:
      return "TEXT";
  }
};