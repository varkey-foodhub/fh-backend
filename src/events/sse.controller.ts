import { Request, Response } from "express";
import { sseManager } from "./sse.manager";

export const subscribeToRestaurant = (
  req: Request,
  res: Response
) => {
  const restaurant_id = Number(req.params.restaurant_id);

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  res.write("retry: 3000\n\n");

  sseManager.subscribe(restaurant_id, res);

  req.on("close", () => {
    sseManager.unsubscribe(restaurant_id, res);
  });
};
