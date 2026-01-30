import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { MenuModule } from '../menu/menu.module';
import { RestaurantModule } from '../restaurant/restaurant.module';

@Module({
  imports: [MenuModule, RestaurantModule],
  providers: [OrderService],
  controllers: [OrderController],
})
export class OrderModule {}
