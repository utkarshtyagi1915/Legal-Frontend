import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

import loginBg from "../assets/loginbg.png";
import loginleft from "../assets/loginleft.jpg";
import logo from "../../public/logo.png";

import { FaUser, FaLock, FaEye, FaEyeSlash, FaEnvelope } from "react-icons/fa";
import ReCAPTCHA from "react-google-recaptcha";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Signup = () => {
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [captchaValue, setCaptchaValue] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSignupClick = async () => {
        if (!fullName) return toast.error("Please enter your full name.");
        if (!email) return toast.error("Please enter your email.");
        if (!password) return toast.error("Please enter a password.");
        if (!confirmPassword) return toast.error("Please confirm your password.");
        if (password !== confirmPassword) return toast.error("Passwords do not match.");
        if (!captchaValue) return toast.error("Please verify reCAPTCHA.");

        setLoading(true);

        const payload = {
            email,
            password,
            full_name: fullName,
            captcha_token: captchaValue,
        };

        try {
            const res = await axios.post(
                `${BACKEND_URL}/auth/signup`,
                payload,
                { withCredentials: true }
            );

            toast.info("OTP sent to your email!");
            // Navigate to OTP verification with email in state
            navigate("/signup/verify", { state: { email } });

        } catch (err) {
            console.log("Signup error:", err);
            toast.error(err.response?.data?.detail || err.response?.data?.message || "Signup failed");
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

                    <img src={logo} className="h-20 w-20 mx-auto mb-4" alt="Lexi" />

                    <h1 className="text-2xl text-[#102437] font-bold mb-2">
                        Create Your Account
                    </h1>
                    <p className="text-gray-600 text-sm mb-4">
                        Join Lexi - Your Legal Research Assistant
                    </p>

                    {/* Full Name */}
                    <div className="text-left">
                        <label className="block text-sm text-[#102437] mb-2">Full Name</label>
                        <div className="relative">
                            <FaUser className="absolute left-3 top-3 text-gray-600 text-lg" />
                            <input
                                type="text"
                                className="pl-10 pr-4 py-3 w-full bg-[#F5F5F5] rounded-md"
                                placeholder="Enter your full name"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div className="text-left">
                        <label className="block text-sm text-[#102437] mb-2">Email</label>
                        <div className="relative">
                            <FaEnvelope className="absolute left-3 top-3 text-gray-600 text-lg" />
                            <input
                                type="email"
                                className="pl-10 pr-4 py-3 w-full bg-[#F5F5F5] rounded-md"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div className="text-left">
                        <label className="block text-sm text-[#102437] mb-2">Password</label>
                        <div className="relative">
                            <FaLock className="absolute left-3 top-3 text-gray-600 text-lg" />
                            <input
                                type={showPassword ? "text" : "password"}
                                className="pl-10 pr-10 py-3 w-full bg-[#F5F5F5] rounded-md"
                                placeholder="Enter password"
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
                        <label className="block text-sm text-[#102437] mb-2">Confirm Password</label>
                        <div className="relative">
                            <FaLock className="absolute left-3 top-3 text-gray-600 text-lg" />
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                className="pl-10 pr-10 py-3 w-full bg-[#F5F5F5] rounded-md"
                                placeholder="Confirm password"
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

                    {/* reCAPTCHA */}
                    <div className="flex justify-center">
                        <ReCAPTCHA
                            sitekey="6LdQFoUrAAAAAPtwk0GeFVhA7fUenVLtedLApb55"
                            onChange={(value) => setCaptchaValue(value)}
                        />
                    </div>

                    {/* Signup Button */}
                    <button
                        className="cursor-pointer w-full py-3 rounded-md font-semibold text-lg text-white"
                        style={{ backgroundColor: "orange" }}
                        onClick={handleSignupClick}
                        disabled={loading}
                    >
                        {loading ? "Creating Account..." : "Sign Up"}
                    </button>

                    {/* Login Link */}
                    <p className="text-center text-sm mt-4">
                        Already have an account?{" "}
                        <button
                            className="text-blue-600 hover:underline cursor-pointer"
                            onClick={() => navigate("/login")}
                        >
                            Login
                        </button>
                    </p>
                </div>
            </div>

            <ToastContainer position="top-center" autoClose={3000} theme="colored" />
        </div>
    );
};

export default Signup;
