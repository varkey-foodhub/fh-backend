import { menuRepo } from "./menu.repo";
import { sseManager } from "../../events/sse.manager";
import { EVENTS } from "../../events/events.types";
import type { Menu } from "./menu.types";
export const MenuService = {
    async getRestaurantMenu(restaurant_id:number): Promise<Menu>{
        const menu: Promise<Menu> = menuRepo.fetchMenu(restaurant_id);
        return menu;
    },
    async markIngredientOutOfStock(restaurant_id:number, ingredient:string):Promise<Menu>{
        const menu: Menu = await menuRepo.markIngredientOutOfStock(restaurant_id,ingredient)
        sseManager.emitToRestaurant(
            restaurant_id,
            EVENTS.MENU_UPDATED,
            { menu }
          );
        return menu;
    },
    async markIngredientBackInStock(restaurant_id:number, ingredient:string):Promise<Menu>{
        const menu: Menu = await menuRepo.markIngreidientBackInStock(restaurant_id,ingredient)
        sseManager.emitToRestaurant(
            restaurant_id,
            EVENTS.MENU_UPDATED,
            { menu }
          );
        return menu;
    },
    async removeItem(restaurant_id : number, item_name:string):Promise<Menu>{
        const menu: Menu = await menuRepo.removeItem(restaurant_id,item_name)
        sseManager.emitToRestaurant(
            restaurant_id,
            EVENTS.MENU_UPDATED,
            { menu }
          );
        return menu;
    }
}