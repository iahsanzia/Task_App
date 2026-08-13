import * as repo from "../repository/taskRepository.js";
import { ApiError } from "../utils/ApiError.js";

const getDefaultDate = (): string => {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return date.toISOString();
};

export const createTask = async (
  title: string,
  note: string,
  dueDate?: string | null,
) => {
  if (!title) {
    throw new ApiError(404, "Title is Required");
  }

  const taskDueDate = dueDate ? dueDate : getDefaultDate();
  return await repo.createTask({ title, note, dueDate: taskDueDate });
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
    completed?: null;
    dueDate?: string | null;
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
    allowedUpdates.dueDate = data.dueDate ? data.dueDate : getDefaultDate();
  }

  const updatedTask = await repo.updateTask(id, allowedUpdates);

  if (!updatedTask) {
    throw new ApiError(404, "Task not found");
  }
  return updatedTask;
};
