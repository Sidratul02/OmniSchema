import { Router } from "express";

import { generateSQL }
from "../controllers/sql.controller";

const router = Router();

router.get("/", generateSQL);

export default router;