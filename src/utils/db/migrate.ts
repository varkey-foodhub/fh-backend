import db from "../../db/db";

db.exec(`
PRAGMA foreign_keys = ON;

-- --------------------
-- restaurants
-- --------------------
CREATE TABLE IF NOT EXISTS restaurants (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT
);

-- --------------------
-- menus (versioned)
-- --------------------
CREATE TABLE IF NOT EXISTS menus (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  restaurant_id INTEGER NOT NULL,
  version INTEGER NOT NULL,
  is_active INTEGER DEFAULT 1,

  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id),
  UNIQUE (restaurant_id, version)
);

-- --------------------
-- menu_items_master
-- --------------------
CREATE TABLE IF NOT EXISTS menu_items_master (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  out_of_stock INTEGER NOT NULL DEFAULT 0 -- ✅ global stock flag
);

-- --------------------
-- menu_items (menu ↔ item)
-- --------------------
CREATE TABLE IF NOT EXISTS menu_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  menu_id INTEGER NOT NULL,
  menu_item_id INTEGER NOT NULL,
  is_active INTEGER DEFAULT 1,
  available_from DATETIME,
  available_until DATETIME,

  FOREIGN KEY (menu_id) REFERENCES menus(id),
  FOREIGN KEY (menu_item_id) REFERENCES menu_items_master(id)
);

-- --------------------
-- menu_item_prices (device-based pricing only)
-- --------------------
CREATE TABLE IF NOT EXISTS menu_item_prices (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  menu_item_id INTEGER NOT NULL,
  device TEXT NOT NULL,
  price INTEGER NOT NULL,

  FOREIGN KEY (menu_item_id) REFERENCES menu_items_master(id),
  UNIQUE (menu_item_id, device)
);

-- --------------------
-- ingredients
-- --------------------
CREATE TABLE IF NOT EXISTS ingredients (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE
);

-- --------------------
-- menu_item_ingredients (join)
-- --------------------
CREATE TABLE IF NOT EXISTS menu_item_ingredients (
  menu_item_id INTEGER NOT NULL,
  ingredient_id INTEGER NOT NULL,

  FOREIGN KEY (menu_item_id) REFERENCES menu_items_master(id),
  FOREIGN KEY (ingredient_id) REFERENCES ingredients(id),
  PRIMARY KEY (menu_item_id, ingredient_id)
);

`);

console.log("✅ SQLite schema migrated successfully");
