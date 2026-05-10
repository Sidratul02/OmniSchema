import { Router } from "express";

import { generateMongoose }
from "../controllers/mongoose.controller";

const router = Router();

router.get("/", generateMongoose);

export default router;