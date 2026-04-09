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
