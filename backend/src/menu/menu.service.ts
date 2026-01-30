import { Injectable } from '@nestjs/common';
import { MenuItem, Country } from '../common/types';

// Mock menu items database
const mockMenuItems: MenuItem[] = [
  // India - Spice Route
  { id: 'm1', restaurantId: 'r1', name: 'Butter Chicken', description: 'Creamy tomato curry', price: 350, country: Country.INDIA },
  { id: 'm2', restaurantId: 'r1', name: 'Paneer Tikka', description: 'Grilled cottage cheese', price: 280, country: Country.INDIA },
  { id: 'm3', restaurantId: 'r1', name: 'Biryani', description: 'Aromatic rice dish', price: 320, country: Country.INDIA },
  // India - Taj Mahal
  { id: 'm4', restaurantId: 'r2', name: 'Naan', description: 'Indian bread', price: 50, country: Country.INDIA },
  { id: 'm5', restaurantId: 'r2', name: 'Dal Makhani', description: 'Black lentil curry', price: 250, country: Country.INDIA },
  // America - American Diner
  { id: 'm6', restaurantId: 'r3', name: 'Pancakes', description: 'Fluffy breakfast pancakes', price: 12, country: Country.AMERICA },
  { id: 'm7', restaurantId: 'r3', name: 'Club Sandwich', description: 'Triple-decker sandwich', price: 15, country: Country.AMERICA },
  { id: 'm8', restaurantId: 'r3', name: 'Caesar Salad', description: 'Fresh romaine lettuce', price: 10, country: Country.AMERICA },
  // America - Burger Palace
  { id: 'm9', restaurantId: 'r4', name: 'Cheeseburger', description: 'Classic beef burger', price: 18, country: Country.AMERICA },
  { id: 'm10', restaurantId: 'r4', name: 'French Fries', description: 'Crispy fries', price: 6, country: Country.AMERICA },
];

@Injectable()
export class MenuService {
  findByRestaurant(restaurantId: string, userCountry?: Country): MenuItem[] {
    let items = mockMenuItems.filter((m) => m.restaurantId === restaurantId);
    
    // Country-based filtering
    if (userCountry) {
      items = items.filter((m) => m.country === userCountry);
    }
    
    return items;
  }

  findOne(id: string, userCountry?: Country): MenuItem | undefined {
    const item = mockMenuItems.find((m) => m.id === id);
    if (!item) return undefined;

    if (userCountry && item.country !== userCountry) {
      return undefined;
    }

    return item;
  }
}
