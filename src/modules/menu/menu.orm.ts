import db from "../../db/db";
import { Menu } from "./menu.types";
import { ERRORS } from "../../errors";
import { getActiveMenuId } from "../../db/helper";
import { RowDataPacket, ResultSetHeader } from "mysql2";

export const menuOrm = {
  /**
   * Fetch active menu
   */
  async fetchMenu(restaurant_id: number): Promise<Menu> {
    const menuId = await getActiveMenuId(restaurant_id);

    const [rows] = await db.query<RowDataPacket[]>(
      `
      SELECT
      mi.name AS item_name,
    
      JSON_OBJECTAGG(
        d.device_type,
        mi.price
      ) AS price,
    
      COALESCE(
        (
          SELECT JSON_ARRAYAGG(t.name)
          FROM (
            SELECT DISTINCT i.name
            FROM menu_item_ingredients mii2
            JOIN ingredients i
              ON i.id = mii2.ingredient_id
            WHERE mii2.menu_item_id = MIN(mi.id)
          ) t
        ),
        JSON_ARRAY()
      ) AS ingredients,
    
      COALESCE(
        (
          SELECT JSON_ARRAYAGG(t2.name)
          FROM (
            SELECT DISTINCT i2.name
            FROM menu_item_ingredients mii3
            JOIN ingredients i2
              ON i2.id = mii3.ingredient_id
            WHERE mii3.menu_item_id = MIN(mi.id)
              AND mii3.out_of_stock = 1
          ) t2
        ),
        JSON_ARRAY()
      ) AS out_of_stock_items,
    
      MAX(mi.out_of_stock) AS out_of_stock
    
    FROM menu_items mi
    JOIN devices d
      ON d.id = mi.device_id
    
    WHERE mi.menu_id = ?
      AND mi.is_active = 1
    
    GROUP BY mi.name;
    
      `,
      [menuId]
    );

    const parse = (v: any) => (typeof v === "string" ? JSON.parse(v) : v);

    return {
      items: rows.map((r) => ({
        name: r.item_name,
        price: [parse(r.price)],
        ingredients: parse(r.ingredients) ?? [],
        out_of_stock: !!r.out_of_stock,
        out_of_stock_items: parse(r.out_of_stock_items) ?? [],
      })),
    };
  },

  /**
   * Mark ingredient OUT OF STOCK
   */
  async markIngredientOutOfStock(
    restaurant_id: number,
    ingredient: string
  ): Promise<Menu> {
    const menuId = await getActiveMenuId(restaurant_id);

    const [ingRows] = await db.query<RowDataPacket[]>(
      `SELECT id FROM ingredients WHERE name = ?`,
      [ingredient]
    );

    if (!ingRows[0]) throw ERRORS.INGREDIENT_NOT_FOUND;

    const ingredientId = ingRows[0].id;

    const conn = await db.getConnection();
    await conn.beginTransaction();

    try {
      await conn.execute(
        `
        UPDATE menu_item_ingredients
        SET out_of_stock = 1
        WHERE ingredient_id = ?
          AND menu_item_id IN (
            SELECT id FROM menu_items
            WHERE menu_id = ?
              AND is_active = 1
          )
        `,
        [ingredientId, menuId]
      );

      await conn.execute(
        `
        UPDATE menu_items
        SET out_of_stock = 1
        WHERE id IN (
          SELECT DISTINCT menu_item_id
          FROM menu_item_ingredients
          WHERE ingredient_id = ?
        )
        `,
        [ingredientId]
      );

      await conn.commit();
    } catch (e) {
      await conn.rollback();
      throw e;
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
    const menuId = await getActiveMenuId(restaurant_id);

    const [ingRows] = await db.query<RowDataPacket[]>(
      `SELECT id FROM ingredients WHERE name = ?`,
      [ingredient]
    );

    if (!ingRows[0]) throw ERRORS.INGREDIENT_NOT_FOUND;

    const ingredientId = ingRows[0].id;

    const conn = await db.getConnection();
    await conn.beginTransaction();

    try {
      await conn.execute(
        `
        UPDATE menu_item_ingredients
        SET out_of_stock = 0
        WHERE ingredient_id = ?
          AND menu_item_id IN (
            SELECT id FROM menu_items
            WHERE menu_id = ?
              AND is_active = 1
          )
        `,
        [ingredientId, menuId]
      );

      await conn.execute(
        `
        UPDATE menu_items mi
        LEFT JOIN menu_item_ingredients mii
          ON mi.id = mii.menu_item_id
          AND mii.out_of_stock = 1
        SET mi.out_of_stock = 0
        WHERE mi.menu_id = ?
          AND mii.menu_item_id IS NULL
        `,
        [menuId]
      );

      await conn.commit();
    } catch (e) {
      await conn.rollback();
      throw e;
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
    const menuId = await getActiveMenuId(restaurant_id);

    const [res] = await db.execute<ResultSetHeader>(
      `
      UPDATE menu_items
      SET is_active = 0
      WHERE menu_id = ?
        AND name = ?
      `,
      [menuId, item_name]
    );

    if (res.affectedRows === 0) {
      throw ERRORS.MENU_ITEM_NOT_FOUND;
    }

    return this.fetchMenu(restaurant_id);
  },

  /**
   * Update item price (device-specific)
   */
  async updateItemPrice(
    restaurant_id: number,
    item_name: string,
    device: string,
    price: number
  ): Promise<Menu> {
    const menuId = await getActiveMenuId(restaurant_id);

    const [res] = await db.execute<ResultSetHeader>(
      `
      UPDATE menu_items mi
      JOIN devices d
        ON d.id = mi.device_id
      SET mi.price = ?
      WHERE mi.menu_id = ?
        AND mi.name = ?
        AND UPPER(d.device_type) = UPPER(?)
        AND mi.is_active = 1
      `,
      [price, menuId, item_name, device]
    );

    if (res.affectedRows === 0) {
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
    const menuId = await getActiveMenuId(restaurant_id);

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
          DELETE mii
          FROM menu_item_ingredients mii
          JOIN menu_items mi ON mi.id = mii.menu_item_id
          WHERE mi.menu_id = ?
            AND mi.name = ?
            AND mii.ingredient_id NOT IN (
              SELECT id FROM ingredients WHERE name IN (?)
            )
          `,
          [menuId, item_name, ingredients]
        );

        await conn.query(
          `
          INSERT IGNORE INTO menu_item_ingredients
            (menu_item_id, ingredient_id, out_of_stock)
          SELECT mi.id, i.id, 0
          FROM menu_items mi
          JOIN ingredients i
            ON i.name IN (?)
          WHERE mi.menu_id = ?
            AND mi.name = ?
            AND mi.is_active = 1
          `,
          [ingredients, menuId, item_name]
        );
      } else {
        await conn.query(
          `
          DELETE mii
          FROM menu_item_ingredients mii
          JOIN menu_items mi ON mi.id = mii.menu_item_id
          WHERE mi.menu_id = ?
            AND mi.name = ?
          `,
          [menuId, item_name]
        );
      }

      await conn.commit();
    } catch (e) {
      await conn.rollback();
      throw e;
    } finally {
      conn.release();
    }

    return this.fetchMenu(restaurant_id);
  },
};
