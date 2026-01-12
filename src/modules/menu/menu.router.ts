import {Router} from 'express'
import { MenuController } from './menu.controller'
import { validate } from '../../middlewares/zod.middleware'
import { menuParamsSchema} from './menu.schema'


const menuRouter = new Router()

menuRouter.get('/:restaurant_id',
    validate({params:menuParamsSchema}),
    MenuController.getRestaurantMenu
)

export default menuRouter