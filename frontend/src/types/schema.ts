export interface Field {
  name: string;
  datatype: string;
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