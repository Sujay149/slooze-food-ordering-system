import { Injectable, NotFoundException } from '@nestjs/common';
import { PaymentMethod } from '../common/types';
import { CreatePaymentMethodDto, UpdatePaymentMethodDto } from './dto/payment-method.dto';

// Mock payment methods database
const mockPaymentMethods: PaymentMethod[] = [
  { id: 'pm1', userId: '1', type: 'credit_card', cardLast4: '4242', isDefault: true },
  { id: 'pm2', userId: '2', type: 'credit_card', cardLast4: '1234', isDefault: true },
];

let paymentMethodIdCounter = 3;

@Injectable()
export class PaymentService {
  findAll(userId: string): PaymentMethod[] {
    return mockPaymentMethods.filter((pm) => pm.userId === userId);
  }

  findOne(id: string, userId: string): PaymentMethod {
    const paymentMethod = mockPaymentMethods.find(
      (pm) => pm.id === id && pm.userId === userId,
    );
    if (!paymentMethod) {
      throw new NotFoundException('Payment method not found');
    }
    return paymentMethod;
  }

  create(createDto: CreatePaymentMethodDto, userId: string): PaymentMethod {
    const paymentMethod: PaymentMethod = {
      id: `pm${paymentMethodIdCounter++}`,
      userId,
      type: createDto.type,
      cardLast4: createDto.cardLast4,
      isDefault: createDto.isDefault || false,
    };

    mockPaymentMethods.push(paymentMethod);
    return paymentMethod;
  }

  update(id: string, updateDto: UpdatePaymentMethodDto, userId: string): PaymentMethod {
    const paymentMethod = this.findOne(id, userId);
    
    if (updateDto.type) paymentMethod.type = updateDto.type;
    if (updateDto.isDefault !== undefined) paymentMethod.isDefault = updateDto.isDefault;

    return paymentMethod;
  }

  remove(id: string, userId: string): void {
    const index = mockPaymentMethods.findIndex(
      (pm) => pm.id === id && pm.userId === userId,
    );
    if (index === -1) {
      throw new NotFoundException('Payment method not found');
    }
    mockPaymentMethods.splice(index, 1);
  }
}
