import {db} from './../../db/db'
import type { Restaurant } from '../restaurant/restaurant.type'
import type { Menu } from './menu.types'
import { NotFoundError,BadRequest } from '../../errors'

export const menuOrm = {

    async fetchMenu(restaurant_id:number): Promise<Menu>{

        if(restaurant_id == null){
            throw new BadRequest("No restaurant_id provided")
        }

        const restaurant : Restaurant | undefined = db.find( restaurant => restaurant.id === restaurant_id) 
        if(!restaurant){
            throw new NotFoundError("No restaurant found");
        }
        const menu = restaurant.menu;
        if (!menu){
            throw new NotFoundError("No menu for this restaurant")
        }
        return menu
    }


}