import express from "express";
import cors from "cors";
import helmet from "helmet";

import authRoutes from "./routes/auth.route";
import entityRoutes from "./routes/entity.route";
import relationRoutes from "./routes/relation.route";
import generatorRoutes from "./routes/generator.route";
import aiRoutes from "./routes/ai.route";
import projectRoutes from "./routes/project.route";

const app = express();

// Security headers
app.use(helmet());

// CORS — only allow the configured frontend origin
const allowedOrigin = process.env.FRONTEND_URL || "http://localhost:3000";
const allowedOrigins = [allowedOrigin, "http://localhost:3001"];
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Limit request body size to prevent payload attacks
app.use(express.json({ limit: "50kb" }));

app.use("/auth", authRoutes);
app.use("/entity", entityRoutes);
app.use("/relation", relationRoutes);
app.use("/generate", generatorRoutes);
app.use("/ai", aiRoutes);
app.use("/project", projectRoutes);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

export default app;
