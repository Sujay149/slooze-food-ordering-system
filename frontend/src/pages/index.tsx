import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Header from '@/components/Header';
import ProtectedRoute from '@/components/ProtectedRoute';
import { restaurantAPI } from '@/lib/api';
import { Restaurant } from '@/types';

const HomePage = () => {
  const router = useRouter();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const response = await restaurantAPI.getAll();
      setRestaurants(response.data);
    } catch (err) {
      console.error('Failed to fetch restaurants:', err);
    } finally {
      setLoading(false);
    }
  };

  const getRestaurantIcon = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('pizza')) return '🍕';
    if (lowerName.includes('burger')) return '🍔';
    if (lowerName.includes('sushi')) return '🍣';
    if (lowerName.includes('taco') || lowerName.includes('mexican')) return '🌮';
    if (lowerName.includes('chinese') || lowerName.includes('noodle')) return '🍜';
    if (lowerName.includes('curry') || lowerName.includes('spice')) return '🍛';
    if (lowerName.includes('grill')) return '🥩';
    return '🍽️';
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#F0F0F5]">
        <Header />

        <main className="container mx-auto px-4 py-8">
          {/* Hero Section */}
          <div className="mb-8 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-[#282C3F] mb-3">
              Discover Restaurants
            </h2>
            <p className="text-gray-600 text-lg">
              Order food from your favorite local restaurants
            </p>
          </div>

          {/* Search Bar (Visual Only) */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <span className="absolute left-4 top-4 text-gray-400 text-xl">🔍</span>
              <input
                type="text"
                placeholder="Search for restaurants, cuisines, or dishes..."
                className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-800 shadow-sm"
                readOnly
              />
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div
                  key={n}
                  className="bg-white rounded-2xl shadow-md overflow-hidden animate-pulse"
                >
                  <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300"></div>
                  <div className="p-6">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : restaurants.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🍽️</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                No Restaurants Available
              </h3>
              <p className="text-gray-600">
                No restaurants are currently available in your country.
              </p>
            </div>
          ) : (
            <>
              {/* Restaurant Count */}
              <div className="mb-6">
                <p className="text-gray-600 font-medium">
                  <span className="text-2xl font-bold text-orange-600">
                    {restaurants.length}
                  </span>{' '}
                  restaurant{restaurants.length !== 1 ? 's' : ''} available
                </p>
              </div>

              {/* Restaurant Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {restaurants.map((restaurant) => (
                  <div
                    key={restaurant.id}
                    className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden border border-gray-100 transform hover:-translate-y-1"
                    onClick={() => router.push(`/menu/${restaurant.id}`)}
                  >
                    {/* Restaurant Image/Banner */}
                    <div className="relative h-48 bg-gradient-to-br from-[#FC8019] to-[#FF5200] overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-8xl opacity-90 transform group-hover:scale-110 transition-transform">
                          {getRestaurantIcon(restaurant.name)}
                        </span>
                      </div>
                      <div className="absolute top-4 right-4">
                        <span className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold text-gray-700 shadow-md">
                          {restaurant.country === 'India' ? '🇮🇳 India' : '🇺🇸 America'}
                        </span>
                      </div>
                      {/* Decorative overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    </div>

                    {/* Restaurant Info */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-orange-600 transition-colors">
                        {restaurant.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {restaurant.description}
                      </p>

                      {/* Stats/Info Row */}
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1 text-yellow-500">
                            <span>⭐</span>
                            <span className="font-semibold text-gray-700">4.5</span>
                          </div>
                          <div className="text-gray-500">
                            <span>•</span>
                            <span className="ml-1">30-40 min</span>
                          </div>
                        </div>
                        <div className="text-orange-600 font-semibold group-hover:translate-x-1 transition-transform">
                          View Menu →
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </main>

        {/* Footer */}
        <footer className="mt-16 py-8 bg-[#282C3F] text-white">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm opacity-90">
              © 2026 FoodExpress • Order food with ease
            </p>
          </div>
        </footer>
      </div>
    </ProtectedRoute>
  );
};

export default HomePage;
