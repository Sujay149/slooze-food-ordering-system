import { Injectable } from '@nestjs/common';
import { Restaurant, Country } from '../common/types';

// Mock restaurant database
const mockRestaurants: Restaurant[] = [
  {
    id: 'r1',
    name: 'Spice Route',
    country: Country.INDIA,
    description: 'Authentic Indian cuisine',
  },
  {
    id: 'r2',
    name: 'Taj Mahal Restaurant',
    country: Country.INDIA,
    description: 'North Indian specialties',
  },
  {
    id: 'r3',
    name: 'American Diner',
    country: Country.AMERICA,
    description: 'Classic American food',
  },
  {
    id: 'r4',
    name: 'Burger Palace',
    country: Country.AMERICA,
    description: 'Best burgers in town',
  },
];

@Injectable()
export class RestaurantService {
  findAll(userCountry?: Country): Restaurant[] {
    if (!userCountry) {
      return mockRestaurants;
    }
    return mockRestaurants.filter((r) => r.country === userCountry);
  }

  findOne(id: string, userCountry?: Country): Restaurant | undefined {
    const restaurant = mockRestaurants.find((r) => r.id === id);
    if (!restaurant) return undefined;

    // Country-based filtering
    if (userCountry && restaurant.country !== userCountry) {
      return undefined;
    }

    return restaurant;
  }
}
