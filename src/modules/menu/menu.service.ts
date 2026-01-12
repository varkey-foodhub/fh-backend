import { menuRepo } from "./menu.repo";
import type { Menu } from "./menu.types";
export const MenuService = {
    async getRestaurantMenu(restaurant_id:number): Promise<Menu>{
        const menu: Promise<Menu> = menuRepo.fetchMenu(restaurant_id);
        return menu;
    },
    async markIngredientOutOfStock(restaurant_id:number, ingredient:string):Promise<Menu>{
        const menu: Promise<Menu> = menuRepo.markIngredientOutOfStock(restaurant_id,ingredient)
        return menu;
    }
}