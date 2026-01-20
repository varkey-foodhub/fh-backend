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
        mi.name AS item_name,
        mi.out_of_stock,
        
        JSON_OBJECTAGG(
          COALESCE(d.device_type, 'UNKNOWN'),
          mi.price
        ) AS price,

        COALESCE(
          (
            SELECT JSON_ARRAYAGG(i.name)
            FROM menu_item_ingredients mii
            JOIN ingredients i ON i.id = mii.ingredient_id
            WHERE mii.menu_item_id = (
              SELECT id FROM menu_items 
              WHERE menu_id = ? AND is_active = 1 AND name = mi.name 
              LIMIT 1
            )
            AND mii.out_of_stock = 0
          ),
          JSON_ARRAY()
        ) AS ingredients,

        COALESCE(
          (
            SELECT JSON_ARRAYAGG(i.name)
            FROM menu_item_ingredients mii
            JOIN ingredients i ON i.id = mii.ingredient_id
            WHERE mii.menu_item_id = (
              SELECT id FROM menu_items 
              WHERE menu_id = ? AND is_active = 1 AND name = mi.name 
              LIMIT 1
            )
            AND mii.out_of_stock = 1
          ),
          JSON_ARRAY()
        ) AS out_of_stock_items

      FROM menu_items mi
      LEFT JOIN devices d ON d.id = mi.device_id

      WHERE mi.menu_id = ?
        AND mi.is_active = 1

      GROUP BY mi.name, mi.out_of_stock
      `,
      [menuId, menuId, menuId]
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
      SELECT DISTINCT mi.id
      FROM menu_items mi
      JOIN menu_item_ingredients mii
        ON mii.menu_item_id = mi.id
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
          `UPDATE menu_items SET out_of_stock = 1 WHERE id = ?`,
          [item.id]
        );

        await conn.execute(
          `
          UPDATE menu_item_ingredients
          SET out_of_stock = 1
          WHERE menu_item_id = ? AND ingredient_id = ?
          `,
          [item.id, ingredientRow.id]
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
        UPDATE menu_item_ingredients
        SET out_of_stock = 0
        WHERE ingredient_id = ?
          AND menu_item_id IN (
            SELECT item_id FROM (
              SELECT mi.id as item_id
              FROM menu_items mi
              JOIN menu_item_ingredients mii
                ON mii.menu_item_id = mi.id
              WHERE mi.menu_id = ?
                AND mi.is_active = 1
                AND mii.ingredient_id = ?
            ) AS derived
          )
        `,
        [ingredientRow.id, menuId, ingredientRow.id]
      );

      // Check if any items still have out_of_stock ingredients
      const [itemsWithOos] = await conn.query<RowDataPacket[]>(
        `
        SELECT DISTINCT mi.id
        FROM menu_items mi
        JOIN menu_item_ingredients mii
          ON mii.menu_item_id = mi.id
        WHERE mii.out_of_stock = 1
        `
      );

      const itemsWithOosSet = new Set(itemsWithOos.map(row => row.id));

      // Get all affected items
      const [affectedItems] = await conn.query<RowDataPacket[]>(
        `
        SELECT DISTINCT mi.id
        FROM menu_items mi
        JOIN menu_item_ingredients mii
          ON mii.menu_item_id = mi.id
        WHERE mi.menu_id = ?
          AND mi.is_active = 1
          AND mii.ingredient_id = ?
        `,
        [menuId, ingredientRow.id]
      );

      for (const item of affectedItems) {
        if (!itemsWithOosSet.has(item.id)) {
          await conn.execute(
            `UPDATE menu_items SET out_of_stock = 0 WHERE id = ?`,
            [item.id]
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
        AND name = ?
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

    const [deviceRows] = await db.query<RowDataPacket[]>(
      `SELECT id FROM devices WHERE UPPER(device_type) = UPPER(?)`,
      [device]
    );

    const deviceRow = deviceRows[0] as { id: number } | undefined;

    if (!deviceRow) throw ERRORS.INVALID_DEVICE;

    const [result] = await db.execute<ResultSetHeader>(
      `
      UPDATE menu_items
      SET price = ?
      WHERE menu_id = ?
        AND is_active = 1
        AND name = ?
        AND device_id = ?
      `,
      [price, menuId, item_name, deviceRow.id]
    );

    if (result.affectedRows === 0) {
      throw ERRORS.MENU_ITEM_NOT_FOUND;
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
      SELECT mi.id
      FROM menu_items mi
      WHERE mi.menu_id = ?
        AND mi.is_active = 1
        AND mi.name = ?
      LIMIT 1
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
            (menu_item_id, ingredient_id, out_of_stock)
            VALUES (?, ?, 0)
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