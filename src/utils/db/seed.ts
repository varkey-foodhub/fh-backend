import db from "../../db/db";

const seed = async () => {
  const conn = await db.getConnection();

  try {
    await conn.beginTransaction();

    // Disable foreign key checks temporarily to allow cleanup/insertion
    await conn.query("SET FOREIGN_KEY_CHECKS = 0");

    // Optional: Clear existing data to avoid duplicate entry errors
    await conn.query("TRUNCATE TABLE menu_item_ingredients");
    await conn.query("TRUNCATE TABLE menu_items");
    await conn.query("TRUNCATE TABLE menus");
    await conn.query("TRUNCATE TABLE devices");
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
    // devices
    // --------------------
    await conn.query(`
      INSERT INTO devices (id, device_type) VALUES
      (1, 'KIOSK'),
      (2, 'MOBILE'),
      (3, 'DINEIN')
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
    // menu_items (Spice Route)
    // --------------------
    await conn.query(`
      INSERT INTO menu_items (id, menu_id, name, out_of_stock, is_active, price, device_id) VALUES
      (1, 1, 'Butter Chicken', 0, 1, 300.00, 1),
      (2, 1, 'Butter Chicken', 0, 1, 320.00, 2),
      (3, 1, 'Butter Chicken', 0, 1, 350.00, 3),
      (4, 1, 'Paneer Tikka', 0, 1, 240.00, 1),
      (5, 1, 'Paneer Tikka', 0, 1, 260.00, 2),
      (6, 1, 'Paneer Tikka', 0, 1, 280.00, 3),
      (7, 1, 'Dal Tadka', 0, 1, 160.00, 1),
      (8, 1, 'Dal Tadka', 0, 1, 180.00, 2),
      (9, 1, 'Dal Tadka', 0, 1, 200.00, 3),
      (10, 1, 'Garlic Naan', 0, 1, 50.00, 1),
      (11, 1, 'Garlic Naan', 0, 1, 60.00, 2),
      (12, 1, 'Garlic Naan', 0, 1, 70.00, 3),
      (13, 1, 'Chicken Biryani', 0, 1, 280.00, 1),
      (14, 1, 'Chicken Biryani', 0, 1, 300.00, 2),
      (15, 1, 'Chicken Biryani', 0, 1, 330.00, 3)
    `);

    // --------------------
    // menu_items (Urban Grill)
    // --------------------
    await conn.query(`
      INSERT INTO menu_items (id, menu_id, name, out_of_stock, is_active, price, device_id) VALUES
      (16, 2, 'Classic Beef Burger', 0, 1, 220.00, 1),
      (17, 2, 'Classic Beef Burger', 0, 1, 240.00, 2),
      (18, 2, 'Classic Beef Burger', 0, 1, 270.00, 3),
      (19, 2, 'Grilled Chicken Sandwich', 0, 1, 200.00, 1),
      (20, 2, 'Grilled Chicken Sandwich', 0, 1, 220.00, 2),
      (21, 2, 'Grilled Chicken Sandwich', 0, 1, 250.00, 3),
      (22, 2, 'French Fries', 0, 1, 100.00, 1),
      (23, 2, 'French Fries', 0, 1, 120.00, 2),
      (24, 2, 'French Fries', 0, 1, 140.00, 3),
      (25, 2, 'Cheese Loaded Fries', 0, 1, 140.00, 1),
      (26, 2, 'Cheese Loaded Fries', 0, 1, 160.00, 2),
      (27, 2, 'Cheese Loaded Fries', 0, 1, 180.00, 3),
      (28, 2, 'Chicken Wings', 0, 1, 260.00, 1),
      (29, 2, 'Chicken Wings', 0, 1, 280.00, 2),
      (30, 2, 'Chicken Wings', 0, 1, 310.00, 3)
    `);

    // --------------------
    // menu_items (Green Bowl)
    // --------------------
    await conn.query(`
      INSERT INTO menu_items (id, menu_id, name, out_of_stock, is_active, price, device_id) VALUES
      (31, 3, 'Quinoa Veg Bowl', 0, 1, 190.00, 1),
      (32, 3, 'Quinoa Veg Bowl', 0, 1, 210.00, 2),
      (33, 3, 'Quinoa Veg Bowl', 0, 1, 230.00, 3),
      (34, 3, 'Avocado Toast', 0, 1, 170.00, 1),
      (35, 3, 'Avocado Toast', 0, 1, 190.00, 2),
      (36, 3, 'Avocado Toast', 0, 1, 210.00, 3),
      (37, 3, 'Vegan Burrito', 0, 1, 210.00, 1),
      (38, 3, 'Vegan Burrito', 0, 1, 230.00, 2),
      (39, 3, 'Vegan Burrito', 0, 1, 250.00, 3),
      (40, 3, 'Fruit Smoothie', 0, 1, 130.00, 1),
      (41, 3, 'Fruit Smoothie', 0, 1, 150.00, 2),
      (42, 3, 'Fruit Smoothie', 0, 1, 170.00, 3),
      (43, 3, 'Grilled Paneer Salad', 0, 1, 180.00, 1),
      (44, 3, 'Grilled Paneer Salad', 0, 1, 200.00, 2),
      (45, 3, 'Grilled Paneer Salad', 0, 1, 220.00, 3)
    `);

    // --------------------
    // menu_item_ingredients
    // --------------------
    await conn.query(`
      INSERT INTO menu_item_ingredients (menu_item_id, ingredient_id, out_of_stock) VALUES
      -- Butter Chicken (items 1-3)
      (1,1,0), (1,2,0), (1,3,0), (1,4,0),
      (2,1,0), (2,2,0), (2,3,0), (2,4,0),
      (3,1,0), (3,2,0), (3,3,0), (3,4,0),
      -- Paneer Tikka (items 4-6)
      (4,5,0), (4,3,0), (4,7,0),
      (5,5,0), (5,3,0), (5,7,0),
      (6,5,0), (6,3,0), (6,7,0),
      -- Dal Tadka (items 7-9)
      (7,6,0), (7,7,0),
      (8,6,0), (8,7,0),
      (9,6,0), (9,7,0),
      -- Chicken Biryani (items 13-15)
      (13,1,0), (13,8,0),
      (14,1,0), (14,8,0),
      (15,1,0), (15,8,0),
      -- French Fries (items 22-24)
      (22,9,0),
      (23,9,0),
      (24,9,0),
      -- Cheese Loaded Fries (items 25-27)
      (25,9,0), (25,10,0),
      (26,9,0), (26,10,0),
      (27,9,0), (27,10,0),
      -- Quinoa Veg Bowl (items 31-33)
      (31,11,0), (31,12,0),
      (32,11,0), (32,12,0),
      (33,11,0), (33,12,0)
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