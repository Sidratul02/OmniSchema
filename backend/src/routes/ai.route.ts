import { Router } from "express";
import OpenAI from "openai";
import { prisma } from "../lib/prisma";
import { DEFAULT_PROJECT_ID } from "../constants/default-project";

const router = Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

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


router.post("/generate", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.json({ success: false, message: "Prompt is required" });
    }

    // CALL OPENAI
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: prompt }
      ],
      temperature: 0.3
    });

    const raw = completion.choices[0]?.message?.content || "";

    // PARSE JSON
    let schema;
    try {
      schema = JSON.parse(raw);
    } catch {
      return res.json({ success: false, message: "AI returned invalid JSON. Try again." });
    }

    if (!schema.entities || !Array.isArray(schema.entities)) {
      return res.json({ success: false, message: "AI returned invalid schema structure." });
    }

    // SAVE ENTITIES TO DB
    for (const entity of schema.entities) {
      const existing = await prisma.entity.findUnique({ where: { id: entity.id } });
      if (existing) continue;

      await prisma.entity.create({
        data: {
          id: entity.id,
          name: entity.name,
          projectId: DEFAULT_PROJECT_ID,
          fields: {
            create: entity.fields.map((f: any) => ({
              name: f.name,
              datatype: f.datatype || "string",
              primary: f.primary || false,
              unique: f.unique || false,
              nullable: f.nullable ?? true
            }))
          }
        }
      });
    }

    // SAVE RELATIONS TO DB
    for (const relation of (schema.relations || [])) {
      await prisma.relation.create({
        data: {
          from: relation.from,
          to: relation.to,
          type: relation.type || "one-to-many",
          projectId: DEFAULT_PROJECT_ID
        }
      }).catch(() => {}); // skip if relation already exists
    }

    return res.json({ success: true, schema });

  } catch (error: any) {
    console.log(error);

    if (error?.status === 401) {
      return res.json({ success: false, message: "Invalid OpenAI API key." });
    }
    if (error?.status === 429) {
      return res.json({ success: false, message: "OpenAI rate limit reached. Try again later." });
    }

    return res.json({ success: false, message: "AI generation failed." });
  }
});


export default router;
