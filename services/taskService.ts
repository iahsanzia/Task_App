import * as repo from "../repository/taskRepository.js";

export const createTask = async (title: string, note: string) => {
  if (!title) {
    throw new Error("Title is required");
  }

  return await repo.createTask({ title, note });
};

export const getTasks = async () => {
  return await repo.getAllTasks();
};

export const getTaskById = async (id: number) => {
  const task = await repo.getTaskById(id);

  if (!task) {
    throw new Error("Task not Found");
  }

  return task;
};

export const deleteTask = async (id: number): Promise<true> => {
  const deletedTask = await repo.deleteTask(id);

  if (!deletedTask) {
    throw new Error("Task not found");
  }
  return deletedTask;
};

export const updateTask = async (
  id: number,
  data: {
    title?: string;
    note?: string | null;
    completed?: null;
  },
) => {
  const allowedUpdates: any = {};

  if (data.title !== undefined) {
    if (!data.title) {
      throw new Error("Title cannot be empty");
    }
    allowedUpdates.title = data.title;
  }

  if (data.completed !== undefined) {
    allowedUpdates.completed = data.completed;
  }
  if (data.note !== undefined) {
    allowedUpdates.note = data.note;
  }

  const updatedTask = await repo.updateTask(id, allowedUpdates);

  if (!updatedTask) {
    throw new Error("Task not found");
  }
  return updatedTask;
};
