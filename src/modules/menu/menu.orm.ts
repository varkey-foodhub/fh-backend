import db from "../../db/db";
import { Menu } from "./menu.types";
import { ERRORS } from "../../errors";
import { getActiveMenuId } from "../../db/helper";

/**
 * Fetch active menu for a restaurant (all active items)
 */
export const menuOrm = {
  fetchMenu(restaurant_id: number): Menu {
    const menuId = getActiveMenuId(restaurant_id);

    const rows = db
      .prepare(
        `
        SELECT
  mim.id AS item_id,
  mim.name AS item_name,
  mim.out_of_stock,

  json_group_object(
    UPPER(mip.device),
    mip.price
  ) AS price,

  (
    SELECT json_group_array(i.name)
    FROM menu_item_ingredients mii
    JOIN ingredients i ON i.id = mii.ingredient_id
    WHERE mii.menu_item_id = mim.id
  ) AS ingredients,

  json('[]') AS out_of_stock_items

FROM menu_items mi
JOIN menu_items_master mim
  ON mim.id = mi.menu_item_id
JOIN menu_item_prices mip
  ON mip.menu_item_id = mim.id

WHERE mi.menu_id = ?
  AND mi.is_active = 1

GROUP BY mim.id, mim.name, mim.out_of_stock;


        `
      )
      .all(menuId) as any[];

    const items = rows.map((row) => ({
      name: row.item_name,
      price: [JSON.parse(row.price)], // array with single object
      ingredients: JSON.parse(row.ingredients),
      out_of_stock: !!row.out_of_stock,
      out_of_stock_items: [],
    }));

    return {
      id: menuId,
      items,
    } as Menu;
  },

  /**
   * Mark ingredient out of stock
   * → all menu items using this ingredient become unavailable
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
          AND mi.is_active = 1
          AND mii.ingredient_id = ?
        `
      )
      .all(menuId, ingredientRow.id) as { menu_item_id: number }[];

    if (affectedItems.length === 0) {
      throw ERRORS.INGREDIENT_NOT_FOUND;
    }

    const updateOOS = db.prepare(
      `
      UPDATE menu_items_master
      SET out_of_stock = 1
      WHERE id = ?
      `
    );

    const txn = db.transaction(() => {
      for (const item of affectedItems) {
        updateOOS.run(item.menu_item_id);
      }
    });

    txn();

    return this.fetchMenu(restaurant_id);
  },

  /**
   * Mark ingredient back in stock
   * → all affected items become available again
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
        UPDATE menu_items_master
        SET out_of_stock = 0
        WHERE id IN (
          SELECT DISTINCT mi.menu_item_id
          FROM menu_items mi
          JOIN menu_item_ingredients mii
            ON mii.menu_item_id = mi.menu_item_id
          WHERE mi.menu_id = ?
            AND mi.is_active = 1
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
  /**
   * Update price for a specific device for a menu item
   */
  updateItemPrice(
    restaurant_id: number,
    item_name: string,
    device: string,
    price: number
  ): Menu {
    const menuId = getActiveMenuId(restaurant_id);
    // Ensure item exists in active menu
    const itemRow = db
      .prepare(
        `
      SELECT mim.id
      FROM menu_items mi
      JOIN menu_items_master mim
        ON mim.id = mi.menu_item_id
      WHERE mi.menu_id = ?
        AND mi.is_active = 1
        AND mim.name = ?
      `
      )
      .get(menuId, item_name) as { id: number } | undefined;

    if (!itemRow) {
      throw ERRORS.MENU_ITEM_NOT_FOUND;
    }

    const result = db
      .prepare(
        `
      UPDATE menu_item_prices
      SET price = ?
      WHERE menu_item_id = ?
        AND UPPER(device) = UPPER(?)
      `
      )
      .run(price, itemRow.id, device);
    if (result.changes === 0) {
      throw ERRORS.INVALID_DEVICE;
    }
    return this.fetchMenu(restaurant_id);
  },
};
