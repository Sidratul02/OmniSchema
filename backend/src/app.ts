import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.route";
import entityRoutes from "./routes/entity.route";
import relationRoutes from "./routes/relation.route";
import generatorRoutes from "./routes/generator.route";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/entity", entityRoutes);
app.use("/relation", relationRoutes);
app.use("/generate", generatorRoutes);

export default app;
