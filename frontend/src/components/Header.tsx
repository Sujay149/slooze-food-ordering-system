import React from 'react';
import { useRouter } from 'next/router';
import { getUser, logout } from '@/lib/auth';
import { UserRole } from '@/types';
import { Home, Tag, HelpCircle, ShoppingCart, LogOut, Menu, ClipboardList, MapPin, ChevronDown, User } from 'lucide-react';

const Header = () => {
  const router = useRouter();
  const user = getUser();

  const isAdminOrManager = user && (user.role === UserRole.ADMIN || user.role === UserRole.MANAGER);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 border-b">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Location */}
          <div className="flex items-center gap-6">
            <div 
              onClick={() => router.push('/')}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-orange-600 rounded-xl blur opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <div className="relative bg-gradient-to-br from-orange-500 to-orange-600 p-2.5 rounded-xl group-hover:scale-105 transition-transform">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm0 18.5c-4.28-1.03-7.5-5.28-7.5-9.5V8.3l7.5-3.75 7.5 3.75v2.7c0 4.22-3.22 8.47-7.5 9.5z"/>
                  </svg>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xl text-gray-900 leading-none">FoodExpress</span>
                <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                  <MapPin size={12} />
                  <span className="hidden md:inline">{user?.country || 'Select location'}</span>
                  <ChevronDown size={12} className="hidden md:inline" />
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center gap-10">
            <button
              onClick={() => router.push('/')}
              className={`flex items-center gap-2 font-medium transition-colors relative py-2 ${
                router.pathname === '/'
                  ? 'text-orange-600'
                  : 'text-gray-700 hover:text-orange-600'
              }`}
            >
              <Home size={20} />
              <span>Home</span>
              {router.pathname === '/' && (
                <span className="absolute -bottom-5 left-0 right-0 h-1 bg-orange-600 rounded-t-full"></span>
              )}
            </button>

            <button className="flex items-center gap-2 font-medium text-gray-700 hover:text-orange-600 transition-colors">
              <Tag size={20} />
              <span>Offers</span>
              <span className="bg-orange-100 text-orange-700 text-[10px] px-1.5 py-0.5 rounded font-bold uppercase">New</span>
            </button>

            {isAdminOrManager && (
              <button
                onClick={() => router.push('/orders')}
                className={`flex items-center gap-2 font-medium transition-colors relative py-2 ${
                  router.pathname === '/orders'
                    ? 'text-orange-600'
                    : 'text-gray-700 hover:text-orange-600'
                }`}
              >
                <ClipboardList size={20} />
                <span>Orders</span>
                {router.pathname === '/orders' && (
                  <span className="absolute -bottom-5 left-0 right-0 h-1 bg-orange-600 rounded-t-full"></span>
                )}
              </button>
            )}

            <button className="flex items-center gap-2 font-medium text-gray-700 hover:text-orange-600 transition-colors">
              <HelpCircle size={20} />
              <span>Help</span>
            </button>
          </nav>

          {/* Right Section */}
          {user && (
            <div className="flex items-center gap-4">
              {/* Cart */}
              <button className="relative p-2.5 hover:bg-gray-100 rounded-xl transition-colors group">
                <ShoppingCart size={22} className="text-gray-700 group-hover:text-orange-600 transition-colors" />
                <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg">
                  0
                </span>
              </button>

              {/* User Profile */}
              <div className="hidden md:flex items-center gap-3">
                <div className="flex items-center gap-3 bg-gray-50 hover:bg-gray-100 rounded-xl px-4 py-2.5 border border-gray-200 transition-colors cursor-pointer group">
                  <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md group-hover:scale-105 transition-transform">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-900 leading-none">{user.name}</span>
                    <span className="text-xs text-gray-500 capitalize mt-0.5">{user.role}</span>
                  </div>
                  <ChevronDown size={16} className="text-gray-400" />
                </div>
                
                <button
                  onClick={logout}
                  className="p-2.5 hover:bg-red-50 rounded-xl transition-colors group"
                  title="Logout"
                >
                  <LogOut size={20} className="text-gray-600 group-hover:text-red-600 transition-colors" />
                </button>
              </div>

              {/* Mobile Menu */}
              <button className="lg:hidden p-2.5 hover:bg-gray-100 rounded-xl transition-colors">
                <Menu size={24} className="text-gray-700" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
