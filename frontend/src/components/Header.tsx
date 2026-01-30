import React from 'react';
import { useRouter } from 'next/router';
import { getUser, logout } from '@/lib/auth';
import { UserRole } from '@/types';

const Header = () => {
  const router = useRouter();
  const user = getUser();

  const isAdminOrManager = user && (user.role === UserRole.ADMIN || user.role === UserRole.MANAGER);

  return (
    <header className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-6">
          <h1 
            className="text-2xl font-bold cursor-pointer hover:text-blue-200" 
            onClick={() => router.push('/')}
          >
            Food Ordering System
          </h1>
          
          {/* Navigation Links for Admin/Manager */}
          {isAdminOrManager && (
            <nav className="flex gap-4">
              <button
                onClick={() => router.push('/')}
                className={`px-3 py-1 rounded hover:bg-blue-700 transition ${
                  router.pathname === '/' ? 'bg-blue-700' : ''
                }`}
              >
                Restaurants
              </button>
              <button
                onClick={() => router.push('/orders')}
                className={`px-3 py-1 rounded hover:bg-blue-700 transition ${
                  router.pathname === '/orders' ? 'bg-blue-700' : ''
                }`}
              >
                All Orders
              </button>
            </nav>
          )}
        </div>
        
        {user && (
          <div className="flex items-center gap-4">
            <span className="text-sm">
              {user.name} ({user.role}) - {user.country}
            </span>
            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
