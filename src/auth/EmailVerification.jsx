  import React, { useState } from "react";
  import { ToastContainer, toast } from "react-toastify";
  import "react-toastify/dist/ReactToastify.css";
  import axios from "axios";

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const EmailVerification = ({ email, onBack, onVerified }) => {
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);

const handleVerifyOtp = async () => {
  if (!otp) return toast.error("Please enter OTP.");

  setLoading(true);
  try {
    const response = await axios.post(
      `${BACKEND_URL}/auth/login/verify`,
      { email, otp, type: "user" },
      { withCredentials: true }
    );

    if (response.data.access_token) {
      toast.success("OTP verified!");
      // <-- Pass token to Login component to save it
      onVerified(response.data.access_token);
    } else {
      toast.error("Invalid OTP.");
    }

  } catch (err) {
    toast.error(err.response?.data?.message || "OTP verification failed");
  } finally {
    setLoading(false);
  }
};


    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-gradient-to-tr from-indigo-50 via-white to-pink-50">
        <div className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-md">
          <h1 className="text-3xl font-extrabold mb-4 text-[#102437] text-center">OTP Verification</h1>
          <p className="mb-6 text-center text-gray-600">
            Enter the OTP sent to <span className="font-medium">{email}</span>
          </p>

          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            className="border border-gray-300 rounded-lg px-5 py-3 mb-6 w-full"
          />

          <div className="flex gap-4 justify-center">
            <button onClick={onBack} className="px-5 py-3 bg-gray-300 rounded-lg">
              Back
            </button>

            <button
              onClick={handleVerifyOtp}
              disabled={loading}
              className="px-5 py-3 bg-[#102437] text-white rounded-lg"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </div>
        </div>

        <ToastContainer position="top-center" autoClose={3000} theme="colored" />
      </div>
    );
  };

  export default EmailVerification;
