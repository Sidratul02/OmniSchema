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
  type: string;
}

export interface DatabaseSchema {
  entities: Entity[];
  relations: Relation[];
}
