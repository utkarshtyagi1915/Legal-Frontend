import React, { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import loginBg from "../assets/loginBg.png";
import loginleft from "../assets/loginleft.jpg";
import logo from "../../public/logo.png";

import { FaLock, FaEye, FaEyeSlash, FaKey } from "react-icons/fa";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const ResetPassword = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const email = state?.email;

  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // If no email in state, redirect back to forgot password
  if (!email) {
    navigate("/forgot-password");
    return null;
  }

  const resetPassword = async () => {
    if (!otp || !password || !confirmPassword)
      return toast.error("Fill all fields");

    if (password !== confirmPassword)
      return toast.error("Passwords do not match");

    setLoading(true);
    try {
      const res = await axios.post(`${BACKEND_URL}/auth/reset-password`, {
        email,
        reset_token: otp,
        new_password: password,
        confirm_password: confirmPassword,
        type: "user",
      });

      toast.success("Password reset successful!");
      navigate("/login");

    } catch (err) {
      toast.error(err.response?.data?.message || "Reset failed");
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
        <div className="w-full max-w-md space-y-5 text-center">

          <img src={logo} className="h-24 w-24 mx-auto mb-4" alt="Lexi" />

          <h1 className="text-2xl text-[#102437] font-bold mb-2">
            Reset Your Password
          </h1>
          <p className="text-gray-600 text-sm mb-4">
            Enter the OTP sent to <span className="font-medium text-[#102437]">"123456"</span>
          </p>

          {/* OTP */}
          <div className="text-left">
            <label className="block text-sm text-[#102437] mb-2">OTP Code</label>
            <div className="relative">
              <FaKey className="absolute left-3 top-3 text-gray-600 text-lg" />
              <input
                type="text"
                className="pl-10 pr-4 py-3 w-full bg-[#F5F5F5] rounded-md text-center tracking-widest"
                placeholder="Enter 6-digit OTP"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>
          </div>

          {/* New Password */}
          <div className="text-left">
            <label className="block text-sm text-[#102437] mb-2">New Password</label>
            <div className="relative">
              <FaLock className="absolute left-3 top-3 text-gray-600 text-lg" />
              <input
                type={showPassword ? "text" : "password"}
                className="pl-10 pr-10 py-3 w-full bg-[#F5F5F5] rounded-md"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="text-left">
            <label className="block text-sm text-[#102437] mb-2">Confirm New Password</label>
            <div className="relative">
              <FaLock className="absolute left-3 top-3 text-gray-600 text-lg" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                className="pl-10 pr-10 py-3 w-full bg-[#F5F5F5] rounded-md"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-gray-600"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
              </button>
            </div>
          </div>

          {/* Reset Button */}
          <button
            className="cursor-pointer w-full py-3 rounded-md font-semibold text-lg text-white"
            style={{ backgroundColor: "orange" }}
            onClick={resetPassword}
            disabled={loading}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>

          {/* Back to Login */}
          <p className="text-center text-sm mt-4">
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

export default ResetPassword;