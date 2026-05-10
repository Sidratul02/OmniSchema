import api from "./api";
import type { Entity, Relation } from "../types/schema";

export const fetchEntities = async (): Promise<Entity[]> => {
  const res = await api.get("/entity");
  return res.data.data;
};

export const fetchRelations = async (): Promise<Relation[]> => {
  const res = await api.get("/relation");
  return res.data.data;
};
