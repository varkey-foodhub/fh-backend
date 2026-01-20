import db from "../../db/db";

const seed = async () => {
  const conn = await db.getConnection();

  try {
    await conn.beginTransaction();

    // Disable foreign key checks temporarily to allow cleanup/insertion
    await conn.query("SET FOREIGN_KEY_CHECKS = 0");

    // Optional: Clear existing data to avoid duplicate entry errors
    await conn.query("TRUNCATE TABLE menu_item_ingredients");
    await conn.query("TRUNCATE TABLE menu_item_prices");
    await conn.query("TRUNCATE TABLE menu_items");
    await conn.query("TRUNCATE TABLE menu_items_master");
    await conn.query("TRUNCATE TABLE menus");
    await conn.query("TRUNCATE TABLE restaurants");
    await conn.query("TRUNCATE TABLE ingredients");

    console.log("Existing data cleared...");

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
    // menus (version 1, active)
    // --------------------
    await conn.query(`
      INSERT INTO menus (id, restaurant_id, version, is_active) VALUES
      (1, 1, 1, 1),
      (2, 2, 1, 1),
      (3, 3, 1, 1)
    `);

    // --------------------
    // menu_items_master
    // --------------------
    await conn.query(`
      INSERT INTO menu_items_master (id, name) VALUES
      (1, 'Butter Chicken'),
      (2, 'Paneer Tikka'),
      (3, 'Dal Tadka'),
      (4, 'Garlic Naan'),
      (5, 'Chicken Biryani'),
      (6, 'Classic Beef Burger'),
      (7, 'Grilled Chicken Sandwich'),
      (8, 'French Fries'),
      (9, 'Cheese Loaded Fries'),
      (10, 'Chicken Wings'),
      (11, 'Quinoa Veg Bowl'),
      (12, 'Avocado Toast'),
      (13, 'Vegan Burrito'),
      (14, 'Fruit Smoothie'),
      (15, 'Grilled Paneer Salad')
    `);

    // --------------------
    // menu_items (menu ↔ items)
    // --------------------
    await conn.query(`
      INSERT INTO menu_items (menu_id, menu_item_id, is_active) VALUES
      -- Spice Route
      (1, 1, 1), (1, 2, 1), (1, 3, 1), (1, 4, 1), (1, 5, 1),
      -- Urban Grill
      (2, 6, 1), (2, 7, 1), (2, 8, 1), (2, 9, 1), (2, 10, 1),
      -- Green Bowl
      (3, 11, 1), (3, 12, 1), (3, 13, 1), (3, 14, 1), (3, 15, 1)
    `);

    // --------------------
    // menu_item_prices
    // --------------------
    await conn.query(`
      INSERT INTO menu_item_prices (menu_item_id, device, price) VALUES
      -- Butter Chicken
      (1, 'KIOSK', 300), (1, 'MOBILE', 320), (1, 'DINEIN', 350),
      -- Paneer Tikka
      (2, 'KIOSK', 240), (2, 'MOBILE', 260), (2, 'DINEIN', 280),
      -- Dal Tadka
      (3, 'KIOSK', 160), (3, 'MOBILE', 180), (3, 'DINEIN', 200),
      -- Garlic Naan
      (4, 'KIOSK', 50), (4, 'MOBILE', 60), (4, 'DINEIN', 70),
      -- Chicken Biryani
      (5, 'KIOSK', 280), (5, 'MOBILE', 300), (5, 'DINEIN', 330),

      -- Urban Grill
      (6, 'KIOSK', 220), (6, 'MOBILE', 240), (6, 'DINEIN', 270),
      (7, 'KIOSK', 200), (7, 'MOBILE', 220), (7, 'DINEIN', 250),
      (8, 'KIOSK', 100), (8, 'MOBILE', 120), (8, 'DINEIN', 140),
      (9, 'KIOSK', 140), (9, 'MOBILE', 160), (9, 'DINEIN', 180),
      (10, 'KIOSK', 260), (10, 'MOBILE', 280), (10, 'DINEIN', 310),

      -- Green Bowl
      (11, 'KIOSK', 190), (11, 'MOBILE', 210), (11, 'DINEIN', 230),
      (12, 'KIOSK', 170), (12, 'MOBILE', 190), (12, 'DINEIN', 210),
      (13, 'KIOSK', 210), (13, 'MOBILE', 230), (13, 'DINEIN', 250),
      (14, 'KIOSK', 130), (14, 'MOBILE', 150), (14, 'DINEIN', 170),
      (15, 'KIOSK', 180), (15, 'MOBILE', 200), (15, 'DINEIN', 220)
    `);

    // --------------------
    // ingredients
    // --------------------
    await conn.query(`
      INSERT INTO ingredients (id, name) VALUES
      (1, 'chicken'), (2, 'butter'), (3, 'tomato'), (4, 'cream'),
      (5, 'paneer'), (6, 'lentils'), (7, 'garlic'), (8, 'rice'),
      (9, 'potato'), (10, 'cheese'), (11, 'quinoa'), (12, 'avocado')
    `);

    // --------------------
    // menu_item_ingredients
    // --------------------
    await conn.query(`
      INSERT INTO menu_item_ingredients (menu_item_id, ingredient_id) VALUES
      (1,1),(1,2),(1,3),(1,4),
      (2,5),(2,3),(2,7),
      (3,6),(3,7),
      (5,1),(5,8),
      (8,9),
      (9,9),(9,10),
      (11,11),(11,12)
    `);

    // Re-enable foreign key checks
    await conn.query("SET FOREIGN_KEY_CHECKS = 1");

    await conn.commit();
    console.log("✅ Demo seed data inserted");
  } catch (error) {
    await conn.rollback();
    console.error("❌ Seeding failed:", error);
  } finally {
    conn.release();
    // Close the pool if this script is standalone, otherwise leave it open
    // process.exit(0); 
  }
};

seed();