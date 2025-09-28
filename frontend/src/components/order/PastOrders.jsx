import { useState } from "react";
import OrderItemDetails from "./OrderItemDetails";
import { MapPin, StickyNote, Utensils } from "lucide-react";

const PastOrders = ({ pastOrders }) => {
  const [detailsShown, setDetailsShown] = useState({});

  const toggleDetails = (orderId) => {
    setDetailsShown((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  if (!pastOrders || pastOrders.length == 0) {
    return (
      <div className="text-gray-600 bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
        You have no past orders.
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Order History
      </h2>
      <div className="space-y-4">
        {pastOrders.map((order) => {
          const totalAmount = order.items.reduce((sum, item) => {
            const discounted = item.price * (1 - item.discount / 100);
            return sum + discounted * item.quantity;
          }, 0);

          const paymentStatusColor =
            order.payment_status === "successful"
              ? "green"
              : order.payment_status === "failed"
              ? "red"
              : "gray";

          const orderStatusColor =
            order.order_status === "completed"
              ? "green"
              : order.order_status === "canceled"
              ? "red"
              : "orange";

          return (
            <div
              key={order.order_id}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Order #{order.order_id}
                    </h3>
                    <p className="text-gray-600">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium bg-${orderStatusColor}-100 text-${orderStatusColor}-800 capitalize`}
                  >
                    {order.order_status}
                  </span>
                </div>
                <div className="text-right space-y-1">
                  <p className="text-xl font-bold text-gray-900">
                    ₹{totalAmount.toFixed(0)}
                  </p>
                  <p className="text-gray-600">
                    {order.order_type === "dine-in"
                      ? `Table: ${order.table_no}`
                      : "Delivery"}
                  </p>
                  <span
                    className={`text-sm px-2 py-1 rounded-full bg-${paymentStatusColor}-100 text-${paymentStatusColor}-800 capitalize`}
                  >
                    {order.payment_status}
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center space-x-2 text-gray-600 mb-2">
                  <Utensils />
                  <span className="text-sm">
                    {order.items.length} item{order.items.length > 1 ? "s" : ""}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {order.items.map((item) => (
                    <span
                      key={item.order_item_id}
                      className="text-sm bg-gray-100 text-gray-700 px-2 py-1 rounded"
                    >
                      {item.quantity}x {item.item_name}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2 text-gray-600 mb-1">
                  <MapPin />
                  <span className="text-sm font-medium">
                    {order.order_type === "dine-in"
                      ? "Table Number"
                      : "Delivery Address"}
                  </span>
                </div>
                <p className="text-sm text-gray-700">
                  {order.order_type === "dine-in"
                    ? order.table_no
                    : "Not Available"}
                </p>
              </div>

              {order.cooking_instruction && (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-2 text-blue-600 mb-1">
                    <StickyNote />
                    <span className="text-sm font-medium">
                      Special Instructions
                    </span>
                  </div>
                  <p className="text-sm text-blue-700">
                    {order.cooking_instruction}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-4">
                  <button
                    className="text-orange-600 hover:text-orange-700 text-sm font-medium cursor-pointer"
                    onClick={() => toggleDetails(order.order_id)}
                  >
                    {detailsShown[order.order_id]
                      ? "Hide Details"
                      : "View Details"}
                  </button>
                  <button className="text-orange-600 hover:text-orange-700 text-sm font-medium cursor-pointer">
                    Reorder
                  </button>
                </div>
              </div>

              {detailsShown[order.order_id] && (
                <OrderItemDetails order={order} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PastOrders;
