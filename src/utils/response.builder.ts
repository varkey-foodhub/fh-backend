// utils/response.ts
import { Response } from "express";

export function sendResponse<T>(
  res: Response,
  options: {
    statusCode?: number;
    data?: T;
    message?: string;
    meta?: Record<string, unknown>;
  }
) {
  const {
    statusCode = 200,
    data = null,
    message = "OK",
    meta,
  } = options;

  return res.status(statusCode).json({
    success: true,
    message,
    data,
    ...(meta && { meta }),
  });
}
