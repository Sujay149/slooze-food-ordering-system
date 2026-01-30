import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Header from '@/components/Header';
import ProtectedRoute from '@/components/ProtectedRoute';
import { menuAPI, restaurantAPI, orderAPI } from '@/lib/api';
import { MenuItem, Restaurant } from '@/types';

interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

const MenuPage = () => {
  const router = useRouter();
  const { restaurantId } = router.query;
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (restaurantId) {
      fetchData();
    }
  }, [restaurantId]);

  const fetchData = async () => {
    try {
      const [restaurantRes, menuRes] = await Promise.all([
        restaurantAPI.getOne(restaurantId as string),
        menuAPI.getByRestaurant(restaurantId as string),
      ]);
      setRestaurant(restaurantRes.data);
      setMenuItems(menuRes.data);
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (menuItem: MenuItem) => {
    const existing = cart.find((item) => item.menuItem.id === menuItem.id);
    if (existing) {
      setCart(
        cart.map((item) =>
          item.menuItem.id === menuItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { menuItem, quantity: 1 }]);
    }
  };

  const removeFromCart = (menuItemId: string) => {
    setCart(cart.filter((item) => item.menuItem.id !== menuItemId));
  };

  const updateQuantity = (menuItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(menuItemId);
    } else {
      setCart(
        cart.map((item) =>
          item.menuItem.id === menuItemId ? { ...item, quantity } : item
        )
      );
    }
  };

  const getTotalAmount = () => {
    return cart.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);
  };

  const handleCreateOrder = async () => {
    if (cart.length === 0) {
      setError('Cannot create order: cart is empty');
      return;
    }

    setCreating(true);
    setError(null);

    try {
      const orderData = {
        restaurantId: restaurantId as string,
        items: cart.map((item) => ({
          menuItemId: item.menuItem.id,
          quantity: item.quantity,
        })),
      };

      const response = await orderAPI.create(orderData);
      
      // Clear cart on success
      setCart([]);
      
      // Navigate to order detail page
      router.push(`/order/${response.data.id}`);
    } catch (err: any) {
      console.error('Order creation error:', err);
      const errorMessage = err.response?.data?.message || 'Failed to create order. Please try again.';
      setError(errorMessage);
    } finally {
      setCreating(false);
    }
  };

  const getItemIcon = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('pizza')) return '🍕';
    if (lowerName.includes('burger')) return '🍔';
    if (lowerName.includes('sushi')) return '🍣';
    if (lowerName.includes('pasta') || lowerName.includes('spaghetti')) return '🍝';
    if (lowerName.includes('taco')) return '🌮';
    if (lowerName.includes('noodle') || lowerName.includes('ramen')) return '🍜';
    if (lowerName.includes('curry')) return '🍛';
    if (lowerName.includes('salad')) return '🥗';
    if (lowerName.includes('sandwich')) return '🥪';
    if (lowerName.includes('chicken')) return '🍗';
    if (lowerName.includes('steak') || lowerName.includes('beef')) return '🥩';
    if (lowerName.includes('rice')) return '🍚';
    if (lowerName.includes('coffee') || lowerName.includes('latte')) return '☕';
    if (lowerName.includes('juice') || lowerName.includes('smoothie')) return '🥤';
    if (lowerName.includes('dessert') || lowerName.includes('cake')) return '🍰';
    return '🍽️';
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-pink-50">
          <Header />
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-5xl mx-auto">
              {/* Loading skeleton */}
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-4">
                    {[1, 2, 3, 4].map((n) => (
                      <div key={n} className="bg-white rounded-2xl p-6 h-32"></div>
                    ))}
                  </div>
                  <div className="bg-white rounded-2xl p-6 h-64"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#F0F0F5]">
        <Header />

        <main className="container mx-auto px-4 py-8">
          {/* Back Button */}
          <button
            onClick={() => router.push('/')}
            className="mb-6 flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium transition group"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span>
            Back to Restaurants
          </button>

          {/* Restaurant Header */}
          <div className="bg-white rounded-3xl p-8 mb-8 shadow-xl border border-gray-100">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-[#FC8019] p-4 rounded-2xl shadow-lg">
                <span className="text-5xl">🍽️</span>
              </div>
              <div className="flex-1">
                <h2 className="text-4xl font-bold mb-2 text-[#282C3F]">{restaurant?.name}</h2>
                <p className="text-gray-600 text-lg">{restaurant?.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2 bg-[#FFF5ED] px-4 py-2 rounded-full border border-orange-200">
                <span>⭐</span>
                <span className="font-semibold text-[#282C3F]">4.5</span>
              </div>
              <div className="flex items-center gap-2 bg-[#FFF5ED] px-4 py-2 rounded-full border border-orange-200">
                <span>🕐</span>
                <span className="text-[#282C3F]">30-40 min</span>
              </div>
              <div className="flex items-center gap-2 bg-[#FFF5ED] px-4 py-2 rounded-full border border-orange-200">
                <span>{restaurant?.country === 'India' ? '🇮🇳' : '🇺🇸'}</span>
                <span className="text-[#282C3F]">{restaurant?.country}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Menu Items */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-800">
                  🍴 Menu Items
                </h3>
                <span className="text-gray-500 text-sm">
                  {menuItems.length} items
                </span>
              </div>
              <div className="space-y-4">
                {menuItems.map((item) => (
                  <div
                    key={item.id}
                    className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100"
                  >
                    <div className="flex gap-4">
                      {/* Item Icon */}
                      <div className="flex-shrink-0">
                        <div className="w-20 h-20 bg-[#FFF5ED] rounded-xl flex items-center justify-center text-4xl group-hover:scale-110 transition-transform border border-orange-100">
                          {getItemIcon(item.name)}
                        </div>
                      </div>

                      {/* Item Details */}
                      <div className="flex-1">
                        <h4 className="text-xl font-bold text-gray-800 mb-1">
                          {item.name}
                        </h4>
                        <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-[#282C3F]">
                              {restaurant?.country === 'India' ? '₹' : '$'}
                              {item.price}
                            </span>
                            <span className="text-yellow-500 text-sm">⭐ 4.3</span>
                          </div>
                          <button
                            onClick={() => addToCart(item)}
                            className="bg-[#FC8019] hover:bg-[#FF5200] text-white px-6 py-2.5 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
                          >
                            + Add
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cart */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-24 border border-gray-100">
                <div className="flex items-center gap-2 mb-6">
                  <span className="text-2xl">🛒</span>
                  <h3 className="text-2xl font-bold text-gray-800">Your Cart</h3>
                </div>
                
                {cart.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4 opacity-50">🛒</div>
                    <p className="text-gray-500 font-medium">Your cart is empty</p>
                    <p className="text-gray-400 text-sm mt-2">Add items to get started</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                      {cart.map((item) => (
                        <div
                          key={item.menuItem.id}
                          className="bg-[#FFF5ED] rounded-xl p-4 border border-orange-200"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-800">
                                {item.menuItem.name}
                              </h4>
                              <p className="text-sm text-gray-600">
                                {restaurant?.country === 'India' ? '₹' : '$'}
                                {item.menuItem.price} each
                              </p>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.menuItem.id)}
                              className="text-red-500 hover:text-red-700 font-medium text-sm"
                            >
                              ✕
                            </button>
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3 bg-white rounded-lg p-1 shadow-sm">
                              <button
                                onClick={() =>
                                  updateQuantity(item.menuItem.id, item.quantity - 1)
                                }
                                className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg font-bold text-gray-700 transition"
                              >
                                −
                              </button>
                              <span className="w-8 text-center font-bold text-gray-800">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateQuantity(item.menuItem.id, item.quantity + 1)
                                }
                                className="w-8 h-8 bg-orange-500 hover:bg-orange-600 rounded-lg font-bold text-white transition"
                              >
                                +
                              </button>
                            </div>
                            <span className="font-bold text-lg text-gray-800">
                              {restaurant?.country === 'India' ? '₹' : '$'}
                              {item.menuItem.price * item.quantity}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Bill Summary */}
                    <div className="border-t-2 border-dashed border-gray-300 pt-4 mb-6">
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-gray-600">
                          <span>Subtotal</span>
                          <span>
                            {restaurant?.country === 'India' ? '₹' : '$'}
                            {getTotalAmount()}
                          </span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                          <span>Delivery Fee</span>
                          <span className="text-green-600 font-semibold">FREE</span>
                        </div>
                      </div>
                      <div className="flex justify-between text-xl font-bold text-[#282C3F] bg-[#FFF5ED] p-3 rounded-lg border border-orange-200">
                        <span>Total</span>
                        <span className="text-[#FC8019]">
                          {restaurant?.country === 'India' ? '₹' : '$'}
                          {getTotalAmount()}
                        </span>
                      </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                      <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                        <div className="flex items-center gap-2">
                          <span>⚠️</span>
                          <p className="text-red-800 text-sm font-medium">{error}</p>
                        </div>
                      </div>
                    )}

                    {/* Checkout Button */}
                    <button
                      onClick={handleCreateOrder}
                      disabled={creating}
                      className={`w-full bg-[#FC8019] hover:bg-[#FF5200] text-white py-4 rounded-xl font-bold text-lg shadow-lg transition-all ${
                        creating
                          ? 'opacity-50 cursor-not-allowed'
                          : 'hover:shadow-xl transform hover:-translate-y-0.5'
                      }`}
                    >
                      {creating ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Creating Order...
                        </span>
                      ) : (
                        <>🛍️ Create Order ({cart.length} item{cart.length !== 1 ? 's' : ''})</>
                      )}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default MenuPage;
