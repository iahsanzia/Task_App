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
    res.status(200).json(tasks);
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ error: err.message });
    }
  }
};

export const getTaskById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const task = await taskService.getTaskById(id);

    res.status(200).json(task);
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ error: err.message });
    }
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    await taskService.deleteTask(id);
    res.status(200).json({
      message: "Task has been deleted",
    });
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ error: err.message });
    }
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const { title, note, completed } = req.body;
    const updatedTask = await taskService.updateTask(id, {
      title,
      note,
      completed,
    });
    res.json(updatedTask);
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ error: err.message });
    }
  }
};
