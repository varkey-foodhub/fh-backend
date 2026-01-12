import { z } from "zod";

export const menuParamsSchema = z.object({
  restaurant_id: z.coerce.number({
    error:"Invalid restaurant_id"
  })
});

export const markIngredientOutOfStockSchema = z.object({
  restaurant_id: z.coerce.number({
    error:"Invalid restaurant_id"
  }),
  ingredient: z.string({
    error:"Invalid restaurant_id"
  })
})