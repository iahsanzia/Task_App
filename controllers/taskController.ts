import type { Request, Response } from "express";
import * as taskService from "../services/taskService.js";

export const createTask = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { title, note } = req.body;

    const task = await taskService.createTask(title, note);

    res.status(201).json(task);
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json({ error: err.message });
    }
  }
};

export const getTasks = async (req: Request, res: Response) => {
  try {
    const tasks = await taskService.getTasks();
    res.json(tasks);
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ error: err.message });
    }
  }
};
