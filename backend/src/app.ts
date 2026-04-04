import express from "express";
import apiRouter from "./routes";
import { globalErrorHandler } from "./routes/middlewares/globalErrorHandler";

const app = express();

app.use(express.json());

// API Routes
app.use("/api", apiRouter);

// Global Error Handling Middleware (must be the last middleware)
app.use(globalErrorHandler);

export default app;