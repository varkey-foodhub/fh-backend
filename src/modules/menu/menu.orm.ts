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
};
