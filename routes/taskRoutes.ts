import { Router } from "express";
import * as controller from "../controllers/taskController.js";

const router = Router();

router.post("/", controller.createTask);
router.get("/", controller.getTasks);

export default router;
