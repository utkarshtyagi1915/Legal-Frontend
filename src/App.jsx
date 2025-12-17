// src/App.jsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import "./app.css";
 
import Sidebar from "./components/Sidebar";
import Login from "./auth/Login";
import PrivateRoute from "./auth/PrivateRoute";
import LegalAssistant from "./pages/LegalAssistant";
import TemplateLibrary from "./pages/TemplateLibrary";
import TemplateView from "./pages/TemplateView";
import LandingPage from "./pages/LandingPage";
import UserDashboard from "./pages/UserDashboard";
 
// Newly added
import ForgotPassword from "./auth/ForgotPassword";
import ResetPassword from "./auth/ResetPassword";
import Signup from "./auth/Signup";
import SignupOTPVerification from "./auth/SignupOTPVerification";
 
const AppLayout = () => {
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
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signup/verify" element={<SignupOTPVerification />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
 
          {/* Landing Page */}
          <Route path="/" element={<LandingPage />} />
 
          {/* Redirect root → login (Removed) */}
          {/* <Route path="/" element={<Navigate to="/login" />} /> */}
 
          {/* Private Routes */}
          <Route
            path="/template-library"
            element={
              <PrivateRoute>
                <TemplateLibrary />
              </PrivateRoute>
            }
          />
 
          <Route
            path="/template-view/:id"
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
 
export default function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}
 