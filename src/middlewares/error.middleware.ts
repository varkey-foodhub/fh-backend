// middleware/error.middleware.ts
import type { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";
import { ERROR_MAP } from "../errors/errorMap";

export function errorMiddleware(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  // Known application error
  if (err instanceof AppError) {
    const mapped = ERROR_MAP[err.code as keyof typeof ERROR_MAP];

    return res.status(mapped?.statusCode ?? err.statusCode).json({
      error: err.code,
      message: err.message ?? mapped?.message
    });
  }

  // Unknown / programmer / infra error
  console.error("Unhandled error:", err);

  return res.status(500).json({
    error: "INTERNAL_SERVER_ERROR",
    message: "Something went wrong"
  });
}
