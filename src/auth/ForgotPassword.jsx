import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

import loginBg from "../assets/loginbg.png";
import loginleft from "../assets/loginleft.jpg";
import logo from "../../public/logo.png";

import { FaEnvelope } from "react-icons/fa";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const sendOtp = async () => {
    if (!email) return toast.error("Please enter your email");

    setLoading(true);
    try {
      const res = await axios.post(
        `${BACKEND_URL}/auth/forgot-password`,
        {
          email,
          type: "user",
        },
        {
          withCredentials: true, // ✅ IMPORTANT
        }
      );

      toast.success(res.data.message || "OTP sent to your email!");
      navigate("/reset-password", { state: { email } });

    } catch (err) {
      toast.error(
        err.response?.data?.detail ||
        err.response?.data?.message ||
        "Failed to send OTP"
      );
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex flex-col md:flex-row relative">

      {/* Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${loginBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Left Image */}
      <div className="md:w-1/2 relative flex items-center justify-center z-10">
        <img src={loginleft} className="w-[35rem] max-h-[92vh] rounded-4xl" alt="illustration" />
      </div>

      {/* Right Side Form */}
      <div className="md:w-1/2 flex items-center justify-center px-6 z-10">
        <div className="w-full max-w-md space-y-6 text-center">

          <img src={logo} className="h-24 w-24 mx-auto mb-6" alt="Lexi" />

          <h1 className="text-2xl text-[#102437] font-bold mb-2">
            Forgot Your Password?
          </h1>
          <p className="text-gray-600 text-sm mb-4">
            Enter your email and we'll send you an OTP to reset your password
          </p>

          {/* Email */}
          <div className="text-left">
            <label className="block text-sm text-[#102437] mb-2">Email</label>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-3 text-gray-600 text-lg" />
              <input
                type="email"
                className="pl-10 pr-4 py-3 w-full bg-[#F5F5F5] rounded-md"
                placeholder="Enter your registered email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Send OTP Button */}
          <button
            className="cursor-pointer w-full py-3 rounded-md font-semibold text-lg text-white"
            style={{ backgroundColor: "orange" }}
            onClick={sendOtp}
            disabled={loading}
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>

          {/* Back to Login */}
          <p className="text-center text-sm mt-4">
            Remember your password?{" "}
            <button
              className="text-blue-600 hover:underline cursor-pointer"
              onClick={() => navigate("/login")}
            >
              Back to Login
            </button>
          </p>
        </div>
      </div>

      <ToastContainer position="top-center" autoClose={3000} theme="colored" />
    </div>
  );
};

export default ForgotPassword;