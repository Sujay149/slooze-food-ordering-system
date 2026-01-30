import React from 'react';
import { getUser } from '@/lib/auth';
import { UserRole } from '@/types';

interface RoleBasedProps {
  roles: UserRole[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const RoleBased: React.FC<RoleBasedProps> = ({ roles, children, fallback = null }) => {
  const user = getUser();

  if (!user || !roles.includes(user.role)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export default RoleBased;
