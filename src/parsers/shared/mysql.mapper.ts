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

    default:
      return "VARCHAR(255)";
  }
};