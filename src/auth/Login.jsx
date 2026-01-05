// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import EmailVerification from "./EmailVerification";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import axios from "axios";

// import loginBg from "../assets/loginbg.png";
// import loginleft from "../assets/loginleft.jpg";
// import logo from "../../public/logo.png";

// import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
// import ReCAPTCHA from "react-google-recaptcha";

// const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
// console.log("BACKEND_URL value =", BACKEND_URL);


// const Login = () => {
//   const navigate = useNavigate();

//   const [showPassword, setShowPassword] = useState(false);
//   const [screen, setScreen] = useState("login");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [captchaValue, setCaptchaValue] = useState(null);
//   const [otpSessionId, setOtpSessionId] = useState(null);
//   const [loading, setLoading] = useState(false);

//   // Step 1 → Login → Request OTP
//   const handleLoginClick = async () => {
//     if (!email || !password) return toast.error("Enter both email and password.");
//     // if (!captchaValue) return toast.error("Please verify reCAPTCHA.");

//     setLoading(true);

//     // Build the payload
//     const payload = {
//       email,
//       password,
//       type: "user",
//       // captcha_token: captchaValue,
//     };

//     console.log("Sending login request to backend:");
//     console.log("URL:", `${BACKEND_URL}/auth/login`);
//     console.log("Payload:", payload);

//     try {
//       const res = await axios.post(
//         `${BACKEND_URL}/auth/login`,
//         payload,
//         { withCredentials: true }
//       );

//       console.log("Response from backend:", res.data);

//       setOtpSessionId(res.data.sessionId);
//       toast.info("OTP sent to your email!");
//       setScreen("verification");

//     } catch (err) {
//       console.log("Login error (full Axios error object):", err);
//       toast.error(err.response?.data?.message || "Login failed");
//     } finally {
//       setLoading(false);
//     }
//   };


//   // Step 2 → OTP Verified → Save token → Navigate
//   // Step 2 → OTP Verified → Save token → Navigate
//   const handleOtpVerified = (jwtToken) => {
//     console.log("✅ OTP verified successfully");
//     console.log("🔐 JWT Token received from backend:", jwtToken);

//     // Optional: decode payload for debugging (DO NOT use in prod logic)
//     try {
//       const payload = JSON.parse(atob(jwtToken.split(".")[1]));
//       console.log("📦 Decoded JWT payload:", payload);
//     } catch (err) {
//       console.warn("⚠️ Failed to decode JWT payload");
//     }

//     localStorage.setItem("authToken", jwtToken);
//     localStorage.setItem("Email", email);

//     toast.success("Login successful!");
//     navigate("/dashboard");
//   };

//   // Screen switch → OTP screen
//   if (screen === "verification") {
//     return (
//       <EmailVerification
//         email={email}
//         otpSessionId={otpSessionId}
//         onBack={() => setScreen("login")}
//         onVerified={handleOtpVerified}
//       />
//     );
//   }

//   // Default → Login screen
//   return (
//     <div className="min-h-screen flex flex-col md:flex-row relative">

//       {/* Background */}
//       <div
//         className="absolute inset-0 z-0"
//         style={{
//           backgroundImage: `url(${loginBg})`,
//           backgroundSize: "cover",
//           backgroundPosition: "center",
//         }}
//       />

//       {/* Left Image */}
//       <div className="md:w-1/2 relative flex items-center justify-center z-10">
//         <img src={loginleft} className="w-[35rem] max-h-[92vh] rounded-4xl" alt="illustration" />
//       </div>

//       {/* Right Side Form */}
//       <div className="md:w-1/2 flex items-center justify-center px-6 z-10">
//         <div className="w-full max-w-md space-y-6 text-center">

//           <img src={logo} className="h-24 w-24 mx-auto mb-6" alt="Lexi" />

