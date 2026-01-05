import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
    FaChartLine,
    FaFileContract,
    FaUsers,
    FaHistory,
    FaCog,
    FaSignOutAlt,
    FaShieldAlt,
    FaChevronLeft,
    FaChevronRight,
} from "react-icons/fa";

const AdminSidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false);
    const [adminEmail, setAdminEmail] = useState("");

    useEffect(() => {
        const email = localStorage.getItem("adminEmail") || "Admin";
        setAdminEmail(email);
    }, []);

    const getInitials = (email) => {
        if (!email || email === "Admin") return "AD";
        const name = email.split("@")[0];
        const words = name.split(/[._-]/);
        if (words.length >= 2) {
            return (words[0][0] + words[1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    const handleLogout = () => {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminEmail");
        localStorage.removeItem("isAdmin");
        navigate("/admin/login");
    };

    const navItems = [
        {
            to: "/admin/dashboard",
            icon: <FaChartLine />,
            label: "Dashboard",
        },
        {
            to: "/admin/templates",
            icon: <FaFileContract />,
            label: "Templates",
        },
        {
            to: "/admin/users",
            icon: <FaUsers />,
            label: "Users",
        },
        {
            to: "/admin/audit-log",
            icon: <FaHistory />,
            label: "Audit Log",
        },
        {
            to: "/admin/settings",
            icon: <FaCog />,
            label: "Settings",
        },
    ];

    return (
        <aside
            className={`h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col transition-all duration-300 ${collapsed ? "w-20" : "w-64"
                }`}
        >
            {/* Header */}
            <div className="p-4 border-b border-slate-700/50">
                <div className="flex items-center justify-between">
                    <div className={`flex items-center gap-3 ${collapsed ? "justify-center w-full" : ""}`}>
                        <div className="p-2.5 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl shadow-lg shadow-orange-500/20">
                            <FaShieldAlt className="text-xl text-white" />
                        </div>
                        {!collapsed && (
                            <div>
                                <h1 className="font-bold text-lg">Admin Panel</h1>
                                <p className="text-xs text-orange-400">Legal Assistant</p>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className={`p-2 hover:bg-slate-700 rounded-lg transition cursor-pointer ${collapsed ? "hidden" : ""}`}
                    >
                        <FaChevronLeft className="text-slate-400" />
                    </button>
                </div>
            </div>

            {/* Collapse toggle for collapsed state */}
            {collapsed && (
                <button
                    onClick={() => setCollapsed(false)}
                    className="p-3 hover:bg-slate-700 transition border-b border-slate-700/50 cursor-pointer"
                >
                    <FaChevronRight className="text-slate-400 mx-auto" />
                </button>
            )}

            {/* Navigation */}
            <nav className="flex-1 py-4 overflow-y-auto">
                <ul className="space-y-1 px-3">
                    {navItems.map((item) => (
                        <li key={item.to}>
                            <NavLink
                                to={item.to}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                                        ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/30"
                                        : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
                                    } ${collapsed ? "justify-center px-3" : ""}`
                                }
                                title={collapsed ? item.label : ""}
                            >
                                <span className="text-lg">{item.icon}</span>
                                {!collapsed && <span className="font-medium">{item.label}</span>}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Quick Stats (visible when expanded) */}
            {!collapsed && (
                <div className="px-4 py-3 border-t border-slate-700/50">
                    <p className="text-xs text-slate-500 uppercase font-semibold mb-2">Quick Stats</p>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="bg-slate-700/50 rounded-xl p-3 text-center border border-slate-600/30">
                            <p className="text-xl font-bold text-orange-400">--</p>
                            <p className="text-[10px] text-slate-400 font-medium">Pending</p>
                        </div>
                        <div className="bg-slate-700/50 rounded-xl p-3 text-center border border-slate-600/30">
                            <p className="text-xl font-bold text-emerald-400">--</p>
                            <p className="text-[10px] text-slate-400 font-medium">Approved</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Admin Profile & Logout */}
            <div className="p-3 border-t border-slate-700/50">
                <div className={`flex items-center ${collapsed ? "justify-center" : "justify-between"}`}>
                    <div className={`flex items-center gap-3 ${collapsed ? "" : ""}`}>
                        {/* Avatar */}
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-orange-500/20">
                            {getInitials(adminEmail)}
                        </div>

                        {!collapsed && (
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate max-w-[120px]">
                                    {adminEmail}
                                </p>
                                <p className="text-xs text-orange-400">Administrator</p>
                            </div>
                        )}
                    </div>

                    {!collapsed && (
                        <button
                            onClick={handleLogout}
                            className="p-2 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-lg transition cursor-pointer"
                            title="Logout"
                        >
                            <FaSignOutAlt />
                        </button>
                    )}
                </div>

                {collapsed && (
                    <button
                        onClick={handleLogout}
                        className="w-full mt-2 p-2 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-lg transition flex justify-center cursor-pointer"
                        title="Logout"
                    >
                        <FaSignOutAlt />
                    </button>
                )}
            </div>
        </aside>
    );
};

export default AdminSidebar;
