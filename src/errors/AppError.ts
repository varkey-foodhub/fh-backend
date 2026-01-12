// errors/AppError.ts
import { ERROR_MAP, ErrorCode } from "./errorMap";

export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;

  constructor(code: ErrorCode, overrideMessage?: string) {
    super(overrideMessage ?? ERROR_MAP[code].message);

    this.code = code;
    this.statusCode = ERROR_MAP[code].statusCode;

    Error.captureStackTrace(this, this.constructor);
  }
}
