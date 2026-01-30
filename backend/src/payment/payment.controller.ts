import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { PaymentService } from './payment.service';
import { CreatePaymentMethodDto, UpdatePaymentMethodDto } from './dto/payment-method.dto';
import { CurrentUser } from '../decorators/current-user.decorator';
import { Roles } from '../decorators/roles.decorator';
import { RolesGuard } from '../guards/roles.guard';
import { UserRole } from '../common/types';

@ApiTags('Payment Methods')
@Controller('payment-methods')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiBearerAuth()
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.MEMBER)
  @ApiOperation({ summary: 'Get all payment methods for current user' })
  findAll(@CurrentUser() user: any) {
    return this.paymentService.findAll(user.id);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.MEMBER)
  @ApiOperation({ summary: 'Get payment method by ID' })
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.paymentService.findOne(id, user.id);
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.MEMBER)
  @ApiOperation({ summary: 'Add new payment method' })
  create(@Body() createDto: CreatePaymentMethodDto, @CurrentUser() user: any) {
    return this.paymentService.create(createDto, user.id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update payment method (Admin only)' })
  @ApiResponse({ status: 403, description: 'Only admins can update payment methods' })
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdatePaymentMethodDto,
    @CurrentUser() user: any,
  ) {
    return this.paymentService.update(id, updateDto, user.id);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.MEMBER)
  @ApiOperation({ summary: 'Delete payment method' })
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    this.paymentService.remove(id, user.id);
    return { message: 'Payment method deleted successfully' };
  }
}
