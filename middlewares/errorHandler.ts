import type { Request, Response, NextFunction } from "express";

import { ApiError } from "../utils/ApiError.js";

type ExpressHttpError = Error & {
  status?: number;
  statusCode?: number;
  type?: string;
};

export const errorHandler = (
  err: ExpressHttpError | ApiError,
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

  if (
    err.status === 413 ||
    err.statusCode === 413 ||
    err.type === "entity.too.large"
  ) {
    return res.status(413).json({
      success: false,
      statusCode: 413,
      error: "Request body is too large",
    });
  }

  if (err instanceof SyntaxError) {
    return res.status(400).json({
      success: false,
      statusCode: 400,
      error: "Request body contains invalid JSON",
    });
  }

  console.error("Unknown Error", err);

  return res.status(500).json({
    success: false,
    statusCode: 500,
    error: "Internal Server Error",
  });
};
