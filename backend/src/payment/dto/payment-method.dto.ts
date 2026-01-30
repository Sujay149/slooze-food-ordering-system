import { IsString, IsNotEmpty, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentMethodDto {
  @ApiProperty({ example: 'credit_card' })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({ example: '4242', required: false })
  @IsString()
  cardLast4?: string;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  isDefault?: boolean;
}

export class UpdatePaymentMethodDto {
  @ApiProperty({ example: 'debit_card', required: false })
  @IsString()
  type?: string;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  isDefault?: boolean;
}
