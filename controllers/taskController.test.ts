import type { Request, Response, NextFunction } from "express";
import { describe, it, expect, jest, beforeEach } from "@jest/globals";

// Explicit typed mocks so .mockResolvedValue(...) doesn't collapse to `never`
const mockCreateTask = jest.fn<(...args: any[]) => Promise<any>>();
const mockGetTasks = jest.fn<(...args: any[]) => Promise<any>>();
const mockGetTaskById = jest.fn<(...args: any[]) => Promise<any>>();
const mockDeleteTask = jest.fn<(...args: any[]) => Promise<any>>();
const mockUpdateTask = jest.fn<(...args: any[]) => Promise<any>>();

jest.unstable_mockModule("../services/taskService.js", () => ({
  createTask: mockCreateTask,
  getTasks: mockGetTasks,
  getTaskById: mockGetTaskById,
  deleteTask: mockDeleteTask,
  updateTask: mockUpdateTask,
}));

// Dynamic import AFTER the mock is registered
const controller = await import("./taskController.js");

describe("taskController", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;
  let jsonMock: jest.Mock<(body?: any) => Response>;
  let statusMock: jest.Mock<(code: number) => Response>;

  beforeEach(() => {
    jsonMock = jest.fn<(body?: any) => Response>();
    statusMock = jest
      .fn<(code: number) => Response>()
      .mockReturnValue({ json: jsonMock } as unknown as Response);
    req = { body: {}, params: {} };
    res = { status: statusMock, json: jsonMock } as unknown as Response;
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe("createTask", () => {
    it("should create a task and return 201", async () => {
      req.body = { title: "Hello", note: "world" };
      const created = { id: 1, title: "Hello", note: "world" };
      mockCreateTask.mockResolvedValue(created);

      await controller.createTask(
        req as Request,
        res as Response,
        next as unknown as NextFunction,
      );

      expect(mockCreateTask).toHaveBeenCalledWith("Hello", "world");
      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith(created);
      expect(next).not.toHaveBeenCalled();
    });

    it("should call next with ApiError when title is missing", async () => {
      req.body = {};

      await controller.createTask(
        req as Request,
        res as Response,
        next as unknown as NextFunction,
      );

      expect(mockCreateTask).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 400,
          message: "Title is Required",
        }),
      );
    });
  });

  describe("getTasks", () => {
    it("should return all tasks with 200", async () => {
      const tasks = [{ id: 1, title: "A" }];
      mockGetTasks.mockResolvedValue(tasks);

      await controller.getTasks(
        req as Request,
        res as Response,
        next as unknown as NextFunction,
      );

      expect(mockGetTasks).toHaveBeenCalled();
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(tasks);
    });
  });

  describe("getTaskById", () => {
    it("should return a task with 200", async () => {
      req.params = { id: "1" };
      const task = { id: 1, title: "Task" };
      mockGetTaskById.mockResolvedValue(task);

      await controller.getTaskById(
        req as Request,
        res as Response,
        next as unknown as NextFunction,
      );

      expect(mockGetTaskById).toHaveBeenCalledWith(1);
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(task);
    });

    it("should call next with ApiError when id is NaN", async () => {
      req.params = { id: "abc" };

      await controller.getTaskById(
        req as Request,
        res as Response,
        next as unknown as NextFunction,
      );

      expect(mockGetTaskById).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 400,
          message: "Invalid task ID",
        }),
      );
    });
  });

  describe("deleteTask", () => {
    it("should delete a task and return 200 with message", async () => {
      req.params = { id: "1" };
      mockDeleteTask.mockResolvedValue(true);

      await controller.deleteTask(
        req as Request,
        res as Response,
        next as unknown as NextFunction,
      );

      expect(mockDeleteTask).toHaveBeenCalledWith(1);
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        message: "Task has been deleted",
      });
    });

    it("should call next with ApiError when id is NaN", async () => {
      req.params = { id: "xyz" };

      await controller.deleteTask(
        req as Request,
        res as Response,
        next as unknown as NextFunction,
      );

      expect(mockDeleteTask).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 400,
          message: "Invalid task ID",
        }),
      );
    });
  });

  describe("updateTask", () => {
    it("should update a task and return the result", async () => {
      req.params = { id: "1" };
      req.body = { title: "Updated", note: "new", completed: true };
      const updated = { id: 1, title: "Updated", note: "new", completed: true };
      mockUpdateTask.mockResolvedValue(updated);

      await controller.updateTask(
        req as Request,
        res as Response,
        next as unknown as NextFunction,
      );

      expect(mockUpdateTask).toHaveBeenCalledWith(1, {
        title: "Updated",
        note: "new",
        completed: true,
      });
      expect(jsonMock).toHaveBeenCalledWith(updated);
    });

    it("should call next with ApiError when id is NaN", async () => {
      req.params = { id: "not-a-number" };

      await controller.updateTask(
        req as Request,
        res as Response,
        next as unknown as NextFunction,
      );

      expect(mockUpdateTask).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 400,
          message: "Invalid task ID",
        }),
      );
    });
  });
});
