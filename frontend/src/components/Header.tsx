import React from 'react';
import { useRouter } from 'next/router';
import { getUser, logout } from '@/lib/auth';
import { UserRole } from '@/types';

const Header = () => {
  const router = useRouter();
  const user = getUser();

  const isAdminOrManager = user && (user.role === UserRole.ADMIN || user.role === UserRole.MANAGER);

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case UserRole.ADMIN:
        return 'bg-purple-100 text-purple-700 border-purple-300';
      case UserRole.MANAGER:
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case UserRole.MEMBER:
        return 'bg-green-100 text-green-700 border-green-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case UserRole.ADMIN:
        return '👑';
      case UserRole.MANAGER:
        return '💼';
      case UserRole.MEMBER:
        return '👤';
      default:
        return '•';
    }
  };

  return (
    <header className="bg-[#FFFFFF] shadow-sm sticky top-0 z-50 border-b border-gray-200">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Left: Navigation Links */}
          <nav className="flex items-center gap-8">
            <button
              onClick={() => router.push('/')}
              className={`text-sm font-medium transition-colors relative ${
                router.pathname === '/'
                  ? 'text-[#FC8019]'
                  : 'text-[#282C3F] hover:text-[#FC8019]'
              }`}
            >
              Restaurants
              {router.pathname === '/' && (
                <span className="absolute -bottom-6 left-0 right-0 h-0.5 bg-[#FC8019]"></span>
              )}
            </button>

            {isAdminOrManager && (
              <button
                onClick={() => router.push('/orders')}
                className={`text-sm font-medium transition-colors relative ${
                  router.pathname === '/orders'
                    ? 'text-[#FC8019]'
                    : 'text-[#282C3F] hover:text-[#FC8019]'
                }`}
              >
                All Orders
                {router.pathname === '/orders' && (
                  <span className="absolute -bottom-6 left-0 right-0 h-0.5 bg-[#FC8019]"></span>
                )}
              </button>
            )}
          </nav>

          {/* Center: Logo */}
          <button
            onClick={() => router.push('/')}
            className="absolute left-1/2 transform -translate-x-1/2 group"
          >
            <div className="flex items-center gap-2">
              <div className="bg-[#FC8019] p-2 rounded-lg shadow-md group-hover:scale-105 transition-transform">
                <span className="text-xl">🍔</span>
              </div>
              <span className="font-bold text-lg text-[#282C3F] group-hover:text-[#FC8019] transition-colors hidden md:inline">
                FoodExpress
              </span>
            </div>
          </button>

          {/* Right: User Info & Actions */}
          {user && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-[#282C3F]">
                <span className="hidden md:inline font-medium">{user.name}</span>
                <span className="text-xs text-gray-500">
                  {user.country === 'India' ? '🇮🇳' : '🇺🇸'}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="px-3 py-1 bg-[#FFF5ED] rounded-lg text-xs font-semibold text-[#FC8019] border border-orange-200">
                  {getRoleIcon(user.role)} {user.role}
                </div>
                
                <button
                  onClick={logout}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Logout"
                >
                  <span className="text-lg">🚪</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
