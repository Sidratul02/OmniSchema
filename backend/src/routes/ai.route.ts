import { Router } from "express";
import OpenAI from "openai";
import { prisma } from "../lib/prisma";
import { getUserProject } from "../lib/project";
import { authenticate } from "../middleware/auth.middleware";
import { aiGenerateSchema, parseBody } from "../validators/schemas";

const router = Router();

router.use(authenticate);

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

const SYSTEM_PROMPT = `You are a database schema designer. When given a description, return ONLY valid JSON in this exact format:

{
  "entities": [
    {
      "id": "snake_case_name",
      "name": "TableName",
      "fields": [
        { "name": "id", "datatype": "uuid", "primary": true },
        { "name": "field_name", "datatype": "string", "unique": false, "nullable": true }
      ]
    }
  ],
  "relations": [
    { "from": "entity_id", "to": "entity_id", "type": "one-to-many" }
  ]
}

Rules:
- Always include an id field with datatype "uuid" and primary: true for each entity
- Use only these datatypes: uuid, string, number, boolean, date, text
- Relation type must be: one-to-one, one-to-many, or many-to-many
- Return ONLY the JSON object, no explanation, no markdown`;

const VALID_DATATYPES = new Set(["uuid", "string", "number", "boolean", "date", "text", "json"]);
const VALID_RELATION_TYPES = new Set(["one-to-one", "one-to-many", "many-to-many"]);

// Sanitize user prompt — strip HTML, control chars, and prompt injection patterns
const sanitizePrompt = (input: string): string =>
  input
    .replace(/<[^>]*>/g, "")
    .replace(/[\x00-\x1F\x7F]/g, "")
    .replace(/\b(ignore|forget|disregard|override|system|assistant|instruction)\b/gi, "")
    .trim()
    .slice(0, 1000);

router.post("/generate", async (req, res) => {
  try {
    const parsed = parseBody(aiGenerateSchema, req.body);

    if (!parsed.success) {
      return res.status(400).json({ success: false, message: parsed.message });
    }

    if (!process.env.OPENAI_API_KEY || !openai) {
      return res.status(503).json({ success: false, message: "AI generation is not available" });
    }

    const sanitizedPrompt = sanitizePrompt(parsed.data.prompt);

    if (!sanitizedPrompt) {
      return res.status(400).json({ success: false, message: "Prompt is empty after sanitization" });
    }

    const project = await getUserProject(req.userId!);

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-3.5-turbo",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: sanitizedPrompt }
      ],
      temperature: 0.3,
      max_tokens: 2000
    });

    const raw = completion.choices[0]?.message?.content || "";

    let schema: { entities?: unknown[]; relations?: unknown[] };
    try {
      const cleaned = raw.replace(/^```json\s*/i, "").replace(/```\s*$/, "").trim();
      schema = JSON.parse(cleaned);
    } catch {
      return res.status(422).json({ success: false, message: "AI returned invalid JSON. Try again." });
    }

    if (!schema.entities || !Array.isArray(schema.entities)) {
      return res.status(422).json({ success: false, message: "AI returned invalid schema structure." });
    }

    // Validate and insert entities
    for (const entity of schema.entities as Record<string, unknown>[]) {
      if (!entity.id || !entity.name || !Array.isArray(entity.fields)) continue;
      if (typeof entity.id !== "string" || typeof entity.name !== "string") continue;

      // Sanitize entity id — only allow snake_case
      const safeId = String(entity.id).replace(/[^a-z0-9_]/g, "_").slice(0, 64);
      const safeName = String(entity.name).replace(/[^a-zA-Z0-9_ ]/g, "").slice(0, 100);

      const existing = await prisma.entity.findFirst({
        where: { id: safeId, projectId: project.id }
      });

      if (existing) continue;

      const validFields = (entity.fields as Record<string, unknown>[])
        .filter((f) => f.name && typeof f.name === "string")
        .map((f) => ({
          name: String(f.name).replace(/[^a-zA-Z0-9_]/g, "_").slice(0, 64),
          datatype: VALID_DATATYPES.has(String(f.datatype)) ? String(f.datatype) : "string",
          primary: Boolean(f.primary),
          unique: Boolean(f.unique),
          nullable: f.nullable !== false
        }));

      if (validFields.length === 0) continue;

      await prisma.entity.create({
        data: {
          id: safeId,
          name: safeName,
          projectId: project.id,
          fields: { create: validFields }
        }
      });
    }

    // Validate and insert relations
    const entityIds = new Set(
      (await prisma.entity.findMany({
        where: { projectId: project.id },
        select: { id: true }
      })).map((e) => e.id)
    );

    for (const relation of (schema.relations || []) as Record<string, unknown>[]) {
      const from = String(relation.from || "");
      const to = String(relation.to || "");
      const type = String(relation.type || "one-to-many");

      if (!entityIds.has(from) || !entityIds.has(to)) continue;
      if (from === to) continue;
      if (!VALID_RELATION_TYPES.has(type)) continue;

      await prisma.relation.create({
        data: { from, to, type, projectId: project.id }
      }).catch(() => {});
    }

    return res.json({ success: true, schema });
  } catch (error: unknown) {
    console.error("[AI Generate Error]", error);

    const status = (error as { status?: number })?.status;

    if (status === 401) {
      return res.status(401).json({ success: false, message: "Invalid OpenAI API key." });
    }
    if (status === 429) {
      return res.status(429).json({ success: false, message: "OpenAI rate limit reached. Try again later." });
    }

    return res.status(500).json({ success: false, message: "AI generation failed." });
  }
});

export default router;
