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
  const random_otp = (Math.random() * 10000).toFixed(0)
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      secure: false,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASS,
      },
    });

    transporter
      .sendMail({
        from: process.env.GMAIL_USER,
        to: "dev.sagar1290@gmail.com",
        subject: "Hello from tests ✔",
        text: "This message was sent from a Node.js integration test.",
      })
      .then((info) => {
        console.log("Message sent: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
      })
      .catch(console.error);
    return { success: true, otp: random_otp }
  } catch (error) {
    return { success: false, message: "Server Error" }
  }
}

export async function verifyOtp(email, otp) {
  try {
    const result = await client.query(`SELECT * from UserOTP where email = '${email}'`)

    if (result.rows.length === 1) {
      return { success: true, user: result.rows[0] };
    } else {
      return { success: false, message: "Invalid OTP" };
    }
  } catch (error) {
    return { success: false, message: "Server Error" }
  }

}
