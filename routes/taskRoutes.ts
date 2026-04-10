import { Router } from "express";
import * as controller from "../controllers/taskController.js";

const router = Router();

router.post("/", controller.createTask);
router.get("/", controller.getTasks);
router.get("/:id", controller.getTaskById);
router.delete("/:id", controller.deleteTask);
router.patch("/:id", controller.updateTask);

export default router;
