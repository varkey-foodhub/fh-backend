import db from "./db";
import { RowDataPacket } from "mysql2";

export async function getActiveMenuId(restaurant_id: number): Promise<number> {
  const [rows] = await db.execute<RowDataPacket[]>(
    `SELECT id FROM menus WHERE restaurant_id = ? AND is_active = 1 LIMIT 1`,
    [restaurant_id]
  );

  if (!rows || rows.length === 0) {
    throw new Error(`No active menu found for restaurant ID: ${restaurant_id}`);
  }

  return rows[0].id;
}