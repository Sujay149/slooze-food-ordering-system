import React from 'react';
import { getUser, logout } from '@/lib/auth';

const Header = () => {
  const user = getUser();

  return (
    <header className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Food Ordering System</h1>
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
