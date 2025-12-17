import React, { useState, useEffect } from "react";
import profile from "../assets/profile.png"; // default profile

const SidebarProfile = () => {
  const [userEmail, setUserEmail] = useState("");
  const [userImage, setUserImage] = useState(null);

  useEffect(() => {
    // Fetch email from localStorage
    const email = localStorage.getItem("Email");
    setUserEmail(email || "Guest");

    // Optionally: fetch user image from API based on email
    const savedImage = localStorage.getItem("profileImage"); // Base64 or URL
    if (savedImage) {
      setUserImage(savedImage);
    } else {
      setUserImage(null); // fallback to default
    }
  }, []);

  // Generate initials if no profile image
  const getInitials = (email) => {
    if (!email) return "G";
    const namePart = email.split("@")[0];
    return namePart
      .split(".")
      .map((n) => n[0].toUpperCase())
      .join("")
      .slice(0, 2);
  };

  return (
    <div className="flex items-center gap-4 p-3 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
      <div className="relative">
        {userImage ? (
          <img
            src={userImage}
            alt="User"
            className="w-12 h-12 rounded-full object-cover ring-2 ring-orange-400 shadow-inner transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-orange-200 flex items-center justify-center text-white font-bold text-lg ring-2 ring-orange-400 shadow-inner transition-transform duration-300 hover:scale-105">
            {getInitials(userEmail)}
          </div>
        )}
      </div>
      <div className="flex flex-col">
        <p className="font-semibold text-sm text-gray-800 truncate w-32">
          {userEmail}
        </p>
        <p className="text-xs text-gray-600">Free Plan</p>
      </div>
    </div>
  );
};

export default SidebarProfile;