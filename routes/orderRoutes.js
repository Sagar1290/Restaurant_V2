import express from "express";
import { adminAuthMiddleWare, authMiddleWare } from "../middleware.js";
import {
  createOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
  updateOrderItemStatus,
} from "../api/order.js";

export const orderRouter = express.Router();

orderRouter.get("/orders", authMiddleWare, async (req, res) => {
  try {
    const userId = req.user_id;
    const orders = await getUserOrders(userId);

    res.json({
      success: true,
      activeOrders: orders.activeOrders,
      pastOrders: orders.pastOrders
    });
  } catch (err) {
    console.error("Error in /orders:", err);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
});

orderRouter.post("/create-order", authMiddleWare, async (req, res) => {
  try {
    const { userId, orderType, paymentDetails, cart, cookingRequest } =
      req.body;

    if (!userId || !orderType || !cart || cart.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid order data" });
    }

    const result = await createOrder(
      userId,
      orderType,
      paymentDetails,
      cart,
      cookingRequest
    );

    if (result.success) {
      res.json({
        success: true,
        message: "Order placed successfully!",
        orderId: result.orderId,
      });
    } else {
      res.status(400).json({ success: false, message: result.message });
    }
  } catch (err) {
    console.error("Error in /create-order:", err);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
});

orderRouter.get("/all-orders", adminAuthMiddleWare, async (req, res) => {
  try {
    const { status, userId, page = 1, limit = 20 } = req.query;
    const orders = await getAllOrders({ status, userId, page, limit });

    res.json({
      success: true,
      activeOrders: orders.activeOrders,
      pastOrders: orders.pastOrders
    });
  } catch (err) {
    console.error("Error in /all-orders:", err);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
});

orderRouter.post("/update-order", adminAuthMiddleWare, async (req, res) => {
  try {
    const { orderId, orderStatus } = req.body;

    if (!orderId || !orderStatus) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid order data" });
    }

    const result = await updateOrderStatus(orderId, orderStatus);

    if (result.success) {
      res.json({
        success: true,
        message: "Order status updated!",
      });
    } else {
      res.status(400).json({ success: false, message: result.message });
    }
  } catch (err) {
    console.error("Error in /update-order:", err);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
});

orderRouter.post("/update-order-item", adminAuthMiddleWare, async (req, res) => {
  try {
    const { orderItemId, itemStatus } = req.body;

    if (!orderItemId || !itemStatus) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid order item data" });
    }

    const result = await updateOrderItemStatus(orderItemId, itemStatus);

    if (result.success) {
      res.json({ success: true, message: "Order item status updated!" });
    } else {
      res.status(400).json({ success: false, message: result.message });
    }
  } catch (err) {
    console.error("Error in /update-order-item:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
});


orderRouter.delete(
  "/delete-order/:id",
  adminAuthMiddleWare,
  async (req, res) => {
    try {
      const orderId = req.params.id;

      const result = await deleteOrder(orderId);

      if (result.success) {
        res.json({ success: true, message: "Order deleted successfully!" });
      } else {
        res.status(400).json({ success: false, message: result.message });
      }
    } catch (err) {
      console.error("Error in /delete-order:", err);
      res
        .status(500)
        .json({ success: false, message: "Server error", error: err.message });
    }
  }
);
