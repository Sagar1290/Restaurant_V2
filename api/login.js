import { initDatabase } from "../database.js";
import nodemailer from "nodemailer";

export async function loginUser(email, password) {
  try {
    const db = await initDatabase();
    const query = "SELECT * FROM UserDetails WHERE email = ? AND password = ?";
    const user = await db.get(query, [email, password]);
    await db.close();

    if (user) {
      return { success: true, user };
    } else {
      return { success: false, message: "Invalid credentials" };
    }
  } catch (err) {
    console.error("Login error:", err);
    return { success: false, message: "Server error" };
  }
}

export async function otpLogin(email) {
  try {
    const db = await initDatabase();
    const random_otp = Math.floor(1000 + Math.random() * 9000).toString();

    const expireAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();
    await db.run(
      `INSERT INTO UserOTP (email, otp, expireAt) VALUES (?, ?, ?)`,
      [email, random_otp, expireAt]
    );
    await db.close();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      secure: false,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is ${random_otp}. It will expire in 5 minutes.`,
    });

    return { success: true, message: "OTP sent to email" };
  } catch (error) {
    console.error("OTP Login error:", error);
    return { success: false, message: "Server Error" };
  }
}

export async function verifyOtp(email, otp) {
  try {
    const db = await initDatabase();

    const record = await db.get(
      `SELECT * FROM UserOTP WHERE email = ? AND otp = ? ORDER BY id DESC LIMIT 1`,
      [email, otp]
    );

    if (!record) {
      await db.close();
      return { success: false, message: "Invalid OTP" };
    }

    const now = new Date();
    const expiry = new Date(record.expireAt);

    if (now > expiry) {
      await db.close();
      return { success: false, message: "OTP expired" };
    }

    await db.run(
      `INSERT OR IGNORE INTO UserDetails (email)
         VALUES (?)`,
      [email]
    );

    const userResult = await db.get(
      "SELECT * FROM UserDetails WHERE email = ?",
      [email]
    );

    await db.close();
    return { success: true, user: userResult };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Server Error" };
  }
}
