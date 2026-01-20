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
  MENU_ITEM_NOT_FOUND: {
    statusCode: 404,
    message: "Menu Item not found",
  },

  UNAUTHORIZED: {
    statusCode: 401,
    message: "Unauthorized",
  },
  INVALID_DEVICE: {
    statusCode: 404,
    message: "Device not found",
  },
  VALIDATION_ERROR: {
    statusCode: 500,
    message: "Invalid data passed",
  },
} as const;

export type ErrorCode = keyof typeof ERROR_MAP;
