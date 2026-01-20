import { menuRepo } from "./menu.repo";
import { sseManager } from "../../events/sse.manager";
import { EVENTS } from "../../events/events.types";
import type { Device, Menu } from "./menu.types";
export const MenuService = {
  async getRestaurantMenu(restaurant_id: number): Promise<Menu> {
    const menu: Promise<Menu> = menuRepo.fetchMenu(restaurant_id);
    return menu;
  },
  async markIngredientOutOfStock(
    restaurant_id: number,
    ingredient: string
  ): Promise<Menu> {
    const menu: Menu = await menuRepo.markIngredientOutOfStock(
      restaurant_id,
      ingredient
    );
    sseManager.emitToRestaurant(restaurant_id, EVENTS.MENU_UPDATED, { menu });
    return menu;
  },
  async markIngredientBackInStock(
    restaurant_id: number,
    ingredient: string
  ): Promise<Menu> {
    const menu: Menu = await menuRepo.markIngreidientBackInStock(
      restaurant_id,
      ingredient
    );
    sseManager.emitToRestaurant(restaurant_id, EVENTS.MENU_UPDATED, { menu });
    return menu;
  },
  async removeItem(restaurant_id: number, item_name: string): Promise<Menu> {
    const menu: Menu = await menuRepo.removeItem(restaurant_id, item_name);
    sseManager.emitToRestaurant(restaurant_id, EVENTS.MENU_UPDATED, { menu });
    return menu;
  },
  async updatePrice(
    restaurant_id: number,
    item_name: string,
    device: string,
    price: number
  ): Promise<Menu> {
    const menu: Menu = await menuRepo.updateItemPrice(
      restaurant_id,
      item_name,
      device,
      price
    );
    sseManager.emitToRestaurant(restaurant_id, EVENTS.MENU_UPDATED, { menu });
    return menu;
  },
  async updateItemIngredients(
    restaurant_id: number,
    item_name: string,
    ingredients: string[]
  ): Promise<Menu> {
    const menu: Menu = await menuRepo.updateItemIngredients(
      restaurant_id,
      item_name,
      ingredients
    );
    sseManager.emitToRestaurant(restaurant_id, EVENTS.MENU_UPDATED, { menu });
    return menu;
  },
};
