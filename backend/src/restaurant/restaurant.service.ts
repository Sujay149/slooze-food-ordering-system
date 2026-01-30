import { Injectable } from '@nestjs/common';
import { Restaurant, Country } from '../common/types';

// Mock restaurant database
const mockRestaurants: Restaurant[] = [
  // India Restaurants
  {
    id: 'r1',
    name: 'Domino\'s Pizza',
    country: Country.INDIA,
    description: 'Pizza, Fast Food, Italian',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&h=300&fit=crop',
  },
  {
    id: 'r2',
    name: 'KFC',
    country: Country.INDIA,
    description: 'Burgers, Fast Food, American',
    image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=500&h=300&fit=crop',
  },
  {
    id: 'r3',
    name: 'McDonald\'s',
    country: Country.INDIA,
    description: 'Burgers, Fast Food, American',
    image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=500&h=300&fit=crop',
  },
  {
    id: 'r4',
    name: 'Subway',
    country: Country.INDIA,
    description: 'Healthy Food, Salads, Sandwiches',
    image: 'https://images.unsplash.com/photo-1555072956-7758afb20e8f?w=500&h=300&fit=crop',
  },
  {
    id: 'r5',
    name: 'Burger King',
    country: Country.INDIA,
    description: 'Burgers, American',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&h=300&fit=crop',
  },
  {
    id: 'r6',
    name: 'Behrouz Biryani',
    country: Country.INDIA,
    description: 'Biryani, Mughlai, North Indian',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&h=300&fit=crop',
  },
  {
    id: 'r7',
    name: 'Wow! Momo',
    country: Country.INDIA,
    description: 'Tibetan, Chinese, Asian',
    image: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=500&h=300&fit=crop',
  },
  {
    id: 'r8',
    name: 'Haldiram\'s',
    country: Country.INDIA,
    description: 'North Indian, Sweets, Chaat, South Indian',
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500&h=300&fit=crop',
  },
  {
    id: 'r9',
    name: 'Biryani Blues',
    country: Country.INDIA,
    description: 'Biryani, Hyderabadi, North Indian, Kebabs',
    image: 'https://images.unsplash.com/photo-1642821373181-696a54913e93?w=500&h=300&fit=crop',
  },
  {
    id: 'r10',
    name: 'Faasos',
    country: Country.INDIA,
    description: 'Wraps, Fast Food, North Indian',
    image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=500&h=300&fit=crop',
  },
  {
    id: 'r11',
    name: 'The Bowl Company',
    country: Country.INDIA,
    description: 'Continental, Indian, Asian',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&h=300&fit=crop',
  },
  {
    id: 'r12',
    name: 'Chinese Wok',
    country: Country.INDIA,
    description: 'Chinese, Asian, Tibetan, Thai',
    image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=500&h=300&fit=crop',
  },
  {
    id: 'r13',
    name: 'La Pino\'z Pizza',
    country: Country.INDIA,
    description: 'Pizzas, Pastas, Italian, Fast Food',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&h=300&fit=crop',
  },
  {
    id: 'r14',
    name: 'Baskin Robbins',
    country: Country.INDIA,
    description: 'Desserts, Ice Cream, Beverages',
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500&h=300&fit=crop',
  },
  {
    id: 'r15',
    name: 'Theobroma',
    country: Country.INDIA,
    description: 'Bakery, Desserts',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&h=300&fit=crop',
  },
  
  // America Restaurants
  {
    id: 'r16',
    name: 'Papa John\'s',
    country: Country.AMERICA,
    description: 'Pizza, Italian, Fast Food',
    image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=500&h=300&fit=crop',
  },
  {
    id: 'r17',
    name: 'Taco Bell',
    country: Country.AMERICA,
    description: 'Mexican, Fast Food',
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=500&h=300&fit=crop',
  },
  {
    id: 'r18',
    name: 'Five Guys',
    country: Country.AMERICA,
    description: 'Burgers, Fast Food, American',
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=500&h=300&fit=crop',
  },
  {
    id: 'r19',
    name: 'Chipotle',
    country: Country.AMERICA,
    description: 'Mexican, Healthy, Bowls',
    image: 'https://images.unsplash.com/photo-1599974164516-33faee082d85?w=500&h=300&fit=crop',
  },
  {
    id: 'r20',
    name: 'Panda Express',
    country: Country.AMERICA,
    description: 'Chinese, Asian',
    image: 'https://images.unsplash.com/photo-1526318472351-c75fcf070305?w=500&h=300&fit=crop',
  },
  {
    id: 'r21',
    name: 'Shake Shack',
    country: Country.AMERICA,
    description: 'Burgers, Fast Food, American',
    image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500&h=300&fit=crop',
  },
  {
    id: 'r22',
    name: 'Panera Bread',
    country: Country.AMERICA,
    description: 'Bakery, Sandwiches, Salads, Healthy',
    image: 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=500&h=300&fit=crop',
  },
  {
    id: 'r23',
    name: 'Chick-fil-A',
    country: Country.AMERICA,
    description: 'Chicken, Fast Food, American',
    image: 'https://images.unsplash.com/photo-1562007908-17c67e878c88?w=500&h=300&fit=crop',
  },
  {
    id: 'r24',
    name: 'Olive Garden',
    country: Country.AMERICA,
    description: 'Italian, Pasta, Pizza',
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=500&h=300&fit=crop',
  },
  {
    id: 'r25',
    name: 'Buffalo Wild Wings',
    country: Country.AMERICA,
    description: 'American, Wings, Sports Bar',
    image: 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=500&h=300&fit=crop',
  },
  {
    id: 'r26',
    name: 'The Cheesecake Factory',
    country: Country.AMERICA,
    description: 'American, Desserts, Continental',
    image: 'https://images.unsplash.com/photo-1533134242116-8a4e32d9e1f9?w=500&h=300&fit=crop',
  },
  {
    id: 'r27',
    name: 'P.F. Chang\'s',
    country: Country.AMERICA,
    description: 'Asian, Chinese, Thai',
    image: 'https://images.unsplash.com/photo-1512003867696-6d5ce6835040?w=500&h=300&fit=crop',
  },
  {
    id: 'r28',
    name: 'Starbucks',
    country: Country.AMERICA,
    description: 'Beverages, Cafe, Desserts',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&h=300&fit=crop',
  },
  {
    id: 'r29',
    name: 'Dunkin\'',
    country: Country.AMERICA,
    description: 'Bakery, Beverages, Fast Food',
    image: 'https://images.unsplash.com/photo-1514517521153-1be72277b32f?w=500&h=300&fit=crop',
  },
  {
    id: 'r30',
    name: 'Red Lobster',
    country: Country.AMERICA,
    description: 'Seafood, American',
    image: 'https://images.unsplash.com/photo-1559737558-2f5a70f8f56f?w=500&h=300&fit=crop',
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
