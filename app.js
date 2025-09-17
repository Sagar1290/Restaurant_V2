import express from "express";
import dotenv from "dotenv";
import cors from 'cors'
import { loginUser, otpLogin, verifyOtp } from "./api/login.js";

// import { setupDatabase } from './database.js'

dotenv.config();

const app = express();
const port = 3000;

app.use(express.static("./frontend/dist"));
app.use(express.json());
app.use(cors())

// setupDatabase().catch(err => {
//   console.error("Database setup failed:", err);
// });

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/login-user", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "email and password required" });
  }

  const result = await loginUser(email, password);

  if (result.success) {
    res.json({
      success: true,
      message: "User logged in successfully!",
      user: result.user,
    });
  } else {
    res.status(401).json({ success: false, message: result.message });
  }
});

app.post("/login-otp", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "email is required" });
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
});

app.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: "email and OTP is required" });
  }

  const result = await verifyOtp(email, otp);

  if (result.success) {
    res.json({
      success: true,
      message: "OTP Verified successfully!",
      user: result.user,
    });
  } else {
    res.status(401).json({ success: false, message: result.message });
  }
});

app.listen(port, () => {
  console.log(`Restaurant app listening on port ${port}`);
});
