import { ApiError } from "./ApiError.js";
import { describe, it, expect } from "@jest/globals";

describe("ApiError", () => {
  it("should create an instance with statusCode and message", () => {
    const error = new ApiError(404, "Not found");

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(ApiError);
    expect(error.statusCode).toBe(404);
    expect(error.message).toBe("Not found");
  });

  it("should have a stack trace", () => {
    const error = new ApiError(500, "Server error");
    expect(error.stack).toBeDefined();
  });

  it("should work with arbitrary status codes", () => {
    expect(new ApiError(400, "Bad").statusCode).toBe(400);
    expect(new ApiError(401, "Unauth").statusCode).toBe(401);
    expect(new ApiError(500, "Oops").statusCode).toBe(500);
  });
});
