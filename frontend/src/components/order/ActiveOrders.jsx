import React, { use, useContext } from "react";
import { AuthContext } from "../../Contexts";

const API_BASE = import.meta.env.VITE_API_BASE;

const ActiveOrders = ({ activeOrders, setActiveOrders }) => {
  const { user } = useContext(AuthContext);

  const handleUpdateOrderItem = async (orderId, orderItemId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("Unauthorized to update order!");
        return;
      }
      const res = await fetch(`${API_BASE}/order/update-order-item`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orderItemId, itemStatus: newStatus }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setActiveOrders((prev) =>
          prev.map((order) =>
            order.order_id === orderId
              ? {
                  ...order,
                  items: order.items.map((item) =>
                    item.order_item_id === orderItemId
                      ? { ...item, item_status: newStatus }
                      : item
                  ),
                  order_status: order.items.every((item) =>
                    item.order_item_id === orderItemId
                      ? newStatus === "ready"
                      : item.item_status === "ready"
                  )
                    ? "ready-for-pickup"
                    : order.order_status,
                  updatedAt: new Date().toISOString(),
                }
              : order
          )
        );
      } else {
        console.error("Failed:", data.message);
      }
    } catch (err) {
      console.error("Error updating order item:", err);
    }
  };

  const handleUpdateOrder = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("Unauthorized to update order!");
        return;
      }
      const res = await fetch(`${API_BASE}/order/update-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orderId, orderStatus: newStatus }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setActiveOrders((prev) =>
          prev.map((order) =>
            order.order_id === orderId
              ? {
                  ...order,
                  order_status: newStatus,
                  updatedAt: new Date().toISOString(),
                }
              : order
          )
        );
      } else {
        console.error("Failed:", data.message);
      }
    } catch (err) {
      console.error("Error updating order:", err);
    }
  };

  if (!activeOrders || activeOrders.length === 0) {
    return (
      <div className="text-gray-600 bg-orange-50 p-4 rounded-lg border border-orange-200 text-center">
        No active orders. Place an order to see it here.
      </div>
    );
  }
  console.log(activeOrders);

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Current Orders
      </h2>

      {activeOrders.map((order) => {
        const totalPrice = order.items.reduce((total, item) => {
          const itemTotal =
            item.quantity * item.price * (1 - item.discount / 100);
          return total + itemTotal;
        }, 0);

        return (
          <div
            key={order.order_id}
            className="bg-white rounded-lg shadow-md border-l-4 border-orange-500 p-6 mb-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Order #{order.order_id}
                  </h3>
                  <p className="text-gray-600">
                    {user.user_role == "manager"
                      ? `${order.fullname ?? order.email}  • `
                      : ""}
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800 capitalize">
                  {order.order_status}
                </span>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">
                  ₹{totalPrice.toFixed(0)}
                </p>
                <p className="text-gray-600">
                  {order.order_type === "dine-in"
                    ? `Table: ${order.table_no}`
                    : "Delivery"}
                </p>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>Order Progress</span>
                <span>
                  (Updated: {new Date(order.updatedAt).toLocaleString()})
                </span>

                <span>Est. 45 mins</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                  style={{
                    width:
                      order.order_status === "pending"
                        ? "20%"
                        : order.order_status === "cooking"
                        ? "50%"
                        : "100%",
                  }}
                ></div>
              </div>
            </div>

            <div className="space-y-3">
              {order.items.map((item) => (
                <div
                  key={item.order_item_id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      alt={item.item_name}
                      className="w-12 h-12 rounded-lg object-cover"
                      src={item.image_url}
                    />
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {item.item_name}
                      </h4>
                      <p className="text-gray-600">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  {user?.user_role === "manager" ? (
                    <div className="flex items-center space-x-3">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        PENDING
                      </span>
                      <select
                        value={item.item_status}
                        onChange={(e) =>
                          handleUpdateOrderItem(
                            order.order_id,
                            item.order_item_id,
                            e.target.value
                          )
                        }
                        className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      >
                        <option value="pending">Pending</option>
                        <option value="cooking">Cooking</option>
                        <option value="ready">Ready</option>
                        <option value="served">Served</option>
                      </select>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item.item_status === "ready"
                            ? "bg-green-100 text-green-800"
                            : item.item_status === "cooking"
                            ? "bg-orange-100 text-orange-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {item.item_status.toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {user?.user_role === "manager" && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <label className="text-sm font-medium text-gray-700">
                      Update Status:
                    </label>
                    <select
                      value={order.order_status}
                      onChange={(e) =>
                        handleUpdateOrder(order.order_id, e.target.value)
                      }
                      className="border border-gray-300 rounded px-3 py-1 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="accepted">Accepted</option>
                      <option value="cooking">Cooking</option>
                      <option value="ready-for-pickup">Ready for Pickup</option>
                      <option value="assigned">Assigned</option>
                      <option value="in-transit">In Transit</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      disabled={true}
                      className="font-medium rounded-lg whitespace-nowrap border-2 border-orange-600 text-orange-600 cursor-not-allowed px-4 py-2 text-sm"
                    >
                      Process Refund
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ActiveOrders;
