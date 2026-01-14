import { z } from "zod";
import { Device } from "./menu.types";
import { error } from "console";
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


export const markIngredientBackInStockSchema = z.object({
  restaurant_id: z.coerce.number({
    error:"Invalid restaurant_id"
  }),
  ingredient: z.string({
    error:"Invalid restaurant_id"
  })
})

export const removeItemParamsSchema = z.object({
  restaurant_id: z.coerce.number({
    error:"Invalid restaurant_id"
  }),
  item_name: z.string({
    error:"Invalid restaurant_id"
  })
})

export const updatePriceSchema = z.object({
  restaurant_id: z.coerce.number({
    error:"Invalid restaurant_id"
  }),
  item_name: z.string({
    error:"Invalid restaurant_id"
  }),
  price: z.number({
    error:"Invalid price value"
  }),
  device: z.enum(Device, {
    error: "Invalid device provided",
  }),
})