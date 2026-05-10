import api from "./api";
import type { Entity, Relation } from "../types/schema";

export const createEntity = async (entity: Entity) => {
  const res = await api.post("/entity", entity);
  return res.data.data;
};

export const fetchEntities = async (): Promise<Entity[]> => {
  const res = await api.get("/entity");
  return res.data.data;
};

export const fetchRelations = async (): Promise<Relation[]> => {
  const res = await api.get("/relation");
  return res.data.data;
};

export const generateSchema = async ( parser: string ) => {
  const response = await api.get(`/generate/${parser}`);
  return response.data;
};

export const createRelation = async (payload: any) => { 
  const response = await api.post( "/relation", payload );
  return response.data;
};

export const deleteEntity = async (id: string) => {
  const response = await api.delete(`/entity/${id}`);
  return response.data;
};