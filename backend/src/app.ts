import express from "express";
import cors from "cors";

import entityRoutes from "./routes/entity.route";
import sqlRoutes from "./routes/sql.route";
import mongooseRoutes from "./routes/mongoose.route";
import relationRoutes from "./routes/relation.route";
import generatorRoutes from "./routes/generator.route";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/entity", entityRoutes);
app.use("/generate/sql", sqlRoutes);
app.use("/generate/mongoose", mongooseRoutes);
app.use("/relation", relationRoutes);

app.use("/generate", generatorRoutes);

export default app;