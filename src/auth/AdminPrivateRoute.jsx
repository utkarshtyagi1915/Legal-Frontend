import React from "react";
import { Navigate } from "react-router-dom";

const AdminPrivateRoute = ({ children }) => {
  // ⚠️ TEMPORARY: Auth disabled for styling review
  //  TODO: Re - enable before production
  return children;

  // ORIGINAL AUTH CODE - UNCOMMENT WHEN READY
  const adminToken = localStorage.getItem("adminToken");
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  // Check if admin is authenticated
  if (!adminToken || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  // Optional: Verify token hasn't expired
  try {
    const payload = JSON.parse(atob(adminToken.split(".")[1]));
    const isExpired = payload.exp * 1000 < Date.now();

    if (isExpired) {
      // Clear expired admin session
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminEmail");
      localStorage.removeItem("isAdmin");
      return <Navigate to="/admin/login" replace />;
    }

    // Verify admin role
    if (payload.role !== "admin") {
      return <Navigate to="/admin/login" replace />;
    }
  } catch (err) {
    console.error("Admin token validation failed:", err);
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default AdminPrivateRoute;