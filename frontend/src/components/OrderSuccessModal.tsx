import React from 'react';
import { CheckCircle, X, Package, Clock, MapPin } from 'lucide-react';
import { UserRole } from '@/types';

interface OrderSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  userRole: UserRole;
  orderStatus: 'draft' | 'placed';
}

const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  isOpen,
  onClose,
  orderId,
  userRole,
  orderStatus,
}) => {
  if (!isOpen) return null;

  const isDraft = orderStatus === 'draft';
  const isMember = userRole === UserRole.MEMBER;

  const getTitle = () => {
    if (isDraft && isMember) {
      return 'Order Created Successfully!';
    }
    return 'Order Placed Successfully!';
  };

  const getMessage = () => {
    if (isDraft && isMember) {
      return 'Your order has been saved as a draft. A manager or admin will review and place it for you.';
    }
    return 'Your order has been confirmed and will be delivered soon!';
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
        <div
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full pointer-events-auto transform animate-slide-up"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative bg-gradient-to-br from-orange-500 to-rose-600 rounded-t-2xl p-6 text-white">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-lg animate-float">
                <CheckCircle className="text-green-500" size={40} strokeWidth={2.5} />
              </div>
              <h2 className="text-2xl font-bold mb-2">{getTitle()}</h2>
              <p className="text-orange-50 text-sm">Order ID: #{orderId.slice(0, 8)}</p>
            </div>
          </div>

          {/* Body */}
          <div className="p-6">
            <p className="text-gray-600 text-center mb-6">{getMessage()}</p>

            {/* Order Details */}
            <div className="space-y-3 mb-6">
              {isDraft && isMember ? (
                <>
                  <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                    <Clock className="text-yellow-600 flex-shrink-0 mt-0.5" size={20} />
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">Pending Approval</p>
                      <p className="text-gray-600 text-xs mt-1">
                        Your order is awaiting approval from a manager or admin
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <Package className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">What's Next?</p>
                      <p className="text-gray-600 text-xs mt-1">
                        Once approved, your order will be placed and you'll receive updates
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-start gap-3 p-4 bg-green-50 rounded-xl border border-green-200">
                    <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">Order Confirmed</p>
                      <p className="text-gray-600 text-xs mt-1">
                        Your order has been placed successfully
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-orange-50 rounded-xl border border-orange-200">
                    <Clock className="text-orange-600 flex-shrink-0 mt-0.5" size={20} />
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">Estimated Delivery</p>
                      <p className="text-gray-600 text-xs mt-1">30-40 minutes</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-xl border border-purple-200">
                    <MapPin className="text-purple-600 flex-shrink-0 mt-0.5" size={20} />
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">Delivering To</p>
                      <p className="text-gray-600 text-xs mt-1">Your registered address</p>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Action Button */}
            <button
              onClick={onClose}
              className="w-full bg-gradient-to-r from-orange-500 to-rose-600 hover:from-orange-600 hover:to-rose-700 text-white font-bold py-3.5 rounded-xl transition-all transform hover:scale-[1.02] shadow-lg"
            >
              {isDraft && isMember ? 'View Order Status' : 'Track Order'}
            </button>

            <button
              onClick={onClose}
              className="w-full text-gray-500 hover:text-gray-700 font-medium py-2 mt-2 transition-colors text-sm"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderSuccessModal;
