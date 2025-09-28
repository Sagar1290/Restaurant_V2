import { useContext, useEffect, useState } from "react";
import ActiveOrders from "../components/order/ActiveOrders";
import PastOrders from "../components/order/PastOrders";
import { AuthContext } from "../Contexts";

const API_BASE = "http://localhost:3000";

const Order = () => {
  const { user } = useContext(AuthContext);
  const [fetchingOrders, setFetchinOrders] = useState(false);
  const [activeOrders, setActiveOrders] = useState();
  const [pastOrders, setPastOrders] = useState();

  useEffect(() => {
    const fetchOrdersData = async () => {
      if (!user) return;
      setFetchinOrders(true);
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          console.warn("No token found. Please log in.");
          return;
        }
        const url = `${API_BASE}/order/${
          user?.user_role == "manager" ? "all-orders" : "orders"
        }`;
        console.log(url);
        const res = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(
            `Request failed with status ${res.status}: ${errorText}`
          );
        }

        const response = await res.json();

        if (!response || !response.activeOrders || !response.pastOrders) {
          throw new Error("Unexpected response format.");
        }

        setActiveOrders(response.activeOrders);
        setPastOrders(response.pastOrders);
      } catch (error) {
        console.error("Error fetching orders:", error.message);
      } finally {
        setFetchinOrders(false);
      }
    };

    fetchOrdersData();
  }, [user]);

  if (fetchingOrders) {
    return (
      <div className="flex justify-center py-8">
        <span className="text-lg text-gray-600">Fetching Orders ...</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        {user?.user_role === "manager" ? (
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Order Management
              </h1>
              <p className="text-gray-600 mt-2">
                Manage all restaurant orders and track progress
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
                <option value="all">All Orders</option>
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
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
              <p className="text-gray-600 mt-2">
                Track your orders and view order history
              </p>
            </div>
          </div>
        )}
      </div>
      <ActiveOrders
        activeOrders={activeOrders}
        setActiveOrders={setActiveOrders}
      />
      <PastOrders pastOrders={pastOrders} />
    </div>
  );
};

export default Order;
