// errors/index.ts
import { AppError } from "./AppError";

export class ValidationError extends AppError {
  constructor(message = "Validation failed") {
    super(message, "VALIDATION_ERROR", 400);
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Not found") {
    super(message, "NOT_FOUND", 404);
  }
}

export class BadRequest extends AppError{
  constructor(message = "Bad Reuqest"){
    super(message,"BAD_REQUEST",400)
  }
}
