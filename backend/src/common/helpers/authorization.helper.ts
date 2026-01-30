import { ForbiddenException } from '@nestjs/common';
import { UserRole, Country } from '../types';

/**
 * Centralized authorization logic to avoid duplication across services
 */
export class AuthorizationHelper {
  /**
   * Check if user can access resource from a specific country
   */
  static canAccessCountry(
    userRole: UserRole,
    userCountry: Country,
    resourceCountry: Country,
  ): boolean {
    // Admin can access all countries
    if (userRole === UserRole.ADMIN) {
      return true;
    }
    // Managers and Members can only access their own country
    return userCountry === resourceCountry;
  }

  /**
   * Enforce country-based access control
   * Throws ForbiddenException if access is denied
   */
  static enforceCountryAccess(
    userRole: UserRole,
    userCountry: Country,
    resourceCountry: Country,
    resourceType: string = 'resource',
  ): void {
    if (!this.canAccessCountry(userRole, userCountry, resourceCountry)) {
      throw new ForbiddenException(
        `Access denied: ${resourceType} is not accessible from your country`,
      );
    }
  }

  /**
   * Check if user has required role(s)
   */
  static hasRole(userRole: UserRole, allowedRoles: UserRole[]): boolean {
    return allowedRoles.includes(userRole);
  }

  /**
   * Enforce role-based access control
   * Throws ForbiddenException if access is denied
   */
  static enforceRoleAccess(
    userRole: UserRole,
    allowedRoles: UserRole[],
    action: string = 'perform this action',
  ): void {
    if (!this.hasRole(userRole, allowedRoles)) {
      throw new ForbiddenException(
        `Access denied: Only ${allowedRoles.join(', ')} can ${action}`,
      );
    }
  }

  /**
   * Check if user can manage order (place/cancel)
   * Only Admin and Manager can finalize orders
   */
  static canManageOrder(userRole: UserRole): boolean {
    return userRole === UserRole.ADMIN || userRole === UserRole.MANAGER;
  }
}
