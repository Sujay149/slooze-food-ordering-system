import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { RestaurantModule } from './restaurant/restaurant.module';
import { MenuModule } from './menu/menu.module';
import { OrderModule } from './order/order.module';
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [
    AuthModule,
    RestaurantModule,
    MenuModule,
    OrderModule,
    PaymentModule,
  ],
})
export class AppModule {}
