import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Header from '@/components/Header';
import ProtectedRoute from '@/components/ProtectedRoute';
import OrderSuccessModal from '@/components/OrderSuccessModal';
import { menuAPI, restaurantAPI, orderAPI } from '@/lib/api';
import { MenuItem, Restaurant, UserRole } from '@/types';
import { getUser } from '@/lib/auth';
import { Plus, Minus, ShoppingCart, ArrowLeft, Star, Clock, Sparkles, Trash2 } from 'lucide-react';

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
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState<string>('');
  const user = getUser();

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
      
      // Show success modal
      setCreatedOrderId(response.data.id);
      setShowSuccessModal(true);
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
    if (lowerName.includes('biryani')) return '🍛';
    if (lowerName.includes('chicken') || lowerName.includes('tikka')) return '🍗';
    if (lowerName.includes('paneer')) return '🧀';
    if (lowerName.includes('momo') || lowerName.includes('dumpling')) return '🥟';
    if (lowerName.includes('noodle') || lowerName.includes('ramen') || lowerName.includes('pasta')) return '🍜';
    if (lowerName.includes('rice') || lowerName.includes('fried rice')) return '🍚';
    if (lowerName.includes('taco') || lowerName.includes('burrito') || lowerName.includes('quesadilla')) return '🌮';
    if (lowerName.includes('sushi') || lowerName.includes('roll')) return '🍣';
    if (lowerName.includes('sandwich') || lowerName.includes('sub') || lowerName.includes('wrap')) return '🥪';
    if (lowerName.includes('fries') || lowerName.includes('nugget')) return '🍟';
    if (lowerName.includes('salad') || lowerName.includes('bowl')) return '🥗';
    if (lowerName.includes('dessert') || lowerName.includes('cake') || lowerName.includes('brownie') || lowerName.includes('pastry')) return '🍰';
    if (lowerName.includes('ice cream') || lowerName.includes('sundae')) return '🍨';
    if (lowerName.includes('coffee') || lowerName.includes('latte') || lowerName.includes('cappuccino')) return '☕';
    if (lowerName.includes('shake') || lowerName.includes('smoothie')) return '🥤';
    if (lowerName.includes('donut') || lowerName.includes('muffin')) return '🍩';
    if (lowerName.includes('steak') || lowerName.includes('beef')) return '🥩';
    if (lowerName.includes('wings')) return '🍗';
    if (lowerName.includes('shrimp') || lowerName.includes('seafood') || lowerName.includes('fish')) return '🍤';
    if (lowerName.includes('bread') || lowerName.includes('naan') || lowerName.includes('roti')) return '🥖';
    if (lowerName.includes('soup')) return '🍲';
    return '🍽️';
  };

  const getItemCategory = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('pizza') || lowerName.includes('burger') || lowerName.includes('sandwich') || lowerName.includes('wrap') || lowerName.includes('sub')) return 'Mains';
    if (lowerName.includes('fries') || lowerName.includes('nugget') || lowerName.includes('wings') || lowerName.includes('roll') && !lowerName.includes('sushi')) return 'Starters & Sides';
    if (lowerName.includes('biryani') || lowerName.includes('rice') || lowerName.includes('noodle') || lowerName.includes('pasta')) return 'Rice & Noodles';
    if (lowerName.includes('salad') || lowerName.includes('bowl') && !lowerName.includes('rice')) return 'Healthy Options';
    if (lowerName.includes('ice cream') || lowerName.includes('cake') || lowerName.includes('brownie') || lowerName.includes('sundae') || lowerName.includes('donut') || lowerName.includes('pastry') || lowerName.includes('dessert')) return 'Desserts';
    if (lowerName.includes('coffee') || lowerName.includes('latte') || lowerName.includes('shake') || lowerName.includes('smoothie')) return 'Beverages';
    if (lowerName.includes('bread') || lowerName.includes('naan') || lowerName.includes('roti') || lowerName.includes('biscuit')) return 'Breads';
    return 'Recommended';
  };

  const categorizeMenuItems = () => {
    const categories: { [key: string]: MenuItem[] } = {};
    menuItems.forEach(item => {
      const category = getItemCategory(item.name);
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push(item);
    });
    return categories;
  };

  const categorizedMenu = categorizeMenuItems();
  const categoryOrder = ['Recommended', 'Mains', 'Starters & Sides', 'Rice & Noodles', 'Healthy Options', 'Desserts', 'Beverages', 'Breads'];

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
      <div className="min-h-screen bg-white">
        <Header />

        <main className="container mx-auto px-4 md:px-6 py-6">
          {/* Back Button */}
          <button
            onClick={() => router.push('/')}
            className="mb-6 flex items-center gap-2 text-gray-600 hover:text-orange-600 font-medium transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Restaurants</span>
          </button>

          {/* Restaurant Header */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 md:p-8 mb-8 text-white shadow-xl">
            <div className="flex items-start gap-4 md:gap-6">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-4xl border-2 border-white/30">
                🍽️
              </div>
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{restaurant?.name}</h1>
                <p className="text-white/90 mb-4">{restaurant?.description}</p>
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
                    <Star size={16} fill="white" />
                    <span className="font-semibold">4.3</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
                    <Clock size={16} />
                    <span>30-35 mins</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
                    <span>{restaurant?.country === 'India' ? '🇮🇳' : '🇺🇸'}</span>
                    <span>{restaurant?.country}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Menu Items by Category */}
            <div className="lg:col-span-2">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Menu</h2>
                <p className="text-gray-600">{menuItems.length} items available</p>
              </div>

              {/* Categories */}
              <div className="space-y-8">
                {categoryOrder.map(category => {
                  const items = categorizedMenu[category];
                  if (!items || items.length === 0) return null;

                  return (
                    <div key={category} className="scroll-mt-24" id={category.toLowerCase().replace(/\s+/g, '-')}>
                      <div className="flex items-center gap-3 mb-4 pb-3 border-b-2 border-gray-200">
                        <h3 className="text-xl font-bold text-gray-900">{category}</h3>
                        <span className="text-sm text-gray-500">({items.length})</span>
                      </div>

                      <div className="space-y-4">
                        {items.map((item) => {
                          const cartItem = cart.find(c => c.menuItem.id === item.id);
                          const isVeg = Math.random() > 0.5; // Random for demo

                          return (
                            <div
                              key={item.id}
                              className="bg-white rounded-xl border-2 border-gray-100 hover:border-orange-200 hover:shadow-lg transition-all p-4 md:p-5"
                            >
                              <div className="flex gap-4">
                                {/* Veg/Non-veg indicator and Image */}
                                <div className="flex-shrink-0">
                                  <div className="relative">
                                    <div className="w-24 h-24 md:w-28 md:h-28 bg-gray-100 rounded-xl overflow-hidden border-2 border-gray-200">
                                      {item.image ? (
                                        <img 
                                          src={item.image} 
                                          alt={item.name}
                                          className="w-full h-full object-cover"
                                          loading="lazy"
                                        />
                                      ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center text-4xl md:text-5xl">
                                          {getItemIcon(item.name)}
                                        </div>
                                      )}
                                    </div>
                                    <div className="absolute -top-2 -left-2">
                                      <div className={`w-5 h-5 border-2 ${isVeg ? 'border-green-600' : 'border-red-600'} rounded flex items-center justify-center bg-white shadow-md`}>
                                        <div className={`w-2 h-2 rounded-full ${isVeg ? 'bg-green-600' : 'bg-red-600'}`}></div>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Item Details */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between gap-3 mb-2">
                                    <div className="flex-1">
                                      <h4 className="text-lg md:text-xl font-bold text-gray-900 mb-1">
                                        {item.name}
                                      </h4>
                                      <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
                                    </div>
                                  </div>

                                  <div className="flex items-center justify-between mt-3">
                                    <div className="flex items-center gap-3">
                                      <span className="text-xl md:text-2xl font-bold text-gray-900">
                                        {restaurant?.country === 'India' ? '₹' : '$'}{item.price}
                                      </span>
                                      <div className="flex items-center gap-1 text-xs">
                                        <Star size={14} className="text-green-600 fill-green-600" />
                                        <span className="font-semibold text-gray-700">4.2</span>
                                      </div>
                                    </div>

                                    {/* Add/Update Cart Button */}
                                    {cartItem ? (
                                      <div className="flex items-center gap-2 bg-orange-600 rounded-lg p-1 shadow-md">
                                        <button
                                          onClick={() => updateQuantity(item.id, cartItem.quantity - 1)}
                                          className="w-8 h-8 bg-white hover:bg-orange-50 rounded-md flex items-center justify-center transition-colors"
                                        >
                                          <Minus size={16} className="text-orange-600" />
                                        </button>
                                        <span className="w-8 text-center font-bold text-white">
                                          {cartItem.quantity}
                                        </span>
                                        <button
                                          onClick={() => updateQuantity(item.id, cartItem.quantity + 1)}
                                          className="w-8 h-8 bg-white hover:bg-orange-50 rounded-md flex items-center justify-center transition-colors"
                                        >
                                          <Plus size={16} className="text-orange-600" />
                                        </button>
                                      </div>
                                    ) : (
                                      <button
                                        onClick={() => addToCart(item)}
                                        className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2.5 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                                      >
                                        <Plus size={18} />
                                        <span className="hidden md:inline">Add</span>
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Cart Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-24 border-2 border-gray-100">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-gray-100">
                  <ShoppingCart className="text-orange-600" size={28} />
                  <h3 className="text-2xl font-bold text-gray-900">Cart</h3>
                  {cart.length > 0 && (
                    <span className="ml-auto bg-orange-600 text-white text-sm font-bold px-3 py-1 rounded-full">
                      {cart.length}
                    </span>
                  )}
                </div>
                
                {cart.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingCart className="mx-auto mb-4 text-gray-300" size={64} />
                    <p className="text-gray-500 font-medium mb-1">Cart is empty</p>
                    <p className="text-gray-400 text-sm">Add items from menu</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-3 mb-6 max-h-96 overflow-y-auto pr-2">
                      {cart.map((item) => (
                        <div
                          key={item.menuItem.id}
                          className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex-1">
                              <h4 className="font-bold text-gray-900 mb-1">
                                {item.menuItem.name}
                              </h4>
                              <p className="text-sm text-gray-600">
                                {restaurant?.country === 'India' ? '₹' : '$'}{item.menuItem.price} × {item.quantity}
                              </p>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.menuItem.id)}
                              className="p-1.5 hover:bg-red-100 rounded-lg transition-colors group"
                              title="Remove"
                            >
                              <Trash2 size={16} className="text-gray-500 group-hover:text-red-600" />
                            </button>
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2 bg-white rounded-lg p-1 shadow-sm">
                              <button
                                onClick={() => updateQuantity(item.menuItem.id, item.quantity - 1)}
                                className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-md flex items-center justify-center transition-colors"
                              >
                                <Minus size={16} className="text-gray-700" />
                              </button>
                              <span className="w-8 text-center font-bold text-gray-900">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.menuItem.id, item.quantity + 1)}
                                className="w-8 h-8 bg-orange-600 hover:bg-orange-700 rounded-md flex items-center justify-center transition-colors"
                              >
                                <Plus size={16} className="text-white" />
                              </button>
                            </div>
                            <span className="font-bold text-lg text-gray-900">
                              {restaurant?.country === 'India' ? '₹' : '$'}
                              {item.menuItem.price * item.quantity}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Bill Details */}
                    <div className="border-t-2 border-dashed border-gray-300 pt-4 mb-6 space-y-3">
                      <div className="flex justify-between text-gray-600">
                        <span>Item Total</span>
                        <span className="font-semibold">
                          {restaurant?.country === 'India' ? '₹' : '$'}{getTotalAmount()}
                        </span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span className="flex items-center gap-1">
                          Delivery Fee
                          <Sparkles size={14} className="text-green-600" />
                        </span>
                        <span className="text-green-600 font-bold">FREE</span>
                      </div>
                      <div className="flex justify-between items-center text-sm text-gray-500 bg-green-50 px-3 py-2 rounded-lg">
                        <span>Platform fee</span>
                        <span>{restaurant?.country === 'India' ? '₹' : '$'}5</span>
                      </div>
                      <div className="flex justify-between text-xl font-bold text-gray-900 bg-orange-50 p-4 rounded-xl border-2 border-orange-200 mt-3">
                        <span>TO PAY</span>
                        <span className="text-orange-600">
                          {restaurant?.country === 'India' ? '₹' : '$'}{getTotalAmount() + 5}
                        </span>
                      </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                      <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                        <p className="text-red-800 text-sm font-medium">{error}</p>
                      </div>
                    )}

                    {/* Checkout Button */}
                    <button
                      onClick={handleCreateOrder}
                      disabled={creating}
                      className={`w-full bg-orange-600 hover:bg-orange-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg transition-all flex items-center justify-center gap-2 ${
                        creating ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-xl'
                      }`}
                    >
                      {creating ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Creating Order...
                        </>
                      ) : (
                        <>
                          <ShoppingCart size={20} />
                          Place Order
                        </>
                      )}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </main>

        {/* Success Modal */}
        <OrderSuccessModal
          isOpen={showSuccessModal}
          onClose={() => {
            setShowSuccessModal(false);
            router.push(`/order/${createdOrderId}`);
          }}
          orderId={createdOrderId}
          userRole={user?.role || UserRole.MEMBER}
          orderStatus="draft"
        />
      </div>
    </ProtectedRoute>
  );
};

export default MenuPage;