//           <h1 className="text-2xl text-[#102437] font-bold mb-4">
//             <span className="font-bold">Lexi</span> Your{" "}
//             <span className="font-normal">Legal</span>{" "}
//             <span className="font-bold">Research Assistant!</span>
//           </h1>

//           {/* Email */}
//           <div className="text-left">
//             <label className="block text-sm text-[#102437] mb-2">Email</label>
//             <div className="relative">
//               <FaUser className="absolute left-3 top-3 text-gray-600 text-lg" />
//               <input
//                 type="email"
//                 className="pl-10 pr-4 py-3 w-full bg-[#F5F5F5] rounded-md"
//                 placeholder="Enter email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//               />
//             </div>
//           </div>

//           {/* Password */}
//           <div className="text-left">
//             <label className="block text-sm text-[#102437] mb-2">Password</label>
//             <div className="relative">
//               <FaLock className="absolute left-3 top-3 text-gray-600 text-lg" />
//               <input
//                 type={showPassword ? "text" : "password"}
//                 className="pl-10 pr-10 py-3 w-full bg-[#F5F5F5] rounded-md"
//                 placeholder="Enter password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//               />
//               <button
//                 className="absolute right-3 top-3 text-gray-600"
//                 onClick={() => setShowPassword(!showPassword)}
//               >
//                 {showPassword ? <FaEye /> : <FaEyeSlash />}
//               </button>
//             </div>
//           </div>

//           <div className="mt-4 flex items-center justify-between text-sm">

//             {/* Sign Up (Center-left balanced) */}
//             <p className="text-gray-700">
//               Don't have an account?{" "}
//               <button
//                 className="text-blue-600 hover:underline cursor-pointer font-medium"
//                 onClick={() => navigate("/signup")}
//               >
//                 Sign Up
//               </button>
//             </p>

//             {/* Forgot Password (Right aligned) */}
//             <button
//               className="text-blue-600 hover:underline cursor-pointer font-medium"
//               onClick={() => navigate("/forgot-password")}
//             >
//               Forgot Password?
//             </button>

//           </div>


//           {/* reCAPTCHA */}
//           {/* <div className="flex justify-center">
//             <ReCAPTCHA
//               sitekey="6LdQFoUrAAAAAPtwk0GeFVhA7fUenVLtedLApb55"
//               onChange={(value) => setCaptchaValue(value)}
//             />
//           </div> */}

//           {/* Login Button */}
//           <button
//             className="cursor-pointer w-full py-3 rounded-md font-semibold text-lg text-white"
//             style={{ backgroundColor: "orange" }}
//             onClick={handleLoginClick}
//             disabled={loading}
//           >
//             {loading ? "Sending OTP..." : "Login"}
//           </button>

//           {/* Admin Login Link */}
//           <div className="mt-4 text-center">
//             <button
//               onClick={() => navigate("/admin/login")}
//               className="cursor-pointer text-sm text-slate-500 hover:text-indigo-600 transition flex items-center justify-center gap-2 mx-auto"
//             >
//               <span>🛡️</span>
//               <span>Admin Login</span>
//             </button>
//           </div>
//         </div>
//       </div>

//       <ToastContainer position="top-center" autoClose={3000} theme="colored" />
//     </div>
//   );
// };

// export default Login;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import EmailVerification from "./EmailVerification";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

import loginBg from "../assets/loginbg.png";
import loginleft from "../assets/loginleft.jpg";
import logo from "../../public/logo.png";

import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import ReCAPTCHA from "react-google-recaptcha";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
console.log("BACKEND_URL value =", BACKEND_URL);


