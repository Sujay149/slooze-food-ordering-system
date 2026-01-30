import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Header from '@/components/Header';
import ProtectedRoute from '@/components/ProtectedRoute';
import RoleBased from '@/components/RoleBased';
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
    try {
      await orderAPI.placeOrder(order.id, selectedPayment);
      await fetchOrderDetails();
      alert('Order placed successfully!');
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
        return 'bg-yellow-100 text-yellow-800';
      case OrderStatus.PLACED:
        return 'bg-green-100 text-green-800';
      case OrderStatus.CANCELLED:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
        <div className="min-h-screen bg-gray-50">
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
      <div className="min-h-screen bg-gray-50">
        <Header />

        <main className="container mx-auto px-4 py-8">
          <button
            onClick={() => router.push('/')}
            className="mb-4 text-blue-600 hover:underline"
          >
            ← Back to Restaurants
          </button>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-800">Order Details</h2>
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
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Order Items</h3>
              <div className="space-y-2">
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center py-2 border-b text-gray-800"
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
                <div className="flex justify-between text-xl font-bold text-gray-800">
                  <span>Total Amount:</span>
                  <span>
                    {order.country === 'India' ? '₹' : '$'}
                    {order.totalAmount}
                  </span>
                </div>
              </div>
            </div>

            {/* Checkout Section - Only for Admin and Manager */}
            <RoleBased roles={[UserRole.ADMIN, UserRole.MANAGER]}>
              {order.status === 'pending' && (
                <div className="mt-6 pt-6 border-t">
                  <h3 className="text-xl font-semibold mb-4 text-gray-800">
                    Checkout
                  </h3>

                  {paymentMethods.length > 0 ? (
                    <>
                      <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2">
                          Select Payment Method
                        </label>
                        <select
                          value={selectedPayment}
                          onChange={(e) => setSelectedPayment(e.target.value)}
                          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                        >
                          {paymentMethods.map((pm) => (
                            <option key={pm.id} value={pm.id}>
                              {pm.type} {pm.cardLast4 ? `****${pm.cardLast4}` : ''}
                              {pm.isDefault ? ' (Default)' : ''}
                            </option>
                          ))}
                        </select>
                      </div>
                      <button
                        onClick={handlePlaceOrder}
                        className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-semibold"
                      >
                        Place Order & Pay
                      </button>
                    </>
                  ) : (
                    <div className="text-gray-600">
                      No payment methods available. Please add one first.
                    </div>
                  )}
                </div>
              )}
            </RoleBased>

            {/* Cancel Order - Only for Admin and Manager */}
            <RoleBased roles={[UserRole.ADMIN, UserRole.MANAGER]}>
              {order.status !== 'cancelled' && order.status !== 'delivered' && (
                <div className="mt-4">
                  <button
                    onClick={handleCancelOrder}
                    className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
                  >
                    Cancel Order
                  </button>
                </div>
              )}
            </RoleBased>

            {/* Member restriction message */}
            <RoleBased roles={[UserRole.MEMBER]}>
              {order.status === 'pending' && (
                <div className="mt-6 pt-6 border-t">
                  <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
                    <p className="font-semibold">Access Restricted</p>
                    <p className="text-sm mt-1">
                      Members cannot place orders or cancel them. Please contact a Manager
                      or Admin.
                    </p>
                  </div>
                </div>
              )}
            </RoleBased>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default OrderDetailPage;
