import express from "express";
import cookieParser from "cookie-parser";
import apiRouter from "./routes";
import { globalErrorHandler } from "./routes/middlewares/globalErrorHandler";

const app = express();

app.use(express.json());
app.use(cookieParser());


app.use("/api", apiRouter);

app.use(globalErrorHandler);

export default app;