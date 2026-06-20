export const mapMySQLDatatype = (
  datatype: string
) => {

  switch (datatype) {

    case "uuid":
      return "CHAR(36)";

    case "string":
      return "VARCHAR(255)";

    case "number":
      return "INT";

    case "boolean":
      return "BOOLEAN";

    case "date":
      return "DATETIME";

    case "json":
      return "JSON";

    case "text":
      return "TEXT";

    default:
      return "VARCHAR(255)";
  }
};