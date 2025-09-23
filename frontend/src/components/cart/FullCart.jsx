import { useContext } from "react";
import { CartContext } from "../../Contexts";
import CartItemList from "./CartItemList";
import { CreditCard, Trash } from "lucide-react";

const FullCart = () => {
  const { cart, setCart } = useContext(CartContext);

  const handleClearCart = () => {
    toast("Cart cleared", {
      icon: <ShoppingCart />,
    });
    setCart(new Map());
  };

  const subtotal = Array.from(cart.values()).reduce(
    (acc, item) => acc + item.subTotal,
    0
  );

  const tax = subtotal * 0.18;
  const deliveryFee = subtotal < 300 ? 30 : 0;
  const total = subtotal + tax + deliveryFee;

  const amountToFreeDelivery = 300 - subtotal;
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-6">
        <div className="space-y-4 mb-6">
          <CartItemList />
        </div>
        <div className="bg-orange-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">Order Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal:</span>
              <span className="text-gray-900">₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tax (GST 18%):</span>
              <span className="text-gray-900">₹{tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Delivery Fee:</span>
              {deliveryFee > 0 ? (
                <span className="text-gray-900">₹{deliveryFee}</span>
              ) : (
                <span className="text-green-600">FREE</span>
              )}
            </div>

            {deliveryFee > 0 && amountToFreeDelivery > 0 && (
              <div className="text-xs text-orange-600 mt-1">
                Add ₹{amountToFreeDelivery.toFixed(2)} more to get{" "}
                <strong>FREE delivery</strong>!
              </div>
            )}

            <div className="border-t border-orange-200 pt-2 mt-2">
              <div className="flex justify-between font-semibold text-lg">
                <span className="text-gray-900">Total:</span>
                <span className="text-orange-600">₹{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex space-x-3">
          <button
            className="font-medium rounded-lg transition-all duration-200 cursor-pointer whitespace-nowrap bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-3 text-base flex-1 flex items-center justify-center space-x-2"
            onClick={handleClearCart}
          >
            <div className="w-4 h-4 flex items-center justify-center">
              <Trash />
            </div>
            <span>Clear Cart</span>
          </button>
          <button className="font-medium rounded-lg transition-all duration-200 cursor-pointer whitespace-nowrap bg-orange-600 hover:bg-orange-700 text-white shadow-lg hover:shadow-xl px-6 py-3 text-base flex-2 flex items-center justify-center space-x-2">
            <div className="w-4 h-4 flex items-center justify-center">
              <CreditCard />
            </div>
            <span>Checkout ₹{total.toFixed(2)}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FullCart;
