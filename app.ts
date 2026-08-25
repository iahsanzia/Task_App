import express from "express";
import path from "node:path";
import taskRoutes from "./routes/taskRoutes.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import cors from "cors";

const app = express();

app.use(express.json());

app.use(cors());

app.use("/tasks", taskRoutes);

app.use(express.static(path.resolve(process.cwd(), "front-end")));

app.use(errorHandler);

export default app;
