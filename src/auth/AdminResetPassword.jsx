import React, { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
    FaLock,
    FaEye,
    FaEyeSlash,
    FaKey,
    FaShieldAlt,
    FaArrowLeft,
    FaCrown,
    FaCheckCircle,
} from "react-icons/fa";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const AdminResetPassword = () => {
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
        navigate("/admin/forgot-password");
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
                type: "admin",
            });

            toast.success("Password reset successful!");
            navigate("/admin/login");
        } catch (err) {
            toast.error(err.response?.data?.message || "Reset failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
            {/* Orange Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-600 via-amber-500 to-orange-700"></div>

            {/* Animated Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br from-orange-400/20 to-amber-400/20 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-gradient-to-tr from-orange-500/20 to-amber-500/20 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-orange-400/10 to-amber-400/10 rounded-full blur-3xl"></div>
            </div>

            {/* Back Arrow */}
            <button
                onClick={() => navigate("/admin/forgot-password")}
                className="cursor-pointer absolute top-6 left-6 z-20 flex items-center gap-2 group"
            >
                <div className="p-2 rounded-xl bg-white shadow-md group-hover:shadow-lg transition">
                    <FaArrowLeft className="text-lg text-orange-600" />
                </div>
                <span className="hidden sm:inline text-white font-medium">
                    Back
                </span>
            </button>

            {/* Main Card */}
            <div className="relative z-10 w-full max-w-md px-4">
                <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
                    {/* Header */}
                    <div className="flex flex-col items-center mb-6">
                        <div className="relative mb-4">
                            <div className="absolute -inset-4 bg-orange-500/30 rounded-full blur-2xl" />
                            <div className="relative p-5 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl shadow-xl">
                                <FaShieldAlt className="text-4xl text-white" />
                            </div>
                        </div>

                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-orange-100 rounded-full mb-3">
                            <FaCrown className="text-orange-600" />
                            <span className="text-xs font-bold text-orange-700 uppercase">
                                Admin Portal
                            </span>
                        </div>

                        <h1 className="text-2xl font-bold text-slate-900 mb-2">
                            Reset Your Password
                        </h1>
                        <p className="text-sm text-slate-500 text-center">
                            OTP sent to <span className="font-semibold text-slate-700">{email}</span>
                        </p>
                    </div>

                    {/* OTP Input */}
                    <div className="mb-4">
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            OTP Code
                        </label>
                        <div className="relative">
                            <FaKey className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                maxLength={6}
                                className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-slate-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 text-center tracking-widest font-bold text-lg transition-all"
                                placeholder="Enter 6-digit OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                            />
                        </div>
                    </div>

                    {/* New Password */}
                    <div className="mb-4">
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            New Password
                        </label>
                        <div className="relative">
                            <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type={showPassword ? "text" : "password"}
                                className="w-full pl-11 pr-11 py-3 rounded-xl border-2 border-slate-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all"
                                placeholder="Enter new password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-orange-500"
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Confirm New Password
                        </label>
                        <div className="relative">
                            <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                className="w-full pl-11 pr-11 py-3 rounded-xl border-2 border-slate-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all"
                                placeholder="Confirm new password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-orange-500"
                            >
                                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                    </div>

                    {/* Reset Button */}
                    <button
                        onClick={resetPassword}
                        disabled={loading}
                        className={`cursor-pointer w-full py-3 rounded-2xl font-bold text-white text-lg transition-all
                            ${loading
                                ? "opacity-50 cursor-not-allowed"
                                : "hover:-translate-y-0.5 hover:shadow-xl"
                            }`}
                    >
                        <div className="bg-gradient-to-r from-orange-600 to-amber-600 rounded-2xl py-3 flex items-center justify-center gap-2">
                            <FaCheckCircle className="text-white" />
                            {loading ? "Resetting..." : "Reset Password"}
                        </div>
                    </button>

                    {/* Back to Login Link */}
                    <p className="text-center text-sm mt-6 text-slate-600">
                        <button
                            className="text-orange-600 hover:text-orange-700 hover:underline cursor-pointer font-medium"
                            onClick={() => navigate("/admin/login")}
                        >
                            Back to Admin Login
                        </button>
                    </p>
                </div>
            </div>

            <ToastContainer
                position="bottom-center"
                autoClose={2000}
                hideProgressBar
                newestOnTop
                closeOnClick
                pauseOnHover
                toastStyle={{ backgroundColor: "orange", color: "white" }}
            />
        </div>
    );
};

export default AdminResetPassword;
