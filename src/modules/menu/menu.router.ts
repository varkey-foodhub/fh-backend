import {Router} from 'express'
import { MenuController } from './menu.controller'
import { validate } from '../../middlewares/zod.middleware'
import { menuParamsSchema, markIngredientOutOfStockSchema, markIngredientBackInStockSchema,removeItemParamsSchema} from './menu.schema'



const menuRouter = new Router();

menuRouter.get(
  "/:restaurant_id",
  validate({ params: menuParamsSchema }),
  MenuController.getRestaurantMenu
);

menuRouter.post(
  "/remove/ingredient/:restaurant_id/:ingredient",
  validate({
    params: markIngredientOutOfStockSchema,
  }),
  MenuController.markIngredientOutOfStock
);

menuRouter.post(
  "/remove/item/:restaurant_id/:item_name",
  validate({
    params: removeItemParamsSchema,
  }),
  MenuController.removeItem
);
menuRouter.post('/add/ingredient/:restaurant_id/:ingredient',
    validate({
        params:markIngredientBackInStockSchema
    }),
    MenuController.markIngredientBackInStock
)


export default menuRouter;
