import express from 'express'
import { authMiddleWare } from '../middleware'

export const orderRouter = express.Router()

orderRouter.route('/create-order', authMiddleWare, async (req, res) => {
try {

    if (result.success) {
      res.json({
        success: true,
        message: "User Details fetched successfully!",
        user: result.user,
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
