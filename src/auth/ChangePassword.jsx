import React, { useState } from "react";
import HomeNav from "../components/navbars/HomeNav";
import Footer from "../components/navbars/Footer/Footer";

const ChangePassword = ({ onReset }) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleResetPassword = () => {
    if (newPassword === confirmPassword && newPassword.length >= 8) {
      alert("Password reset successful!");
      onReset(); // Go back to login screen
    } else {
      alert("Passwords do not match or are too short (minimum 8 characters)");
    }
  };

  return (
    <>
      <div className="bg-gray-50 py-4 flex items-center justify-center">
        <div className="w-full p-6 bg-white rounded-lg shadow sm:max-w-md sm:p-8">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">Change Password</h2>

          <form
            className="space-y-6"
            onSubmit={(e) => {
              e.preventDefault();
              handleResetPassword();
            }}
          >
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#441410] focus:border-[#441410] block w-full p-2.5"
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#441410] focus:border-[#441410] block w-full p-2.5"
                required
              />
            </div>

            <button
              type="submit"
              className="cursor-pointer w-full text-white bg-[#441410] hover:bg-opacity-90 focus:ring-4 focus:outline-none focus:ring-[#441410]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              Reset Password
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ChangePassword;