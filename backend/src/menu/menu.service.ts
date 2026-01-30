import { Injectable } from '@nestjs/common';
import { MenuItem, Country } from '../common/types';

// Mock menu items database
const mockMenuItems: MenuItem[] = [
  // r1 - Spice Route (North Indian)
  { id: 'm1', restaurantId: 'r1', name: 'Butter Chicken', description: 'Creamy tomato curry with tender chicken', price: 350, country: Country.INDIA },
  { id: 'm2', restaurantId: 'r1', name: 'Paneer Tikka', description: 'Grilled cottage cheese with spices', price: 280, country: Country.INDIA },
  { id: 'm3', restaurantId: 'r1', name: 'Chicken Biryani', description: 'Aromatic basmati rice with spiced chicken', price: 320, country: Country.INDIA },
  { id: 'm4', restaurantId: 'r1', name: 'Garlic Naan', description: 'Soft bread with garlic butter', price: 60, country: Country.INDIA },
  { id: 'm5', restaurantId: 'r1', name: 'Dal Makhani', description: 'Creamy black lentil curry', price: 240, country: Country.INDIA },

  // r2 - Taj Mahal (Mughlai)
  { id: 'm6', restaurantId: 'r2', name: 'Mutton Rogan Josh', description: 'Kashmiri lamb curry', price: 450, country: Country.INDIA },
  { id: 'm7', restaurantId: 'r2', name: 'Hyderabadi Biryani', description: 'Royal Hyderabadi style biryani', price: 380, country: Country.INDIA },
  { id: 'm8', restaurantId: 'r2', name: 'Tandoori Chicken', description: 'Clay oven roasted chicken', price: 320, country: Country.INDIA },
  { id: 'm9', restaurantId: 'r2', name: 'Shahi Paneer', description: 'Cottage cheese in royal gravy', price: 290, country: Country.INDIA },
  { id: 'm10', restaurantId: 'r2', name: 'Butter Naan', description: 'Traditional Indian flatbread', price: 50, country: Country.INDIA },

  // r3 - Dosa Plaza (South Indian)
  { id: 'm11', restaurantId: 'r3', name: 'Masala Dosa', description: 'Crispy crepe with potato filling', price: 120, country: Country.INDIA },
  { id: 'm12', restaurantId: 'r3', name: 'Idli Sambar', description: 'Steamed rice cakes with lentil soup', price: 80, country: Country.INDIA },
  { id: 'm13', restaurantId: 'r3', name: 'Medu Vada', description: 'Crispy lentil donuts', price: 90, country: Country.INDIA },
  { id: 'm14', restaurantId: 'r3', name: 'Rava Dosa', description: 'Crispy semolina crepe', price: 130, country: Country.INDIA },
  { id: 'm15', restaurantId: 'r3', name: 'Filter Coffee', description: 'South Indian style coffee', price: 50, country: Country.INDIA },

  // r4 - Pizza Italiana
  { id: 'm16', restaurantId: 'r4', name: 'Margherita Pizza', description: 'Classic tomato and mozzarella', price: 280, country: Country.INDIA },
  { id: 'm17', restaurantId: 'r4', name: 'Pepperoni Pizza', description: 'Spicy pepperoni and cheese', price: 350, country: Country.INDIA },
  { id: 'm18', restaurantId: 'r4', name: 'Pasta Alfredo', description: 'Creamy white sauce pasta', price: 240, country: Country.INDIA },
  { id: 'm19', restaurantId: 'r4', name: 'Garlic Bread', description: 'Toasted bread with garlic butter', price: 120, country: Country.INDIA },
  { id: 'm20', restaurantId: 'r4', name: 'Tiramisu', description: 'Classic Italian dessert', price: 180, country: Country.INDIA },

  // r5 - Chinese Wok
  { id: 'm21', restaurantId: 'r5', name: 'Veg Manchurian', description: 'Crispy veggie balls in sauce', price: 200, country: Country.INDIA },
  { id: 'm22', restaurantId: 'r5', name: 'Chicken Fried Rice', description: 'Stir-fried rice with chicken', price: 220, country: Country.INDIA },
  { id: 'm23', restaurantId: 'r5', name: 'Hakka Noodles', description: 'Stir-fried noodles', price: 180, country: Country.INDIA },
  { id: 'm24', restaurantId: 'r5', name: 'Chilli Chicken', description: 'Spicy chicken in Indo-Chinese sauce', price: 260, country: Country.INDIA },
  { id: 'm25', restaurantId: 'r5', name: 'Spring Rolls', description: 'Crispy vegetable rolls', price: 150, country: Country.INDIA },

  // r6 - Burger Street
  { id: 'm26', restaurantId: 'r6', name: 'Classic Burger', description: 'Beef patty with cheese and veggies', price: 180, country: Country.INDIA },
  { id: 'm27', restaurantId: 'r6', name: 'Chicken Burger', description: 'Grilled chicken fillet burger', price: 200, country: Country.INDIA },
  { id: 'm28', restaurantId: 'r6', name: 'Loaded Fries', description: 'Fries with cheese and toppings', price: 140, country: Country.INDIA },
  { id: 'm29', restaurantId: 'r6', name: 'Veggie Burger', description: 'Plant-based patty burger', price: 170, country: Country.INDIA },
  { id: 'm30', restaurantId: 'r6', name: 'Chocolate Shake', description: 'Thick chocolate milkshake', price: 120, country: Country.INDIA },

  // r7 - Rolls Mania
  { id: 'm31', restaurantId: 'r7', name: 'Chicken Kathi Roll', description: 'Spiced chicken wrapped in paratha', price: 140, country: Country.INDIA },
  { id: 'm32', restaurantId: 'r7', name: 'Paneer Roll', description: 'Cottage cheese roll with chutney', price: 120, country: Country.INDIA },
  { id: 'm33', restaurantId: 'r7', name: 'Egg Roll', description: 'Egg omelette wrapped in paratha', price: 80, country: Country.INDIA },
  { id: 'm34', restaurantId: 'r7', name: 'Mutton Roll', description: 'Minced mutton kathi roll', price: 180, country: Country.INDIA },
  { id: 'm35', restaurantId: 'r7', name: 'Veg Roll', description: 'Mixed vegetables in wrap', price: 100, country: Country.INDIA },

  // r8 - Sweet Tooth Desserts
  { id: 'm36', restaurantId: 'r8', name: 'Gulab Jamun', description: 'Sweet milk solid balls in syrup', price: 80, country: Country.INDIA },
  { id: 'm37', restaurantId: 'r8', name: 'Rasgulla', description: 'Spongy cottage cheese balls', price: 90, country: Country.INDIA },
  { id: 'm38', restaurantId: 'r8', name: 'Jalebi', description: 'Crispy sweet spirals', price: 70, country: Country.INDIA },
  { id: 'm39', restaurantId: 'r8', name: 'Kulfi', description: 'Indian ice cream', price: 60, country: Country.INDIA },
  { id: 'm40', restaurantId: 'r8', name: 'Ras Malai', description: 'Sweet cheese in cream', price: 100, country: Country.INDIA },

  // r9 - Curry House
  { id: 'm41', restaurantId: 'r9', name: 'Home Style Thali', description: 'Complete meal with rice and curries', price: 280, country: Country.INDIA },
  { id: 'm42', restaurantId: 'r9', name: 'Palak Paneer', description: 'Spinach and cottage cheese curry', price: 220, country: Country.INDIA },
  { id: 'm43', restaurantId: 'r9', name: 'Chole Bhature', description: 'Chickpea curry with fried bread', price: 150, country: Country.INDIA },
  { id: 'm44', restaurantId: 'r9', name: 'Rajma Chawal', description: 'Kidney beans with rice', price: 180, country: Country.INDIA },
  { id: 'm45', restaurantId: 'r9', name: 'Aloo Paratha', description: 'Potato stuffed flatbread', price: 120, country: Country.INDIA },

  // r10 - Tandoor Express
  { id: 'm46', restaurantId: 'r10', name: 'Tandoori Prawns', description: 'Clay oven grilled prawns', price: 450, country: Country.INDIA },
  { id: 'm47', restaurantId: 'r10', name: 'Chicken Tikka', description: 'Marinated grilled chicken chunks', price: 280, country: Country.INDIA },
  { id: 'm48', restaurantId: 'r10', name: 'Seekh Kebab', description: 'Minced meat on skewers', price: 320, country: Country.INDIA },
  { id: 'm49', restaurantId: 'r10', name: 'Paneer Tikka', description: 'Grilled cottage cheese', price: 250, country: Country.INDIA },
  { id: 'm50', restaurantId: 'r10', name: 'Tandoori Roti', description: 'Whole wheat tandoor bread', price: 40, country: Country.INDIA },

  // r11 - American Diner
  { id: 'm51', restaurantId: 'r11', name: 'Pancakes', description: 'Fluffy breakfast pancakes with syrup', price: 12, country: Country.AMERICA },
  { id: 'm52', restaurantId: 'r11', name: 'Club Sandwich', description: 'Triple-decker classic sandwich', price: 15, country: Country.AMERICA },
  { id: 'm53', restaurantId: 'r11', name: 'Caesar Salad', description: 'Fresh romaine with Caesar dressing', price: 10, country: Country.AMERICA },
  { id: 'm54', restaurantId: 'r11', name: 'Eggs Benedict', description: 'Poached eggs with hollandaise', price: 14, country: Country.AMERICA },
  { id: 'm55', restaurantId: 'r11', name: 'Milkshake', description: 'Classic vanilla milkshake', price: 6, country: Country.AMERICA },

  // r12 - Burger Palace
  { id: 'm56', restaurantId: 'r12', name: 'Double Cheeseburger', description: 'Two beef patties with cheese', price: 18, country: Country.AMERICA },
  { id: 'm57', restaurantId: 'r12', name: 'Bacon Burger', description: 'Burger with crispy bacon', price: 20, country: Country.AMERICA },
  { id: 'm58', restaurantId: 'r12', name: 'French Fries', description: 'Crispy golden fries', price: 6, country: Country.AMERICA },
  { id: 'm59', restaurantId: 'r12', name: 'Onion Rings', description: 'Battered and fried onion rings', price: 7, country: Country.AMERICA },
  { id: 'm60', restaurantId: 'r12', name: 'Chicken Nuggets', description: 'Crispy chicken nuggets', price: 9, country: Country.AMERICA },

  // r13 - Pizza Hub
  { id: 'm61', restaurantId: 'r13', name: 'Pepperoni Pizza', description: 'Classic pepperoni and mozzarella', price: 22, country: Country.AMERICA },
  { id: 'm62', restaurantId: 'r13', name: 'BBQ Chicken Pizza', description: 'BBQ sauce with grilled chicken', price: 24, country: Country.AMERICA },
  { id: 'm63', restaurantId: 'r13', name: 'Veggie Supreme', description: 'Loaded with fresh vegetables', price: 20, country: Country.AMERICA },
  { id: 'm64', restaurantId: 'r13', name: 'Meat Lovers Pizza', description: 'Loaded with assorted meats', price: 26, country: Country.AMERICA },
  { id: 'm65', restaurantId: 'r13', name: 'Garlic Breadsticks', description: 'Cheesy garlic breadsticks', price: 8, country: Country.AMERICA },

  // r14 - Taco Bell Express
  { id: 'm66', restaurantId: 'r14', name: 'Beef Taco', description: 'Seasoned beef in crispy shell', price: 4, country: Country.AMERICA },
  { id: 'm67', restaurantId: 'r14', name: 'Chicken Burrito', description: 'Grilled chicken burrito bowl', price: 11, country: Country.AMERICA },
  { id: 'm68', restaurantId: 'r14', name: 'Quesadilla', description: 'Cheese and chicken quesadilla', price: 9, country: Country.AMERICA },
  { id: 'm69', restaurantId: 'r14', name: 'Nachos Supreme', description: 'Loaded nachos with toppings', price: 10, country: Country.AMERICA },
  { id: 'm70', restaurantId: 'r14', name: 'Mexican Rice', description: 'Seasoned Mexican style rice', price: 5, country: Country.AMERICA },

  // r15 - Sushi Garden
  { id: 'm71', restaurantId: 'r15', name: 'California Roll', description: 'Crab, avocado, and cucumber', price: 14, country: Country.AMERICA },
  { id: 'm72', restaurantId: 'r15', name: 'Salmon Nigiri', description: 'Fresh salmon on rice', price: 16, country: Country.AMERICA },
  { id: 'm73', restaurantId: 'r15', name: 'Spicy Tuna Roll', description: 'Tuna with spicy mayo', price: 15, country: Country.AMERICA },
  { id: 'm74', restaurantId: 'r15', name: 'Miso Soup', description: 'Traditional Japanese soup', price: 6, country: Country.AMERICA },
  { id: 'm75', restaurantId: 'r15', name: 'Tempura Shrimp', description: 'Battered fried shrimp', price: 18, country: Country.AMERICA },

  // r16 - Steakhouse Grill
  { id: 'm76', restaurantId: 'r16', name: 'Ribeye Steak', description: '12oz premium ribeye', price: 45, country: Country.AMERICA },
  { id: 'm77', restaurantId: 'r16', name: 'Grilled Salmon', description: 'Atlantic salmon fillet', price: 32, country: Country.AMERICA },
  { id: 'm78', restaurantId: 'r16', name: 'BBQ Ribs', description: 'Slow-cooked pork ribs', price: 28, country: Country.AMERICA },
  { id: 'm79', restaurantId: 'r16', name: 'Mashed Potatoes', description: 'Creamy mashed potatoes', price: 7, country: Country.AMERICA },
  { id: 'm80', restaurantId: 'r16', name: 'Grilled Vegetables', description: 'Seasonal vegetable medley', price: 8, country: Country.AMERICA },

  // r17 - Noodle House
  { id: 'm81', restaurantId: 'r17', name: 'Pad Thai', description: 'Thai stir-fried rice noodles', price: 13, country: Country.AMERICA },
  { id: 'm82', restaurantId: 'r17', name: 'Lo Mein', description: 'Chinese egg noodles', price: 12, country: Country.AMERICA },
  { id: 'm83', restaurantId: 'r17', name: 'Ramen Bowl', description: 'Japanese noodle soup', price: 15, country: Country.AMERICA },
  { id: 'm84', restaurantId: 'r17', name: 'Singapore Noodles', description: 'Curry flavored rice noodles', price: 14, country: Country.AMERICA },
  { id: 'm85', restaurantId: 'r17', name: 'Dumplings', description: 'Pan-fried pork dumplings', price: 9, country: Country.AMERICA },

  // r18 - Healthy Bowls
  { id: 'm86', restaurantId: 'r18', name: 'Buddha Bowl', description: 'Quinoa with roasted vegetables', price: 14, country: Country.AMERICA },
  { id: 'm87', restaurantId: 'r18', name: 'Greek Salad', description: 'Feta cheese and olives', price: 11, country: Country.AMERICA },
  { id: 'm88', restaurantId: 'r18', name: 'Acai Bowl', description: 'Acai berry smoothie bowl', price: 12, country: Country.AMERICA },
  { id: 'm89', restaurantId: 'r18', name: 'Green Smoothie', description: 'Spinach and fruit smoothie', price: 8, country: Country.AMERICA },
  { id: 'm90', restaurantId: 'r18', name: 'Protein Bowl', description: 'Grilled chicken with greens', price: 15, country: Country.AMERICA },

  // r19 - BBQ Nation
  { id: 'm91', restaurantId: 'r19', name: 'Pulled Pork', description: 'Slow-smoked pulled pork', price: 16, country: Country.AMERICA },
  { id: 'm92', restaurantId: 'r19', name: 'Brisket Platter', description: 'Texas style smoked brisket', price: 24, country: Country.AMERICA },
  { id: 'm93', restaurantId: 'r19', name: 'Chicken Wings', description: 'Smoked BBQ chicken wings', price: 14, country: Country.AMERICA },
  { id: 'm94', restaurantId: 'r19', name: 'Coleslaw', description: 'Creamy cabbage slaw', price: 5, country: Country.AMERICA },
  { id: 'm95', restaurantId: 'r19', name: 'Cornbread', description: 'Sweet cornbread', price: 4, country: Country.AMERICA },

  // r20 - Cafe Mocha
  { id: 'm96', restaurantId: 'r20', name: 'Cappuccino', description: 'Espresso with foamed milk', price: 5, country: Country.AMERICA },
  { id: 'm97', restaurantId: 'r20', name: 'Latte', description: 'Espresso with steamed milk', price: 5, country: Country.AMERICA },
  { id: 'm98', restaurantId: 'r20', name: 'Croissant', description: 'Buttery French pastry', price: 4, country: Country.AMERICA },
  { id: 'm99', restaurantId: 'r20', name: 'Blueberry Muffin', description: 'Fresh baked muffin', price: 4, country: Country.AMERICA },
  { id: 'm100', restaurantId: 'r20', name: 'Avocado Toast', description: 'Smashed avocado on sourdough', price: 9, country: Country.AMERICA },
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
