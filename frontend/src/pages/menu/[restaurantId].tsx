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

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-xl">Loading...</div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Header />

        <main className="container mx-auto px-4 py-8">
          <button
            onClick={() => router.push('/')}
            className="mb-4 text-blue-600 hover:underline"
          >
            ← Back to Restaurants
          </button>

          <h2 className="text-3xl font-bold mb-2 text-gray-800">
            {restaurant?.name}
          </h2>
          <p className="text-gray-600 mb-6">{restaurant?.description}</p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Menu Items */}
            <div className="lg:col-span-2">
              <h3 className="text-2xl font-semibold mb-4 text-gray-800">Menu</h3>
              <div className="space-y-4">
                {menuItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-lg shadow p-4 flex justify-between items-center"
                  >
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800">
                        {item.name}
                      </h4>
                      <p className="text-gray-600 text-sm">{item.description}</p>
                      <p className="text-blue-600 font-semibold mt-2">
                        {restaurant?.country === 'India' ? '₹' : '$'}
                        {item.price}
                      </p>
                    </div>
                    <button
                      onClick={() => addToCart(item)}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                      Add to Cart
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Cart */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow p-4 sticky top-4">
                <h3 className="text-2xl font-semibold mb-4 text-gray-800">Cart</h3>
                {cart.length === 0 ? (
                  <p className="text-gray-600">Your cart is empty</p>
                ) : (
                  <>
                    <div className="space-y-3 mb-4">
                      {cart.map((item) => (
                        <div
                          key={item.menuItem.id}
                          className="border-b pb-2 text-gray-800"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-medium">{item.menuItem.name}</span>
                            <button
                              onClick={() => removeFromCart(item.menuItem.id)}
                              className="text-red-600 text-sm"
                            >
                              Remove
                            </button>
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() =>
                                  updateQuantity(item.menuItem.id, item.quantity - 1)
                                }
                                className="bg-gray-200 px-2 py-1 rounded"
                              >
                                -
                              </button>
                              <span>{item.quantity}</span>
                              <button
                                onClick={() =>
                                  updateQuantity(item.menuItem.id, item.quantity + 1)
                                }
                                className="bg-gray-200 px-2 py-1 rounded"
                              >
                                +
                              </button>
                            </div>
                            <span className="font-semibold">
                              {restaurant?.country === 'India' ? '₹' : '$'}
                              {item.menuItem.price * item.quantity}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="border-t pt-3 mb-4">
                      <div className="flex justify-between text-lg font-bold text-gray-800">
                        <span>Total:</span>
                        <span>
                          {restaurant?.country === 'India' ? '₹' : '$'}
                          {getTotalAmount()}
                        </span>
                      </div>
                    </div>
                    
                    {/* Error Message */}
                    {error && (
                      <div className="mb-4 p-3 bg-red-50 border border-red-300 rounded-lg">
                        <p className="text-red-800 text-sm">{error}</p>
                      </div>
                    )}
                    
                    <button
                      onClick={handleCreateOrder}
                      disabled={creating}
                      className={`w-full bg-green-600 text-white py-2 rounded font-semibold transition ${
                        creating
                          ? 'opacity-50 cursor-not-allowed'
                          : 'hover:bg-green-700'
                      }`}
                    >
                      {creating ? 'Creating Order...' : 'Create Order'}
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
