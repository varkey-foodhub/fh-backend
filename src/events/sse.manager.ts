import { Response } from "express";

type RestaurantId = number;

const subscribers = new Map<RestaurantId, Set<Response>>();

export const sseManager = {
  subscribe(restaurantId: RestaurantId, res: Response) {
    if (!subscribers.has(restaurantId)) {
      subscribers.set(restaurantId, new Set());
    }

    subscribers.get(restaurantId)!.add(res);
  },

  unsubscribe(restaurantId: RestaurantId, res: Response) {
    subscribers.get(restaurantId)?.delete(res);

    if (subscribers.get(restaurantId)?.size === 0) {
      subscribers.delete(restaurantId);
    }
  },

  emitToRestaurant(
    restaurant_id: RestaurantId,
    event: string,
    payload: unknown
  ) {
    const data = `event: ${event}\ndata: ${JSON.stringify(payload)}\n\n`;
    const clients = subscribers.get(restaurant_id);
    if (!clients) return;

    for (const res of clients) {
      res.write(data);
    }
  },
};
