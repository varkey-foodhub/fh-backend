// errors/AppError.ts
export class AppError extends Error {
    public readonly code: string;
    public readonly statusCode: number;
  
    constructor(message: string, code: string, statusCode: number) {
      super(message);
      this.code = code;
      this.statusCode = statusCode;
  
      Error.captureStackTrace(this, this.constructor);
    }
  }
  