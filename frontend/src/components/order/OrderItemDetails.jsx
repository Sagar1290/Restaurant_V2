const OrderItemDetails = ({ order }) => {
  if (!order) return null;

  const TAX_RATE = 0.18;

  const subtotal = order.items.reduce((sum, item) => {
    const discountedPrice = item.price * (1 - item.discount / 100);
    return sum + discountedPrice * item.quantity;
  }, 0);

  const tax = subtotal * TAX_RATE;
  const DELIVERY_FEE =
    order.order_type === "online" && subtotal >= 300 ? 30 : 0;
  const total = subtotal + tax + DELIVERY_FEE;

  return (
    <div className="mt-4 pt-4 border-t border-gray-200">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Items */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Order Items</h4>
          <div className="space-y-3">
            {order.items.map((item) => {
              const discountedPrice = item.price * (1 - item.discount / 100);
              const itemTotal = discountedPrice * item.quantity;

              return (
                <div
                  key={item.order_item_id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      alt={item.item_name}
                      src={item.image_url}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div>
                      <h5 className="font-medium text-gray-900">
                        {item.item_name}
                      </h5>
                      <p className="text-sm text-gray-600">
                        ₹{item.price}{" "}
                        {item.discount > 0 && `(${item.discount}% off)`}
                      </p>
                      {item.special_instruction && (
                        <p className="text-xs text-blue-600">
                          {item.special_instruction}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">Qty: {item.quantity}</p>
                    <p className="text-sm text-gray-600">
                      ₹{itemTotal.toFixed(2)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Order Summary</h4>
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(0)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Tax (18%)</span>
              <span>₹{tax.toFixed(0)}</span>
            </div>
            {DELIVERY_FEE > 0 && (
              <div className="flex justify-between text-sm">
                <span>Delivery Fee</span>
                <span>₹{DELIVERY_FEE}</span>
              </div>
            )}
            <div className="border-t border-gray-200 pt-2">
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>₹{total.toFixed(0)}</span>
              </div>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Payment Method</span>
              <span className="capitalize">{order.payment_method}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderItemDetails;
