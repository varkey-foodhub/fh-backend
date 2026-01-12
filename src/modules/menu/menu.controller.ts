import type {Request,Response,NextFunction} from 'express'
import { MenuService } from './menu.service'

export const MenuController = {
    async getRestaurantMenu(req:Request,res:Response,next:NextFunction){
        try{
            const data = await MenuService.getRestaurantMenu(req.params.restaurant_id);
            res.json({
                status:200,
                message:data
            });
        }catch(e){
            next(e)
        }
    },
    async markIngredientOutOfStock(req:Request,res:Response,next:NextFunction){
        try{
            const data = await MenuService.markIngredientOutOfStock(req.params.restaurant_id,req.params.ingredient)
            res.json({
                status:200,
                message:data
            })
        }catch(e){
            next(e)
        }
    },
    async markIngredientBackInStock(req:Request,res:Response,next:NextFunction){
        try{
            const data = await MenuService.markIngredientBackInStock(req.params.restaurant_id,req.params.ingredient)
            res.json({
                status:200,
                message:data
            })
        }catch(e){
            next(e)
        }
    },
    async removeItem(req:Request,res:Response,next:NextFunction){
        try{
            const data = await MenuService.removeItem(req.params.restaurant_id,req.params.item_name)
            res.json({
                status:200,
                message:data
            })
        }catch(e){
            next(e)
        }
    }
}