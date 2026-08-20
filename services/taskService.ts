import * as repo from "../repository/taskRepository.js";
import { ApiError } from "../utils/ApiError.js";

const matchRegex = /^\d{4}-\d{2}-\d{2}$/;
const dueDateValidation = (value: unknown): Date | null => {
  if (value === null || value === undefined || value === "") {
    return null;
  }
  if (typeof value !== "string") {
    throw new ApiError(400, "Due date must be a string in YYYY-MM-DD format");
  }
  if (!matchRegex.test(value)) {
    throw new ApiError(400, "Due date must be in YYYY-MM-DD format");
  }
  const [yearStr, monthStr, dayStr] = value.split("-");
  const year = Number(yearStr);
  const month = Number(monthStr);
  const day = Number(dayStr);

  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    throw new ApiError(400, "Due date must be a valid date ");
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);
  if (date.getTime() < today.getTime()) {
    throw new ApiError(400, "Due date cannot be in the past");
  }
  return date;
};

export const createTask = async (
  title: string,
  note?: string,
  dueDate?: unknown,
) => {
  if (!title) {
    throw new ApiError(404, "Title is Required");
  }
  const parsedDueDate = dueDateValidation(dueDate);
  return await repo.createTask({
    title,
    ...(note ? { note } : {}),
    ...(parsedDueDate ? { dueDate: parsedDueDate } : {}),
  });
};

export const getTasks = async () => {
  return await repo.getAllTasks();
};

export const getTaskById = async (id: number) => {
  const task = await repo.getTaskById(id);

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  return task;
};

export const deleteTask = async (id: number): Promise<true> => {
  const deletedTask = await repo.deleteTask(id);

  if (!deletedTask) {
    throw new ApiError(404, "Task not found");
  }
  return deletedTask;
};

export const updateTask = async (
  id: number,
  data: {
    title?: string;
    note?: string | null;
    completed?: boolean | null;
    dueDate?: unknown;
  },
) => {
  const allowedUpdates: any = {};

  if (data.title !== undefined) {
    if (!data.title) {
      throw new ApiError(404, "Title cannot be empty");
    }
    allowedUpdates.title = data.title;
  }

  if (data.completed !== undefined) {
    allowedUpdates.completed = data.completed;
  }
  if (data.note !== undefined) {
    allowedUpdates.note = data.note;
  }

  if (data.dueDate !== undefined) {
    allowedUpdates.dueDate = dueDateValidation(data.dueDate);
  }

  const updatedTask = await repo.updateTask(id, allowedUpdates);

  if (!updatedTask) {
    throw new ApiError(404, "Task not found");
  }
  return updatedTask;
};
