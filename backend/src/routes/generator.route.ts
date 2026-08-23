import { Router } from "express";
import { prisma } from "../lib/prisma";
import { getUserProject } from "../lib/project";
import { authenticate } from "../middleware/auth.middleware";
import { ParserFactory } from "../parsers/parser.factory";

const router = Router();

router.use(authenticate);

const SUPPORTED_FORMATS = [
  { id: "postgres",    label: "PostgreSQL",  category: "sql"        },
  { id: "mysql",       label: "MySQL",       category: "sql"        },
  { id: "sqlite",      label: "SQLite",      category: "sql"        },
  { id: "prisma",      label: "Prisma",      category: "orm"        },
  { id: "drizzle",     label: "Drizzle",     category: "orm"        },
  { id: "sequelize",   label: "Sequelize",   category: "orm"        },
  { id: "mongoose",    label: "Mongoose",    category: "nosql"      },
  { id: "typescript",  label: "TypeScript",  category: "typescript" }
];

const SUPPORTED_TYPES = new Set(SUPPORTED_FORMATS.map((f) => f.id));

// GET /generate — list all supported export formats
router.get("/", (_req, res) => {
  return res.json({ success: true, formats: SUPPORTED_FORMATS });
});

// GET /generate/:type — generate schema for a specific format
router.get("/:type", async (req, res) => {
  try {
    const { type } = req.params;

    if (!SUPPORTED_TYPES.has(type)) {
      return res.status(400).json({
        success: false,
        message: `Unsupported format "${type}". Supported: ${[...SUPPORTED_TYPES].join(", ")}`
      });
    }

    const project = await getUserProject(req.userId!);

    const [entities, relations] = await Promise.all([
      prisma.entity.findMany({
        where: { projectId: project.id },
        include: { fields: true }
      }),
      prisma.relation.findMany({
        where: { projectId: project.id }
      })
    ]);

    const code = ParserFactory.generate(type, { entities, relations });

    return res.json({ success: true, code });
  } catch (error) {
    console.error("[Generate Schema Error]", error);
    return res.status(500).json({ success: false, message: "Failed to generate schema" });
  }
});

export default router;
