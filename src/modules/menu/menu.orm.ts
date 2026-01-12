import db from "../../db/db";
import { Menu } from "./menu.types";
import { ERRORS } from "../../errors";
import { getActiveMenuId } from "../../db/helper";

/**
 * Fetch active menu for a restaurant (all active items)
 */
export const menuOrm = {
  fetchMenu(restaurant_id: number): Menu {
    // get active menu (latest version)
    const menuId = getActiveMenuId(restaurant_id);
    const items = db
      .prepare(
        `
        SELECT
          mim.id,
          mim.name
        FROM menu_items mi
        JOIN menu_items_master mim
          ON mim.id = mi.menu_item_id
        WHERE mi.menu_id = ?
          AND mi.is_active = 1
          AND mim.id NOT IN (
            SELECT menu_item_id
            FROM menu_item_oos
          )
        `
      )
      .all(menuId);

    return {
      id: menuId,
      items,
    } as Menu;
  },

  /**
   * Mark ingredient out of stock
   * → all menu items using this ingredient become unavailable (per device if needed later)
   */
  markIngredientOutOfStock(restaurant_id: number, ingredient: string): Menu {
    const ingredientRow = db
      .prepare(
        `
        SELECT id
        FROM ingredients
        WHERE name = ?
        `
      )
      .get(ingredient) as { id: number } | undefined;

    if (!ingredientRow) {
      throw ERRORS.INGREDIENT_NOT_FOUND;
    }

    const menuId = getActiveMenuId(restaurant_id);

    const affectedItems = db
      .prepare(
        `
        SELECT DISTINCT mi.menu_item_id
        FROM menu_items mi
        JOIN menu_item_ingredients mii
          ON mii.menu_item_id = mi.menu_item_id
        WHERE mi.menu_id = ?
          AND mii.ingredient_id = ?
        `
      )
      .all(menuId, ingredientRow.id) as { menu_item_id: number }[];

    if (affectedItems.length === 0) {
      throw ERRORS.INGREDIENT_NOT_FOUND;
    }

    const insertOOS = db.prepare(
      `
      INSERT OR IGNORE INTO menu_item_oos (menu_item_id, device)
      VALUES (?, 'ALL')
      `
    );

    const txn = db.transaction(() => {
      for (const item of affectedItems) {
        insertOOS.run(item.menu_item_id);
      }
    });

    txn();

    return this.fetchMenu(restaurant_id);
  },

  /**
   * Mark ingredient back in stock
   */
  markIngredientBackInStock(restaurant_id: number, ingredient: string): Menu {
    const ingredientRow = db
      .prepare(
        `
        SELECT id
        FROM ingredients
        WHERE name = ?
        `
      )
      .get(ingredient) as { id: number } | undefined;

    if (!ingredientRow) {
      throw ERRORS.INGREDIENT_NOT_FOUND;
    }

    const menuId = getActiveMenuId(restaurant_id);

    const result = db
      .prepare(
        `
        DELETE FROM menu_item_oos
        WHERE menu_item_id IN (
          SELECT mi.menu_item_id
          FROM menu_items mi
          JOIN menu_item_ingredients mii
            ON mii.menu_item_id = mi.menu_item_id
          WHERE mi.menu_id = ?
            AND mii.ingredient_id = ?
        )
        `
      )
      .run(menuId, ingredientRow.id);

    if (result.changes === 0) {
      throw ERRORS.INGREDIENT_NOT_FOUND;
    }

    return this.fetchMenu(restaurant_id);
  },

  /**
   * Remove item from menu (soft delete)
   */
  removeItem(restaurant_id: number, item_name: string): Menu {
    const menuId = getActiveMenuId(restaurant_id);

    const result = db
      .prepare(
        `
        UPDATE menu_items
        SET is_active = 0
        WHERE menu_id = ?
          AND menu_item_id = (
            SELECT id
            FROM menu_items_master
            WHERE name = ?
          )
        `
      )
      .run(menuId, item_name);

    if (result.changes === 0) {
      throw ERRORS.MENU_ITEM_NOT_FOUND;
    }

    return this.fetchMenu(restaurant_id);
  },
};
