import { IsArray, IsNotEmpty, IsString, ValidateNested, IsPositive, IsInt, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderItemDto {
  @ApiProperty({ example: 'm1', description: 'Menu item ID' })
  @IsString()
  @IsNotEmpty({ message: 'Menu item ID is required' })
  menuItemId: string;

  @ApiProperty({ example: 2, description: 'Quantity must be a positive integer' })
  @IsInt({ message: 'Quantity must be an integer' })
  @IsPositive({ message: 'Quantity must be greater than 0' })
  quantity: number;
}

export class CreateOrderDto {
  @ApiProperty({ example: 'r1', description: 'Restaurant ID' })
  @IsString()
  @IsNotEmpty({ message: 'Restaurant ID is required' })
  restaurantId: string;

  @ApiProperty({ type: [CreateOrderItemDto], description: 'At least one item is required' })
  @IsArray()
  @ArrayMinSize(1, { message: 'Order must contain at least one item' })
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];
}

export class PlaceOrderDto {
  @ApiProperty({ example: 'pm1', required: false })
  @IsString()
  paymentMethodId?: string;
}
