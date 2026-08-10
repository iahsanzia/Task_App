import { describe, it, expect, jest, beforeEach } from "@jest/globals";

const mockFetchJSON = jest.fn<(...args: any[]) => Promise<any>>();

jest.unstable_mockModule("../utils/helper.js", () => ({
  fetchJSON: mockFetchJSON,
}));

// Dynamic import AFTER the mock is registered
const { getTasks, getTaskById, createTask, updateTask, deleteTask } =
  await import("./tasksApi.js");

describe("tasksApi", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getTasks", () => {
    it("should call fetchJSON with the base URL", async () => {
      const tasks = [{ id: 1, title: "Task" }];
      mockFetchJSON.mockResolvedValue(tasks);

      const result = await getTasks();

      expect(mockFetchJSON).toHaveBeenCalledWith("http://localhost:3000/tasks");
      expect(result).toEqual(tasks);
    });
  });

  describe("getTaskById", () => {
    it("should call fetchJSON with the task URL", async () => {
      const task = { id: 5, title: "Task 5" };
      mockFetchJSON.mockResolvedValue(task);

      const result = await getTaskById(5);

      expect(mockFetchJSON).toHaveBeenCalledWith(
        "http://localhost:3000/tasks/5",
      );
      expect(result).toEqual(task);
    });
  });

  describe("createTask", () => {
    it("should POST with title and note", async () => {
      mockFetchJSON.mockResolvedValue({ id: 1, title: "New" });

      await createTask("New", "details");

      expect(mockFetchJSON).toHaveBeenCalledWith(
        "http://localhost:3000/tasks",
        {
          method: "POST",
          body: JSON.stringify({ title: "New", note: "details" }),
        },
      );
    });

    it("should POST without note when not provided", async () => {
      mockFetchJSON.mockResolvedValue({ id: 2, title: "No note" });

      await createTask("No note");

      expect(mockFetchJSON).toHaveBeenCalledWith(
        "http://localhost:3000/tasks",
        {
          method: "POST",
          body: JSON.stringify({ title: "No note" }),
        },
      );
    });
  });

  describe("updateTask", () => {
    it("should PATCH with the given updates", async () => {
      mockFetchJSON.mockResolvedValue({ id: 1, completed: true });

      await updateTask(1, { completed: true });

      expect(mockFetchJSON).toHaveBeenCalledWith(
        "http://localhost:3000/tasks/1",
        {
          method: "PATCH",
          body: JSON.stringify({ completed: true }),
        },
      );
    });
  });

  describe("deleteTask", () => {
    it("should DELETE the task", async () => {
      mockFetchJSON.mockResolvedValue(undefined);

      await deleteTask(3);

      expect(mockFetchJSON).toHaveBeenCalledWith(
        "http://localhost:3000/tasks/3",
        {
          method: "DELETE",
        },
      );
    });
  });
});
