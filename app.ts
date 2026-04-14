import express from "express";
import taskRoutes from "./routes/taskRoutes.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import cors from "cors";

const app = express();

app.use(express.json());

app.use(cors());

app.use("/tasks", taskRoutes);

app.use(errorHandler);

export default app;
