import type { Task } from "../types/taskTypes.js";
import { fetchJSON } from "../utils/helper.js";

const BASE_URL = "http://localhost:3000/tasks";

export const getTasks = async (): Promise<Task[]> => {
  return fetchJSON(BASE_URL);
};

export const getTaskById = async (id: number): Promise<Task> => {
  return fetchJSON(`${BASE_URL}/${id}`);
};

export const createTask = async (
  title: string,
  note?: string,
): Promise<Task> => {
  return fetchJSON(BASE_URL, {
    method: "POST",
    body: JSON.stringify({ title, note }),
  });
};

export const updateTask = async (
  id: number,
  updates: Partial<{
    title: string;
    note: string | null;
    completed: boolean;
  }>,
): Promise<Task> => {
  return fetchJSON(`${BASE_URL}/${id}`, {
    method: "PATCH",
    body: JSON.stringify(updates),
  });
};

export const deleteTask = async (id: number): Promise<void> => {
  await fetchJSON(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });
};
