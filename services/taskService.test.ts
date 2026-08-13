import { ApiError } from "../utils/ApiError.js";
import { describe, it, expect, jest, beforeEach } from "@jest/globals";

const mockCreateTask = jest.fn<(...args: any[]) => Promise<any>>();
const mockGetAllTasks = jest.fn<(...args: any[]) => Promise<any>>();
const mockGetTaskById = jest.fn<(...args: any[]) => Promise<any>>();
const mockDeleteTask = jest.fn<(...args: any[]) => Promise<any>>();
const mockUpdateTask = jest.fn<(...args: any[]) => Promise<any>>();

jest.unstable_mockModule("../repository/taskRepository.js", () => ({
  createTask: mockCreateTask,
  getAllTasks: mockGetAllTasks,
  getTaskById: mockGetTaskById,
  deleteTask: mockDeleteTask,
  updateTask: mockUpdateTask,
}));

const service = await import("./taskService.js");
const repo = await import("../repository/taskRepository.js");

describe("taskService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createTask", () => {
    it("should create a task when title is provided", async () => {
      const created = {
        id: 1,
        title: "Hello",
        note: "world",
        completed: false,
      };
      mockCreateTask.mockResolvedValue(created);

      const result = await service.createTask("Hello", "world");

      expect(repo.createTask).toHaveBeenCalledWith({
        title: "Hello",
        note: "world",
      });
      expect(result).toEqual(created);
    });

    it("should throw ApiError when title is empty", async () => {
      await expect(service.createTask("", "note")).rejects.toThrow(ApiError);
      await expect(service.createTask("", "note")).rejects.toMatchObject({
        statusCode: 404,
        message: "Title is Required",
      });
    });
  });

  describe("getTasks", () => {
    it("should return all tasks from repo", async () => {
      const tasks = [
        { id: 1, title: "A" },
        { id: 2, title: "B" },
      ];
      mockGetAllTasks.mockResolvedValue(tasks);

      const result = await service.getTasks();

      expect(result).toEqual(tasks);
    });
  });

  describe("getTaskById", () => {
    it("should return a task when found", async () => {
      const task = { id: 1, title: "Task" };
      mockGetTaskById.mockResolvedValue(task);

      const result = await service.getTaskById(1);

      expect(result).toEqual(task);
    });

    it("should throw ApiError when task not found", async () => {
      mockGetTaskById.mockResolvedValue(null);

      await expect(service.getTaskById(999)).rejects.toMatchObject({
        statusCode: 404,
        message: "Task not found",
      });
    });
  });

  describe("deleteTask", () => {
    it("should return true on successful delete", async () => {
      mockDeleteTask.mockResolvedValue(true);

      const result = await service.deleteTask(1);

      expect(result).toBe(true);
    });

    it("should throw ApiError when task not found", async () => {
      mockDeleteTask.mockResolvedValue(null);

      await expect(service.deleteTask(999)).rejects.toMatchObject({
        statusCode: 404,
        message: "Task not found",
      });
    });
  });

  describe("updateTask", () => {
    it("should update title when provided and non-empty", async () => {
      const updated = { id: 1, title: "New", completed: false };
      mockUpdateTask.mockResolvedValue(updated);

      const result = await service.updateTask(1, { title: "New" });

      expect(repo.updateTask).toHaveBeenCalledWith(1, { title: "New" });
      expect(result).toEqual(updated);
    });

    it("should throw ApiError when title is empty string", async () => {
      await expect(service.updateTask(1, { title: "" })).rejects.toMatchObject({
        statusCode: 404,
        message: "Title cannot be empty",
      });
    });

    it("should update note when provided", async () => {
      mockUpdateTask.mockResolvedValue({ id: 1, note: "abc" });

      await service.updateTask(1, { note: "abc" });

      expect(repo.updateTask).toHaveBeenCalledWith(1, { note: "abc" });
    });

    it("should allow setting note to null", async () => {
      mockUpdateTask.mockResolvedValue({ id: 1, note: null });

      await service.updateTask(1, { note: null });

      expect(repo.updateTask).toHaveBeenCalledWith(1, { note: null });
    });

    it("should update completed when provided", async () => {
      mockUpdateTask.mockResolvedValue({
        id: 1,
        completed: true,
      });

      await service.updateTask(1, { completed: undefined as any });

      // completed is falsy check, so `undefined` won't pass through
      expect(repo.updateTask).toHaveBeenCalledWith(1, {});
    });

    it("should throw ApiError when task does not exist", async () => {
      mockUpdateTask.mockResolvedValue(null);

      await expect(
        service.updateTask(999, { title: "X" }),
      ).rejects.toMatchObject({
        statusCode: 404,
        message: "Task not found",
      });
    });
  });
});
