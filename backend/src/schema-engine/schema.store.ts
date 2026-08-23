import { DatabaseSchema } from "./schema.types";

export const emptySchema = (): DatabaseSchema => ({
  entities: [],
  relations: []
});
