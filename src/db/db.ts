import type { Restaurant } from "../modules/restaurant/restaurant.type";

export const db: Restaurant[] = [
  {
    name: "Spice Route",
    description: "Modern Indian cuisine with bold spices",
    menu: {
      items: [
        {
          name: "Butter Chicken",
          price: 320,
          ingredients: ["chicken", "butter", "tomato", "cream", "garam masala"]
        },
        {
          name: "Paneer Tikka",
          price: 260,
          ingredients: ["paneer", "yogurt", "chili", "capsicum", "onion"]
        },
        {
          name: "Dal Tadka",
          price: 180,
          ingredients: ["lentils", "ghee", "garlic", "cumin"]
        },
        {
          name: "Garlic Naan",
          price: 60,
          ingredients: ["flour", "garlic", "butter"]
        },
        {
          name: "Chicken Biryani",
          price: 300,
          ingredients: ["chicken", "rice", "saffron", "onion", "spices"]
        }
      ]
    }
  },
  {
    name: "Urban Grill",
    description: "Fast food and grilled classics",
    menu: {
      items: [
        {
          name: "Classic Beef Burger",
          price: 240,
          ingredients: ["beef", "bun", "lettuce", "cheese", "tomato"]
        },
        {
          name: "Grilled Chicken Sandwich",
          price: 220,
          ingredients: ["chicken", "bun", "lettuce", "mayonnaise"]
        },
        {
          name: "French Fries",
          price: 120,
          ingredients: ["potato", "salt", "oil"]
        },
        {
          name: "Cheese Loaded Fries",
          price: 160,
          ingredients: ["potato", "cheese", "salt", "oil"]
        },
        {
          name: "Chicken Wings",
          price: 280,
          ingredients: ["chicken", "chili", "butter", "garlic"]
        }
      ]
    }
  },
  {
    name: "Green Bowl",
    description: "Healthy bowls and vegan-friendly meals",
    menu: {
      items: [
        {
          name: "Quinoa Veg Bowl",
          price: 210,
          ingredients: ["quinoa", "broccoli", "carrot", "beans"]
        },
        {
          name: "Avocado Toast",
          price: 190,
          ingredients: ["bread", "avocado", "olive oil", "salt"]
        },
        {
          name: "Vegan Burrito",
          price: 230,
          ingredients: ["tortilla", "beans", "rice", "avocado"]
        },
        {
          name: "Fruit Smoothie",
          price: 150,
          ingredients: ["banana", "strawberry", "almond milk"]
        },
        {
          name: "Grilled Paneer Salad",
          price: 200,
          ingredients: ["paneer", "lettuce", "tomato", "olive oil"]
        }
      ]
    }
  }
];
