import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RestaurantService } from './restaurant.service';
import { CurrentUser } from '../decorators/current-user.decorator';
import { UserRole } from '../common/types';

@ApiTags('Restaurants')
@Controller('restaurants')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class RestaurantController {
  constructor(private restaurantService: RestaurantService) {}

  @Get()
  @ApiOperation({ summary: 'Get all restaurants (filtered by country for non-admins)' })
  findAll(@CurrentUser() user: any) {
    // Admins see all, others see only their country
    const country = user.role === UserRole.ADMIN ? undefined : user.country;
    return this.restaurantService.findAll(country);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get restaurant by ID' })
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    const country = user.role === UserRole.ADMIN ? undefined : user.country;
    return this.restaurantService.findOne(id, country);
  }
}
