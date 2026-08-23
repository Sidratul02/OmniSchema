import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

export const loginSchema = z.object({
  email: z.string().trim().email("Invalid email"),
  password: z.string().min(1, "Password is required")
});

const fieldSchema = z.object({
  name: z.string().trim().min(1, "Field name is required"),
  datatype: z.enum(["uuid", "string", "number", "boolean", "date", "text", "json"]),
  primary: z.boolean().optional(),
  unique: z.boolean().optional(),
  nullable: z.boolean().optional()
});

export const createEntitySchema = z.object({
  id: z.string().trim().min(1, "Entity id is required"),
  name: z.string().trim().min(1, "Entity name is required"),
  fields: z.array(fieldSchema).min(1, "At least one field is required")
});

export const updateEntitySchema = z.object({
  name: z.string().trim().min(1, "Entity name is required"),
  fields: z.array(fieldSchema).min(1, "At least one field is required")
});

export const createRelationSchema = z.object({
  from: z.string().trim().min(1, "From entity is required"),
  to: z.string().trim().min(1, "To entity is required"),
  type: z.enum(["one-to-one", "one-to-many", "many-to-many"])
});

export const aiGenerateSchema = z.object({
  prompt: z.string().trim().min(3, "Prompt must be at least 3 characters").max(2000)
});

export const parseBody = <T>(schema: z.ZodType<T>, body: unknown) => {
  const result = schema.safeParse(body);

  if (!result.success) {
    const message = result.error.issues[0]?.message || "Invalid request body";
    return { success: false as const, message };
  }

  return { success: true as const, data: result.data };
};
