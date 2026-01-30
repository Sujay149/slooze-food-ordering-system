import { Injectable } from '@nestjs/common';
import { Restaurant, Country } from '../common/types';

// Mock restaurant database
const mockRestaurants: Restaurant[] = [
  // India Restaurants
  {
    id: 'r1',
    name: 'Spice Route',
    country: Country.INDIA,
    description: 'Authentic North Indian cuisine with aromatic spices',
  },
  {
    id: 'r2',
    name: 'Taj Mahal Restaurant',
    country: Country.INDIA,
    description: 'Royal Mughlai delicacies and biryanis',
  },
  {
    id: 'r3',
    name: 'Dosa Plaza',
    country: Country.INDIA,
    description: 'South Indian breakfast and snacks',
  },
  {
    id: 'r4',
    name: 'Pizza Italiana',
    country: Country.INDIA,
    description: 'Wood-fired pizzas and Italian classics',
  },
  {
    id: 'r5',
    name: 'Chinese Wok',
    country: Country.INDIA,
    description: 'Indo-Chinese fusion favorites',
  },
  {
    id: 'r6',
    name: 'Burger Street',
    country: Country.INDIA,
    description: 'Gourmet burgers and loaded fries',
  },
  {
    id: 'r7',
    name: 'Rolls Mania',
    country: Country.INDIA,
    description: 'Kolkata-style kathi rolls and wraps',
  },
  {
    id: 'r8',
    name: 'Sweet Tooth Desserts',
    country: Country.INDIA,
    description: 'Indian sweets and desserts',
  },
  {
    id: 'r9',
    name: 'Curry House',
    country: Country.INDIA,
    description: 'Home-style Indian curries and thalis',
  },
  {
    id: 'r10',
    name: 'Tandoor Express',
    country: Country.INDIA,
    description: 'Tandoori specialties and kebabs',
  },
  
  // America Restaurants
  {
    id: 'r11',
    name: 'American Diner',
    country: Country.AMERICA,
    description: 'Classic comfort food and breakfast all day',
  },
  {
    id: 'r12',
    name: 'Burger Palace',
    country: Country.AMERICA,
    description: 'Premium handcrafted burgers',
  },
  {
    id: 'r13',
    name: 'Pizza Hub',
    country: Country.AMERICA,
    description: 'New York style pizzas',
  },
  {
    id: 'r14',
    name: 'Taco Bell Express',
    country: Country.AMERICA,
    description: 'Mexican tacos, burritos, and quesadillas',
  },
  {
    id: 'r15',
    name: 'Sushi Garden',
    country: Country.AMERICA,
    description: 'Fresh sushi and Japanese cuisine',
  },
  {
    id: 'r16',
    name: 'Steakhouse Grill',
    country: Country.AMERICA,
    description: 'Premium steaks and grilled meats',
  },
  {
    id: 'r17',
    name: 'Noodle House',
    country: Country.AMERICA,
    description: 'Asian noodles and stir-fry',
  },
  {
    id: 'r18',
    name: 'Healthy Bowls',
    country: Country.AMERICA,
    description: 'Fresh salads and smoothie bowls',
  },
  {
    id: 'r19',
    name: 'BBQ Nation',
    country: Country.AMERICA,
    description: 'Smoked BBQ and ribs',
  },
  {
    id: 'r20',
    name: 'Cafe Mocha',
    country: Country.AMERICA,
    description: 'Coffee, pastries, and light bites',
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
