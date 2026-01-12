import type { Restaurant } from "../modules/restaurant/restaurant.type";
import type { Device, Price } from "../modules/menu/menu.types";

export const db: Restaurant[] = [
  {
    id: 1,
    name: "Spice Route",
    description: "Modern Indian cuisine with bold spices",
    menu: {
      items: [
        {
          name: "Butter Chicken",
          price: [
            { device: "kiosk", price: 300 },
            { device: "mobile", price: 320 },
            { device: "dinein", price: 350 }
          ],
          ingredients: ["chicken", "butter", "tomato", "cream", "garam masala"],
          out_of_stock: false,
          out_of_stock_items: []
        },
        {
          name: "Paneer Tikka",
          price: [
            { device: "kiosk", price: 240 },
            { device: "mobile", price: 260 },
            { device: "dinein", price: 280 }
          ],
          ingredients: ["paneer", "yogurt", "chili", "capsicum", "onion"],
          out_of_stock: false,
          out_of_stock_items: []
        },
        {
          name: "Dal Tadka",
          price: [
            { device: "kiosk", price: 160 },
            { device: "mobile", price: 180 },
            { device: "dinein", price: 200 }
          ],
          ingredients: ["lentils", "ghee", "garlic", "cumin"],
          out_of_stock: false,
          out_of_stock_items: []
        },
        {
          name: "Garlic Naan",
          price: [
            { device: "kiosk", price: 50 },
            { device: "mobile", price: 60 },
            { device: "dinein", price: 70 }
          ],
          ingredients: ["flour", "garlic", "butter"],
          out_of_stock: false,
          out_of_stock_items: []
        },
        {
          name: "Chicken Biryani",
          price: [
            { device: "kiosk", price: 280 },
            { device: "mobile", price: 300 },
            { device: "dinein", price: 330 }
          ],
          ingredients: ["chicken", "rice", "saffron", "onion", "spices"],
          out_of_stock: false,
          out_of_stock_items: []
        }
      ]
    }
  },
  {
    id: 2,
    name: "Urban Grill",
    description: "Fast food and grilled classics",
    menu: {
      items: [
        {
          name: "Classic Beef Burger",
          price: [
            { device: "kiosk", price: 220 },
            { device: "mobile", price: 240 },
            { device: "dinein", price: 270 }
          ],
          ingredients: ["beef", "bun", "lettuce", "cheese", "tomato"],
          out_of_stock: false,
          out_of_stock_items: []
        },
        {
          name: "Grilled Chicken Sandwich",
          price: [
            { device: "kiosk", price: 200 },
            { device: "mobile", price: 220 },
            { device: "dinein", price: 250 }
          ],
          ingredients: ["chicken", "bun", "lettuce", "mayonnaise"],
          out_of_stock: false,
          out_of_stock_items: []
        },
        {
          name: "French Fries",
          price: [
            { device: "kiosk", price: 100 },
            { device: "mobile", price: 120 },
            { device: "dinein", price: 140 }
          ],
          ingredients: ["potato", "salt", "oil"],
          out_of_stock: false,
          out_of_stock_items: []
        },
        {
          name: "Cheese Loaded Fries",
          price: [
            { device: "kiosk", price: 140 },
            { device: "mobile", price: 160 },
            { device: "dinein", price: 180 }
          ],
          ingredients: ["potato", "cheese", "salt", "oil"],
          out_of_stock: false,
          out_of_stock_items: []
        },
        {
          name: "Chicken Wings",
          price: [
            { device: "kiosk", price: 260 },
            { device: "mobile", price: 280 },
            { device: "dinein", price: 310 }
          ],
          ingredients: ["chicken", "chili", "butter", "garlic"],
          out_of_stock: false,
          out_of_stock_items: []
        }
      ]
    }
  },
  {
    id: 3,
    name: "Green Bowl",
    description: "Healthy bowls and vegan-friendly meals",
    menu: {
      items: [
        {
          name: "Quinoa Veg Bowl",
          price: [
            { device: "kiosk", price: 190 },
            { device: "mobile", price: 210 },
            { device: "dinein", price: 230 }
          ],
          ingredients: ["quinoa", "broccoli", "carrot", "beans"],
          out_of_stock: false,
          out_of_stock_items: []
        },
        {
          name: "Avocado Toast",
          price: [
            { device: "kiosk", price: 170 },
            { device: "mobile", price: 190 },
            { device: "dinein", price: 210 }
          ],
          ingredients: ["bread", "avocado", "olive oil", "salt"],
          out_of_stock: false,
          out_of_stock_items: []
        },
        {
          name: "Vegan Burrito",
          price: [
            { device: "kiosk", price: 210 },
            { device: "mobile", price: 230 },
            { device: "dinein", price: 250 }
          ],
          ingredients: ["tortilla", "beans", "rice", "avocado"],
          out_of_stock: false,
          out_of_stock_items: []
        },
        {
          name: "Fruit Smoothie",
          price: [
            { device: "kiosk", price: 130 },
            { device: "mobile", price: 150 },
            { device: "dinein", price: 170 }
          ],
          ingredients: ["banana", "strawberry", "almond milk"],
          out_of_stock: false,
          out_of_stock_items: []
        },
        {
          name: "Grilled Paneer Salad",
          price: [
            { device: "kiosk", price: 180 },
            { device: "mobile", price: 200 },
            { device: "dinein", price: 220 }
          ],
          ingredients: ["paneer", "lettuce", "tomato", "olive oil"],
          out_of_stock: false,
          out_of_stock_items: []
        }
      ]
    }
  }
];
