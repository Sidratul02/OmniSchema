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
  id?: string;
  from: string;
  to: string;
  type: string;
}
