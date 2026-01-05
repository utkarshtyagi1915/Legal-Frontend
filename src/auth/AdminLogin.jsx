import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import {
    FaUser,
    FaLock,
    FaEye,
    FaEyeSlash,
    FaShieldAlt,
    FaArrowRight,
    FaKey,
    FaCheckCircle,
    FaCrown,
    FaArrowLeft,
} from "react-icons/fa";

import loginBg from "../assets/loginbg.png";
import logo from "../../public/logo.png";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const AdminLogin = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [otp, setOtp] = useState("");
    const [screen, setScreen] = useState("login");
    const [otpSessionId, setOtpSessionId] = useState(null);

    // Step 1: Admin Login → Request OTP
    const handleAdminLogin = async () => {
        if (!email || !password) {
            return toast.error("Enter both email and password.");
        }

        setLoading(true);

        try {
            const res = await axios.post(
                `${BACKEND_URL}/auth/login`,
                {
                    email,
                    password,
                    type: 'admin',
                },
                { withCredentials: true }
            );

            setOtpSessionId(res.data.sessionId);
            toast.info("OTP sent to your admin email!");
            setScreen("otp");
        } catch (err) {
            console.error("Admin login error:", err);
            toast.error(err.response?.data?.message || "Admin login failed. Check credentials.");
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Verify OTP
    const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
        return toast.error("Enter a valid 6-digit OTP");
    }

    setLoading(true);

    try {
        const res = await axios.post(
            `${BACKEND_URL}/auth/login/verify`,
            {
                email,
                otp,
                type: "admin",
            },
            { withCredentials: true }
        );

        // ✅ FIX 1: Correct token field
        const jwtToken = res.data.access_token;

        if (!jwtToken) {
            throw new Error("Access token missing");
        }

        // ✅ FIX 2: Proper Base64URL decode
        const base64Url = jwtToken.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const payload = JSON.parse(
            decodeURIComponent(
                atob(base64)
                    .split("")
                    .map(c => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                    .join("")
            )
        );

        // ✅ FIX 3: roles is ARRAY
        if (!payload.roles || !payload.roles.includes("admin")) {
            toast.error("Access denied. Admin privileges required.");
            return;
        }

        // ✅ Store token
        localStorage.setItem("authToken", jwtToken);
        localStorage.setItem("adminEmail", payload.email);
        localStorage.setItem("isAdmin", "true");

        toast.success("Admin login successful!");
        navigate("/admin/dashboard");

    } catch (err) {
        console.error("OTP verification error:", err);
        toast.error(
            err.response?.data?.detail ||
            err.response?.data?.message ||
            "OTP verification failed"
        );
    } finally {
        setLoading(false);
    }
};

    // OTP Screen
    if (screen === "otp") {
        return (
            <div className="min-h-screen flex items-center justify-center relative">
                {/* Orange Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-600 via-amber-500 to-orange-700"></div>
                {/* 🔙 Back Arrow – TOP LEFT */}
                <button
                    onClick={() => navigate("/admin/login")}
                    className="cursor-pointer absolute top-6 left-6 z-20 flex items-center gap-2 group"
                >
                    <div className="p-2 rounded-xl bg-white shadow-md group-hover:shadow-lg transition">
                        <FaArrowLeft className="text-lg text-orange-600" />
                    </div>
                    <span className="hidden sm:inline text-white font-medium">
                        Back to Login
                    </span>
                </button>
                {/* Animated Background Elements */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                    <div className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br from-orange-400/20 to-amber-400/20 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-gradient-to-tr from-orange-500/20 to-amber-500/20 rounded-full blur-3xl"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-orange-400/10 to-amber-400/10 rounded-full blur-3xl"></div>
                </div>

                <div className="relative z-10 w-full max-w-md">
                    {/* Glassmorphism Card */}
                    <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
                        {/* Admin Badge */}
                        <div className="flex justify-center mb-6">
                            <div className="relative">
                                <div className="absolute -inset-4 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full blur-2xl opacity-30"></div>
                                <div className="relative p-5 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl shadow-xl">
                                    <FaShieldAlt className="text-4xl text-white" />
                                </div>
                            </div>
                        </div>

                        <div className="text-center mb-8">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-100 to-amber-100 rounded-full mb-4">
                                <FaKey className="text-orange-600 text-sm" />
                                <span className="text-sm font-bold text-orange-700">SECURE ACCESS</span>
                            </div>
                            <p className="text-slate-600 mb-2">
                                OTP sent to <span className="font-bold text-slate-800">{email}</span>
                            </p>
                            <p className="text-sm text-slate-500">
                                Check your email for the 6-digit code
                            </p>
                        </div>

                        {/* OTP Input with Modern Design */}
                        <div className="mb-8">
                            <div className="relative">
                                <input
                                    type="text"
                                    maxLength={6}
                                    className="w-full text-center text-3xl tracking-[20px] font-bold px-4 py-5 bg-gradient-to-b from-slate-50 to-white rounded-2xl border-2 border-orange-200 focus:border-orange-500 focus:outline-none focus:ring-4 focus:ring-orange-100 transition-all duration-300 shadow-lg"
                                    placeholder="• • • • • •"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                                    autoFocus
                                />
                                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full"></div>
                            </div>
                        </div>

                        {/* Verify Button */}
                        <button
                            onClick={handleVerifyOtp}
                            disabled={loading || otp.length !== 6}
                            className={`cursor-pointer group relative w-full py-4 rounded-2xl font-bold text-lg shadow-xl transition-all duration-500 ${loading || otp.length !== 6
                                ? 'opacity-50 cursor-not-allowed'
                                : 'hover:shadow-2xl hover:-translate-y-1'
                                }`}
                        >
                            {/* Button Background */}
                            <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-amber-600 rounded-2xl"></div>
                            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>

                            {/* Shine Effect */}
                            <div className="absolute inset-0 overflow-hidden rounded-2xl">
                                <div className="absolute -inset-[100%] bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                            </div>

                            {/* Button Content */}
                            <span className="relative z-10 flex items-center justify-center gap-3 text-white">
                                {loading ? (
                                    <>
                                        <div className="flex gap-1">
                                            <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                                            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                        </div>
                                        <span>Verifying OTP...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Verify & Access Dashboard</span>
                                        <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </span>
                        </button>
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
    }

    return (
        <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-600 via-amber-500 to-orange-700" />
            {/* 🔙 Back Arrow – TOP LEFT */}
            <button
                onClick={() => navigate("/login")}
                className="cursor-pointer absolute top-6 left-6 z-20 flex items-center gap-2 group"
            >
                <div className="p-2 rounded-xl bg-white shadow-md group-hover:shadow-lg transition">
                    <FaArrowLeft className="text-lg text-orange-600" />
                </div>
                <span className="hidden sm:inline text-white font-medium">
                    Back to Login
                </span>
            </button>

            {/* CENTER CARD */}
            <div className="relative z-10 w-full max-w-lg px-4">
                <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">

                    {/* Header */}
                    <div className="flex flex-col items-center mb-6">
                        <div className="relative mb-4">
                            <div className="absolute -inset-4 bg-orange-500/30 rounded-full blur-2xl" />
                            <div className="relative w-16 h-16 rounded-2xl from-orange-500 to-amber-500 flex items-center justify-center shadow-xl">
                                <img src={logo} alt="Lexi" className="w-10 h-10" />
                            </div>
                        </div>

                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-orange-100 rounded-full mb-3">
                            <FaCrown className="text-orange-600" />
                            <span className="text-xs font-bold text-orange-700 uppercase">
                                Admin Portal
                            </span>
                        </div>

                        <h1 className="text-2xl font-bold text-slate-900">
                            Lexi <span className="text-orange-600">Admin</span>
                        </h1>
                        <p className="text-sm text-slate-500">
                            Secure access to admin dashboard
                        </p>
                    </div>

                    {/* Email */}
                    <div className="mb-4">
                        <label className="block text-sm font-semibold text-slate-700 mb-1">
                            Admin Email
                        </label>
                        <div className="relative">
                            <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="email"
                                className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-slate-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
                                placeholder="admin@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div className="mb-4">
                        <label className="block text-sm font-semibold text-slate-700 mb-1">
                            Password
                        </label>
                        <div className="relative">
                            <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type={showPassword ? "text" : "password"}
                                className="w-full pl-11 pr-11 py-3 rounded-xl border-2 border-slate-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
                                placeholder="••••••••"
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

                    {/* Forgot Password Link */}
                    <div className="mb-6 text-right">
                        <button
                            type="button"
                            onClick={() => navigate("/admin/forgot-password")}
                            className="cursor-pointer text-sm text-orange-600 hover:text-orange-700 hover:underline font-medium"
                        >
                            Forgot Password?
                        </button>
                    </div>

                    {/* Login Button */}
                    <button
                        onClick={handleAdminLogin}
                        disabled={loading}
                        className={`cursor-pointer w-full py-3 rounded-2xl font-bold text-white text-lg transition-all
            ${loading
                                ? "opacity-50 cursor-not-allowed"
                                : "hover:-translate-y-0.5 hover:shadow-xl"}
          `}
                    >
                        <div className="bg-gradient-to-r from-orange-600 to-amber-600 rounded-2xl py-3">
                            {loading ? "Sending OTP..." : "Access Admin Panel"}
                        </div>
                    </button>
                </div>
            </div>

            {/* Toast */}
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

export default AdminLogin;

// Add these animations to your CSS
const styles = `
@keyframes float {
    0%, 100% {
        transform: translateY(0) rotate(0deg);
    }
    50% {
        transform: translateY(-20px) rotate(10deg);
    }
}

@keyframes float-delayed {
    0%, 100% {
        transform: translateY(0) rotate(0deg);
    }
    50% {
        transform: translateY(-15px) rotate(-5deg);
    }
}

@keyframes float-slow {
    0%, 100% {
        transform: translateY(0) rotate(0deg);
    }
    50% {
        transform: translateY(-25px) rotate(15deg);
    }
}

.animate-float {
    animation: float 6s ease-in-out infinite;
}

.animate-float-delayed {
    animation: float-delayed 7s ease-in-out infinite;
    animation-delay: 1s;
}

.animate-float-slow {
    animation: float-slow 8s ease-in-out infinite;
    animation-delay: 2s;
}

.animate-pulse-delayed {
    animation: pulse 3s ease-in-out infinite;
    animation-delay: 1s;
}
`;