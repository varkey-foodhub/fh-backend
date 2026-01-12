import { menuOrm } from "./menu.orm";
import { Menu } from "./menu.types";
export const menuRepo = {
    
    async fetchMenu(restaurant_id:number): Promise<Menu>{
        return menuOrm.fetchMenu(restaurant_id);
    }
}