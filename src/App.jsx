// src/App.jsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./app.css";

// ================= USER COMPONENTS =================
import Sidebar from "./components/Sidebar";
import Login from "./auth/Login";
import PrivateRoute from "./auth/PrivateRoute";
import LegalAssistant from "./pages/LegalAssistant";
import TemplateLibrary from "./pages/TemplateLibrary";
import TemplateView from "./pages/TemplateView";
import LandingPage from "./pages/LandingPage";
import UserDashboard from "./pages/UserDashboard";

// ================= AUTH PAGES =================
import ForgotPassword from "./auth/ForgotPassword";
import ResetPassword from "./auth/ResetPassword";
import Signup from "./auth/Signup";
import SignupOTPVerification from "./auth/SignupOTPVerification";

// ================= ADMIN COMPONENTS =================
import AdminLogin from "./auth/AdminLogin";
import AdminForgotPassword from "./auth/AdminForgotPassword";
import AdminResetPassword from "./auth/AdminResetPassword";
import AdminPrivateRoute from "./auth/AdminPrivateRoute";
import AdminSidebar from "./components/AdminSidebar";
import AdminDashboard from "./admin/AdminDashboard";
import AdminTemplates from "./admin/AdminTemplates";
import AdminUsers from "./admin/AdminUsers";
import AdminAuditLog from "./admin/AdminAuditLog";
import AdminSettings from "./admin/AdminSettings";

// ================= USER LAYOUT =================
const UserLayout = () => {
  const location = useLocation();

  const hideSidebar =
    location.pathname === "/" ||
    location.pathname === "/login" ||
    location.pathname === "/signup" ||
    location.pathname === "/signup/verify" ||
    location.pathname === "/forgot-password" ||
    location.pathname === "/reset-password";

  return (
    <div className="flex h-screen">
      {!hideSidebar && <Sidebar />}
      <div className="flex-1">
        <Routes>
          {/* ---------- AUTH ROUTES ---------- */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signup/verify" element={<SignupOTPVerification />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* ---------- LANDING ---------- */}
          <Route path="/" element={<LandingPage />} />

          {/* ---------- PRIVATE USER ROUTES ---------- */}
          <Route
            path="/template-library"
            element={
              <PrivateRoute>
                <TemplateLibrary />
              </PrivateRoute>
            }
          />

          {/* ✅ FIXED ROUTE PARAM */}
          <Route
            path="/template-view/:templateId"
            element={
              <PrivateRoute>
                <TemplateView />
              </PrivateRoute>
            }
          />

          <Route
            path="/lexi-chat"
            element={
              <PrivateRoute>
                <LegalAssistant />
              </PrivateRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <UserDashboard />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
};

// ================= ADMIN LAYOUT =================
const AdminLayout = () => {
  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">
        <Routes>
          <Route
            path="dashboard"
            element={
              <AdminPrivateRoute>
                <AdminDashboard />
              </AdminPrivateRoute>
            }
          />

          <Route
            path="templates"
            element={
              <AdminPrivateRoute>
                <AdminTemplates />
              </AdminPrivateRoute>
            }
          />

          <Route
            path="templates/:id"
            element={
              <AdminPrivateRoute>
                <AdminTemplates />
              </AdminPrivateRoute>
            }
          />

          <Route
            path="users"
            element={
              <AdminPrivateRoute>
                <AdminUsers />
              </AdminPrivateRoute>
            }
          />

          <Route
            path="audit-log"
            element={
              <AdminPrivateRoute>
                <AdminAuditLog />
              </AdminPrivateRoute>
            }
          />

          <Route
            path="settings"
            element={
              <AdminPrivateRoute>
                <AdminSettings />
              </AdminPrivateRoute>
            }
          />

          {/* DEFAULT ADMIN REDIRECT */}
          <Route path="" element={<Navigate to="/admin/dashboard" replace />} />
        </Routes>
      </div>
    </div>
  );
};

// ================= MAIN APP =================
const App = () => {
  return (
    <Router>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      <Routes>
        {/* ---------- ADMIN AUTH ---------- */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/forgot-password" element={<AdminForgotPassword />} />
        <Route path="/admin/reset-password" element={<AdminResetPassword />} />

        {/* ---------- ADMIN ROUTES ---------- */}
        <Route path="/admin/*" element={<AdminLayout />} />

        {/* ---------- USER ROUTES ---------- */}
        <Route path="/*" element={<UserLayout />} />
      </Routes>
    </Router>
  );
};

export default App;
