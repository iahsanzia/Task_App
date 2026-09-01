import * as repo from "../repository/taskRepository.js";
import { ApiError } from "../utils/ApiError.js";
const MAX_TITLE_LENGTH = 200;
const MAX_NOTE_LENGTH = 2000;

const validateTitle = (value: unknown, emptyMessage: string): string => {
  if (typeof value !== "string") {
    throw new ApiError(400, "Title must be a string");
  }

  const title = value.trim();

  if (!title) {
    throw new ApiError(404, emptyMessage);
  }

  if (title.length > MAX_TITLE_LENGTH) {
    throw new ApiError(
      400,
      `Title cannot exceed ${MAX_TITLE_LENGTH} characters`,
    );
  }

  return title;
};

const validateNote = (value: unknown): string | null | undefined => {
  if (value === undefined) return undefined;
  if (value === null) return null;

  if (typeof value !== "string") {
    throw new ApiError(400, "Note must be a string or null");
  }

  const note = value.trim();

  if (note.length > MAX_NOTE_LENGTH) {
    throw new ApiError(400, `Note cannot exceed ${MAX_NOTE_LENGTH} characters`);
  }

  return note === "" ? null : note;
};

const validateCompleted = (value: unknown): boolean | undefined => {
  if (value === undefined) return undefined;

  if (typeof value !== "boolean") {
    throw new ApiError(400, "Completed must be a boolean");
  }

  return value;
};

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
  titleValue: unknown,
  noteValue?: unknown,
  dueDate?: unknown,
) => {
  const title = validateTitle(titleValue, "Title is Required");
  const note = validateNote(noteValue);
  const parsedDueDate = dueDateValidation(dueDate);

  return repo.createTask({
    title,
    ...(note !== undefined && note !== null ? { note } : {}),
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
    title?: unknown;
    note?: unknown;
    completed?: unknown;
    dueDate?: unknown;
  },
) => {
  const allowedUpdates: {
    title?: string;
    note?: string | null;
    completed?: boolean;
    dueDate?: Date | null;
  } = {};

  if (data.title !== undefined) {
    allowedUpdates.title = validateTitle(data.title, "Title cannot be empty");
  }

  if (data.note !== undefined) {
    allowedUpdates.note = validateNote(data.note) ?? null;
  }

  if (data.completed !== undefined) {
    allowedUpdates.completed = validateCompleted(data.completed)!;
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
