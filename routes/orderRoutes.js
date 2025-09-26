import express from 'express'
import { authMiddleWare } from '../middleware.js'
import { createOrder } from '../api/order.js'

export const orderRouter = express.Router()

orderRouter.post('/create-order', authMiddleWare, async (req, res) => {
  try {
    const { userId, orderType, paymentDetails, cart, cookingRequest } = req.body

    if (!userId || !orderType || !cart) {
      return res.status(400).json({ success: false, message: "Invalid order data" })
    }

    const result = await createOrder(userId, orderType, paymentDetails, cart, cookingRequest)

    if (result.success) {
      res.json({
        success: true,
        message: "Order placed successfully!",
        orderID: result.orderId,   // 👈 match with frontend expectation
      })
    } else {
      res.status(400).json({ success: false, message: result.message })
    }
  } catch (err) {
    console.error("Error in /create-order:", err)
    res.status(500).json({ success: false, message: "Server error", error: err.message })
  }
})
