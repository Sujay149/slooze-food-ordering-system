import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Header from '@/components/Header';
import ProtectedRoute from '@/components/ProtectedRoute';
import { orderAPI, paymentAPI } from '@/lib/api';
import { Order, PaymentMethod, UserRole, OrderStatus } from '@/types';
import { getUser } from '@/lib/auth';

const OrderDetailPage = () => {
  const router = useRouter();
  const { orderId } = router.query;
  const user = getUser();
  const [order, setOrder] = useState<Order | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedPayment, setSelectedPayment] = useState('');
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
      fetchPaymentMethods();
    }
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      setError(null);
      const response = await orderAPI.getOne(orderId as string);
      setOrder(response.data);
    } catch (err: any) {
      console.error('Failed to fetch order:', err);
      setError(err.response?.data?.message || 'Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const fetchPaymentMethods = async () => {
    try {
      const response = await paymentAPI.getAll();
      setPaymentMethods(response.data);
      const defaultMethod = response.data.find((pm: PaymentMethod) => pm.isDefault);
      if (defaultMethod) {
        setSelectedPayment(defaultMethod.id);
      }
    } catch (err) {
      console.error('Failed to fetch payment methods:', err);
    }
  };

  const handlePlaceOrder = async () => {
    if (!order) return;

    setPlacing(true);
    setError(null);
    try {
      await orderAPI.placeOrder(order.id, selectedPayment);
      await fetchOrderDetails();
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to place order';
      setError(errorMsg);
    } finally {
      setPlacing(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!order || !confirm('Are you sure you want to cancel this order?')) return;

    setCancelling(true);
    setError(null);
    try {
      await orderAPI.cancelOrder(order.id);
      await fetchOrderDetails();
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to cancel order';
      setError(errorMsg);
    } finally {
      setCancelling(false);
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.CREATED:
        return 'from-yellow-400 to-orange-400';
      case OrderStatus.PLACED:
        return 'from-green-400 to-emerald-500';
      case OrderStatus.CANCELLED:
        return 'from-red-400 to-pink-500';
      default:
        return 'from-gray-400 to-gray-500';
    }
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.CREATED:
        return '⏳';
      case OrderStatus.PLACED:
        return '✓';
      case OrderStatus.CANCELLED:
        return '✕';
      default:
        return '•';
    }
  };

  const getStatusLabel = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.CREATED:
        return 'Draft Order';
      case OrderStatus.PLACED:
        return 'Order Placed';
      case OrderStatus.CANCELLED:
        return 'Cancelled';
      default:
        return status;
    }
  };

  const canPlaceOrder = () => {
    return (
      order?.status === OrderStatus.CREATED &&
      (user?.role === UserRole.ADMIN || user?.role === UserRole.MANAGER)
    );
  };

  const canCancelOrder = () => {
    return (
      order?.status === OrderStatus.CREATED &&
      (user?.role === UserRole.ADMIN || user?.role === UserRole.MANAGER)
    );
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-pink-50">
          <Header />
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-4xl mx-auto">
              <div className="animate-pulse space-y-6">
                <div className="h-12 bg-gray-200 rounded w-1/3"></div>
                <div className="bg-white rounded-3xl p-8 space-y-4">
                  <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-6 bg-gray-200 rounded w-full"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error && !order) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-pink-50">
          <Header />
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-3xl shadow-2xl p-12 text-center border border-red-200">
                <div className="text-6xl mb-6">⚠️</div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Error Loading Order</h2>
                <p className="text-gray-600 mb-8">{error}</p>
                <button
                  onClick={() => router.push('/')}
                  className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition"
                >
                  ← Back to Restaurants
                </button>
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!order) return null;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-pink-50">
        <Header />

        <main className="container mx-auto px-4 py-8">
          {/* Back Button */}
          <button
            onClick={() => router.push('/')}
            className="mb-6 flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium transition group"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span>
            Back to Home
          </button>

          <div className="max-w-4xl mx-auto">
            {/* Order Header */}
            <div className="bg-white rounded-3xl shadow-xl p-8 mb-6 border border-gray-100">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">
                    Order #{order.id}
                  </h2>
                  <p className="text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <div className={`px-6 py-3 rounded-2xl bg-gradient-to-r ${getStatusColor(order.status)} text-white font-bold shadow-lg`}>
                  <span className="text-2xl mr-2">{getStatusIcon(order.status)}</span>
                  {getStatusLabel(order.status)}
                </div>
              </div>

              {/* Member Hint */}
              {user?.role === UserRole.MEMBER && order.status === OrderStatus.CREATED && (
                <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📋</span>
                    <div>
                      <p className="font-semibold text-blue-800">Awaiting manager approval</p>
                      <p className="text-blue-600 text-sm">A manager will review and finalize this order shortly</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Order Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-4 border border-orange-200">
                  <p className="text-gray-600 text-sm font-medium mb-1">Country</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {order.country === 'India' ? '🇮🇳' : '🇺🇸'} {order.country}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4 border border-purple-200">
                  <p className="text-gray-600 text-sm font-medium mb-1">Restaurant</p>
                  <p className="text-2xl font-bold text-gray-800">🍽️ #{order.restaurantId}</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-200">
                  <p className="text-gray-600 text-sm font-medium mb-1">Total Items</p>
                  <p className="text-2xl font-bold text-gray-800">
                    🛍️ {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span>📦</span>
                  Order Items
                </h3>
                <div className="space-y-3">
                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center bg-gradient-to-r from-gray-50 to-orange-50 rounded-xl p-4 border border-gray-200"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-2xl shadow-sm">
                          🍽️
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">Menu Item #{item.menuItemId}</p>
                          <p className="text-sm text-gray-600">
                            Quantity: <span className="font-bold text-orange-600">{item.quantity}</span>
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">
                          {order.country === 'India' ? '₹' : '$'}{item.price} × {item.quantity}
                        </p>
                        <p className="text-lg font-bold text-gray-800">
                          {order.country === 'India' ? '₹' : '$'}
                          {item.price * item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="mt-6 pt-6 border-t-2 border-dashed border-gray-300">
                <div className="flex justify-between items-center bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-2xl p-6 shadow-lg">
                  <span className="text-2xl font-bold">Total Amount</span>
                  <span className="text-3xl font-bold">
                    {order.country === 'India' ? '₹' : '$'}
                    {order.totalAmount}
                  </span>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 rounded-xl p-6 mb-6 shadow-md">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">⚠️</span>
                  <div>
                    <p className="font-bold text-red-800 text-lg">Error</p>
                    <p className="text-red-600">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            {order.status === OrderStatus.CREATED && (
              <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
                {canPlaceOrder() && (
                  <>
                    <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                      <span>💳</span>
                      Finalize Order
                    </h3>

                    {paymentMethods.length > 0 && (
                      <div className="mb-6">
                        <label className="block text-gray-700 font-semibold mb-3">
                          Select Payment Method
                        </label>
                        <select
                          value={selectedPayment}
                          onChange={(e) => setSelectedPayment(e.target.value)}
                          className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-800 font-medium bg-white shadow-sm"
                        >
                          {paymentMethods.map((pm) => (
                            <option key={pm.id} value={pm.id}>
                              {pm.type} {pm.cardLast4 ? `****${pm.cardLast4}` : ''}
                              {pm.isDefault ? ' (Default)' : ''}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    <div className="flex gap-4">
                      <button
                        onClick={handlePlaceOrder}
                        disabled={placing}
                        className={`flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg transition-all ${
                          placing
                            ? 'opacity-50 cursor-not-allowed'
                            : 'hover:shadow-xl hover:from-green-600 hover:to-emerald-700 transform hover:-translate-y-0.5'
                        }`}
                      >
                        {placing ? (
                          <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Placing Order...
                          </span>
                        ) : (
                          '✓ Place Order'
                        )}
                      </button>

                      {canCancelOrder() && (
                        <button
                          onClick={handleCancelOrder}
                          disabled={cancelling}
                          className={`flex-1 bg-gradient-to-r from-red-500 to-pink-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg transition-all ${
                            cancelling
                              ? 'opacity-50 cursor-not-allowed'
                              : 'hover:shadow-xl hover:from-red-600 hover:to-pink-700 transform hover:-translate-y-0.5'
                          }`}
                        >
                          {cancelling ? 'Cancelling...' : '✕ Cancel Order'}
                        </button>
                      )}
                    </div>
                  </>
                )}

                {!canPlaceOrder() && user?.role === UserRole.MEMBER && (
                  <div className="text-center py-8">
                    <div className="text-6xl mb-4">📋</div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Order Created</h3>
                    <p className="text-gray-600">
                      Your order has been created. A manager will review and finalize it shortly.
                    </p>
                  </div>
                )}
              </div>
            )}

            {order.status === OrderStatus.PLACED && (
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-3xl shadow-2xl p-12 text-center text-white">
                <div className="text-7xl mb-6">✓</div>
                <h3 className="text-4xl font-bold mb-4">Order Successfully Placed!</h3>
                <p className="text-xl opacity-90 mb-8">
                  Your order is being processed and will be delivered soon
                </p>
                <div className="flex justify-center gap-4">
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-3">
                    <p className="text-sm opacity-90">Order ID</p>
                    <p className="font-bold text-lg">#{order.id}</p>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-3">
                    <p className="text-sm opacity-90">Estimated Time</p>
                    <p className="font-bold text-lg">30-40 min</p>
                  </div>
                </div>
              </div>
            )}

            {order.status === OrderStatus.CANCELLED && (
              <div className="bg-gradient-to-r from-red-500 to-pink-600 rounded-3xl shadow-2xl p-12 text-center text-white">
                <div className="text-7xl mb-6">✕</div>
                <h3 className="text-4xl font-bold mb-4">Order Cancelled</h3>
                <p className="text-xl opacity-90">
                  This order has been cancelled and will not be processed
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default OrderDetailPage;
