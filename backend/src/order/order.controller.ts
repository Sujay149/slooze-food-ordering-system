import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Patch,
  Delete,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { OrderService } from './order.service';
import { CreateOrderDto, PlaceOrderDto } from './dto/create-order.dto';
import { CurrentUser } from '../decorators/current-user.decorator';
import { Roles } from '../decorators/roles.decorator';
import { RolesGuard } from '../guards/roles.guard';
import { UserRole } from '../common/types';

@ApiTags('Orders')
@Controller('orders')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiBearerAuth()
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.MEMBER)
  @ApiOperation({ summary: 'Create a new order (all roles)' })
  @ApiResponse({ status: 201, description: 'Order created successfully' })
  create(@Body() createOrderDto: CreateOrderDto, @CurrentUser() user: any) {
    return this.orderService.create(createOrderDto, user.id, user.country);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.MEMBER)
  @ApiOperation({ summary: 'Get all orders (filtered by country for non-admins)' })
  findAll(@CurrentUser() user: any) {
    return this.orderService.findAll(user.id, user.role, user.country);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.MEMBER)
  @ApiOperation({ summary: 'Get order by ID' })
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.orderService.findOne(id, user.id, user.role, user.country);
  }

  @Patch(':id/place')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Place order / Checkout (Admin & Manager only)' })
  @ApiResponse({ status: 403, description: 'Members cannot place orders' })
  placeOrder(
    @Param('id') id: string,
    @Body() placeOrderDto: PlaceOrderDto,
    @CurrentUser() user: any,
  ) {
    return this.orderService.placeOrder(
      id,
      user.id,
      user.role,
      user.country,
      placeOrderDto.paymentMethodId,
    );
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Cancel order (Admin & Manager only)' })
  @ApiResponse({ status: 403, description: 'Members cannot cancel orders' })
  cancelOrder(@Param('id') id: string, @CurrentUser() user: any) {
    return this.orderService.cancelOrder(id, user.id, user.role, user.country);
  }
}
