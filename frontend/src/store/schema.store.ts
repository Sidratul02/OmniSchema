import { create } from "zustand";

import {
  Entity,
  Relation
} from "../types/schema";

interface SchemaState {

  entities: Entity[];

  relations: Relation[];

  generatedCode: string;

  setEntities: (
    entities: Entity[]
  ) => void;

  setRelations: (
    relations: Relation[]
  ) => void;

  setGeneratedCode: (
    code: string
  ) => void;
}


export const useSchemaStore =
create<SchemaState>((set) => ({

  entities: [],

  relations: [],

  generatedCode: "",

  setEntities: (entities) =>
    set({ entities }),

  setRelations: (relations) =>
    set({ relations }),

  setGeneratedCode: (generatedCode) =>
    set({ generatedCode })

}));