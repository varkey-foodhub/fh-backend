import type { Restaurant } from "../modules/restaurant/restaurant.type";
import { db } from "./db";
import { ERRORS } from "../errors";
export async function getRestaurant(restaurant_id):Promise<Restaurant>{
    const restaurant: Restaurant | undefined = db.find(
        (restaurant) => restaurant.id === restaurant_id
      );
      if (!restaurant) {
        throw  ERRORS.RESTAURANT_NOT_FOUND
      }
      return restaurant
}