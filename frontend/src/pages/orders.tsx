import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Header from '@/components/Header';
import ProtectedRoute from '@/components/ProtectedRoute';
import RoleBased from '@/components/RoleBased';
import { orderAPI } from '@/lib/api';
import { Order, UserRole, OrderStatus } from '@/types';
import { getUser } from '@/lib/auth';

const AllOrdersPage = () => {
  const router = useRouter();
  const user = getUser();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await orderAPI.getAll();
      // Sort by most recent first
      const sortedOrders = response.data.sort((a: Order, b: Order) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setOrders(sortedOrders);
    } catch (err: any) {
      console.error('Failed to fetch orders:', err);
      setError(err.response?.data?.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.CREATED:
        return 'bg-[#FFF5ED] text-[#FC8019] border-orange-200';
      case OrderStatus.PLACED:
        return 'bg-green-50 text-green-700 border-green-200';
      case OrderStatus.CANCELLED:
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusLabel = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.CREATED:
        return '⏳ Draft';
      case OrderStatus.PLACED:
        return '✓ Placed';
      case OrderStatus.CANCELLED:
        return '✕ Cancelled';
      default:
        return status;
    }
  };

  return (
    <ProtectedRoute>
      <RoleBased roles={[UserRole.ADMIN, UserRole.MANAGER]}>
        <div className="min-h-screen bg-[#F0F0F5]">
          <Header />

          <main className="container mx-auto px-4 py-8">
            {/* Page Header */}
            <div className="mb-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h2 className="text-4xl font-bold text-[#282C3F] mb-2">
                    📋 All Orders
                  </h2>
                  <p className="text-gray-600 text-lg">
                    {user?.role === UserRole.ADMIN 
                      ? '🌍 Viewing all orders globally' 
                      : `${user?.country === 'India' ? '🇮🇳' : '🇺🇸'} Viewing orders from ${user?.country}`}
                  </p>
                </div>
                <button
                  onClick={fetchOrders}
                  className="bg-white text-[#FC8019] border-2 border-[#FC8019] px-6 py-3 rounded-xl font-semibold hover:bg-[#FFF5ED] transition shadow-md"
                >
                  🔄 Refresh
                </button>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((n) => (
                  <div key={n} className="bg-white rounded-2xl shadow-md p-6 animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                    <div className="space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="bg-white rounded-3xl shadow-2xl p-12 text-center border border-red-200">
                <div className="text-6xl mb-6">⚠️</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Error Loading Orders</h3>
                <p className="text-gray-600 mb-8">{error}</p>
                <button
                  onClick={fetchOrders}
                  className="bg-[#FC8019] hover:bg-[#FF5200] text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition"
                >
                  🔄 Try Again
                </button>
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-white rounded-3xl shadow-xl p-16 text-center">
                <div className="text-8xl mb-6">📭</div>
                <h3 className="text-3xl font-bold text-gray-800 mb-4">No Orders Yet</h3>
                <p className="text-gray-600 text-lg mb-8">
                  Orders will appear here once members create them
                </p>
                <button
                  onClick={() => router.push('/')}
                  className="bg-[#FC8019] hover:bg-[#FF5200] text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition"
                >
                  Browse Restaurants
                </button>
              </div>
            ) : (
              <>
                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                  <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm font-medium">Total Orders</p>
                        <p className="text-3xl font-bold text-gray-800 mt-1">{orders.length}</p>
                      </div>
                      <div className="text-4xl">📦</div>
                    </div>
                  </div>
                  <div className="bg-[#FFF5ED] rounded-2xl p-6 shadow-md border border-orange-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm font-medium">Draft</p>
                        <p className="text-3xl font-bold text-[#FC8019] mt-1">
                          {orders.filter(o => o.status === OrderStatus.CREATED).length}
                        </p>
                      </div>
                      <div className="text-4xl">⏳</div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 shadow-md border border-green-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm font-medium">Placed</p>
                        <p className="text-3xl font-bold text-green-600 mt-1">
                          {orders.filter(o => o.status === OrderStatus.PLACED).length}
                        </p>
                      </div>
                      <div className="text-4xl">✓</div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-6 shadow-md border border-red-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm font-medium">Cancelled</p>
                        <p className="text-3xl font-bold text-red-600 mt-1">
                          {orders.filter(o => o.status === OrderStatus.CANCELLED).length}
                        </p>
                      </div>
                      <div className="text-4xl">✕</div>
                    </div>
                  </div>
                </div>

                {/* Orders Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden border border-gray-100 transform hover:-translate-y-1"
                      onClick={() => router.push(`/order/${order.id}`)}
                    >
                      {/* Status Banner */}
                      <div className={`h-2 ${
                        order.status === OrderStatus.CREATED ? 'bg-[#FC8019]' :
                        order.status === OrderStatus.PLACED ? 'bg-green-500' :
                        'bg-red-500'
                      }`}></div>

                      <div className="p-6">
                        {/* Header Row */}
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-gray-800 mb-1 group-hover:text-[#FC8019] transition">
                              Order #{order.id}
                            </h3>
                            <p className="text-sm text-gray-500">
                              User: <span className="font-medium text-gray-700">{order.userId}</span>
                            </p>
                          </div>
                          <div className="text-right">
                            <span className={`inline-block px-3 py-1.5 rounded-full text-xs font-bold border ${getStatusColor(order.status)}`}>
                              {getStatusLabel(order.status)}
                            </span>
                            <p className="text-xs text-gray-500 mt-2">
                              {new Date(order.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                          </div>
                        </div>

                        {/* Order Details Grid */}
                        <div className="grid grid-cols-3 gap-3 mb-4">
                          <div className="bg-[#FFF5ED] rounded-xl p-3 text-center border border-orange-100">
                            <p className="text-xs text-gray-600 mb-1">Country</p>
                            <p className="font-bold text-gray-800">
                              {order.country === 'India' ? '🇮🇳' : '🇺🇸'}
                            </p>
                          </div>
                          <div className="bg-[#FFF5ED] rounded-xl p-3 text-center border border-orange-100">
                            <p className="text-xs text-gray-600 mb-1">Items</p>
                            <p className="font-bold text-gray-800">{order.items.length}</p>
                          </div>
                          <div className="bg-[#FFF5ED] rounded-xl p-3 text-center border border-orange-100">
                            <p className="text-xs text-gray-600 mb-1">Total</p>
                            <p className="font-bold text-[#FC8019]">
                              {order.country === 'India' ? '₹' : '$'}{order.totalAmount}
                            </p>
                          </div>
                        </div>

                        {/* Order Items Preview */}
                        <div className="border-t border-dashed border-gray-200 pt-4">
                          <p className="text-xs text-gray-500 mb-2 font-medium">Order Items:</p>
                          <div className="grid grid-cols-2 gap-2">
                            {order.items.slice(0, 4).map((item, index) => (
                              <div
                                key={index}
                                className="bg-gray-50 rounded-lg p-2 text-xs"
                              >
                                <div className="flex items-center gap-2">
                                  <span className="text-lg">🍽️</span>
                                  <div className="flex-1 min-w-0">
                                    <p className="font-medium text-gray-700 truncate">
                                      Item {item.menuItemId}
                                    </p>
                                    <p className="text-gray-500">
                                      Qty: {item.quantity} × {order.country === 'India' ? '₹' : '$'}{item.price}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          {order.items.length > 4 && (
                            <p className="text-xs text-gray-500 mt-2 text-center">
                              + {order.items.length - 4} more item(s)
                            </p>
                          )}
                        </div>

                        {/* Action Hint */}
                        {order.status === OrderStatus.CREATED && (
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <p className="text-[#FC8019] text-sm font-semibold flex items-center gap-2">
                              <span>💡</span>
                              Click to finalize this order
                              <span className="group-hover:translate-x-1 transition-transform">→</span>
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </main>
        </div>
      </RoleBased>
    </ProtectedRoute>
  );
};

export default AllOrdersPage;
