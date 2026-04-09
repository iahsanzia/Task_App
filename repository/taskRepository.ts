import Task from "../models/Task.js";

export const createTask = async (data: {
  title: string;
  note?: string;
}): Promise<Task> => {
  return await Task.create(data);
};

export const getAllTasks = async (): Promise<Task[]> => {
  return await Task.findAll();
};
