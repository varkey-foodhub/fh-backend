// errors/errorMap.ts
export const ERROR_MAP = {
  INVALID_EMAIL: {
    statusCode: 400,
    message: "Invalid email address",
  },

  RESTAURANT_NOT_FOUND: {
    statusCode: 404,
    message: "Restaurant not found",
  },
  MENU_NOT_FOUND: {
    statusCode: 404,
    message: "Menu not found",
  },
  INGREDIENT_NOT_FOUND: {
    statusCode: 404,
    message: "Ingredient not found",
  },

  UNAUTHORIZED: {
    statusCode: 401,
    message: "Unauthorized",
  },
} as const;

export type ErrorCode = keyof typeof ERROR_MAP;
