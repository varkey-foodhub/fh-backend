import type {Request,Response,NextFunction} from 'express'
import { MenuService } from './menu.service'
import { sendResponse } from '../../utils/response.builder';
import { asyncHandler } from '../../utils/asyncHandler';
export const MenuController = {
    getRestaurantMenu: asyncHandler(async (req:Request, res:Response) => {
      const data = await MenuService.getRestaurantMenu(
        req.params.restaurant_id
      );
  
      return sendResponse(res, {
        data,
        message: "Fetched Restaurant Menu",
      });
    }),
  
    markIngredientOutOfStock: asyncHandler(async (req:Request, res:Response) => {
      const data = await MenuService.markIngredientOutOfStock(
        req.params.restaurant_id,
        req.params.ingredient
      );
  
      return sendResponse(res, {
        data,
        message: "Ingredient marked out of stock",
      });
    }),
  
    markIngredientBackInStock: asyncHandler(async (req:Request, res:Response) => {
      const data = await MenuService.markIngredientBackInStock(
        req.params.restaurant_id,
        req.params.ingredient
      );
  
      return sendResponse(res, {
        data,
        message: "Ingredient marked back in stock",
      });
    }),
  
    removeItem: asyncHandler(async (req:Request, res:Response) => {
      const data = await MenuService.removeItem(
        req.params.restaurant_id,
        req.params.item_name
      );
  
      return sendResponse(res, {
        data,
        message: "Item removed from menu",
      });
    }),

    updatePrice: asyncHandler(async (req: Request, res: Response) => {
      const {
        restaurant_id,
        item_name,
        price,
        device,
      } = req.body;
    
      const data = await MenuService.updatePrice(
        restaurant_id,
        item_name,
        device,
        price
      );
    
      return sendResponse(res, {
        data,
        message: "Price updated successfully",
      });
    }),
    updateItemIngredients : asyncHandler(async (req:Request, res:Response) => {
      const {
        restaurant_id,
        item_name,
        ingredients,
      } = req.body;
    
      const data = await MenuService.updateItemIngredients(
        restaurant_id,
        item_name,
        ingredients
      );
    
      return sendResponse(res, {
        data,
        message: "Item ingredients updated successfully",
      });
    }
  )};
  