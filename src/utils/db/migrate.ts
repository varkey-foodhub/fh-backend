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
  is_active BOOLEAN DEFAULT TRUE,

  UNIQUE KEY uq_restaurant_version (restaurant_id, version),
  CONSTRAINT fk_menus_restaurant
    FOREIGN KEY (restaurant_id)
    REFERENCES restaurants(id)
    ON DELETE CASCADE
) ENGINE=InnoDB;
`,
  `
-- --------------------
-- devices
-- --------------------
CREATE TABLE IF NOT EXISTS devices (
  id INT PRIMARY KEY,
  device_type TEXT
) ENGINE=InnoDB;
`,
  `
-- --------------------
-- menu_items
-- --------------------
CREATE TABLE IF NOT EXISTS menu_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  menu_id INT NOT NULL,
  name TEXT NOT NULL,
  out_of_stock BOOLEAN,
  is_active BOOLEAN DEFAULT TRUE,
  available_from DATETIME,
  available_until DATETIME,
  price DECIMAL(10,2),
  device_id INT,

  CONSTRAINT fk_menu_items_menu
    FOREIGN KEY (menu_id)
    REFERENCES menus(id)
    ON DELETE CASCADE,

  CONSTRAINT fk_menu_items_device
    FOREIGN KEY (device_id)
    REFERENCES devices(id)
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
-- menu_item_ingredients (junction table)
-- --------------------
CREATE TABLE IF NOT EXISTS menu_item_ingredients (
  menu_item_id INT NOT NULL,
  ingredient_id INT NOT NULL,
  out_of_stock BOOLEAN,

  PRIMARY KEY (menu_item_id, ingredient_id),

  CONSTRAINT fk_mii_menu_item
    FOREIGN KEY (menu_item_id)
    REFERENCES menu_items(id)
    ON DELETE CASCADE,

  CONSTRAINT fk_mii_ingredient
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