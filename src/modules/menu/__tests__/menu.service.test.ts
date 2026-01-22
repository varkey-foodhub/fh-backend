import { MenuService } from '../menu.service';
import { menuRepo } from '../menu.repo';
import { sseManager } from '../../../events/sse.manager';
import { EVENTS } from '../../../events/events.types';


jest.mock('../menu.repo');
jest.mock('../../../events/sse.manager');

describe('MenuService', () => {
  // Clear mocks before every test so previous tests don't interfere
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Dummy data to be used in tests
  const mockRestaurantId = 1;
  const mockMenu = { 
    id: 1, 
    restaurant_id: 1, 
    items: [], 
    // ... add other necessary Menu type properties here
  } as any; 

  // --------------------------------------------------------
  // TEST CASE 1: getRestaurantMenu
  // --------------------------------------------------------
  describe('getRestaurantMenu', () => {
    it('should return the menu from the repo', async () => {
      (menuRepo.fetchMenu as jest.Mock).mockResolvedValue(mockMenu);

      const result = await MenuService.getRestaurantMenu(mockRestaurantId);

      expect(result).toEqual(mockMenu); 
      expect(menuRepo.fetchMenu).toHaveBeenCalledWith(mockRestaurantId); 
      expect(menuRepo.fetchMenu).toHaveBeenCalledTimes(1); 
    });
  });

  // --------------------------------------------------------
  // TEST CASE 2: markIngredientOutOfStock
  // --------------------------------------------------------
  describe('markIngredientOutOfStock', () => {
    it('should update repo and emit an SSE event', async () => {
      const ingredient = 'Tomato';

      
      (menuRepo.markIngredientOutOfStock as jest.Mock).mockResolvedValue(mockMenu);

      
      const result = await MenuService.markIngredientOutOfStock(mockRestaurantId, ingredient);

      expect(result).toEqual(mockMenu);

    
      expect(menuRepo.markIngredientOutOfStock).toHaveBeenCalledWith(mockRestaurantId, ingredient);

    
      expect(sseManager.emitToRestaurant).toHaveBeenCalledWith(
        mockRestaurantId,
        EVENTS.MENU_UPDATED,
        { menu: mockMenu }
      );
    });
  });

  
  describe('updatePrice', () => {
    it('should update price in repo and emit SSE', async () => {
      const params = {
        item_name: 'Burger',
        device: 'tablet',
        price: 150
      };
      (menuRepo.updateItemPrice as jest.Mock).mockResolvedValue(mockMenu);

      const result = await MenuService.updatePrice(
        mockRestaurantId, 
        params.item_name, 
        params.device, 
        params.price
      );

      expect(menuRepo.updateItemPrice).toHaveBeenCalledWith(
        mockRestaurantId,
        params.item_name,
        params.device,
        params.price
      );
      expect(sseManager.emitToRestaurant).toHaveBeenCalled();
    });
  });
});