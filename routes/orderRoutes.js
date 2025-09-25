import express from 'express'
import { authMiddleWare } from '../middleware.js'
import { createOrder } from '../api/order.js'

export const orderRouter = express.Router()

orderRouter.route('/create-order', authMiddleWare, async (req, res) => {
  try {
    const { userId, orderType, paymentMethod, cart, cookingRequest } = req.body

    const result = createOrder(userId, orderType, paymentMethod, cart, cookingRequest);
    if (result.success) {
      res.json({
        success: true,
        message: "User Details fetched successfully!",
        orderID: result.orderID,
      });
    } else {
      res.status(401).json({ success: false, message: result.message });
    }
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
})
