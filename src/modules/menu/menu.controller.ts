import type {Request,Response,NextFunction} from 'express'
import { MenuService } from './menu.service'

export const MenuController = {
    async getRestaurantMenu(req:Request,res:Response,next:NextFunction){
        try{
            const data = await MenuService.getRestaurantMenu(req.params.id);
            res.json({
                status:200,
                message:data
            });
        }catch(e){
            next(e)
        }
    }
}