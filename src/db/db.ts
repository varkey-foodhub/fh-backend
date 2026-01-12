import type { Restaurant } from "../modules/restaurant/restaurant.type";

export const db: Restaurant[] = [
  {
    name: "Spice Route",
    description: "Modern Indian cuisine with bold spices",
    id:1,
    menu: {
      items: [
        {
          name: "Butter Chicken",
          price: 320,
          ingredients: ["chicken", "butter", "tomato", "cream", "garam masala"],
          out_of_stock:false,
          out_of_stock_items:[]
          
        },
        {
          name: "Paneer Tikka",
          price: 260,
          ingredients: ["paneer", "yogurt", "chili", "capsicum", "onion"],
          out_of_stock:false,
          out_of_stock_items:[]
        },
        {
          name: "Dal Tadka",
          price: 180,
          ingredients: ["lentils", "ghee", "garlic", "cumin"],
          out_of_stock:false,
          out_of_stock_items:[]
        },
        {
          name: "Garlic Naan",
          price: 60,
          ingredients: ["flour", "garlic", "butter"],
          out_of_stock:false,
          out_of_stock_items:[]
        },
        {
          name: "Chicken Biryani",
          price: 300,
          ingredients: ["chicken", "rice", "saffron", "onion", "spices"],
          out_of_stock:false,
          out_of_stock_items:[]
        }
      ]
    }
  },
  {
    name: "Urban Grill",
    description: "Fast food and grilled classics",
    id:2,
    menu: {
      items: [
        {
          name: "Classic Beef Burger",
          price: 240,
          ingredients: ["beef", "bun", "lettuce", "cheese", "tomato"],
          out_of_stock:false,
          out_of_stock_items:[]
        },
        {
          name: "Grilled Chicken Sandwich",
          price: 220,
          ingredients: ["chicken", "bun", "lettuce", "mayonnaise"],
          out_of_stock:false,
          out_of_stock_items:[]
        },
        {
          name: "French Fries",
          price: 120,
          ingredients: ["potato", "salt", "oil"],
          out_of_stock:false,
          out_of_stock_items:[]
        },
        {
          name: "Cheese Loaded Fries",
          price: 160,
          ingredients: ["potato", "cheese", "salt", "oil"],
          out_of_stock:false,
          out_of_stock_items:[]
        },
        {
          name: "Chicken Wings",
          price: 280,
          ingredients: ["chicken", "chili", "butter", "garlic"],
          out_of_stock:false,
          out_of_stock_items:[]
        }
      ]
    }
  },
  {
    name: "Green Bowl",
    description: "Healthy bowls and vegan-friendly meals",
    id:3,
    menu: {
      items: [
        {
          name: "Quinoa Veg Bowl",
          price: 210,
          ingredients: ["quinoa", "broccoli", "carrot", "beans"],
          out_of_stock:false,
          out_of_stock_items:[]
        },
        {
          name: "Avocado Toast",
          price: 190,
          ingredients: ["bread", "avocado", "olive oil", "salt"],
          out_of_stock:false,
          out_of_stock_items:[]
        },
        {
          name: "Vegan Burrito",
          price: 230,
          ingredients: ["tortilla", "beans", "rice", "avocado"],
          out_of_stock:false,
          out_of_stock_items:[]
        },
        {
          name: "Fruit Smoothie",
          price: 150,
          ingredients: ["banana", "strawberry", "almond milk"],
          out_of_stock:false,
          out_of_stock_items:[]
        },
        {
          name: "Grilled Paneer Salad",
          price: 200,
          ingredients: ["paneer", "lettuce", "tomato", "olive oil"],
          out_of_stock:false,
          out_of_stock_items:[]
        }
      ]
    }
  }
];
