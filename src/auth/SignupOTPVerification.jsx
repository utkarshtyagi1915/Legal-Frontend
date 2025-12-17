import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

import loginBg from "../assets/loginbg.png";
import logo from "../../public/logo.png";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const SignupOTPVerification = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const email = state?.email;

    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);

    // If no email in state, redirect back to signup
    if (!email) {
        navigate("/signup");
        return null;
    }

    const handleVerifyOtp = async () => {
        if (!otp) return toast.error("Please enter OTP.");

        setLoading(true);
        try {
            const response = await axios.post(
                `${BACKEND_URL}/auth/signup/verify`,
                {
                    email,
                    otp,
                    type: "user",   // ✅ HARD-CODED (important)
                },
                { withCredentials: true }
            );

            toast.success("Registration complete! Redirecting to login...");

            setTimeout(() => {
                navigate("/login");
            }, 2000);

        } catch (err) {
            toast.error(
                err.response?.data?.detail ||
                err.response?.data?.message ||
                "OTP verification failed"
            );
        } finally {
            setLoading(false);
        }
    };


    const handleResendOtp = async () => {
        try {
            // Re-trigger signup to resend OTP (user needs to go back and signup again)
            toast.info("Please go back and submit the signup form again to resend OTP.");
        } catch (err) {
            toast.error("Failed to resend OTP");
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-6 relative">

            {/* Background */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: `url(${loginBg})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            />

            <div className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-md z-10">
                <div className="flex justify-center mb-6">
                    <img src={logo} className="h-16 w-16" alt="Lexi" />
                </div>

                <h1 className="text-2xl font-bold mb-4 text-[#102437] text-center">
                    Verify Your Email
                </h1>
                <p className="mb-6 text-center text-gray-600">
                    Enter the OTP sent to <span className="font-medium text-[#102437]">{email}</span>
                </p>

                <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter 6-digit OTP"
                    maxLength={6}
                    className="border border-gray-300 rounded-lg px-5 py-3 mb-6 w-full text-center text-xl tracking-widest bg-[#F5F5F5]"
                />

                <div className="flex flex-col gap-3">
                    <button
                        onClick={handleVerifyOtp}
                        disabled={loading}
                        className="w-full py-3 rounded-md font-semibold text-lg text-white cursor-pointer"
                        style={{ backgroundColor: "orange" }}
                    >
                        {loading ? "Verifying..." : "Verify & Complete Registration"}
                    </button>

                    <button
                        onClick={() => navigate("/signup")}
                        className="w-full py-3 bg-gray-200 rounded-md font-medium text-gray-700 cursor-pointer hover:bg-gray-300"
                    >
                        Back to Signup
                    </button>
                </div>

                <p className="text-center text-sm mt-6 text-gray-500">
                    Didn't receive the OTP?{" "}
                    <button
                        className="text-blue-600 hover:underline cursor-pointer"
                        onClick={() => navigate("/signup")}
                    >
                        Go back and try again
                    </button>
                </p>
            </div>

            <ToastContainer position="top-center" autoClose={3000} theme="colored" />
        </div>
    );
};

export default SignupOTPVerification;
