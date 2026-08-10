import { errorHandler } from "./errorHandler.js";
import { ApiError } from "../utils/ApiError.js";
import type { Request, Response, NextFunction } from "express";
import {
  describe,
  it,
  expect,
  jest,
  beforeEach,
  afterEach,
} from "@jest/globals";

describe("errorHandler", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn().mockReturnValue({});
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });
    req = {};
    res = { status: statusMock } as unknown as Response;
    next = jest.fn();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should return ApiError status and message as JSON", () => {
    const err = new ApiError(404, "Not found");

    errorHandler(err, req as Request, res as Response, next);

    expect(statusMock).toHaveBeenCalledWith(404);
    expect(jsonMock).toHaveBeenCalledWith({
      success: false,
      statusCode: 404,
      error: "Not found",
    });
  });

  it("should return 500 for non-ApiError errors", () => {
    const err = new Error("Something broke");

    errorHandler(err, req as Request, res as Response, next);

    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({
      success: false,
      statusCode: 500,
      error: "Internal Server Error",
    });
  });
});
