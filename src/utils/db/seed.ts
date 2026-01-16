import db from "../../db/db";

const seed = async () => {
  const conn = await db.getConnection();

  try {
    await conn.beginTransaction();

    await conn.query("SET FOREIGN_KEY_CHECKS = 0");

    // ---- CLEANUP (order matters)
    await conn.query("TRUNCATE TABLE menu_item_ingredients");
    await conn.query("TRUNCATE TABLE menu_items");
    await conn.query("TRUNCATE TABLE menus");
    await conn.query("TRUNCATE TABLE ingredients");
    await conn.query("TRUNCATE TABLE devices");
    await conn.query("TRUNCATE TABLE restaurants");

    console.log("🧹 Existing data cleared");

    // --------------------
    // restaurants
    // --------------------
    await conn.query(`
      INSERT INTO restaurants (id, name, description) VALUES
      (1, 'Spice Route', 'Modern Indian cuisine with bold spices'),
      (2, 'Urban Grill', 'Fast food and grilled classics'),
      (3, 'Green Bowl', 'Healthy bowls and vegan-friendly meals')
    `);

    // --------------------
    // menus
    // --------------------
    await conn.query(`
      INSERT INTO menus (id, restaurant_id, version, is_active) VALUES
      (1, 1, 1, 1),
      (2, 2, 1, 1),
      (3, 3, 1, 1)
    `);

    // --------------------
    // devices
    // --------------------
    await conn.query(`
      INSERT INTO devices (id, device_type) VALUES
      (1, 'KIOSK'),
      (2, 'MOBILE'),
      (3, 'DINEIN')
    `);

    // --------------------
    // menu_items (DENORMALIZED)
    // One row = one dish + one device
    // --------------------
    await conn.query(`
      INSERT INTO menu_items
        (menu_id, name, device_id, price, is_active, out_of_stock)
      VALUES
      -- Spice Route
      (1,'Butter Chicken',1,300,1,0),
      (1,'Butter Chicken',2,320,1,0),
      (1,'Butter Chicken',3,350,1,0),

      (1,'Paneer Tikka',1,240,1,0),
      (1,'Paneer Tikka',2,260,1,0),
      (1,'Paneer Tikka',3,280,1,0),

      (1,'Dal Tadka',1,160,1,0),
      (1,'Dal Tadka',2,180,1,0),
      (1,'Dal Tadka',3,200,1,0),

      -- Urban Grill
      (2,'Classic Beef Burger',1,220,1,0),
      (2,'Classic Beef Burger',2,240,1,0),
      (2,'Classic Beef Burger',3,270,1,0),

      (2,'French Fries',1,100,1,0),
      (2,'French Fries',2,120,1,0),
      (2,'French Fries',3,140,1,0),

      -- Green Bowl
      (3,'Quinoa Veg Bowl',1,190,1,0),
      (3,'Quinoa Veg Bowl',2,210,1,0),
      (3,'Quinoa Veg Bowl',3,230,1,0)
    `);

    // --------------------
    // ingredients
    // --------------------
    await conn.query(`
      INSERT INTO ingredients (id, name) VALUES
      (1,'chicken'),
      (2,'butter'),
      (3,'tomato'),
      (4,'cream'),
      (5,'paneer'),
      (6,'lentils'),
      (7,'rice'),
      (8,'potato'),
      (9,'quinoa')
    `);

    // --------------------
    // menu_item_ingredients
    // IMPORTANT:
    // You must map ALL device rows of a dish
    // --------------------
    await conn.query(`
      INSERT INTO menu_item_ingredients
        (menu_item_id, ingredient_id, out_of_stock)
      VALUES
      -- Butter Chicken (ids 1,2,3)
      (1,1,0),(1,2,0),(1,3,0),(1,4,0),
      (2,1,0),(2,2,0),(2,3,0),(2,4,0),
      (3,1,0),(3,2,0),(3,3,0),(3,4,0),

      -- Paneer Tikka (ids 4,5,6)
      (4,5,0),(4,3,0),
      (5,5,0),(5,3,0),
      (6,5,0),(6,3,0),

      -- French Fries (ids 13,14,15)
      (13,8,0),(14,8,0),(15,8,0),

      -- Quinoa Bowl (ids 16,17,18)
      (16,9,0),(17,9,0),(18,9,0)
    `);

    await conn.query("SET FOREIGN_KEY_CHECKS = 1");

    await conn.commit();
    console.log("✅ Seed completed successfully");
  } catch (err) {
    await conn.rollback();
    console.error("❌ Seed failed", err);
  } finally {
    conn.release();
  }
};

seed();
