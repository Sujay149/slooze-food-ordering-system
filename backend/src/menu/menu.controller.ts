import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { MenuService } from './menu.service';
import { CurrentUser } from '../decorators/current-user.decorator';
import { UserRole } from '../common/types';

@ApiTags('Menu')
@Controller('menu')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class MenuController {
  constructor(private menuService: MenuService) {}

  @Get('restaurant/:restaurantId')
  @ApiOperation({ summary: 'Get menu items for a restaurant' })
  findByRestaurant(
    @Param('restaurantId') restaurantId: string,
    @CurrentUser() user: any,
  ) {
    const country = user.role === UserRole.ADMIN ? undefined : user.country;
    return this.menuService.findByRestaurant(restaurantId, country);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get menu item by ID' })
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    const country = user.role === UserRole.ADMIN ? undefined : user.country;
    return this.menuService.findOne(id, country);
  }
}
