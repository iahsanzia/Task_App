import type { Request, Response } from "express";
import * as taskService from "../services/taskService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

export const createTask = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { title, note, dueDate } = req.body;

    if (!title) {
      throw new ApiError(400, "Title is Required");
    }

    const task = await taskService.createTask(title, note, dueDate);

    res.status(201).json(task);
  },
);

export const getTasks = asyncHandler(async (req: Request, res: Response) => {
  const tasks = await taskService.getTasks();
  res.status(200).json(tasks);
});

export const getTaskById = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    throw new ApiError(400, "Invalid task ID");
  }

  const task = await taskService.getTaskById(id);

  res.status(200).json(task);
});

export const deleteTask = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    throw new ApiError(400, "Invalid task ID");
  }
  await taskService.deleteTask(id);
  res.status(200).json({
    message: "Task has been deleted",
  });
});

export const updateTask = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    throw new ApiError(400, "Invalid task ID");
  }

  const { title, note, completed, dueDate } = req.body;
  const updatedTask = await taskService.updateTask(id, {
    title,
    note,
    completed,
    dueDate,
  });
  res.json(updatedTask);
});
