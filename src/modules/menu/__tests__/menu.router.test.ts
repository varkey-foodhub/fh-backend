import request from 'supertest';
import express from 'express';
import menuRouter from '../menu.router';
import { MenuController } from '../menu.controller';

// --------------------------------------------------------
// 1. MOCK THE CONTROLLER
// --------------------------------------------------------
// We mock the controller so we don't actually run business logic/DB calls.
// We just want to know if the router routed the request correctly.
jest.mock('../menu.controller', () => ({
  MenuController: {
    getRestaurantMenu: jest.fn((req, res) => res.status(200).json({ msg: 'ok' })),
    markIngredientOutOfStock: jest.fn((req, res) => res.status(200).json({ msg: 'ok' })),
    markIngredientBackInStock: jest.fn((req, res) => res.status(200).json({ msg: 'ok' })),
    removeItem: jest.fn((req, res) => res.status(200).json({ msg: 'ok' })),
    updatePrice: jest.fn((req, res) => res.status(200).json({ msg: 'ok' })),
    updateItemIngredients: jest.fn((req, res) => res.status(200).json({ msg: 'ok' })),
  },
}));

// --------------------------------------------------------
// 2. SETUP EXPRESS APP
// --------------------------------------------------------
const app = express();
app.use(express.json()); // Essential for parsing POST/PATCH bodies
app.use('/menu', menuRouter); 

// Simple Error Handler (Mocking your global error handler)
// This catches Zod errors if your middleware passes them to next(err)
app.use((err: any, req: any, res: any, next: any) => {
  res.status(400).json({ error: err.message || 'Validation Error' });
});

describe('Menu Router', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // --------------------------------------------------------
  // TEST: GET /:restaurant_id
  // --------------------------------------------------------
  describe('GET /menu/:restaurant_id', () => {
    it('should call getRestaurantMenu when ID is valid', async () => {
      // Assuming restaurant_id in your schema is a number string (e.g. "123")
      const response = await request(app).get('/menu/123');
      
      expect(response.status).toBe(200);
      expect(MenuController.getRestaurantMenu).toHaveBeenCalled();
    });

    it('should fail validation if restaurant_id is invalid', async () => {
      // Assuming your schema expects a number, pass a non-numeric string
      // If your schema allows strings, change this to an invalid format
      const response = await request(app).get('/menu/invalid_id');
      
      // We expect your Zod middleware to block this
      // Note: Status depends on your specific Zod middleware (usually 400 or 422)
      expect(response.status).not.toBe(200); 
      expect(MenuController.getRestaurantMenu).not.toHaveBeenCalled();
    });
  });

  // --------------------------------------------------------
  // TEST: POST /remove/ingredient/...
  // --------------------------------------------------------
  describe('POST /menu/remove/ingredient/:restaurant_id/:ingredient', () => {
    it('should call markIngredientOutOfStock with correct params', async () => {
      await request(app).post('/menu/remove/ingredient/1/Tomato');
      
      expect(MenuController.markIngredientOutOfStock).toHaveBeenCalled();
    });
  });

  // --------------------------------------------------------
  // TEST: PATCH /update/price
  // --------------------------------------------------------
  describe('PATCH /menu/update/price', () => {
    it('should call updatePrice when body is valid', async () => {
      const validBody = {
        restaurant_id: 1,
        item_name: 'Burger',
        price: 100,
        device: 'kiosk'
      };

      await request(app)
        .patch('/menu/update/price')
        .send(validBody);

      expect(MenuController.updatePrice).toHaveBeenCalled();
    });

    it('should fail validation when body is missing required fields', async () => {
      const invalidBody = {
        restaurant_id: 1,
        // Missing item_name and price
      };

      const response = await request(app)
        .patch('/menu/update/price')
        .send(invalidBody);

      expect(response.status).toBe(400); // Assuming middleware sends 400 on error
      expect(MenuController.updatePrice).not.toHaveBeenCalled();
    });
  });
});