import { db } from "./../../db/db";
import type { Restaurant } from "../restaurant/restaurant.type";
import type { Menu } from "./menu.types";
import { NotFoundError, BadRequest } from "../../errors";
import { getRestaurant } from "../../db/helper";
export const menuOrm = {
  async fetchMenu(restaurant_id: number): Promise<Menu> {

    const restaurant: Restaurant = await getRestaurant(restaurant_id)
    const menu = restaurant.menu;
    menu.items = menu.items.filter((item) => !item.out_of_stock);
    if (!menu) {
      throw new NotFoundError("No menu for this restaurant");
    }
    return menu;
  },

  async markIngredientOutOfStock(
    restaurant_id: number,
    ingredient: string
  ): Promise<Menu> {

    const restaurant: Restaurant = await getRestaurant(restaurant_id)

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

  async markIngredientBackInStock(restaurant_id: number, ingredient: string):Promise<Menu> {
    

    const restaurant: Restaurant = await getRestaurant(restaurant_id)

    const menu = restaurant.menu;
    if (!menu) {
      throw new NotFoundError("No menu for this restaurant");
    }
    let ingredientFound = false;
    for (const item of menu.items) {
      const index = item.out_of_stock_items.indexOf(ingredient);
      if (index != -1) {
        ingredientFound = true;

        item.out_of_stock_items.splice(index, 1);

        if (item.out_of_stock_items.length === 0) {
          item.out_of_stock = false;
        }
      }
    }
    if (!ingredientFound) {
      throw new NotFoundError(
        `Ingredient '${ingredient}' is not marked out of stock`
      );
    }

    return menu;
  },
  async removeItem(restaurant_id:number,item_name:string):Promise<Menu>{

    const restaurant: Restaurant = await getRestaurant(restaurant_id)

    const menu = restaurant.menu;
    if (!menu) {
      throw new NotFoundError("No menu for this restaurant");
    }
    menu.items.filter(items => items.name != item_name);
    return menu;
  }
};
