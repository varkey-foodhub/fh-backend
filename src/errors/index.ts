// errors/errors.ts
import { AppError } from "./AppError";

export const ERRORS = {
  INVALID_EMAIL: new AppError("INVALID_EMAIL"),
  RESTAURANT_NOT_FOUND: new AppError("RESTAURANT_NOT_FOUND"),
  UNAUTHORIZED: new AppError("UNAUTHORIZED"),
  MENU_NOT_FOUND: new AppError("MENU_NOT_FOUND"),
  INGREDIENT_NOT_FOUND: new AppError("INGREDIENT_NOT_FOUND"),
  MENU_ITEM_NOT_FOUND: new AppError("MENU_ITEM_NOT_FOUND"),
  INVALID_DEVICE: new AppError("INVALID_DEVICE"),
  VALIDATION_ERROR: new AppError("VALIDATION_ERROR")
} as const;
