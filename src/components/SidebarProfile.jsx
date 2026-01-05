import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaEllipsisV, FaEnvelope, FaSignOutAlt } from "react-icons/fa";

const SidebarProfile = ({ collapsed }) => {
  const navigate = useNavigate();
  const menuRef = useRef(null);

  const [userEmail, setUserEmail] = useState("");
  const [userImage, setUserImage] = useState(null);
  const [openMenu, setOpenMenu] = useState(false);

  // Load user info
  useEffect(() => {
    const email = localStorage.getItem("Email");
    setUserEmail(email || "Guest");

    const savedImage = localStorage.getItem("profileImage");
    setUserImage(savedImage || null);
  }, []);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getInitials = (email) => {
    if (!email) return "G";
    return email
      .split("@")[0]
      .split(".")
      .map((n) => n[0].toUpperCase())
      .join("")
      .slice(0, 2);
  };

  // 🔥 Logout handler
  const handleLogout = () => {
    localStorage.clear(); // clears auth, chats, profile, drafts etc
    navigate("/login");
  };

  return (
    <div
      className={`relative flex items-center transition-all duration-300
        ${collapsed ? "justify-center" : "justify-between gap-3"}
      `}
    >
      {/* Avatar + Info */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          {userImage ? (
            <img
              src={userImage}
              alt="User"
              className="w-10 h-10 rounded-full object-cover ring-2 ring-orange-400"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-orange-400 flex items-center justify-center text-white font-bold">
              {getInitials(userEmail)}
            </div>
          )}
        </div>

        {/* Email + Plan */}
        {!collapsed && (
          <div className="flex flex-col min-w-0">
            <p className="font-semibold text-sm text-gray-800 truncate max-w-[140px]">
              {userEmail}
            </p>
            <p className="text-xs text-gray-500">Free Plan</p>
          </div>
        )}
      </div>

      {/* 3 Dot Menu */}
      <div ref={menuRef} className="relative">
        <button
          onClick={() => setOpenMenu((prev) => !prev)}
          className={`cursor-pointer p-2 rounded-lg hover:bg-orange-100 transition
            ${collapsed ? "ml-0" : ""}
          `}
        >
          <FaEllipsisV className="text-gray-500" />
        </button>

        {/* Dropdown */}
        {openMenu && (
          <div
            className={`absolute z-50 -mt-[7.7rem] w-44 bg-white rounded-xl shadow-lg border border-gray-100
              ${collapsed ? "left-4 top-0" : "right-9"}
            `}
          >
            <button
              onClick={() => {
                setOpenMenu(false);
                navigate("/contact");
              }}
              className="cursor-pointer flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-t-xl"
            >
              <FaEnvelope className="text-orange-500" />
              Contact
            </button>

            <button
              onClick={handleLogout}
              className="cursor-pointer flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-b-xl"
            >
              <FaSignOutAlt />
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SidebarProfile;
