import type { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError.js";

export const errorHandler = (
  err: Error | ApiError,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      statusCode: err.statusCode,
      error: err.message,
    });
  }

  console.error("Unknown Error", err);

  return res.status(500).json({
    success: false,
    statusCode: 500,
    error: "Internal Server Error",
  });
};
