import { Router }
from "express";

import { generateSchema }
from "../controllers/generator.controller";

const router = Router();

router.get("/:type", generateSchema);

export default router;