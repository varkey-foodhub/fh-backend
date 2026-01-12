import { db } from "./../../db/db";
import type { Restaurant } from "../restaurant/restaurant.type";
import type { Menu } from "./menu.types";
import { NotFoundError, BadRequest } from "../../errors";

export const menuOrm = {
  async fetchMenu(restaurant_id: number): Promise<Menu> {
    if (restaurant_id == null) {
      throw new BadRequest("No restaurant_id provided");
    }

    const restaurant: Restaurant | undefined = db.find(
      (restaurant) => restaurant.id === restaurant_id
    );
    if (!restaurant) {
      throw new NotFoundError("No restaurant found");
    }
    const menu = restaurant.menu;
    menu.items = menu.items.filter(item => !item.out_of_stock)
    if (!menu) {
      throw new NotFoundError("No menu for this restaurant");
    }
    return menu;
  },

  async markIngredientOutOfStock(
    restaurant_id: number,
    ingredient: string
  ): Promise<Menu> {
    if (restaurant_id == null) {
      throw new BadRequest("No restaurant_id provided");
    }
    if (!ingredient) {
      throw new BadRequest("No ingredient provided");
    }

    const restaurant = db.find((restaurant) => restaurant.id === restaurant_id);
    if (!restaurant) {
      throw new NotFoundError("No restaurant found");
    }

    const menu = restaurant.menu;
    if (!menu) {
      throw new NotFoundError("No menu for this restaurant");
    }

    let ingredientUsed = false;

    for (const item of menu.items) {
      if (item.ingredients.includes(ingredient)) {
        ingredientUsed = true;

        item.out_of_stock = true;

        if (!item.out_of_stock_items.includes(ingredient)) {
          item.out_of_stock_items.push(ingredient);
        }
      }
    }

    if (!ingredientUsed) {
      throw new NotFoundError(
        `Ingredient '${ingredient}' not used in any menu item`
      );
    }

    return menu;
  },

  async removeMenuItem(
    restaurant_id: number,
    item_name: string
  ): Promise<Menu> {
    if (restaurant_id == null) {
      throw new BadRequest("invalid restaurant_id");
    }
    if (!item_name) {
      throw new BadRequest("Invalid menu item name");
    }

    const restaurant = db.find((restaurant) => restaurant.id == restaurant_id);

    if (!restaurant) {
      throw new NotFoundError("No restaurant found");
    }

    const menu: Menu = restaurant.menu;
    if (!menu) {
      throw new NotFoundError("No menu for this restaurant");
    }
    const initialLength = menu.items.length;

    menu.items = menu.items.filter((item) => item.name !== item_name);

    if (menu.items.length === initialLength) {
      throw new NotFoundError("Menu item not found");
    }

    return menu;
  },
};
