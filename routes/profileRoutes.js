import express from "express";
import { authMiddleWare } from "../middleware.js";
import { updateProfile } from "../api/profile.js";

export const profileRouter = express.Router();

profileRouter.post("/update-profile", authMiddleWare, async (req, res) => {
  const { user, email } = req.body;

  if (!email || !user) {
    return res.status(400).json({ message: "email and user is required" });
  }

  const result = await updateProfile(user, email);

  if (result.success) {
    res.json({
      success: true,
      message: "Profile updated successfully!",
      user: result.user,
    });
  } else {
    res.status(401).json({ success: false, message: result.message });
  }
});
