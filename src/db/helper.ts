import type { Restaurant } from "../modules/restaurant/restaurant.type";
import { db } from "./db";
import { NotFoundError } from "../errors";
export async function getRestaurant(restaurant_id):Promise<Restaurant>{
    const restaurant: Restaurant | undefined = db.find(
        (restaurant) => restaurant.id === restaurant_id
      );
      if (!restaurant) {
        throw new NotFoundError("No restaurant found");
      }
      return restaurant
}