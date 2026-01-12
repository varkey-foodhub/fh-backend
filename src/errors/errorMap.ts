// errors/errorMap.ts
export const ERROR_MAP = {
  VALIDATION_ERROR: {
    statusCode: 400,
    message: "Invalid request data",
  },
  UNAUTHORIZED: {
    statusCode: 401,
    message: "Unauthorized",
  },
  FORBIDDEN: {
    statusCode: 403,
    message: "Forbidden",
  },
  NOT_FOUND: {
    statusCode: 404,
    message: "Resource not found",
  },
} as const;