const Login = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [screen, setScreen] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captchaValue, setCaptchaValue] = useState(null);
  const [otpSessionId, setOtpSessionId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Step 1 → Login → Request OTP
  const handleLoginClick = async () => {
    if (!email || !password)
      return toast.error("Enter both email and password.");

    setLoading(true);

    const payload = {
      email,
      password,
      type: "user",
    };

    try {
      // 👉 Switch to OTP screen instantly
      setScreen("verification");

      // 👉 API call continues in background
      await axios.post(`${BACKEND_URL}/auth/login`, payload, {
        withCredentials: true,
      });

      // ❌ No success toast here — avoid delayed notification
      // toast.success("OTP sent to your email!");

    } catch (err) {
      console.error("Login error:", err);

      // ❗ Show only error toast
      toast.error(err.response?.data?.detail || "Login failed");

      // Go back to login screen
      setScreen("login");
    } finally {
      setLoading(false);
    }
  };

  // Step 2 → OTP Verified → Save token → Navigate
  // Step 2 → OTP Verified → Save token → Navigate
  const handleOtpVerified = (jwtToken) => {
    console.log("✅ OTP verified successfully");
    console.log("🔐 JWT Token received from backend:", jwtToken);

    // Optional: decode payload for debugging (DO NOT use in prod logic)
    try {
      const payload = JSON.parse(atob(jwtToken.split(".")[1]));
      console.log("📦 Decoded JWT payload:", payload);
    } catch (err) {
      console.warn("⚠️ Failed to decode JWT payload");
    }

    localStorage.setItem("authToken", jwtToken);
    localStorage.setItem("Email", email);

    toast.success("Login successful!");
    navigate("/dashboard");
  };

  // Screen switch → OTP screen
  if (screen === "verification") {
    return (
      <EmailVerification
        email={email}
        otpSessionId={otpSessionId}
        onBack={() => setScreen("login")}
        onVerified={handleOtpVerified}
      />
    );
  }

  // Default → Login screen
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

          <h1 className="text-2xl text-[#102437] font-bold mb-4">
            <span className="font-bold">Lexi</span> Your{" "}
            <span className="font-normal">Legal</span>{" "}
            <span className="font-bold">Research Assistant!</span>
          </h1>

          {/* Email */}
          <div className="text-left">
            <label className="block text-sm text-[#102437] mb-2">Email</label>
            <div className="relative">
              <FaUser className="absolute left-3 top-3 text-gray-600 text-lg" />
              <input
                type="email"
                className="pl-10 pr-4 py-3 w-full bg-[#F5F5F5] rounded-md"
                placeholder="Enter email"
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
                className="absolute right-3 top-3 text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </button>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-sm">

            {/* Sign Up (Center-left balanced) */}
            <p className="text-gray-700">
              Don't have an account?{" "}
              <button
                className="text-blue-600 hover:underline cursor-pointer font-medium"
                onClick={() => navigate("/signup")}
              >
                Sign Up
              </button>
            </p>

            {/* Forgot Password (Right aligned) */}
            <button
              className="text-blue-600 hover:underline cursor-pointer font-medium"
              onClick={() => navigate("/forgot-password")}
            >
              Forgot Password?
            </button>

          </div>


          {/* reCAPTCHA */}
          {/* <div className="flex justify-center">
            <ReCAPTCHA
              sitekey="6LdQFoUrAAAAAPtwk0GeFVhA7fUenVLtedLApb55"
              onChange={(value) => setCaptchaValue(value)}
            />
          </div> */}

          {/* Login Button */}
          <button
            className="cursor-pointer w-full py-3 rounded-md font-semibold text-lg text-white"
            style={{ backgroundColor: "orange" }}
            onClick={handleLoginClick}
            disabled={loading}
          >
            {loading ? "Sending OTP..." : "Login"}
          </button>

          {/* Admin Login Link */}
          <div className="mt-4 text-center">
            <button
              onClick={() => navigate("/admin/login")}
              className="cursor-pointer text-sm text-slate-500 hover:text-indigo-600 transition flex items-center justify-center gap-2 mx-auto"
            >
              <span>🛡️</span>
              <span>Admin Login</span>
            </button>
          </div>
        </div>
      </div>

      <ToastContainer position="top-center" autoClose={3000} theme="colored" />
    </div >
  );
};

export default Login;