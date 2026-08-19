import * as repo from "../repository/taskRepository.js";
import { ApiError } from "../utils/ApiError.js";

export const createTask = async (
  title: string,
  note?: string,
  dueDate?: Date | null,
) => {
  if (!title) {
    throw new ApiError(404, "Title is Required");
  }

  return await repo.createTask({
    title,
    ...(note ? { note } : {}),
    ...(dueDate ? { dueDate } : {}),
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
    dueDate?: Date | null;
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
    allowedUpdates.dueDate = data.dueDate ? data.dueDate : null;
  }

  const updatedTask = await repo.updateTask(id, allowedUpdates);

  if (!updatedTask) {
    throw new ApiError(404, "Task not found");
  }
  return updatedTask;
};
