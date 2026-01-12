import { z } from "zod";

export const menuParamsSchema = z.object({
  id: z.coerce.number({
    error:"Invalid restaurant_id"
  })
});

