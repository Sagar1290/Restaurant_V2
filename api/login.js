import { initDatabase } from "../database.js";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

export async function loginUser(email, password) {
  try {
    const db = await initDatabase();
    const query = "SELECT * FROM UserDetails WHERE email = ? AND password = ?";
    const user = await db.get(query, [email, password]);
    await db.close();

    if (user) {
      const { password, ...userDetail } = user
      const JWT_SECRET = process.env.JWT_SECRET;
      const jwt_payload = {
        id: user.id,
        email: user.email,
        fullname: user.fullname,
        role: user.user_role,
      };
      const token = jwt.sign(jwt_payload, JWT_SECRET);
      return { success: true, user: userDetail, token };
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

    const profile_photo = `https://avatar.iran.liara.run/public/${(
      Math.random() * 100
    ).toFixed(0)}`;

    await db.run(
      `INSERT OR IGNORE INTO UserDetails (email, profile_photo)
         VALUES (?, ?)`,
      [email, profile_photo]
    );

    const userResult = await db.get(
      "SELECT * FROM UserDetails WHERE email = ?",
      [email]
    );
    await db.close();

    const { password, ...userDetail } = userResult

    const JWT_SECRET = process.env.JWT_SECRET;
    const jwt_payload = {
      id: userResult.id,
      email: userResult.email,
      fullname: userResult.fullname,
      role: userResult.user_role,
    };
    const token = jwt.sign(jwt_payload, JWT_SECRET);

    return { success: true, user: userDetail, token };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Server Error" };
  }
}

export async function getUser(user_email) {
  try {
    const db = await initDatabase();

    const userResult = await db.get(
      "SELECT * FROM UserDetails WHERE email = ?",
      [user_email]
    );
    await db.close();

    if (!userResult) {
      return { success: false, message: "No User Found" };
    }

    return { success: true, user: userResult };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Server Error" };
  }
}
