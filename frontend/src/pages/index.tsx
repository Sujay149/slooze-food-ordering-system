import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Header from '@/components/Header';
import ProtectedRoute from '@/components/ProtectedRoute';
import { restaurantAPI } from '@/lib/api';
import { Restaurant } from '@/types';
import { getUser } from '@/lib/auth';
import { MapPin, Search, ChevronRight, Clock, Star, Heart, Tag, TrendingUp, Sparkles } from 'lucide-react';

const HomePage = () => {
  const router = useRouter();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'Fast Delivery' | 'New' | 'Rating'>('All');
  const user = getUser();

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

  const handleCategoryClick = (categoryName: string) => {
    router.push(`/category/${encodeURIComponent(categoryName)}`);
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

  const foodCategories = [
    { image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&h=200&fit=crop', name: 'Pizza', query: 'pizza' },
    { image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=200&fit=crop', name: 'Burgers', query: 'burger' },
    { image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=200&h=200&fit=crop', name: 'Noodles', query: 'noodles' },
    { image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200&h=200&fit=crop', name: 'Biryani', query: 'biryani' },
    { image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=200&h=200&fit=crop', name: 'Sushi', query: 'sushi' },
    { image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&h=200&fit=crop', name: 'Sandwich', query: 'sandwich' },
    { image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&h=200&fit=crop', name: 'Salads', query: 'salad' },
    { image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=200&h=200&fit=crop', name: 'Cakes', query: 'cake' },
    { image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=200&h=200&fit=crop', name: 'Pasta', query: 'pasta' },
    { image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=200&h=200&fit=crop', name: 'Chinese', query: 'chinese' },
  ];

  const offers = [
    { 
      title: '50% OFF', 
      subtitle: 'Up to $10 • Use code', 
      code: 'WELCOME50',
      gradient: 'from-orange-400 to-rose-400'
    },
    { 
      title: 'Free Delivery', 
      subtitle: 'On orders above $20', 
      code: 'FREEDEL',
      gradient: 'from-blue-400 to-cyan-400'
    },
    { 
      title: '$12 OFF', 
      subtitle: 'On orders above $60', 
      code: 'SAVE12',
      gradient: 'from-purple-400 to-pink-400'
    },
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-white">
        <Header />

        {/* Hero Section with Background */}
        <div className="relative bg-gradient-to-br from-orange-500 via-orange-600 to-rose-600 text-white overflow-hidden">
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 animate-pulse" style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
              backgroundSize: '40px 40px'
            }}></div>
          </div>
          
          {/* Floating Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-float"></div>
            <div className="absolute top-40 right-20 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-float-delayed"></div>
            <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-white/10 rounded-full blur-xl animate-float"></div>
            <div className="absolute top-1/3 right-1/3 w-16 h-16 bg-white/10 rounded-full blur-lg animate-float-delayed"></div>
          </div>
          
          <div className="container mx-auto px-4 md:px-6 py-16 md:py-24 relative">
            <div className="max-w-4xl">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-white/30 animate-fade-in">
                <Sparkles size={18} className="text-yellow-300" />
                <span className="text-sm font-semibold">Free delivery on your first order!</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight animate-slide-up">
                Hungry? Order food from your 
                <span className="text-yellow-300"> favorite </span>
                restaurants
              </h1>
              <p className="text-lg md:text-2xl text-white/90 mb-10 max-w-2xl animate-slide-up-delayed">
                Get delicious meals delivered to your door in <span className="font-bold text-yellow-300">30 minutes</span> or less
              </p>

              {/* Search Bar */}
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden transform hover:scale-[1.02] transition-all duration-300 animate-slide-up-delayed">
                <div className="flex flex-col md:flex-row">
                  <div className="flex items-center gap-3 px-5 md:px-8 py-5 md:py-6 flex-1 border-b md:border-b-0 md:border-r border-gray-200 group">
                    <MapPin className="text-orange-600 flex-shrink-0 group-hover:scale-110 transition-transform" size={24} />
                    <input
                      type="text"
                      placeholder="Enter delivery address"
                      className="flex-1 outline-none text-gray-800 placeholder-gray-500 text-sm md:text-base font-medium"
                      defaultValue={user?.country || ''}
                    />
                  </div>
                  <div className="flex items-center gap-3 px-5 md:px-8 py-5 md:py-6 flex-1 group">
                    <Search className="text-gray-400 flex-shrink-0 group-hover:scale-110 transition-transform" size={24} />
                    <input
                      type="text"
                      placeholder="Search for restaurants or dishes"
                      className="flex-1 outline-none text-gray-800 placeholder-gray-500 text-sm md:text-base font-medium"
                    />
                  </div>
                  <button className="bg-gradient-to-r from-orange-600 to-rose-600 hover:from-orange-700 hover:to-rose-700 text-white px-8 md:px-12 py-5 md:py-6 font-bold transition-all flex items-center justify-center gap-2 hover:shadow-lg">
                    <Search size={22} />
                    <span className="hidden md:inline">Search</span>
                  </button>
                </div>
              </div>
            </div>
            
            {/* Stats Section */}
            <div className="grid grid-cols-3 gap-8 mt-16 max-w-4xl">
              <div className="text-center animate-fade-in">
                <div className="text-3xl md:text-5xl font-extrabold mb-2 text-yellow-300">30+</div>
                <div className="text-sm md:text-base text-white/80">Restaurants</div>
              </div>
              <div className="text-center animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <div className="text-3xl md:text-5xl font-extrabold mb-2 text-yellow-300">88+</div>
                <div className="text-sm md:text-base text-white/80">Menu Items</div>
              </div>
              <div className="text-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <div className="text-3xl md:text-5xl font-extrabold mb-2 text-yellow-300">30min</div>
                <div className="text-sm md:text-base text-white/80">Avg Delivery</div>
              </div>
            </div>
          </div>
        </div>

        <main className="container mx-auto px-4 md:px-6">
          {/* Food Categories */}
          <div className="py-12 md:py-16 border-b">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">What's on your mind?</h2>
                <p className="text-gray-600">Explore your favorite cuisines</p>
              </div>
              <div className="flex gap-2">
                <button className="p-3 rounded-full hover:bg-orange-100 hover:text-orange-600 transition-all shadow-sm hover:shadow-md">
                  <ChevronRight className="rotate-180" size={20} />
                </button>
                <button className="p-3 rounded-full hover:bg-orange-100 hover:text-orange-600 transition-all shadow-sm hover:shadow-md">
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-10 gap-6 md:gap-8">
              {foodCategories.map((category, index) => (
                <div
                  key={index}
                  onClick={() => handleCategoryClick(category.name)}
                  className="flex flex-col items-center gap-3 cursor-pointer group"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="w-full aspect-square rounded-full overflow-hidden shadow-lg group-hover:shadow-2xl transition-all duration-300 ring-4 ring-transparent group-hover:ring-orange-200 transform group-hover:-translate-y-2">
                    <img 
                      src={category.image} 
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-500"
                    />
                  </div>
                  <span className="text-xs md:text-sm font-bold text-gray-700 text-center group-hover:text-orange-600 transition-colors">
                    {category.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Offers Section */}
          <div className="py-12 md:py-16 border-b">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-gradient-to-br from-orange-500 to-rose-500 rounded-2xl shadow-lg">
                <Tag className="text-white" size={28} />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">Best Deals for you</h2>
                <p className="text-gray-600">Save big on your favorite meals</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {offers.map((offer, index) => (
                <div
                  key={index}
                  className={`relative overflow-hidden bg-gradient-to-br ${offer.gradient} rounded-3xl p-8 hover:shadow-2xl transition-all duration-500 cursor-pointer group transform hover:-translate-y-2`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-3xl md:text-4xl font-black text-white mb-2 group-hover:scale-110 transition-transform inline-block">{offer.title}</h3>
                        <p className="text-base text-white/95 font-medium">{offer.subtitle}</p>
                      </div>
                      <Sparkles className="text-white/90 animate-pulse" size={28} />
                    </div>
                    <div className="inline-flex items-center gap-3 bg-white/25 backdrop-blur-md px-5 py-3 rounded-xl border-2 border-white/40 group-hover:bg-white/35 transition-all shadow-lg">
                      <span className="text-base font-black text-white font-mono tracking-wider">{offer.code}</span>
                      <ChevronRight className="text-white group-hover:translate-x-1 transition-transform" size={18} />
                    </div>
                  </div>
                  <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/15 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-500"></div>
                  <div className="absolute -left-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="py-6 flex items-center gap-3 border-b overflow-x-auto scrollbar-hide">
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gray-900 text-white shadow-md whitespace-nowrap font-medium">
              <TrendingUp size={18} />
              Popular
            </button>
            {(['Fast Delivery', 'Rating 4.0+', 'New on FoodExpress', 'Offers'] as const).map((filter) => (
              <button
                key={filter}
                className="px-5 py-2.5 rounded-full bg-white border-2 border-gray-200 text-gray-700 hover:border-gray-300 hover:shadow-md whitespace-nowrap transition-all font-medium"
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Restaurants Section */}
          <div className="py-8 pb-16">
            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                Restaurants to explore
              </h2>
              <p className="text-gray-600">
                {restaurants.length} restaurants delivering to you
              </p>
            </div>

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
              <div className="text-center py-20 bg-gray-50 rounded-3xl">
                <div className="w-32 h-32 mx-auto mb-6 bg-gray-200 rounded-full flex items-center justify-center">
                  <Search className="text-gray-400" size={48} />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  No restaurants found
                </h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  We couldn't find any restaurants in your area. Try adjusting your filters or location.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                {restaurants.map((restaurant, index) => {
                  const rating = (4.0 + Math.random() * 0.8).toFixed(1);
                  const time = 20 + Math.floor(Math.random() * 20);
                  const discount = [20, 30, 40, 50][index % 4];
                  
                  return (
                    <div
                      key={restaurant.id}
                      className="group cursor-pointer"
                      onClick={() => router.push(`/menu/${restaurant.id}`)}
                    >
                      {/* Restaurant Image Card */}
                      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-3 shadow-md hover:shadow-2xl transition-all">
                        <img 
                          src={restaurant.image || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&h=300&fit=crop'}
                          alt={restaurant.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                        
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        
                        {/* Discount Badge */}
                        {discount && (
                          <div className="absolute top-3 left-3 flex items-center gap-1 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg">
                            <Tag size={14} />
                            {discount}% OFF
                          </div>
                        )}

                        {/* Favorite Button */}
                        <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:scale-110">
                          <Heart size={18} className="text-gray-600" />
                        </button>

                        {/* Quick Info on Hover */}
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
                        
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <MapPin size={12} />
                          <span>{restaurant.country}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-black text-gray-300">
          <div className="container mx-auto px-4 md:px-6 py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
              {/* Company Info */}
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-2.5 rounded-xl">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm0 18.5c-4.28-1.03-7.5-5.28-7.5-9.5V8.3l7.5-3.75 7.5 3.75v2.7c0 4.22-3.22 8.47-7.5 9.5z"/>
                    </svg>
                  </div>
                  <span className="font-bold text-2xl text-white">FoodExpress</span>
                </div>
                <p className="text-sm text-gray-400 mb-4">
                  Fast, reliable food delivery service bringing your favorite meals to your doorstep.
                </p>
                <p className="text-xs text-gray-500">
                  © 2026 FoodExpress Technologies Inc.
                </p>
              </div>

              {/* Company Links */}
              <div>
                <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Company</h4>
                <ul className="space-y-3 text-sm">
                  <li className="hover:text-orange-500 cursor-pointer transition-colors">About Us</li>
                  <li className="hover:text-orange-500 cursor-pointer transition-colors">Careers</li>
                  <li className="hover:text-orange-500 cursor-pointer transition-colors">Team</li>
                  <li className="hover:text-orange-500 cursor-pointer transition-colors">FoodExpress Blog</li>
                  <li className="hover:text-orange-500 cursor-pointer transition-colors">Bug Bounty</li>
                </ul>
              </div>

              {/* Contact & Support */}
              <div>
                <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Contact</h4>
                <ul className="space-y-3 text-sm">
                  <li className="hover:text-orange-500 cursor-pointer transition-colors">Help & Support</li>
                  <li className="hover:text-orange-500 cursor-pointer transition-colors">Partner with us</li>
                  <li className="hover:text-orange-500 cursor-pointer transition-colors">Ride with us</li>
                </ul>
                
                <h4 className="font-bold text-white mb-4 mt-8 text-sm uppercase tracking-wider">Available in</h4>
                <div className="flex gap-3 text-2xl">
                  <span className="cursor-pointer hover:scale-110 transition-transform">🇮🇳</span>
                  <span className="cursor-pointer hover:scale-110 transition-transform">🇺🇸</span>
                </div>
              </div>

              {/* Legal */}
              <div>
                <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Legal</h4>
                <ul className="space-y-3 text-sm">
                  <li className="hover:text-orange-500 cursor-pointer transition-colors">Terms & Conditions</li>
                  <li className="hover:text-orange-500 cursor-pointer transition-colors">Refund Policy</li>
                  <li className="hover:text-orange-500 cursor-pointer transition-colors">Privacy Policy</li>
                  <li className="hover:text-orange-500 cursor-pointer transition-colors">Cookie Policy</li>
                  <li className="hover:text-orange-500 cursor-pointer transition-colors">Offer Terms</li>
                </ul>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-800 pt-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-6">
                  <a href="#" className="hover:text-orange-500 transition-colors text-sm">
                    Download iOS App
                  </a>
                  <a href="#" className="hover:text-orange-500 transition-colors text-sm">
                    Download Android App
                  </a>
                </div>
                <div className="flex gap-6">
                  <a href="#" className="hover:text-orange-500 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                  <a href="#" className="hover:text-orange-500 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  </a>
                  <a href="#" className="hover:text-orange-500 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </ProtectedRoute>
  );
};

export default HomePage;
