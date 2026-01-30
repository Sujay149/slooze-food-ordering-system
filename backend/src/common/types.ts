export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  MEMBER = 'member',
}

export enum Country {
  INDIA = 'India',
  AMERICA = 'America',
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  country: Country;
}

export interface Restaurant {
  id: string;
  name: string;
  country: Country;
  description: string;
  image?: string;
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  country: Country;
  image?: string;
}

export interface Order {
  id: string;
  userId: string;
  restaurantId: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  country: Country;
  paymentMethodId?: string;
  createdAt: Date;
}

export interface OrderItem {
  menuItemId: string;
  quantity: number;
  price: number;
}

export enum OrderStatus {
  CREATED = 'created',      // Draft order, not yet finalized
  PLACED = 'placed',        // Order confirmed and submitted
  CANCELLED = 'cancelled',  // Order terminated
}

export interface PaymentMethod {
  id: string;
  userId: string;
  type: string;
  cardLast4?: string;
  isDefault: boolean;
}
