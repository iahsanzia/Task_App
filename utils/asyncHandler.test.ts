import { asyncHandler } from "./asyncHandler.js";
import type { Request, Response, NextFunction } from "express";
import { describe, it, expect, jest, beforeEach } from "@jest/globals";

describe("asyncHandler", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    req = {};
    res = {};
    next = jest.fn();
  });

  it("should call the wrapped function with req, res, next", async () => {
    const fn = jest
      .fn<(req: Request, res: Response, next: NextFunction) => Promise<void>>()
      .mockResolvedValue(undefined);
    const handler = asyncHandler(fn);
    await handler(
      req as Request,
      res as Response,
      next as unknown as NextFunction,
    );

    expect(fn).toHaveBeenCalledWith(req as Request, res as Response, next);
  });

  it("should forward rejected promises to next()", async () => {
    const error = new Error("boom");
    const fn = jest
      .fn<(req: Request, res: Response, next: NextFunction) => Promise<void>>()
      .mockRejectedValue(error);
    const handler = asyncHandler(fn);
    await handler(
      req as Request,
      res as Response,
      next as unknown as NextFunction,
    );

    expect(next).toHaveBeenCalledWith(error);
  });

  it("should return a function", () => {
    const handler = asyncHandler(jest.fn());
    expect(typeof handler).toBe("function");
  });
});
