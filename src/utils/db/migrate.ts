import db from "../../db/db";


async function migrate() {

const statements = [
  `
-- --------------------
-- restaurants
-- --------------------
CREATE TABLE IF NOT EXISTS restaurants (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT
) ENGINE=InnoDB;
`,
  `

-- --------------------
-- menus (versioned)
-- --------------------
CREATE TABLE IF NOT EXISTS menus (
  id INT AUTO_INCREMENT PRIMARY KEY,
  restaurant_id INT NOT NULL,
  version INT NOT NULL,
  is_active TINYINT(1) DEFAULT 1,

  UNIQUE KEY uniq_restaurant_version (restaurant_id, version),
  CONSTRAINT fk_menus_restaurant
    FOREIGN KEY (restaurant_id)
    REFERENCES restaurants(id)
    ON DELETE CASCADE
) ENGINE=InnoDB;
`,
  `
-- --------------------
-- menu_items_master
-- --------------------
CREATE TABLE IF NOT EXISTS menu_items_master (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  out_of_stock TINYINT(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB;
`,
  `
-- --------------------
-- menu_items (menu ↔ item)
-- --------------------
CREATE TABLE IF NOT EXISTS menu_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  menu_id INT NOT NULL,
  menu_item_id INT NOT NULL,
  is_active TINYINT(1) DEFAULT 1,
  available_from DATETIME,
  available_until DATETIME,

  CONSTRAINT fk_menu_items_menu
    FOREIGN KEY (menu_id)
    REFERENCES menus(id)
    ON DELETE CASCADE,

  CONSTRAINT fk_menu_items_item
    FOREIGN KEY (menu_item_id)
    REFERENCES menu_items_master(id)
    ON DELETE CASCADE
) ENGINE=InnoDB;
`,
  `
-- --------------------
-- menu_item_prices (device-based pricing only)
-- --------------------
CREATE TABLE IF NOT EXISTS menu_item_prices (
  id INT AUTO_INCREMENT PRIMARY KEY,
  menu_item_id INT NOT NULL,
  device VARCHAR(50) NOT NULL,
  price INT NOT NULL,

  UNIQUE KEY uniq_item_device (menu_item_id, device),
  CONSTRAINT fk_prices_item
    FOREIGN KEY (menu_item_id)
    REFERENCES menu_items_master(id)
    ON DELETE CASCADE
) ENGINE=InnoDB;
`,
  `
-- --------------------
-- ingredients
-- --------------------
CREATE TABLE IF NOT EXISTS ingredients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE
) ENGINE=InnoDB;
`,
  `
-- --------------------
-- menu_item_ingredients (join)
-- --------------------
CREATE TABLE IF NOT EXISTS menu_item_ingredients (
  menu_item_id INT NOT NULL,
  ingredient_id INT NOT NULL,

  PRIMARY KEY (menu_item_id, ingredient_id),

  CONSTRAINT fk_mii_item
    FOREIGN KEY (menu_item_id)
    REFERENCES menu_items_master(id)
    ON DELETE CASCADE,

  CONSTRAINT fk_mii_ingredient
    FOREIGN KEY (ingredient_id)
    REFERENCES ingredients(id)
    ON DELETE CASCADE
) ENGINE=InnoDB;
`,
  `
-- --------------------
-- menu_item_out_of_stock_ingredients
-- --------------------
CREATE TABLE IF NOT EXISTS menu_item_out_of_stock_ingredients (
  menu_item_id INT NOT NULL,
  ingredient_id INT NOT NULL,

  PRIMARY KEY (menu_item_id, ingredient_id),

  CONSTRAINT fk_oos_item
    FOREIGN KEY (menu_item_id)
    REFERENCES menu_items_master(id)
    ON DELETE CASCADE,

  CONSTRAINT fk_oos_ingredient
    FOREIGN KEY (ingredient_id)
    REFERENCES ingredients(id)
    ON DELETE CASCADE
) ENGINE=InnoDB;
`,
];
for (const sql of statements) {
  await db.execute(sql);
}

console.log("✅ MySQL schema migrated successfully");

}

migrate().catch((err) => {
  console.error("❌ Migration failed");
  console.error(err);
  process.exit(1);
});