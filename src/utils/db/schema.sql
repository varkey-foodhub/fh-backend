SET FOREIGN_KEY_CHECKS = 0;

CREATE TABLE restaurants (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  description TEXT
) ENGINE=InnoDB;

CREATE TABLE menus (
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

CREATE TABLE devices (
  id INT AUTO_INCREMENT PRIMARY KEY,
  device_type TEXT
) ENGINE=InnoDB;

CREATE TABLE menu_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  menu_id INT NOT NULL,
  name TEXT,
  out_of_stock TINYINT(1),
  is_active TINYINT(1) DEFAULT 1,
  available_from DATETIME,
  available_until DATETIME,
  price DECIMAL(10,2),
  device_id INT,

  CONSTRAINT fk_menu_items_menu
    FOREIGN KEY (menu_id)
    REFERENCES menus(id)
    ON DELETE CASCADE,schea

  CONSTRAINT fk_menu_items_device
    FOREIGN KEY (device_id)
    REFERENCES devices(id)
    ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE ingredients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE
) ENGINE=InnoDB;

CREATE TABLE menu_item_ingredients (
  menu_item_id INT NOT NULL,
  ingredient_id INT NOT NULL,
  out_of_stock TINYINT(1),

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

SET FOREIGN_KEY_CHECKS = 1;
