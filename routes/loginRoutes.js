import express from "express";
import { loginUser, otpLogin, verifyOtp } from "../api/login.js";

export const loginRouter = express.Router();

loginRouter.post("/login-user", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const result = await loginUser(email, password);

    if (result.success) {
      res.json({
        success: true,
        message: "User logged in successfully!",
        user: result.user,
        token: result.token,
      });
    } else {
      res.status(401).json({ success: false, message: result.message });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
});

loginRouter.post("/login-otp", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const result = await otpLogin(email);

    if (result.success) {
      res.json({
        success: true,
        message: result.message,
      });
    } else {
      res.status(401).json({ success: false, message: result.message });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
});

loginRouter.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const result = await verifyOtp(email, otp);

    if (result.success) {
      res.json({
        success: true,
        message: "OTP verified successfully!",
        user: result.user,
        token: result.token,
      });
    } else {
      res.status(401).json({ success: false, message: result.message });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
});
