import db from "../../db/db";
import { Menu } from "./menu.types";
import { ERRORS } from "../../errors";
import { getActiveMenuId } from "../../db/helper";
import { RowDataPacket, ResultSetHeader } from "mysql2";

export const menuOrm = {
  /**
   * Fetch active menu for a restaurant (MySQL version)
   */
  async fetchMenu(restaurant_id: number): Promise<Menu> {
    // FIX: Added await here
    const menuId = await getActiveMenuId(restaurant_id);

    const [rows] = await db.query<RowDataPacket[]>(
      `
      SELECT
        mim.id AS item_id,
        mim.name AS item_name,
        mim.out_of_stock,

        JSON_OBJECTAGG(
          UPPER(mip.device),
          mip.price
        ) AS price,

        COALESCE(
          (
            SELECT JSON_ARRAYAGG(i.name)
            FROM menu_item_ingredients mii
            JOIN ingredients i ON i.id = mii.ingredient_id
            WHERE mii.menu_item_id = mim.id
          ),
          JSON_ARRAY()
        ) AS ingredients,

        COALESCE(
          (
            SELECT JSON_ARRAYAGG(i.name)
            FROM menu_item_out_of_stock_ingredients miosi
            JOIN ingredients i ON i.id = miosi.ingredient_id
            WHERE miosi.menu_item_id = mim.id
          ),
          JSON_ARRAY()
        ) AS out_of_stock_items

      FROM menu_items mi
      JOIN menu_items_master mim ON mim.id = mi.menu_item_id
      JOIN menu_item_prices mip ON mip.menu_item_id = mim.id

      WHERE mi.menu_id = ?
        AND mi.is_active = 1

      GROUP BY mim.id, mim.name, mim.out_of_stock
      `,
      [menuId]
    );

    // Helper to safely parse JSON if MySQL returns it as a string
    const parseJson = (val: any) => (typeof val === 'string' ? JSON.parse(val) : val);

    const items = rows.map((row) => ({
      name: row.item_name,
      price: [parseJson(row.price)],
      ingredients: parseJson(row.ingredients) ?? [],
      out_of_stock: !!row.out_of_stock,
      out_of_stock_items: parseJson(row.out_of_stock_items) ?? [],
    }));

    return { items };
  },

  /**
   * Mark ingredient OUT OF STOCK
   */
  async markIngredientOutOfStock(
    restaurant_id: number,
    ingredient: string
  ): Promise<Menu> {
    const [rows] = await db.query<RowDataPacket[]>(
      `SELECT id FROM ingredients WHERE name = ?`,
      [ingredient]
    );

    const ingredientRow = rows[0] as { id: number } | undefined;

    if (!ingredientRow) throw ERRORS.INGREDIENT_NOT_FOUND;

    // FIX: Added await here
    const menuId = await getActiveMenuId(restaurant_id);

    const [affectedItems] = await db.query<RowDataPacket[]>(
      `
      SELECT DISTINCT mi.menu_item_id
      FROM menu_items mi
      JOIN menu_item_ingredients mii
        ON mii.menu_item_id = mi.menu_item_id
      WHERE mi.menu_id = ?
        AND mi.is_active = 1
        AND mii.ingredient_id = ?
      `,
      [menuId, ingredientRow.id]
    );

    if (affectedItems.length === 0) {
      throw ERRORS.INGREDIENT_NOT_FOUND;
    }

    const conn = await db.getConnection();
    await conn.beginTransaction();

    try {
      for (const item of affectedItems) {
        await conn.execute(
          `UPDATE menu_items_master SET out_of_stock = 1 WHERE id = ?`,
          [item.menu_item_id]
        );

        await conn.execute(
          `
          INSERT IGNORE INTO menu_item_out_of_stock_ingredients
          (menu_item_id, ingredient_id)
          VALUES (?, ?)
          `,
          [item.menu_item_id, ingredientRow.id]
        );
      }

      await conn.commit();
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }

    return this.fetchMenu(restaurant_id);
  },

  /**
   * Mark ingredient BACK IN STOCK
   */
  async markIngredientBackInStock(
    restaurant_id: number,
    ingredient: string
  ): Promise<Menu> {
    const [rows] = await db.query<RowDataPacket[]>(
      `SELECT id FROM ingredients WHERE name = ?`,
      [ingredient]
    );

    const ingredientRow = rows[0] as { id: number } | undefined;

    if (!ingredientRow) throw ERRORS.INGREDIENT_NOT_FOUND;

    // FIX: Added await here
    const menuId = await getActiveMenuId(restaurant_id);

    const conn = await db.getConnection();
    await conn.beginTransaction();

    try {
      await conn.execute(
        `
        DELETE FROM menu_item_out_of_stock_ingredients
        WHERE ingredient_id = ?
          AND menu_item_id IN (
            SELECT mi.menu_item_id
            FROM menu_items mi
            JOIN menu_item_ingredients mii
              ON mii.menu_item_id = mi.menu_item_id
            WHERE mi.menu_id = ?
              AND mi.is_active = 1
              AND mii.ingredient_id = ?
          )
        `,
        [ingredientRow.id, menuId, ingredientRow.id]
      );

      await conn.execute(
        `
        UPDATE menu_items_master mim
        LEFT JOIN menu_item_out_of_stock_ingredients miosi
          ON miosi.menu_item_id = mim.id
        SET mim.out_of_stock = 0
        WHERE miosi.menu_item_id IS NULL
        `
      );

      await conn.commit();
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }

    return this.fetchMenu(restaurant_id);
  },

  /**
   * Remove item from menu
   */
  async removeItem(
    restaurant_id: number,
    item_name: string
  ): Promise<Menu> {
    // FIX: Added await here
    const menuId = await getActiveMenuId(restaurant_id);

    const [result] = await db.execute<ResultSetHeader>(
      `
      UPDATE menu_items
      SET is_active = 0
      WHERE menu_id = ?
        AND menu_item_id = (
          SELECT id FROM menu_items_master WHERE name = ?
        )
      `,
      [menuId, item_name]
    );

    if (result.affectedRows === 0) {
      throw ERRORS.MENU_ITEM_NOT_FOUND;
    }

    return this.fetchMenu(restaurant_id);
  },

  /**
   * Update item price
   */
  async updateItemPrice(
    restaurant_id: number,
    item_name: string,
    device: string,
    price: number
  ): Promise<Menu> {
    // FIX: Added await here
    const menuId = await getActiveMenuId(restaurant_id);

    const [rows] = await db.query<RowDataPacket[]>(
      `
      SELECT mim.id
      FROM menu_items mi
      JOIN menu_items_master mim ON mim.id = mi.menu_item_id
      WHERE mi.menu_id = ?
        AND mi.is_active = 1
        AND mim.name = ?
      `,
      [menuId, item_name]
    );

    const itemRow = rows[0] as { id: number } | undefined;

    if (!itemRow) throw ERRORS.MENU_ITEM_NOT_FOUND;

    const [result] = await db.execute<ResultSetHeader>(
      `
      UPDATE menu_item_prices
      SET price = ?
      WHERE menu_item_id = ?
        AND UPPER(device) = UPPER(?)
      `,
      [price, itemRow.id, device]
    );

    if (result.affectedRows === 0) {
      throw ERRORS.INVALID_DEVICE;
    }

    return this.fetchMenu(restaurant_id);
  },

  /**
   * Update item ingredients
   */
  async updateItemIngredients(
    restaurant_id: number,
    item_name: string,
    ingredients: string[]
  ): Promise<Menu> {
    // FIX: Added await here
    const menuId = await getActiveMenuId(restaurant_id);
    
    const [rows] = await db.query<RowDataPacket[]>(
      `
      SELECT mim.id
      FROM menu_items mi
      JOIN menu_items_master mim ON mim.id = mi.menu_item_id
      WHERE mi.menu_id = ?
        AND mi.is_active = 1
        AND mim.name = ?
      `,
      [menuId, item_name]
    );

    const itemRow = rows[0] as { id: number } | undefined;

    if (!itemRow) throw ERRORS.MENU_ITEM_NOT_FOUND;

    const conn = await db.getConnection();
    await conn.beginTransaction();

    try {
      for (const ing of ingredients) {
        await conn.execute(
          `INSERT IGNORE INTO ingredients (name) VALUES (?)`,
          [ing]
        );
      }

      if (ingredients.length > 0) {
        await conn.query(
          `
          DELETE FROM menu_item_ingredients
          WHERE menu_item_id = ?
            AND ingredient_id NOT IN (
              SELECT id FROM ingredients WHERE name IN (?)
            )
          `,
          [itemRow.id, ingredients]
        );
      } else {
        await conn.execute(
            `DELETE FROM menu_item_ingredients WHERE menu_item_id = ?`,
            [itemRow.id]
        );
      }

      if (ingredients.length > 0) {
        const [ingredientRows] = await conn.query<RowDataPacket[]>(
          `SELECT id FROM ingredients WHERE name IN (?)`,
          [ingredients]
        );

        for (const ing of ingredientRows) {
          await conn.execute(
            `
            INSERT IGNORE INTO menu_item_ingredients
            (menu_item_id, ingredient_id)
            VALUES (?, ?)
            `,
            [itemRow.id, ing.id]
          );
        }
      }

      await conn.commit();
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }

    return this.fetchMenu(restaurant_id);
  },
};