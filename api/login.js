import { query } from "../database.js";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

// ------------------ LOGIN WITH PASSWORD ------------------
export async function loginUser(email, password) {
  try {
    const sql = "SELECT * FROM user_details WHERE email = $1 AND password = $2";
    const { rows } = await query(sql, [email, password]);

    if (rows.length > 0) {
      const user = rows[0];
      const { password, ...userDetail } = user;

      const jwt_payload = {
        id: user.id,
        email: user.email,
        fullname: user.fullname,
        role: user.user_role,
      };

      const token = jwt.sign(jwt_payload, process.env.JWT_SECRET);
      return { success: true, user: userDetail, token };
    } else {
      return { success: false, message: "Invalid credentials" };
    }
  } catch (err) {
    console.error("Login error:", err);
    return { success: false, message: "Server error" };
  }
}

// ------------------ LOGIN WITH OTP ------------------
export async function otpLogin(email) {
  try {
    const random_otp = Math.floor(1000 + Math.random() * 9000).toString();
    const expireAt = new Date(Date.now() + 5 * 60 * 1000);

    const insertSql =
      "INSERT INTO user_otp (email, otp, expire_at) VALUES ($1, $2, $3)";
    await query(insertSql, [email, random_otp, expireAt]);

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

// ------------------ VERIFY OTP ------------------
export async function verifyOtp(email, otp) {
  try {
    const selectSql = `
      SELECT * FROM user_otp 
      WHERE email = $1 AND otp = $2 
      ORDER BY id DESC 
      LIMIT 1
    `;
    const { rows } = await query(selectSql, [email, otp]);

    if (rows.length === 0) {
      return { success: false, message: "Invalid OTP" };
    }

    const record = rows[0];
    const now = new Date();
    const expiry = new Date(record.expire_at);
    console.log(now.toISOString(), expiry.toISOString())
    if (now.toISOString() > expiry.toISOString()) {
      return { success: false, message: "OTP expired" };
    }

    const profile_photo = `https://avatar.iran.liara.run/public/${(
      Math.random() * 100
    ).toFixed(0)}`;

    const insertUserSql = `
      INSERT INTO user_details (email, profile_photo)
      VALUES ($1, $2)
      ON CONFLICT (email) DO NOTHING
    `;
    await query(insertUserSql, [email, profile_photo]);

    const userResult = await query(
      "SELECT * FROM user_details WHERE email = $1",
      [email]
    );

    const user = userResult.rows[0];
    const { password, ...userDetail } = user;

    const jwt_payload = {
      id: user.id,
      email: user.email,
      fullname: user.fullname,
      role: user.user_role,
    };

    const token = jwt.sign(jwt_payload, process.env.JWT_SECRET);

    return { success: true, user: userDetail, token };
  } catch (error) {
    console.error("Verify OTP error:", error);
    return { success: false, message: "Server Error" };
  }
}

// ------------------ GET USER ------------------
export async function getUser(user_email) {
  try {
    const { rows } = await query(
      "SELECT * FROM user_details WHERE email = $1",
      [user_email]
    );

    if (rows.length === 0) {
      return { success: false, message: "No User Found" };
    }

    return { success: true, user: rows[0] };
  } catch (error) {
    console.error("GetUser error:", error);
    return { success: false, message: "Server Error" };
  }
}
