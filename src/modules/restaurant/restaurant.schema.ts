import {z} from 'zod'

export const menuStreamerSchema = z.object({
    restaurant_id: z.coerce.number({
        error:"Invalid restaurant_id"
    })
})