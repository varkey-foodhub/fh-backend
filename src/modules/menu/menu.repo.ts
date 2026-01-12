import { menuOrm } from "./menu.orm";
import { Menu } from "./menu.types";
export const menuRepo = {
    
    async fetchMenu(restaurant_id:number): Promise<Menu>{
        return menuOrm.fetchMenu(restaurant_id);
    },
    async markIngredientOutOfStock(restaurant_id:number, ingredient:string):Promise<Menu> {
        return menuOrm.markIngredientOutOfStock(restaurant_id,ingredient);
    },
    async markIngreidientBackInStock(restaurant_id:number, ingredient:string):Promise<Menu> {
        return menuOrm.markIngredientBackInStock(restaurant_id,ingredient);
    },
    async removeItem(restaurant_id:number, item_name:string):Promise<Menu>{
        return menuOrm.removeItem(restaurant_id,item_name);
    }
}