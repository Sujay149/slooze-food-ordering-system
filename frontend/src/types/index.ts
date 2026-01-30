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
  role: UserRole;
  country: Country;
}

export interface Restaurant {
  id: string;
  name: string;
  country: Country;
  description: string;
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  country: Country;
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
  createdAt: string;
}

export interface OrderItem {
  menuItemId: string;
  quantity: number;
  price: number;
}

export enum OrderStatus {
  CREATED = 'created',      // Draft order
  PLACED = 'placed',        // Finalized order
  CANCELLED = 'cancelled',  // Cancelled order
}

export interface PaymentMethod {
  id: string;
  userId: string;
  type: string;
  cardLast4?: string;
  isDefault: boolean;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}
