import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Order, OrderStatus, OrderItem, Country, UserRole } from '../common/types';
import { AuthorizationHelper } from '../common/helpers/authorization.helper';
import { OrderStateMachine } from '../common/helpers/order-state-machine.helper';
import { MenuService } from '../menu/menu.service';
import { RestaurantService } from '../restaurant/restaurant.service';
import { CreateOrderDto } from './dto/create-order.dto';

// Mock order database
const mockOrders: Order[] = [];
let orderIdCounter = 1;

@Injectable()
export class OrderService {
  constructor(
    private menuService: MenuService,
    private restaurantService: RestaurantService,
  ) {}

  /**
   * Create a new order in CREATED (draft) status
   * All authenticated users can create orders
   */
  async create(
    createOrderDto: CreateOrderDto,
    userId: string,
    userCountry: Country,
  ): Promise<Order> {
    // Verify restaurant exists and user has access
    const restaurant = this.restaurantService.findOne(
      createOrderDto.restaurantId,
      userCountry,
    );

    if (!restaurant) {
      throw new NotFoundException('Restaurant not found or not accessible in your country');
    }

    // Validate all menu items exist and calculate total
    const orderItems = await this.validateAndBuildOrderItems(
      createOrderDto.items,
      userCountry,
    );

    const totalAmount = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    const order: Order = {
      id: `o${orderIdCounter++}`,
      userId,
      restaurantId: createOrderDto.restaurantId,
      items: orderItems,
      totalAmount,
      status: OrderStatus.CREATED, // Always start as draft
      country: userCountry,
      createdAt: new Date(),
    };

    mockOrders.push(order);
    return order;
  }

  /**
   * Get all orders with role-based filtering
   * - Admin: sees all orders
   * - Manager: sees all orders in their country
   * - Member: sees only their own orders
   */
  findAll(userId: string, userRole: UserRole, userCountry: Country): Order[] {
    if (userRole === UserRole.ADMIN) {
      return mockOrders;
    }

    if (userRole === UserRole.MANAGER) {
      // Managers see all orders in their country
      return mockOrders.filter((order) => order.country === userCountry);
    }

    // Members see only their own orders
    return mockOrders.filter(
      (order) => order.userId === userId && order.country === userCountry,
    );
  }

  /**
   * Get a single order by ID with country-based access control
   * Enforces country isolation even when accessing by direct ID
   */
  findOne(
    id: string,
    userId: string,
    userRole: UserRole,
    userCountry: Country,
  ): Order {
    const order = mockOrders.find((o) => o.id === id);

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Enforce country-based access control
    AuthorizationHelper.enforceCountryAccess(
      userRole,
      userCountry,
      order.country,
      'Order',
    );

    // Members can only view their own orders
    if (userRole === UserRole.MEMBER && order.userId !== userId) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  /**
   * Place (finalize) an order - transitions from CREATED to PLACED
   * Only Admin and Manager can place orders
   */
  placeOrder(
    id: string,
    userId: string,
    userRole: UserRole,
    userCountry: Country,
    paymentMethodId?: string,
  ): Order {
    // Enforce role-based access control
    AuthorizationHelper.enforceRoleAccess(
      userRole,
      [UserRole.ADMIN, UserRole.MANAGER],
      'place orders',
    );

    const order = this.findOne(id, userId, userRole, userCountry);

    // Validate state transition
    OrderStateMachine.validateCanPlace(order.status);

    // Update order status
    order.status = OrderStatus.PLACED;
    order.paymentMethodId = paymentMethodId;

    return order;
  }

  /**
   * Cancel an order - transitions from CREATED to CANCELLED
   * Only Admin and Manager can cancel orders
   */
  cancelOrder(
    id: string,
    userId: string,
    userRole: UserRole,
    userCountry: Country,
  ): Order {
    // Enforce role-based access control
    AuthorizationHelper.enforceRoleAccess(
      userRole,
      [UserRole.ADMIN, UserRole.MANAGER],
      'cancel orders',
    );

    const order = this.findOne(id, userId, userRole, userCountry);

    // Validate state transition
    OrderStateMachine.validateCanCancel(order.status);

    // Update order status
    order.status = OrderStatus.CANCELLED;

    return order;
  }

  /**
   * Private helper: Validate menu items and build order items with prices
   */
  private async validateAndBuildOrderItems(
    items: Array<{ menuItemId: string; quantity: number }>,
    userCountry: Country,
  ): Promise<OrderItem[]> {
    const orderItems: OrderItem[] = [];

    for (const item of items) {
      const menuItem = this.menuService.findOne(item.menuItemId, userCountry);

      if (!menuItem) {
        throw new NotFoundException(
          `Menu item '${item.menuItemId}' not found or not accessible`,
        );
      }

      orderItems.push({
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        price: menuItem.price,
      });
    }

    return orderItems;
  }
}
