import type { Restaurant } from "../modules/restaurant/restaurant.type";
import { Device } from "../modules/menu/menu.types";

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
            { device: Device.KIOSK, price: 300 },
            { device: Device.MOBILE, price: 320 },
            { device: Device.DINEIN, price: 350 }
          ],
          ingredients: ["chicken", "butter", "tomato", "cream", "garam masala"],
          out_of_stock: false,
          out_of_stock_items: []
        },
        {
          name: "Paneer Tikka",
          price: [
            { device: Device.KIOSK, price: 240 },
            { device: Device.MOBILE, price: 260 },
            { device: Device.DINEIN, price: 280 }
          ],
          ingredients: ["paneer", "yogurt", "chili", "capsicum", "onion"],
          out_of_stock: false,
          out_of_stock_items: []
        },
        {
          name: "Dal Tadka",
          price: [
            { device: Device.KIOSK, price: 160 },
            { device: Device.MOBILE, price: 180 },
            { device: Device.DINEIN, price: 200 }
          ],
          ingredients: ["lentils", "ghee", "garlic", "cumin"],
          out_of_stock: false,
          out_of_stock_items: []
        },
        {
          name: "Garlic Naan",
          price: [
            { device: Device.KIOSK, price: 50 },
            { device: Device.MOBILE, price: 60 },
            { device: Device.DINEIN, price: 70 }
          ],
          ingredients: ["flour", "garlic", "butter"],
          out_of_stock: false,
          out_of_stock_items: []
        },
        {
          name: "Chicken Biryani",
          price: [
            { device: Device.KIOSK, price: 280 },
            { device: Device.MOBILE, price: 300 },
            { device: Device.DINEIN, price: 330 }
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
            { device: Device.KIOSK, price: 220 },
            { device: Device.MOBILE, price: 240 },
            { device: Device.DINEIN, price: 270 }
          ],
          ingredients: ["beef", "bun", "lettuce", "cheese", "tomato"],
          out_of_stock: false,
          out_of_stock_items: []
        },
        {
          name: "Grilled Chicken Sandwich",
          price: [
            { device: Device.KIOSK, price: 200 },
            { device: Device.MOBILE, price: 220 },
            { device: Device.DINEIN, price: 250 }
          ],
          ingredients: ["chicken", "bun", "lettuce", "mayonnaise"],
          out_of_stock: false,
          out_of_stock_items: []
        },
        {
          name: "French Fries",
          price: [
            { device: Device.KIOSK, price: 100 },
            { device: Device.MOBILE, price: 120 },
            { device: Device.DINEIN, price: 140 }
          ],
          ingredients: ["potato", "salt", "oil"],
          out_of_stock: false,
          out_of_stock_items: []
        },
        {
          name: "Cheese Loaded Fries",
          price: [
            { device: Device.KIOSK, price: 140 },
            { device: Device.MOBILE, price: 160 },
            { device: Device.DINEIN, price: 180 }
          ],
          ingredients: ["potato", "cheese", "salt", "oil"],
          out_of_stock: false,
          out_of_stock_items: []
        },
        {
          name: "Chicken Wings",
          price: [
            { device: Device.KIOSK, price: 260 },
            { device: Device.MOBILE, price: 280 },
            { device: Device.DINEIN, price: 310 }
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
            { device: Device.KIOSK, price: 190 },
            { device: Device.MOBILE, price: 210 },
            { device: Device.DINEIN, price: 230 }
          ],
          ingredients: ["quinoa", "broccoli", "carrot", "beans"],
          out_of_stock: false,
          out_of_stock_items: []
        },
        {
          name: "Avocado Toast",
          price: [
            { device: Device.KIOSK, price: 170 },
            { device: Device.MOBILE, price: 190 },
            { device: Device.DINEIN, price: 210 }
          ],
          ingredients: ["bread", "avocado", "olive oil", "salt"],
          out_of_stock: false,
          out_of_stock_items: []
        },
        {
          name: "Vegan Burrito",
          price: [
            { device: Device.KIOSK, price: 210 },
            { device: Device.MOBILE, price: 230 },
            { device: Device.DINEIN, price: 250 }
          ],
          ingredients: ["tortilla", "beans", "rice", "avocado"],
          out_of_stock: false,
          out_of_stock_items: []
        },
        {
          name: "Fruit Smoothie",
          price: [
            { device: Device.KIOSK, price: 130 },
            { device: Device.MOBILE, price: 150 },
            { device: Device.DINEIN, price: 170 }
          ],
          ingredients: ["banana", "strawberry", "almond milk"],
          out_of_stock: false,
          out_of_stock_items: []
        },
        {
          name: "Grilled Paneer Salad",
          price: [
            { device: Device.KIOSK, price: 180 },
            { device: Device.MOBILE, price: 200 },
            { device: Device.DINEIN, price: 220 }
          ],
          ingredients: ["paneer", "lettuce", "tomato", "olive oil"],
          out_of_stock: false,
          out_of_stock_items: []
        }
      ]
    }
  }
];
