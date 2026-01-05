import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import {
    FaEnvelope,
    FaShieldAlt,
    FaArrowLeft,
    FaCrown,
    FaKey,
} from "react-icons/fa";

import logo from "../../public/logo.png";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const AdminForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const sendOtp = async () => {
        if (!email) return toast.error("Please enter your admin email");

        setLoading(true);
        try {
            const res = await axios.post(
                `${BACKEND_URL}/auth/forgot-password`,
                {
                    email,
                    type: "admin",
                },
                {
                    withCredentials: true,
                }
            );

            toast.success(res.data.message || "OTP sent to your admin email!");
            navigate("/admin/reset-password", { state: { email } });
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
                onClick={() => navigate("/admin/login")}
                className="cursor-pointer absolute top-6 left-6 z-20 flex items-center gap-2 group"
            >
                <div className="p-2 rounded-xl bg-white shadow-md group-hover:shadow-lg transition">
                    <FaArrowLeft className="text-lg text-orange-600" />
                </div>
                <span className="hidden sm:inline text-white font-medium">
                    Back to Admin Login
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
                            Forgot Password?
                        </h1>
                        <p className="text-sm text-slate-500 text-center">
                            Enter your admin email and we'll send you an OTP to reset your password
                        </p>
                    </div>

                    {/* Email Input */}
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Admin Email
                        </label>
                        <div className="relative">
                            <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="email"
                                className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-slate-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all"
                                placeholder="admin@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Send OTP Button */}
                    <button
                        onClick={sendOtp}
                        disabled={loading}
                        className={`cursor-pointer w-full py-3 rounded-2xl font-bold text-white text-lg transition-all
                            ${loading
                                ? "opacity-50 cursor-not-allowed"
                                : "hover:-translate-y-0.5 hover:shadow-xl"
                            }`}
                    >
                        <div className="bg-gradient-to-r from-orange-600 to-amber-600 rounded-2xl py-3 flex items-center justify-center gap-2">
                            <FaKey className="text-white" />
                            {loading ? "Sending OTP..." : "Send OTP"}
                        </div>
                    </button>

                    {/* Back to Login Link */}
                    <p className="text-center text-sm mt-6 text-slate-600">
                        Remember your password?{" "}
                        <button
                            className="cursor-pointer text-orange-600 hover:text-orange-700 hover:underline cursor-pointer font-medium"
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

export default AdminForgotPassword;
