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

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <main className="container mx-auto px-4 py-8">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Restaurants</h2>

          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : restaurants.length === 0 ? (
            <div className="text-center py-8 text-gray-600">
              No restaurants available in your country.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {restaurants.map((restaurant) => (
                <div
                  key={restaurant.id}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer"
                  onClick={() => router.push(`/menu/${restaurant.id}`)}
                >
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">
                    {restaurant.name}
                  </h3>
                  <p className="text-gray-600 mb-2">{restaurant.description}</p>
                  <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    {restaurant.country}
                  </span>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default HomePage;
