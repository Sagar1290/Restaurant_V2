import { useContext, useState } from "react";
import { AuthContext, CartContext } from "../../Contexts";
import CartItemList from "./CartItemList";
import { CreditCard, ShoppingCart, Trash } from "lucide-react";
import toast from "react-hot-toast";
import _, { uniqueId } from "lodash";

const API_BASE = import.meta.env.VITE_API_BASE;

const FullCart = ({ onModalClose }) => {
  const { user } = useContext(AuthContext);
  const { cart, setCart } = useContext(CartContext);
  const [loading, setLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(null);

  const handleClearCart = () => {
    toast("Cart cleared", {
      icon: <ShoppingCart />,
    });
    setCart(new Map());
  };

  const handlePayment = async (amount) => {
    return new Promise((resolve, reject) => {
      setLoadingStatus("Connecting to payment gateway...");
      setTimeout(() => {
        setLoadingStatus("Processing payment...");
        setTimeout(() => {
          const success = Math.random() > 0.1;
          if (success) {
            const paymentResponse = {
              paymentMethod: "Online",
              refID:
                "REF-" +
                Math.random().toString(36).substring(2, 10).toUpperCase(),
              transactionID: "TXN-" + Date.now(),
              amount: amount,
              status: "successful",
            };
            setLoadingStatus("Payment successful!");
            resolve(paymentResponse);
          } else {
            reject({
              status: "failed",
              message: "Payment gateway error. Please try again.",
            });
          }
        }, 2000);
      }, 1500);
    });
  };

  const handleOrderPlace = async (totalAmount) => {
    try {
      setLoading(true);
      setLoadingStatus("Initializing payment...");

      const paymentDetails = await handlePayment(totalAmount);
      setLoadingStatus("Placing order...");
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        setLoadingStatus("User not authenticated.");
        toast.error("Please login to proceed!");
        return;
      }
      const cartObj = Object.fromEntries(cart);

      const response = await fetch(`${API_BASE}/order/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: user?.id,
          cart: cartObj,
          orderType: "online",
          paymentDetails: paymentDetails,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to place order");
      }

      const res = await response.json();
      const orderID = res?.orderID;

      setLoadingStatus("Order placed successfully!");
      toast.success(`Order #${orderID} placed successfully!`);
      console.log("Order placed:", { orderID, paymentDetails });
      setCart(new Map());
      setLoading(false);
      onModalClose();
    } catch (error) {
      console.error("Order placement error:", error);
      setLoadingStatus(
        error.message || "Something went wrong during order placement."
      );
      toast.error(error.message || "Order failed. Please try again.");
      setLoading(false);
    }
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
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-3 justify-center items-center">
          <button
            className="font-medium rounded-lg transition-all duration-200 cursor-pointer whitespace-nowrap bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-3 text-base flex-1 flex items-center justify-center space-x-2"
            onClick={handleClearCart}
          >
            <div className="w-4 h-4 flex items-center justify-center">
              <Trash />
            </div>
            <span>Clear Cart</span>
          </button>
          <button
            className="font-medium rounded-lg transition-all duration-200 cursor-pointer whitespace-nowrap bg-orange-600 hover:bg-orange-700 text-white shadow-lg hover:shadow-xl px-6 py-3 text-base flex-2 flex items-center justify-center space-x-2"
            onClick={() => handleOrderPlace(total)}
          >
            <div className="w-4 h-4 flex items-center justify-center">
              <CreditCard />
            </div>
            {loading ? (
              <span>Placing Order</span>
            ) : (
              <span>Checkout ₹{total.toFixed(2)}</span>
            )}
          </button>
        </div>
        <div className="w-full flex justify-end">
          {loadingStatus && <span className="text-right">{loadingStatus}</span>}
        </div>
      </div>
    </div>
  );
};

export default FullCart;
