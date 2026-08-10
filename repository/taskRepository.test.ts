import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import type Task from "../models/Task.js";

type TaskAttrs = {
  id: number;
  title: string;
  completed: boolean;
  note?: string | null;
};

const mockCreate = jest.fn<(...args: any[]) => Promise<TaskAttrs>>();
const mockFindAll = jest.fn<(...args: any[]) => Promise<TaskAttrs[]>>();
const mockFindByPk =
  jest.fn<(...args: any[]) => Promise<TaskAttrs | any | null>>();
const mockDestroy = jest.fn<(...args: any[]) => Promise<void>>();
const mockUpdate = jest.fn<(...args: any[]) => Promise<TaskAttrs>>();

jest.unstable_mockModule("../models/Task.js", () => {
  return {
    default: {
      create: (...args: any[]) => mockCreate(...args),
      findAll: (...args: any[]) => mockFindAll(...args),
      findByPk: (...args: any[]) => mockFindByPk(...args),
    },
  };
});

const { createTask, getAllTasks, getTaskById, deleteTask, updateTask } =
  await import("./taskRepository.js");

describe("taskRepository", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createTask", () => {
    it("should call Task.create with the provided data", async () => {
      const input = { title: "Test", note: "optional" };
      const created = { id: 1, ...input, completed: false };
      mockCreate.mockResolvedValue(created);

      const result = await createTask(input);

      expect(mockCreate).toHaveBeenCalledWith(input);
      expect(result).toEqual(created);
    });
  });

  describe("getAllTasks", () => {
    it("should return all tasks", async () => {
      const tasks = [
        { id: 1, title: "A", completed: false },
        { id: 2, title: "B", completed: true },
      ];
      mockFindAll.mockResolvedValue(tasks);

      const result = await getAllTasks();

      expect(mockFindAll).toHaveBeenCalled();
      expect(result).toEqual(tasks);
    });
  });

  describe("getTaskById", () => {
    it("should return a task by id", async () => {
      const task = { id: 1, title: "Task", completed: false };
      mockFindByPk.mockResolvedValue(task);

      const result = await getTaskById(1);

      expect(mockFindByPk).toHaveBeenCalledWith(1);
      expect(result).toEqual(task);
    });

    it("should return null if task not found", async () => {
      mockFindByPk.mockResolvedValue(null);

      const result = await getTaskById(999);

      expect(result).toBeNull();
    });
  });

  describe("deleteTask", () => {
    it("should delete and return true when task exists", async () => {
      const task = {
        id: 1,
        title: "Task",
        destroy: mockDestroy,
      };
      mockFindByPk.mockResolvedValue(task as any);
      mockDestroy.mockResolvedValue(undefined);

      const result = await deleteTask(1);

      expect(mockFindByPk).toHaveBeenCalledWith(1);
      expect(mockDestroy).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it("should return null when task does not exist", async () => {
      mockFindByPk.mockResolvedValue(null);

      const result = await deleteTask(999);

      expect(result).toBeNull();
    });
  });

  describe("updateTask", () => {
    it("should update and return the task when it exists", async () => {
      const existing = {
        id: 1,
        title: "Old",
        update: mockUpdate,
      };
      const updates = { title: "New" };
      const updated = { id: 1, title: "New", completed: false };
      mockFindByPk.mockResolvedValue(existing as any);
      mockUpdate.mockResolvedValue(updated);

      const result = await updateTask(1, updates);

      expect(mockFindByPk).toHaveBeenCalledWith(1);
      expect(mockUpdate).toHaveBeenCalledWith(updates);
      expect(result).toEqual(updated);
    });

    it("should return null when task does not exist", async () => {
      mockFindByPk.mockResolvedValue(null);

      const result = await updateTask(999, { title: "X" });

      expect(result).toBeNull();
    });
  });
});
