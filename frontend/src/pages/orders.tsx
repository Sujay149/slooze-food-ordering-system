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
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case OrderStatus.PLACED:
        return 'bg-green-100 text-green-800 border-green-300';
      case OrderStatus.CANCELLED:
        return 'bg-red-100 text-red-800 border-red-300';
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
        <div className="min-h-screen bg-gray-50">
          <Header />

          <main className="container mx-auto px-4 py-8">
            <div className="mb-6 flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-800">All Orders</h2>
                <p className="text-gray-600 mt-2">
                  {user?.role === UserRole.ADMIN 
                    ? 'Viewing all orders globally' 
                    : `Viewing orders from ${user?.country}`}
                </p>
              </div>
              <button
                onClick={() => router.push('/')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                ← Back to Restaurants
              </button>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="text-xl text-gray-600">Loading orders...</div>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-300 rounded-lg p-6">
                <p className="text-red-800 font-semibold">Error loading orders</p>
                <p className="text-red-600 text-sm mt-2">{error}</p>
                <button
                  onClick={fetchOrders}
                  className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Retry
                </button>
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <p className="text-gray-600 text-lg">No orders found</p>
                <p className="text-gray-500 text-sm mt-2">
                  Orders will appear here once members create them
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition cursor-pointer border border-gray-200"
                    onClick={() => router.push(`/order/${order.id}`)}
                  >
                    <div className="p-6">
                      {/* Header Row */}
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-800">
                            Order #{order.id}
                          </h3>
                          <p className="text-gray-600 text-sm mt-1">
                            User ID: {order.userId}
                          </p>
                        </div>
                        <div className="text-right">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {getStatusLabel(order.status)}
                          </span>
                          <p className="text-gray-500 text-sm mt-2">
                            {new Date(order.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                      </div>

                      {/* Order Details */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t pt-4">
                        <div>
                          <p className="text-gray-500 text-sm">Country</p>
                          <p className="text-gray-800 font-medium">
                            {order.country === 'India' ? '🇮🇳' : '🇺🇸'} {order.country}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-sm">Items</p>
                          <p className="text-gray-800 font-medium">
                            {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-sm">Total Amount</p>
                          <p className="text-gray-800 font-semibold text-lg">
                            {order.country === 'India' ? '₹' : '$'}
                            {order.totalAmount}
                          </p>
                        </div>
                      </div>

                      {/* Order Items Preview */}
                      <div className="mt-4 border-t pt-4">
                        <p className="text-gray-500 text-sm mb-2">Order Items:</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {order.items.map((item, index) => (
                            <div
                              key={index}
                              className="bg-gray-50 rounded p-2 text-sm text-gray-700"
                            >
                              <span className="font-medium">Item {item.menuItemId}</span>
                              <span className="text-gray-500 mx-2">×</span>
                              <span>{item.quantity}</span>
                              <span className="text-gray-500 mx-2">@</span>
                              <span className="font-semibold">
                                {order.country === 'India' ? '₹' : '$'}
                                {item.price}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Action Hint */}
                      {order.status === OrderStatus.CREATED && (
                        <div className="mt-4 pt-4 border-t">
                          <p className="text-blue-600 text-sm font-medium">
                            💡 Click to view details and finalize this order
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </RoleBased>
    </ProtectedRoute>
  );
};

export default AllOrdersPage;
