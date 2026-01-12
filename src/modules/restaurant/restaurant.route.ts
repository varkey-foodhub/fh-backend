import Router from 'express'
import { validate } from '../../middlewares/zod.middleware'
import { menuStreamerSchema } from './restaurant.schema'
import { subscribeToRestaurant } from '../../events/sse.controller'
const restaurantRouter = new Router()

restaurantRouter.get('/menu/:restaurant_id',
    validate({params:menuStreamerSchema}),
    subscribeToRestaurant
)

export default restaurantRouter