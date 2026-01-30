import { Injectable, CanActivate, ExecutionContext, Logger, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { UserRole } from '../common/types';

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    
    if (!user) {
      this.logger.warn('No user found in request - authentication may have failed');
      throw new UnauthorizedException('Authentication required');
    }
    
    const hasRole = requiredRoles.some((role) => user.role === role);
    this.logger.log(`User ${user.email} (${user.role}) - Required: [${requiredRoles.join(', ')}] - Has access: ${hasRole}`);
    
    if (!hasRole) {
      throw new ForbiddenException(`User role '${user.role}' does not have permission. Required: ${requiredRoles.join(', ')}`);
    }
    
    return true;
  }
}
