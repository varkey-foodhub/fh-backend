import { db } from "./../../db/db";
import type { Restaurant } from "../restaurant/restaurant.type";
import type { Menu } from "./menu.types";
import { ERRORS } from "../../errors";
import { getRestaurant } from "../../db/helper";
export const menuOrm = {
  async fetchMenu(restaurant_id: number): Promise<Menu> {

    const restaurant: Restaurant = await getRestaurant(restaurant_id)
    const menu = restaurant.menu;
    menu.items = menu.items.filter((item) => !item.out_of_stock);
    if (!menu) {
      throw ERRORS.MENU_NOT_FOUND
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
      throw ERRORS.MENU_NOT_FOUND
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
      throw  ERRORS.INGREDIENT_NOT_FOUND
    }

    return menu;
  },

  async markIngredientBackInStock(restaurant_id: number, ingredient: string):Promise<Menu> {
    

    const restaurant: Restaurant = await getRestaurant(restaurant_id)

    const menu = restaurant.menu;
    if (!menu) {
      throw ERRORS.MENU_NOT_FOUND
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
      throw ERRORS.INGREDIENT_NOT_FOUND
    }

    return menu;
  },
  async removeItem(restaurant_id:number,item_name:string):Promise<Menu>{

    const restaurant: Restaurant = await getRestaurant(restaurant_id)

    const menu = restaurant.menu;
    if (!menu) {
      throw ERRORS.MENU_NOT_FOUND
    }
    menu.items.filter(items => items.name != item_name);
    return menu;
  }
};
