import Task from "../models/Task.js";

export const createTask = async (data: {
  title: string;
  note?: string;
  dueDate?: string;
}): Promise<Task> => {
  return await Task.create(data);
};

export const getAllTasks = async (): Promise<Task[]> => {
  return await Task.findAll();
};

export const getTaskById = async (id: number): Promise<Task | null> => {
  return await Task.findByPk(id);
};

export const deleteTask = async (id: number): Promise<true | null> => {
  const task = await Task.findByPk(id);

  if (!task) return null;

  await task.destroy();
  return true;
};

export const updateTask = async (
  id: number,
  data: Partial<{
    title: string;
    note: string | null;
    completed: boolean;
    dueDate: string | null;
  }>,
) => {
  const task = await Task.findByPk(id);
  if (!task) return null;

  return await task.update(data);
};
