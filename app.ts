import express from "express";
import taskRoutes from "./routes/taskRoutes.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();

app.use(express.json());

app.use("/tasks", taskRoutes);

app.use(errorHandler);

export default app;
