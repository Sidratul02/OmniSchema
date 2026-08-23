import api from "./api";
import type { Entity, Field, Relation } from "../types/schema";

export const createEntity = async (entity: Entity) => {
  const res = await api.post("/entity", entity);
  return res.data;
};

export const updateEntity = async (id: string, payload: { name: string; fields: Field[] }) => {
  const res = await api.put(`/entity/${id}`, payload);
  return res.data;
};

export const fetchEntities = async (): Promise<Entity[]> => {
  const res = await api.get("/entity");
  return res.data.data;
};

export const fetchRelations = async (): Promise<Relation[]> => {
  const res = await api.get("/relation");
  return res.data.data;
};

export const generateSchema = async (parser: string) => {
  const response = await api.get(`/generate/${parser}`);
  return response.data.code as string;
};

export const generateSchemaFromAI = async (prompt: string) => {
  const response = await api.post("/ai/generate", { prompt });
  return response.data;
};

export const createRelation = async (payload: Omit<Relation, "id">) => {
  const response = await api.post("/relation", payload);
  return response.data;
};

export const deleteRelation = async (id: string) => {
  const response = await api.delete(`/relation/${id}`);
  return response.data;
};

export const deleteEntity = async (id: string) => {
  const response = await api.delete(`/entity/${id}`);
  return response.data;
};

export const fetchProjects = async () => {
  const res = await api.get("/project");
  return res.data.data;
};

export const createProject = async (name: string) => {
  const res = await api.post("/project", { name });
  return res.data;
};

export const deleteProject = async (id: string) => {
  const res = await api.delete(`/project/${id}`);
  return res.data;
};

export const fetchSupportedFormats = async () => {
  const res = await api.get("/generate");
  return res.data.formats;
};
