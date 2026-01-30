import { Injectable } from '@nestjs/common';
import { MenuItem, Country } from '../common/types';

// Mock menu items database
const mockMenuItems: MenuItem[] = [
  // r1 - Domino's Pizza (India)
  { id: 'm1', restaurantId: 'r1', name: 'Margherita Pizza', description: 'Classic cheese pizza with tomato sauce', price: 299, country: Country.INDIA, image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop' },
  { id: 'm2', restaurantId: 'r1', name: 'Farmhouse Pizza', description: 'Loaded with capsicum, onion, tomato & mushroom', price: 399, country: Country.INDIA, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop' },
  { id: 'm3', restaurantId: 'r1', name: 'Peppy Paneer Pizza', description: 'Chunky paneer with crisp capsicum and spicy red pepper', price: 449, country: Country.INDIA, image: 'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=400&h=300&fit=crop' },
  { id: 'm4', restaurantId: 'r1', name: 'Mexican Green Wave', description: 'Mexican herbs with onions, capsicum & red paprika', price: 399, country: Country.INDIA, image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=300&fit=crop' },

  // r2 - KFC (India)
  { id: 'm5', restaurantId: 'r2', name: 'Hot & Crispy Chicken', description: '4 Pcs signature chicken', price: 449, country: Country.INDIA, image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400&h=300&fit=crop' },
  { id: 'm6', restaurantId: 'r2', name: 'Zinger Burger', description: 'Crunchy chicken fillet burger', price: 199, country: Country.INDIA, image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=400&h=300&fit=crop' },
  { id: 'm7', restaurantId: 'r2', name: 'Popcorn Chicken', description: 'Bite-sized chicken pieces', price: 149, country: Country.INDIA, image: 'https://images.unsplash.com/photo-1562007908-17c67e878c88?w=400&h=300&fit=crop' },
  { id: 'm8', restaurantId: 'r2', name: 'Chicken Bucket', description: '6 Pcs hot & crispy chicken', price: 599, country: Country.INDIA, image: 'https://images.unsplash.com/photo-1598511726623-d2e9996892f0?w=400&h=300&fit=crop' },

  // r3 - McDonald's (India)
  { id: 'm9', restaurantId: 'r3', name: 'McAloo Tikki Burger', description: 'Indian potato patty burger', price: 45, country: Country.INDIA, image: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=400&h=300&fit=crop' },
  { id: 'm10', restaurantId: 'r3', name: 'McSpicy Chicken Burger', description: 'Spicy chicken fillet burger', price: 149, country: Country.INDIA, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&h=300&fit=crop' },
  { id: 'm11', restaurantId: 'r3', name: 'Chicken McNuggets', description: '6 Pcs chicken nuggets', price: 119, country: Country.INDIA, image: 'https://images.unsplash.com/photo-1619740455993-9e68f5f2f158?w=400&h=300&fit=crop' },
  { id: 'm12', restaurantId: 'r3', name: 'McFlurry Oreo', description: 'Vanilla soft serve with Oreo', price: 99, country: Country.INDIA, image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=300&fit=crop' },

  // r4 - Subway (India)
  { id: 'm13', restaurantId: 'r4', name: 'Veg Delight Sub', description: 'Loaded with fresh vegetables', price: 199, country: Country.INDIA, image: 'https://images.unsplash.com/photo-1555072956-7758afb20e8f?w=400&h=300&fit=crop' },
  { id: 'm14', restaurantId: 'r4', name: 'Chicken Tikka Sub', description: 'Grilled chicken tikka submarine', price: 249, country: Country.INDIA, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop' },
  { id: 'm15', restaurantId: 'r4', name: 'Paneer Tikka Sub', description: 'Indian paneer tikka sub', price: 229, country: Country.INDIA, image: 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=400&h=300&fit=crop' },

  // r5 - Burger King (India)
  { id: 'm16', restaurantId: 'r5', name: 'Whopper', description: 'Flame-grilled beef burger', price: 199, country: Country.INDIA, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop' },
  { id: 'm17', restaurantId: 'r5', name: 'Chicken Whopper', description: 'Grilled chicken burger', price: 189, country: Country.INDIA, image: 'https://images.unsplash.com/photo-1603064752734-4c48eff53d05?w=400&h=300&fit=crop' },
  { id: 'm18', restaurantId: 'r5', name: 'Veg Whopper', description: 'Vegetarian patty burger', price: 139, country: Country.INDIA, image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop' },

  // r6 - Behrouz Biryani (India)
  { id: 'm19', restaurantId: 'r6', name: 'Dum Gosht Biryani', description: 'Slow cooked mutton biryani', price: 499, country: Country.INDIA, image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=300&fit=crop' },
  { id: 'm20', restaurantId: 'r6', name: 'Murgh Tikka Biryani', description: 'Chicken tikka biryani', price: 399, country: Country.INDIA, image: 'https://images.unsplash.com/photo-1642821373181-696a54913e93?w=400&h=300&fit=crop' },
  { id: 'm21', restaurantId: 'r6', name: 'Subz-E-Biryani', description: 'Vegetable dum biryani', price: 299, country: Country.INDIA, image: 'https://images.unsplash.com/photo-1633945274586-a7f298f9e1b7?w=400&h=300&fit=crop' },
  { id: 'm22', restaurantId: 'r6', name: 'Kebab Platter', description: 'Assorted kebabs', price: 449, country: Country.INDIA, image: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=400&h=300&fit=crop' },

  // r7 - Wow! Momo (India)
  { id: 'm23', restaurantId: 'r7', name: 'Chicken Steamed Momo', description: '8 Pcs steamed chicken momos', price: 149, country: Country.INDIA, image: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=400&h=300&fit=crop' },
  { id: 'm24', restaurantId: 'r7', name: 'Veg Pan Fried Momo', description: '8 Pcs pan fried veg momos', price: 159, country: Country.INDIA, image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400&h=300&fit=crop' },
  { id: 'm25', restaurantId: 'r7', name: 'Chicken Darjeeling Momo', description: 'Spicy chicken momos', price: 169, country: Country.INDIA, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop' },

  // r8 - Haldiram's (India)
  { id: 'm26', restaurantId: 'r8', name: 'Chole Bhature', description: 'Chickpea curry with fried bread', price: 179, country: Country.INDIA, image: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=400&h=300&fit=crop' },
  { id: 'm27', restaurantId: 'r8', name: 'Raj Kachori', description: 'Large crispy kachori with toppings', price: 129, country: Country.INDIA, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop' },
  { id: 'm28', restaurantId: 'r8', name: 'Gulab Jamun', description: 'Sweet milk dumplings', price: 89, country: Country.INDIA, image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop' },

  // r9 - Biryani Blues (India)
  { id: 'm29', restaurantId: 'r9', name: 'Hyderabadi Chicken Dum Biryani', description: 'Authentic Hyderabadi style', price: 349, country: Country.INDIA, image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=300&fit=crop' },
  { id: 'm30', restaurantId: 'r9', name: 'Awadhi Mutton Biryani', description: 'Lucknowi style mutton biryani', price: 449, country: Country.INDIA, image: 'https://images.unsplash.com/photo-1642821373181-696a54913e93?w=400&h=300&fit=crop' },

  // r10 - Faasos (India)
  { id: 'm31', restaurantId: 'r10', name: 'Chicken Tikka Wrap', description: 'Grilled chicken tikka in wrap', price: 159, country: Country.INDIA, image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&h=300&fit=crop' },
  { id: 'm32', restaurantId: 'r10', name: 'Paneer Kathi Roll', description: 'Paneer wrapped in paratha', price: 139, country: Country.INDIA, image: 'https://images.unsplash.com/photo-1593252719532-26ab111ec5e0?w=400&h=300&fit=crop' },

  // r11 - The Bowl Company (India)
  { id: 'm33', restaurantId: 'r11', name: 'Butter Chicken Rice Bowl', description: 'Butter chicken with rice', price: 249, country: Country.INDIA, image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop' },
  { id: 'm34', restaurantId: 'r11', name: 'Thai Green Curry Bowl', description: 'Thai curry with jasmine rice', price: 269, country: Country.INDIA, image: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400&h=300&fit=crop' },

  // r12 - Chinese Wok (India)
  { id: 'm35', restaurantId: 'r12', name: 'Veg Hakka Noodles', description: 'Stir fried noodles', price: 189, country: Country.INDIA, image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&h=300&fit=crop' },
  { id: 'm36', restaurantId: 'r12', name: 'Chicken Manchurian', description: 'Chicken in spicy sauce', price: 249, country: Country.INDIA, image: 'https://images.unsplash.com/photo-1526318472351-c75fcf070305?w=400&h=300&fit=crop' },

  // r13 - La Pino'z Pizza (India)
  { id: 'm37', restaurantId: 'r13', name: 'Cheese Burst Pizza', description: 'Extra cheese loaded pizza', price: 399, country: Country.INDIA, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop' },
  { id: 'm38', restaurantId: 'r13', name: 'Mexican Fiesta Pizza', description: 'Spicy Mexican style pizza', price: 429, country: Country.INDIA, image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=300&fit=crop' },

  // r14 - Baskin Robbins (India)
  { id: 'm39', restaurantId: 'r14', name: 'Chocolate Chip Cookie Dough', description: 'Premium ice cream', price: 199, country: Country.INDIA, image: 'https://images.unsplash.com/photo-1567206563064-6f60f40a2b57?w=400&h=300&fit=crop' },
  { id: 'm40', restaurantId: 'r14', name: 'Mango Mania Sundae', description: 'Mango ice cream sundae', price: 149, country: Country.INDIA, image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=300&fit=crop' },

  // r15 - Theobroma (India)
  { id: 'm41', restaurantId: 'r15', name: 'Chocolate Brownie', description: 'Rich chocolate brownie', price: 129, country: Country.INDIA, image: 'https://images.unsplash.com/photo-1561364858-7af6b5896074?w=400&h=300&fit=crop' },
  { id: 'm42', restaurantId: 'r15', name: 'Red Velvet Pastry', description: 'Classic red velvet cake', price: 159, country: Country.INDIA, image: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=400&h=300&fit=crop' },

  // r16 - Papa John's (America)
  { id: 'm43', restaurantId: 'r16', name: 'The Works Pizza', description: 'Loaded with pepperoni, sausage, and veggies', price: 18, country: Country.AMERICA, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop' },
  { id: 'm44', restaurantId: 'r16', name: 'BBQ Chicken Bacon Pizza', description: 'BBQ sauce with chicken and bacon', price: 20, country: Country.AMERICA, image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=400&h=300&fit=crop' },
  { id: 'm45', restaurantId: 'r16', name: 'Garlic Parmesan Breadsticks', description: '8 pieces garlic breadsticks', price: 7, country: Country.AMERICA, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop' },

  // r17 - Taco Bell (America)
  { id: 'm46', restaurantId: 'r17', name: 'Crunchy Taco Supreme', description: 'Seasoned beef taco with toppings', price: 4, country: Country.AMERICA, image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&h=300&fit=crop' },
  { id: 'm47', restaurantId: 'r17', name: 'Burrito Supreme', description: 'Loaded beef burrito', price: 9, country: Country.AMERICA, image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&h=300&fit=crop' },
  { id: 'm48', restaurantId: 'r17', name: 'Nachos BellGrande', description: 'Loaded nachos with cheese and beef', price: 8, country: Country.AMERICA, image: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=400&h=300&fit=crop' },
  { id: 'm49', restaurantId: 'r17', name: 'Quesadilla', description: 'Grilled quesadilla with chicken', price: 7, country: Country.AMERICA, image: 'https://images.unsplash.com/photo-1599974164516-33faee082d85?w=400&h=300&fit=crop' },

  // r18 - Five Guys (America)
  { id: 'm50', restaurantId: 'r18', name: 'Hamburger', description: 'Fresh beef patty burger', price: 9, country: Country.AMERICA, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&h=300&fit=crop' },
  { id: 'm51', restaurantId: 'r18', name: 'Bacon Cheeseburger', description: 'Burger with bacon and cheese', price: 12, country: Country.AMERICA, image: 'https://images.unsplash.com/photo-1603064752734-4c48eff53d05?w=400&h=300&fit=crop' },
  { id: 'm52', restaurantId: 'r18', name: 'Cajun Fries', description: 'Spicy seasoned fries', price: 5, country: Country.AMERICA, image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=300&fit=crop' },

  // r19 - Chipotle (America)
  { id: 'm53', restaurantId: 'r19', name: 'Chicken Burrito Bowl', description: 'Rice bowl with grilled chicken', price: 11, country: Country.AMERICA, image: 'https://images.unsplash.com/photo-1599974464957-82015f2f0d8c?w=400&h=300&fit=crop' },
  { id: 'm54', restaurantId: 'r19', name: 'Steak Burrito', description: 'Grilled steak burrito', price: 13, country: Country.AMERICA, image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&h=300&fit=crop' },
  { id: 'm55', restaurantId: 'r19', name: 'Chips & Guacamole', description: 'Tortilla chips with guac', price: 5, country: Country.AMERICA, image: 'https://images.unsplash.com/photo-1601924582970-9238bcb495d9?w=400&h=300&fit=crop' },

  // r20 - Panda Express (America)
  { id: 'm56', restaurantId: 'r20', name: 'Orange Chicken', description: 'Sweet & spicy orange chicken', price: 10, country: Country.AMERICA, image: 'https://images.unsplash.com/photo-1526318472351-c75fcf070305?w=400&h=300&fit=crop' },
  { id: 'm57', restaurantId: 'r20', name: 'Beijing Beef', description: 'Crispy beef with sweet tangy sauce', price: 11, country: Country.AMERICA, image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop' },
  { id: 'm58', restaurantId: 'r20', name: 'Chow Mein', description: 'Stir-fried noodles', price: 8, country: Country.AMERICA, image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&h=300&fit=crop' },

  // r21 - Shake Shack (America)
  { id: 'm59', restaurantId: 'r21', name: 'ShackBurger', description: 'Cheeseburger with ShackSauce', price: 8, country: Country.AMERICA, image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop' },
  { id: 'm60', restaurantId: 'r21', name: 'SmokeShack', description: 'Burger with bacon and cherry peppers', price: 10, country: Country.AMERICA, image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=400&h=300&fit=crop' },
  { id: 'm61', restaurantId: 'r21', name: 'Crinkle Fries', description: 'Classic crispy fries', price: 4, country: Country.AMERICA, image: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?w=400&h=300&fit=crop' },

  // r22 - Panera Bread (America)
  { id: 'm62', restaurantId: 'r22', name: 'Broccoli Cheddar Soup', description: 'Creamy broccoli soup in bread bowl', price: 9, country: Country.AMERICA, image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop' },
  { id: 'm63', restaurantId: 'r22', name: 'Turkey Avocado BLT', description: 'Turkey sandwich with avocado', price: 11, country: Country.AMERICA, image: 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=400&h=300&fit=crop' },
  { id: 'm64', restaurantId: 'r22', name: 'Caesar Salad', description: 'Classic caesar with grilled chicken', price: 10, country: Country.AMERICA, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop' },

  // r23 - Chick-fil-A (America)
  { id: 'm65', restaurantId: 'r23', name: 'Chicken Sandwich', description: 'Original fried chicken sandwich', price: 6, country: Country.AMERICA, image: 'https://images.unsplash.com/photo-1562007908-17c67e878c88?w=400&h=300&fit=crop' },
  { id: 'm66', restaurantId: 'r23', name: 'Spicy Chicken Sandwich', description: 'Spicy fried chicken sandwich', price: 7, country: Country.AMERICA, image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400&h=300&fit=crop' },
  { id: 'm67', restaurantId: 'r23', name: 'Waffle Fries', description: 'Signature waffle-cut fries', price: 3, country: Country.AMERICA, image: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=400&h=300&fit=crop' },

  // r24 - Olive Garden (America)
  { id: 'm68', restaurantId: 'r24', name: 'Fettuccine Alfredo', description: 'Creamy Alfredo pasta', price: 15, country: Country.AMERICA, image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=300&fit=crop' },
  { id: 'm69', restaurantId: 'r24', name: 'Chicken Parmigiana', description: 'Breaded chicken with marinara', price: 17, country: Country.AMERICA, image: 'https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?w=400&h=300&fit=crop' },
  { id: 'm70', restaurantId: 'r24', name: 'Breadsticks', description: 'Unlimited warm breadsticks', price: 5, country: Country.AMERICA, image: 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=400&h=300&fit=crop' },

  // r25 - Buffalo Wild Wings (America)
  { id: 'm71', restaurantId: 'r25', name: 'Traditional Wings', description: '12 pc wings with sauce', price: 14, country: Country.AMERICA, image: 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=400&h=300&fit=crop' },
  { id: 'm72', restaurantId: 'r25', name: 'Boneless Wings', description: 'Boneless wings with buffalo sauce', price: 13, country: Country.AMERICA, image: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=400&h=300&fit=crop' },
  { id: 'm73', restaurantId: 'r25', name: 'Loaded Nachos', description: 'Tortilla chips with toppings', price: 12, country: Country.AMERICA, image: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=400&h=300&fit=crop' },

  // r26 - The Cheesecake Factory (America)
  { id: 'm74', restaurantId: 'r26', name: 'Original Cheesecake', description: 'Classic New York cheesecake', price: 9, country: Country.AMERICA, image: 'https://images.unsplash.com/photo-1533134242116-8a4e32d9e1f9?w=400&h=300&fit=crop' },
  { id: 'm75', restaurantId: 'r26', name: 'Chicken Madeira', description: 'Grilled chicken with madeira wine sauce', price: 22, country: Country.AMERICA, image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400&h=300&fit=crop' },
  { id: 'm76', restaurantId: 'r26', name: 'Four Cheese Pasta', description: 'Pasta with four cheese sauce', price: 18, country: Country.AMERICA, image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400&h=300&fit=crop' },

  // r27 - P.F. Chang's (America)
  { id: 'm77', restaurantId: 'r27', name: 'Mongolian Beef', description: 'Beef with scallions in sauce', price: 19, country: Country.AMERICA, image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop' },
  { id: 'm78', restaurantId: 'r27', name: 'Dynamite Shrimp', description: 'Crispy shrimp with spicy sauce', price: 15, country: Country.AMERICA, image: 'https://images.unsplash.com/photo-1559737558-2f5a70f8f56f?w=400&h=300&fit=crop' },
  { id: 'm79', restaurantId: 'r27', name: 'Pad Thai', description: 'Thai stir-fried rice noodles', price: 16, country: Country.AMERICA, image: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400&h=300&fit=crop' },

  // r28 - Starbucks (America)
  { id: 'm80', restaurantId: 'r28', name: 'Caramel Macchiato', description: 'Espresso with vanilla and caramel', price: 5, country: Country.AMERICA, image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop' },
  { id: 'm81', restaurantId: 'r28', name: 'Pumpkin Spice Latte', description: 'Fall favorite with pumpkin flavor', price: 6, country: Country.AMERICA, image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&h=300&fit=crop' },
  { id: 'm82', restaurantId: 'r28', name: 'Chocolate Croissant', description: 'Buttery croissant with chocolate', price: 4, country: Country.AMERICA, image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&h=300&fit=crop' },

  // r29 - Dunkin' (America)
  { id: 'm83', restaurantId: 'r29', name: 'Glazed Donut', description: 'Classic glazed donut', price: 2, country: Country.AMERICA, image: 'https://images.unsplash.com/photo-1514517521153-1be72277b32f?w=400&h=300&fit=crop' },
  { id: 'm84', restaurantId: 'r29', name: 'Coffee Coolatta', description: 'Frozen coffee beverage', price: 4, country: Country.AMERICA, image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=300&fit=crop' },
  { id: 'm85', restaurantId: 'r29', name: 'Bacon Egg Cheese', description: 'Breakfast sandwich', price: 5, country: Country.AMERICA, image: 'https://images.unsplash.com/photo-1619096252214-ef06c45683e3?w=400&h=300&fit=crop' },

  // r30 - Red Lobster (America)
  { id: 'm86', restaurantId: 'r30', name: 'Ultimate Feast', description: 'Lobster tail, shrimp, and crab legs', price: 34, country: Country.AMERICA, image: 'https://images.unsplash.com/photo-1559737558-2f5a70f8f56f?w=400&h=300&fit=crop' },
  { id: 'm87', restaurantId: 'r30', name: 'Cheddar Bay Biscuits', description: 'Famous warm biscuits', price: 5, country: Country.AMERICA, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop' },
  { id: 'm88', restaurantId: 'r30', name: 'Lobster Bisque', description: 'Creamy lobster soup', price: 9, country: Country.AMERICA, image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop' },
];

@Injectable()
export class MenuService {
  findByRestaurant(
    restaurantId: string,
    userCountry?: Country,
  ): MenuItem[] {
    return mockMenuItems.filter((item) => {
      if (item.restaurantId !== restaurantId) return false;
      if (userCountry && item.country !== userCountry) return false;
      return true;
    });
  }

  findOne(id: string, userCountry?: Country): MenuItem | undefined {
    const menuItem = mockMenuItems.find((item) => item.id === id);
    if (!menuItem) return undefined;

    // Country-based filtering
    if (userCountry && menuItem.country !== userCountry) {
      return undefined;
    }

    return menuItem;
  }
}
