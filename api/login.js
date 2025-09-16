import { client } from "../database.js";
import nodemailer from "nodemailer";

export async function loginUser(email, password) {
  try {
    const query = "SELECT * FROM users WHERE email = $1 AND password = $2";
    const values = [email, password];

    const result = await client.query(query, values);

    if (result.rows.length === 1) {
      return { success: true, user: result.rows[0] };
    } else {
      return { success: false, message: "Invalid credentials" };
    }
  } catch (err) {
    console.error("Login error:", err);
    return { success: false, message: "Server error" };
  }
}

export async function sendEmail(email) {
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
}
