import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Key } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../Contexts";

const API_BASE = "http://localhost:3000";

export default function Login() {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const [loginWithOtp, setLoginWithOtp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otpRequested, setOtpRequested] = useState(false);
  const [otp, setOtp] = useState(new Array(4).fill(""));

  async function handleEmailLogin(e) {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/login-user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Login successful!");
        setUser(data.user);
        navigate("/");
      } else {
        toast.error(data.message || "Login failed");
      }
    } catch (err) {
      toast.error("Something went wrong.");
    }
  }

  async function handleSendOtp() {
    if (!email) {
      toast.error("Please enter your email");
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/login-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        toast.success("OTP sent to your email");
        setOtpRequested(true);
      } else {
        const error = await res.json();
        toast.error(error.message || "Failed to send OTP");
      }
    } catch {
      toast.error("Something went wrong.");
    }
  }

  function handleOtpChange(e, i) {
    const val = e.target.value;
    if (!/^\d?$/.test(val)) return; // Only digits allowed, max 1 char
    const newOtp = [...otp];
    newOtp[i] = val;
    setOtp(newOtp);

    if (val && i < 3) {
      const nextInput = document.getElementById(`otp-${i + 1}`);
      if (nextInput) nextInput.focus();
    }
  }

  async function handleVerifyOtp(e) {
    e.preventDefault();
    const otpStr = otp.join("");

    if (otpStr.length !== 4) {
      toast.error("Please enter complete 4-digit OTP");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otpStr }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("OTP verified, login successful!");
        setUser(data.user);
        navigate("/");
      } else {
        toast.error(data.message || "Invalid OTP");
      }
    } catch {
      toast.error("Something went wrong.");
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 px-4">
      <Toaster position="bottom-right" />
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          {loginWithOtp ? "Login with OTP" : "Login with Email & Password"}
        </h2>
        {!loginWithOtp ? (
          <form onSubmit={handleEmailLogin} className="space-y-5">
            <div>
              <label htmlFor="email" className="block mb-1 text-gray-600">
                Email
              </label>
              <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
                <Mail className="text-gray-400 mr-2" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border-none outline-none"
                  placeholder="you@example.com"
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="block mb-1 text-gray-600">
                Password
              </label>
              <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
                <Lock className="text-gray-400 mr-2" />
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border-none outline-none"
                  placeholder="Enter your password"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-2 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
            >
              Login
            </button>
            <p
              className="mt-4 text-center text-sm text-blue-600 cursor-pointer hover:underline select-none"
              onClick={() => {
                setLoginWithOtp(true);
                setOtpRequested(false);
                setOtp(new Array(4).fill(""));
              }}
            >
              Or login with OTP
            </p>
          </form>
        ) : (
          <div>
            {!otpRequested ? (
              <div className="space-y-5">
                <label htmlFor="emailOtp" className="block mb-1 text-gray-600">
                  Enter your Email
                </label>
                <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
                  <Mail className="text-gray-400 mr-2" />
                  <input
                    id="emailOtp"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full border-none outline-none"
                  />
                </div>
                <button
                  className="w-full py-2 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                  onClick={handleSendOtp}
                >
                  Send OTP
                </button>
                <p
                  className="mt-4 text-center text-sm text-blue-600 cursor-pointer hover:underline select-none"
                  onClick={() => setLoginWithOtp(false)}
                >
                  Back to Email & Password login
                </p>
              </div>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-5">
                <label className="block text-gray-600 mb-1">
                  Enter 4-digit OTP
                </label>
                <div className="flex justify-center space-x-3">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`otp-${idx}`}
                      type="text"
                      inputMode="numeric"
                      maxLength="1"
                      className="w-12 h-12 text-center border border-gray-300 rounded-md text-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      value={digit}
                      onChange={(e) => handleOtpChange(e, idx)}
                      autoComplete="one-time-code"
                    />
                  ))}
                </div>

                <button
                  type="submit"
                  className="w-full py-2 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                >
                  Verify OTP
                </button>
                <p
                  className="mt-4 text-center text-sm text-blue-600 cursor-pointer hover:underline select-none"
                  onClick={() => {
                    setOtpRequested(false);
                    setOtp(new Array(4).fill(""));
                  }}
                >
                  Resend OTP
                </p>
                <p
                  className="mt-2 text-center text-sm text-blue-600 cursor-pointer hover:underline select-none"
                  onClick={() => setLoginWithOtp(false)}
                >
                  Back to Email & Password login
                </p>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
