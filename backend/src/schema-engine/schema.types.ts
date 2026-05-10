export interface Field {
  name: string;
  datatype: string;
  primary?: boolean;
  unique?: boolean;
  nullable?: boolean;
}

export interface Entity {
  id: string;
  name: string;
  fields: Field[];
}

export interface Relation {
  from: string;
  to: string;
  type: "one-to-one" | "one-to-many" | "many-to-many";
}

export interface DatabaseSchema {
  entities: Entity[];
  relations: Relation[];
}