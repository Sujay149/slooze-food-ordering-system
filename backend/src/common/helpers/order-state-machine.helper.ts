import { BadRequestException } from '@nestjs/common';
import { OrderStatus } from '../types';

/**
 * Order state machine to enforce valid state transitions
 */
export class OrderStateMachine {
  private static readonly VALID_TRANSITIONS: Record<
    OrderStatus,
    OrderStatus[]
  > = {
    [OrderStatus.CREATED]: [OrderStatus.PLACED, OrderStatus.CANCELLED],
    [OrderStatus.PLACED]: [], // Terminal state - cannot transition further
    [OrderStatus.CANCELLED]: [], // Terminal state
  };

  /**
   * Check if transition from current state to new state is valid
   */
  static canTransition(
    currentStatus: OrderStatus,
    newStatus: OrderStatus,
  ): boolean {
    const allowedTransitions = this.VALID_TRANSITIONS[currentStatus] || [];
    return allowedTransitions.includes(newStatus);
  }

  /**
   * Enforce valid state transition
   * Throws BadRequestException if transition is invalid
   */
  static enforceTransition(
    currentStatus: OrderStatus,
    newStatus: OrderStatus,
  ): void {
    if (!this.canTransition(currentStatus, newStatus)) {
      throw new BadRequestException(
        `Invalid state transition: Cannot change order from '${currentStatus}' to '${newStatus}'`,
      );
    }
  }

  /**
   * Validate that order can be placed (finalized)
   */
  static validateCanPlace(currentStatus: OrderStatus): void {
    if (currentStatus !== OrderStatus.CREATED) {
      throw new BadRequestException(
        `Cannot place order: Order must be in 'created' status (current: ${currentStatus})`,
      );
    }
  }

  /**
   * Validate that order can be cancelled
   */
  static validateCanCancel(currentStatus: OrderStatus): void {
    if (currentStatus !== OrderStatus.CREATED) {
      throw new BadRequestException(
        `Cannot cancel order: Only orders in 'created' status can be cancelled (current: ${currentStatus})`,
      );
    }
  }
}
