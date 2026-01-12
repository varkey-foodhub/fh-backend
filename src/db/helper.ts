import db from "./db";
import { ERRORS } from "../errors";

export function getActiveMenuId(restaurant_id: number): number {
  const menu = db
    .prepare(
      `
      SELECT id
      FROM menus
      WHERE restaurant_id = ?
        AND is_active = 1
      ORDER BY version DESC
      LIMIT 1
      `
    )
    .get(restaurant_id) as { id: number } | undefined;

  if (!menu) {
    throw ERRORS.MENU_NOT_FOUND;
  }

  return menu.id;
}
