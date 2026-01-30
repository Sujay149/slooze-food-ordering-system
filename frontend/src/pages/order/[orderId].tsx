import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Header from '@/components/Header';
import ProtectedRoute from '@/components/ProtectedRoute';
import RoleBased from '@/components/RoleBased';
import OrderSuccessModal from '@/components/OrderSuccessModal';
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
  const [showSuccessModal, setShowSuccessModal] = useState(false);

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
    try {
      await orderAPI.placeOrder(order.id, selectedPayment);
      await fetchOrderDetails();
      setShowSuccessModal(true);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to place order';
      alert(errorMsg);
    } finally {
      setPlacing(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!order || !confirm('Are you sure you want to cancel this order?')) return;

    setCancelling(true);
    try {
      await orderAPI.cancelOrder(order.id);
      await fetchOrderDetails();
      alert('Order cancelled successfully');
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to cancel order';
      alert(errorMsg);
    } finally {
      setCancelling(false);
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.CREATED:
        return 'bg-[#FFF5ED] text-[#FC8019] border border-orange-200';
      case OrderStatus.PLACED:
        return 'bg-green-50 text-green-700 border border-green-200';
      case OrderStatus.CANCELLED:
        return 'bg-red-50 text-red-700 border border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
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
    return order?.status === OrderStatus.CREATED && user?.role !== UserRole.MEMBER;
  };

  const canCancelOrder = () => {
    return order?.status === OrderStatus.CREATED && user?.role !== UserRole.MEMBER;
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-xl">Loading order details...</div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error || !order) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-[#F0F0F5]">
          <Header />
          <div className="container mx-auto px-4 py-8">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <h2 className="text-xl font-semibold text-red-800 mb-2">
                {error || 'Order not found'}
              </h2>
              <button
                onClick={() => router.push('/')}
                className="mt-4 text-blue-600 hover:underline"
              >
                ← Return to Restaurants
              </button>
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
          <button
            onClick={() => router.push('/')}
            className="mb-4 text-[#FC8019] hover:text-[#FF5200] font-medium"
          >
            ← Back to Restaurants
          </button>

          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-3xl font-bold text-[#282C3F]">Order Details</h2>
                <p className="text-gray-600 mt-1">Order ID: {order.id}</p>
              </div>
              <div className="text-right">
                <span
                  className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(
                    order.status,
                  )}`}
                >
                  {getStatusLabel(order.status)}
                </span>
                {order.status === OrderStatus.CREATED && user?.role === UserRole.MEMBER && (
                  <p className="text-sm text-gray-500 mt-2">
                    Awaiting manager approval
                  </p>
                )}
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="text-xl font-semibold mb-4 text-[#282C3F]">Order Items</h3>
              <div className="space-y-2">
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center py-2 border-b text-[#282C3F]"
                  >
                    <div>
                      <span className="font-medium">Item {item.menuItemId}</span>
                      <span className="text-gray-600 ml-2">x {item.quantity}</span>
                    </div>
                    <span className="font-semibold">
                      {order.country === 'India' ? '₹' : '$'}
                      {item.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between text-xl font-bold text-[#282C3F]">
                  <span>Total Amount:</span>
                  <span className="text-[#FC8019]">
                    {order.country === 'India' ? '₹' : '$'}
                    {order.totalAmount}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 pt-6 border-t">
              {order.status === OrderStatus.CREATED && (
                <>
                  {/* Place Order Button - Admin & Manager only */}
                  {canPlaceOrder() && (
                    <div className="mb-4">
                      <h3 className="text-xl font-semibold mb-4 text-[#282C3F]">
                        Finalize Order
                      </h3>

                      {paymentMethods.length > 0 && (
                        <div className="mb-4">
                          <label className="block text-[#282C3F] font-medium mb-2">
                            Select Payment Method
                          </label>
                          <select
                            value={selectedPayment}
                            onChange={(e) => setSelectedPayment(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FC8019] text-[#282C3F]"
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

                      <button
                        onClick={handlePlaceOrder}
                        disabled={placing}
                        className={`w-full bg-[#FC8019] hover:bg-[#FF5200] text-white py-3 rounded-xl font-semibold transition shadow-lg ${
                          placing
                            ? 'opacity-50 cursor-not-allowed'
                            : 'hover:shadow-xl'
                        }`}
                      >
                        {placing ? 'Placing Order...' : '✓ Place Order'}
                      </button>
                    </div>
                  )}

                  {/* Cancel Order Button - Admin & Manager only */}
                  {canCancelOrder() && (
                    <button
                      onClick={handleCancelOrder}
                      disabled={cancelling}
                      className={`w-full bg-gray-200 hover:bg-gray-300 text-[#282C3F] py-3 rounded-xl font-semibold transition shadow-lg ${
                        cancelling
                          ? 'opacity-50 cursor-not-allowed'
                          : 'hover:shadow-xl'
                      }`}
                    >
                      {cancelling ? 'Cancelling...' : '✕ Cancel Order'}
                    </button>
                  )}

                  {/* Message for Members */}
                  {user?.role === UserRole.MEMBER && (
                    <div className="bg-[#FFF5ED] border border-orange-200 rounded-xl p-4 text-center">
                      <p className="text-[#FC8019] font-medium">
                        📋 Your order has been created
                      </p>
                      <p className="text-gray-600 text-sm mt-2">
                        A manager will review and finalize this order. You will be notified once it's processed.
                      </p>
                    </div>
                  )}
                </>
              )}

              {order.status === OrderStatus.PLACED && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                  <p className="text-green-700 font-medium text-lg">
                    ✓ Order Successfully Placed
                  </p>
                  <p className="text-gray-600 text-sm mt-2">
                    Your order is being processed
                  </p>
                </div>
              )}

              {order.status === OrderStatus.CANCELLED && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
                  <p className="text-red-700 font-medium text-lg">
                    ✕ Order Cancelled
                  </p>
                  <p className="text-gray-600 text-sm mt-2">
                    This order has been cancelled
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Success Modal */}
        <OrderSuccessModal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          orderId={order?.id || ''}
          userRole={user?.role || UserRole.MEMBER}
          orderStatus="placed"
        />
      </div>
    </ProtectedRoute>
  );
};

export default OrderDetailPage;
