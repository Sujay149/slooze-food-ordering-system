import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
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
   * 
   * RBAC Rules:
   * - Admin: Views ALL orders across all countries (no filters applied)
   * - Manager: Views ALL orders within their country (country-scoped)
   * - Member: Views ONLY their own orders (user-scoped, read-only)
   * 
   * Why these rules?
   * - Admins need global oversight
   * - Managers need to finalize orders for customers in their region
   * - Members should not see other customers' order data (privacy)
   */
  findAll(userId: string, userRole: UserRole, userCountry: Country): Order[] {
    // Admin: No filters - sees all orders globally
    if (userRole === UserRole.ADMIN) {
      return mockOrders;
    }

    // Manager: Country filter - sees all orders in their assigned country
    // This allows managers to finalize Member orders in their region
    if (userRole === UserRole.MANAGER) {
      return mockOrders.filter((order) => order.country === userCountry);
    }

    // Member: User filter - sees only their own orders (read-only access)
    // No need for country filter since userId is already globally unique
    return mockOrders.filter((order) => order.userId === userId);
  }

  /**
   * Get a single order by ID with role-based access control
   * 
   * RBAC Rules:
   * - Admin: Can access ANY order by ID (no restrictions)
   * - Manager: Can access orders by ID if order.country === user.country
   * - Member: Can access order by ID if order.userId === user.id
   * 
   * Security Notes:
   * - Country check prevents Managers from accessing other countries' orders via direct ID
   * - User check prevents Members from accessing other users' orders via direct ID
   * - Returns NotFoundException (not ForbiddenException) for Members to avoid
   *   information disclosure (don't reveal that order exists but user can't access it)
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

    // Admin: No access restrictions - can view any order
    if (userRole === UserRole.ADMIN) {
      return order;
    }

    // Manager: Enforce country-based access control
    // Managers can only access orders within their assigned country
    if (userRole === UserRole.MANAGER) {
      if (order.country !== userCountry) {
        throw new ForbiddenException(
          'Access denied: Order is not accessible from your country',
        );
      }
      return order;
    }

    // Member: Enforce ownership check
    // Members can only access their own orders (userId match required)
    // Use NotFoundException instead of ForbiddenException to avoid leaking
    // information about existence of orders they don't own
    if (order.userId !== userId) {
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
