import type {Request,Response,NextFunction} from 'express'
import { MenuService } from './menu.service'
import { sendResponse } from '../../utils/response.builder';
export const MenuController = {
    async getRestaurantMenu(req:Request,res:Response,next:NextFunction){
        try{
            const data = await MenuService.getRestaurantMenu(req.params.restaurant_id);
            return sendResponse(res, {
                data: data,
                message: "Fetched Restaurant Menu",
              });
        }catch(e){
            next(e)
        }
    },
    async markIngredientOutOfStock(req:Request,res:Response,next:NextFunction){
        try{
            const data = await MenuService.markIngredientOutOfStock(req.params.restaurant_id,req.params.ingredient)
            return sendResponse(res, {
                data: data,
                message: "Ingredient marked out of stock",
              });
        }catch(e){
            next(e)
        }
    },
    async markIngredientBackInStock(req:Request,res:Response,next:NextFunction){
        try{
            const data = await MenuService.markIngredientBackInStock(req.params.restaurant_id,req.params.ingredient)
            return sendResponse(res, {
                data: data,
                message: "Ingredient marked back in stock",
              });
        }catch(e){
            next(e)
        }
    },
    async removeItem(req:Request,res:Response,next:NextFunction){
        try{
            const data = await MenuService.removeItem(req.params.restaurant_id,req.params.item_name)
            return sendResponse(res, {
                data: data,
                message: "Item removed from menu",
              });
        }catch(e){
            next(e)
        }
    }
}