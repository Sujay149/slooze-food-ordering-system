import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Header from '@/components/Header';
import ProtectedRoute from '@/components/ProtectedRoute';
import { restaurantAPI } from '@/lib/api';
import { Restaurant } from '@/types';
import { ArrowLeft, Star, Clock, Heart, Tag, Search } from 'lucide-react';

const CategoryPage = () => {
  const router = useRouter();
  const { category } = router.query;
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (category) {
      fetchRestaurants();
    }
  }, [category]);

  const fetchRestaurants = async () => {
    try {
      const response = await restaurantAPI.getAll();
      const filtered = filterByCategory(response.data, category as string);
      setRestaurants(filtered);
    } catch (err) {
      console.error('Failed to fetch restaurants:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterByCategory = (allRestaurants: Restaurant[], categoryName: string) => {
    const cat = categoryName.toLowerCase();
    
    return allRestaurants.filter(restaurant => {
      const description = restaurant.description.toLowerCase();
      
      if (cat === 'pizza') return description.includes('pizza') || description.includes('italian');
      if (cat === 'burgers') return description.includes('burger') || description.includes('american') || description.includes('fast food');
      if (cat === 'noodles' || cat === 'chinese') return description.includes('chinese') || description.includes('noodles') || description.includes('asian');
      if (cat === 'biryani') return description.includes('biryani') || description.includes('indian');
      if (cat === 'sushi') return description.includes('sushi') || description.includes('japanese');
      if (cat === 'sandwich') return description.includes('sandwich') || description.includes('healthy') || description.includes('salad');
      if (cat === 'salads') return description.includes('salad') || description.includes('healthy');
      if (cat === 'cakes') return description.includes('dessert') || description.includes('bakery');
      if (cat === 'pasta') return description.includes('pasta') || description.includes('italian');
      
      return description.includes(cat);
    });
  };

  const getCuisineType = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('pizza')) return 'Italian, Pizza';
    if (lowerName.includes('burger')) return 'American, Burgers';
    if (lowerName.includes('sushi')) return 'Japanese, Sushi';
    if (lowerName.includes('taco') || lowerName.includes('mexican')) return 'Mexican, Tacos';
    if (lowerName.includes('chinese') || lowerName.includes('noodle')) return 'Chinese, Asian';
    if (lowerName.includes('curry') || lowerName.includes('spice')) return 'Indian, Curry';
    if (lowerName.includes('grill')) return 'BBQ, Grilled';
    return 'Multi-cuisine';
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Header />

        {/* Header Section */}
        <div className="bg-gradient-to-br from-orange-500 to-rose-600 text-white">
          <div className="container mx-auto px-4 md:px-6 py-8">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-white/90 hover:text-white mb-4 transition-colors"
            >
              <ArrowLeft size={20} />
              <span className="font-medium">Back</span>
            </button>
            <div className="max-w-4xl">
              <h1 className="text-3xl md:text-5xl font-extrabold mb-2">
                {category}
              </h1>
              <p className="text-lg text-white/90">
                {restaurants.length} restaurant{restaurants.length !== 1 ? 's' : ''} serving delicious {category?.toString().toLowerCase()}
              </p>
            </div>
          </div>
        </div>

        <main className="container mx-auto px-4 md:px-6 py-8">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <div key={n} className="animate-pulse">
                  <div className="aspect-[4/3] bg-gray-200 rounded-2xl mb-4"></div>
                  <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : restaurants.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl shadow-sm">
              <div className="w-32 h-32 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <Search className="text-gray-400" size={48} />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                No restaurants found
              </h3>
              <p className="text-gray-600 max-w-md mx-auto mb-6">
                We couldn't find any restaurants serving {category}. Try browsing other categories.
              </p>
              <button
                onClick={() => router.push('/')}
                className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold transition-colors"
              >
                Browse All Restaurants
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {restaurants.map((restaurant, index) => {
                const rating = (4.0 + Math.random() * 1).toFixed(1);
                const time = 20 + Math.floor(Math.random() * 25);
                const discount = index % 3 === 0 ? [10, 20, 30, 40][Math.floor(Math.random() * 4)] : null;

                return (
                  <div
                    key={restaurant.id}
                    onClick={() => router.push(`/menu/${restaurant.id}`)}
                    className="bg-white rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer group border border-gray-100"
                  >
                    {/* Restaurant Image */}
                    <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                      <img 
                        src={restaurant.image || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&h=300&fit=crop'}
                        alt={restaurant.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      
                      {discount && (
                        <div className="absolute top-3 left-3 flex items-center gap-1 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg">
                          <Tag size={14} />
                          {discount}% OFF
                        </div>
                      )}

                      <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:scale-110">
                        <Heart size={18} className="text-gray-600" />
                      </button>

                      <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform">
                        <p className="text-white text-sm line-clamp-2">{restaurant.description}</p>
                      </div>
                    </div>

                    {/* Restaurant Info */}
                    <div className="px-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-1 flex-1">
                          {restaurant.name}
                        </h3>
                      </div>
                      
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex items-center gap-1.5 bg-green-600 text-white px-2 py-1 rounded-lg shadow-sm">
                          <Star size={12} fill="white" />
                          <span className="text-xs font-bold">{rating}</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-600">
                          <Clock size={14} />
                          <span className="text-sm font-medium">{time}-{time+10} mins</span>
                        </div>
                      </div>

                      <p className="text-sm text-gray-500 line-clamp-1 mb-1">
                        {getCuisineType(restaurant.name)}
                      </p>

                      {discount && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <p className="text-xs font-semibold text-orange-600 flex items-center gap-1">
                            <Tag size={12} />
                            {discount}% off up to ₹100
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default CategoryPage;
