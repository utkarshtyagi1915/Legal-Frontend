import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    FaFileContract,
    FaUsers,
    FaCheckCircle,
    FaClock,
    FaTimesCircle,
    FaArrowUp,
    FaArrowDown,
    FaEye,
    FaCalendarAlt,
    FaChartBar,
    FaExclamationTriangle,
} from "react-icons/fa";

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalTemplates: 0,
        approvedTemplates: 0,
        pendingTemplates: 0,
        rejectedTemplates: 0,
        totalUsers: 0,
    });
    const [recentTemplates, setRecentTemplates] = useState([]);
    const [recentActivity, setRecentActivity] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("adminToken");

            // Mock data for demonstration - replace with actual API calls
            setTimeout(() => {
                setStats({
                    totalTemplates: 156,
                    approvedTemplates: 89,
                    pendingTemplates: 42,
                    rejectedTemplates: 25,
                    totalUsers: 1234,
                });

                setRecentTemplates([
                    {
                        id: 1,
                        title: "Non-Disclosure Agreement",
                        user: "john@example.com",
                        status: "pending",
                        uploadDate: new Date().toISOString(),
                    },
                    {
                        id: 2,
                        title: "Employment Contract",
                        user: "sarah@company.com",
                        status: "pending",
                        uploadDate: new Date(Date.now() - 86400000).toISOString(),
                    },
                    {
                        id: 3,
                        title: "Service Level Agreement",
                        user: "mike@business.com",
                        status: "approved",
                        uploadDate: new Date(Date.now() - 172800000).toISOString(),
                    },
                    {
                        id: 4,
                        title: "Lease Agreement",
                        user: "emma@realty.com",
                        status: "rejected",
                        uploadDate: new Date(Date.now() - 259200000).toISOString(),
                    },
                    {
                        id: 5,
                        title: "Partnership Agreement",
                        user: "alex@startup.com",
                        status: "approved",
                        uploadDate: new Date(Date.now() - 345600000).toISOString(),
                    },
                ]);

                setRecentActivity([
                    {
                        id: 1,
                        action: "Template Approved",
                        template: "NDA Template v2",
                        admin: "admin@lexi.com",
                        timestamp: new Date().toISOString(),
                        type: "approved",
                    },
                    {
                        id: 2,
                        action: "New Template Submitted",
                        template: "Employment Contract",
                        admin: "System",
                        timestamp: new Date(Date.now() - 3600000).toISOString(),
                        type: "pending",
                    },
                    {
                        id: 3,
                        action: "Template Rejected",
                        template: "Service Agreement",
                        admin: "admin@lexi.com",
                        timestamp: new Date(Date.now() - 7200000).toISOString(),
                        type: "rejected",
                    },
                    {
                        id: 4,
                        action: "User Suspended",
                        template: "alex@startup.com",
                        admin: "admin@lexi.com",
                        timestamp: new Date(Date.now() - 14400000).toISOString(),
                        type: "warning",
                    },
                ]);

                setLoading(false);
            }, 800);
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case "approved":
                return {
                    bg: "bg-emerald-100",
                    text: "text-emerald-700",
                    icon: <FaCheckCircle className="text-xs" />,
                    label: "Approved",
                };
            case "pending":
                return {
                    bg: "bg-orange-100",
                    text: "text-orange-700",
                    icon: <FaClock className="text-xs" />,
                    label: "Pending",
                };
            case "rejected":
                return {
                    bg: "bg-red-100",
                    text: "text-red-700",
                    icon: <FaTimesCircle className="text-xs" />,
                    label: "Rejected",
                };
            default:
                return {
                    bg: "bg-gray-100",
                    text: "text-gray-700",
                    icon: null,
                    label: status,
                };
        }
    };

    const getActivityIcon = (type) => {
        switch (type) {
            case "approved":
                return <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>;
            case "pending":
                return <div className="w-2.5 h-2.5 rounded-full bg-orange-500"></div>;
            case "rejected":
                return <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>;
            case "warning":
                return <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>;
            default:
                return <div className="w-2.5 h-2.5 rounded-full bg-gray-400"></div>;
        }
    };

    const StatCard = ({ icon, label, value, change, changeType, color, onClick, tooltip }) => {
        const colorClasses = {
            orange: "from-orange-500 to-orange-600",
            emerald: "from-emerald-500 to-emerald-600",
            amber: "from-amber-500 to-amber-600",
            red: "from-red-500 to-red-600",
            purple: "from-purple-500 to-purple-600",
        };

        const bgHover = {
            orange: "hover:border-orange-200",
            emerald: "hover:border-emerald-200",
            amber: "hover:border-amber-200",
            red: "hover:border-red-200",
            purple: "hover:border-purple-200",
        };

        return (
            <div
                onClick={onClick}
                title={tooltip}
                className={`bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-100 hover:shadow-lg transition-all duration-300 ${bgHover[color]} ${onClick ? "cursor-pointer hover:scale-[1.02]" : ""
                    }`}
            >
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-sm text-slate-500 font-medium">{label}</p>
                        <p className="text-3xl font-bold text-slate-900 mt-1">{value}</p>
                        {change && (
                            <div className={`flex items-center gap-1 mt-2 text-sm ${changeType === "up" ? "text-emerald-600" : "text-red-500"
                                }`}>
                                {changeType === "up" ? <FaArrowUp className="text-xs" /> : <FaArrowDown className="text-xs" />}
                                <span>{change}% from last week</span>
                            </div>
                        )}
                    </div>
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${colorClasses[color]} shadow-lg`}>
                        <span className="text-white text-xl">{icon}</span>
                    </div>
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 px-8 py-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
                        <p className="text-slate-500 text-sm mt-1">
                            Welcome back! Here's an overview of your platform.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 text-sm text-slate-500 bg-orange-50 px-4 py-2 rounded-xl">
                            <FaCalendarAlt className="text-orange-500" />
                            <span className="font-medium">
                                {new Date().toLocaleDateString("en-US", {
                                    weekday: "long",
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="p-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
                    <StatCard
                        icon={<FaFileContract />}
                        label="Total Templates"
                        value={stats.totalTemplates}
                        change="12"
                        changeType="up"
                        color="orange"
                        onClick={() => navigate("/admin/templates")}
                        tooltip="Click to view all templates"
                    />
                    <StatCard
                        icon={<FaCheckCircle />}
                        label="Approved"
                        value={stats.approvedTemplates}
                        change="8"
                        changeType="up"
                        color="emerald"
                        onClick={() => navigate("/admin/templates?status=approved")}
                        tooltip="Click to view approved templates"
                    />
                    <StatCard
                        icon={<FaClock />}
                        label="Pending"
                        value={stats.pendingTemplates}
                        change="5"
                        changeType="up"
                        color="amber"
                        onClick={() => navigate("/admin/templates?status=pending")}
                        tooltip="Click to review pending templates"
                    />
                    <StatCard
                        icon={<FaTimesCircle />}
                        label="Rejected"
                        value={stats.rejectedTemplates}
                        color="red"
                        onClick={() => navigate("/admin/templates?status=rejected")}
                        tooltip="Click to view rejected templates"
                    />
                    <StatCard
                        icon={<FaUsers />}
                        label="Total Users"
                        value={stats.totalUsers}
                        change="15"
                        changeType="up"
                        color="purple"
                        onClick={() => navigate("/admin/users")}
                        tooltip="Click to manage users"
                    />
                </div>

                {/* Pending Review Alert */}
                {stats.pendingTemplates > 0 && (
                    <div className="mb-6 bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-200 rounded-2xl p-5">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-orange-100 rounded-xl">
                                    <FaExclamationTriangle className="text-2xl text-orange-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800">Templates Awaiting Review</h3>
                                    <p className="text-sm text-slate-600">
                                        You have <span className="font-bold text-orange-600">{stats.pendingTemplates}</span> templates pending approval
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => navigate("/admin/templates?status=pending")}
                                className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-medium hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-orange-200 cursor-pointer"
                            >
                                Review Now
                            </button>
                        </div>
                    </div>
                )}

                {/* Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Recent Templates */}
                    <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100">
                        <div className="p-6 border-b border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-lg font-bold text-slate-800">Recent Templates</h2>
                                    <p className="text-sm text-slate-500">Latest template submissions</p>
                                </div>
                                <button
                                    onClick={() => navigate("/admin/templates")}
                                    className="px-4 py-2 text-sm font-medium text-orange-600 hover:bg-orange-50 rounded-lg transition cursor-pointer"
                                >
                                    View All →
                                </button>
                            </div>
                        </div>

                        <div className="divide-y divide-gray-100">
                            {recentTemplates.map((template) => {
                                const badge = getStatusBadge(template.status);
                                return (
                                    <div
                                        key={template.id}
                                        className="p-4 hover:bg-slate-50 transition-colors cursor-pointer"
                                        onClick={() => navigate(`/admin/templates/${template.id}`)}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="p-2.5 bg-orange-100 rounded-lg">
                                                    <FaFileContract className="text-orange-600" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-slate-800">{template.title}</p>
                                                    <p className="text-sm text-slate-500">
                                                        by {template.user} • {new Date(template.uploadDate).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
                                                    {badge.icon}
                                                    {badge.label}
                                                </span>
                                                <button className="p-2 hover:bg-orange-100 rounded-lg transition cursor-pointer" title="View Template">
                                                    <FaEye className="text-orange-500" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
                        <div className="p-6 border-b border-gray-100">
                            <h2 className="text-lg font-bold text-slate-800">Recent Activity</h2>
                            <p className="text-sm text-slate-500">Latest admin actions</p>
                        </div>

                        <div className="divide-y divide-gray-100">
                            {recentActivity.map((activity) => (
                                <div key={activity.id} className="p-4">
                                    <div className="flex items-start gap-3">
                                        <div className="mt-1.5">
                                            {getActivityIcon(activity.type)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-800">{activity.action}</p>
                                            <p className="text-xs text-slate-500 mt-1">
                                                {activity.template} • {activity.admin}
                                            </p>
                                            <p className="text-xs text-slate-400 mt-1">
                                                {new Date(activity.timestamp).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="p-4 border-t border-gray-100">
                            <button
                                onClick={() => navigate("/admin/audit-log")}
                                className="w-full py-2 text-sm font-medium text-orange-600 hover:bg-orange-50 rounded-lg transition cursor-pointer"
                            >
                                View Full Audit Log →
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
