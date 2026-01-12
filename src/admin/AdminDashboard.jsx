import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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
    FaExclamationTriangle,
} from "react-icons/fa";
 
const API_BASE = import.meta.env.VITE_BACKEND_URL;
 
const AdminDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalUsers: 0,
        templates: { total: 0, approved: 0, pending: 0, rejected: 0 },
    });
    const [recentTemplates, setRecentTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
 
    useEffect(() => {
        fetchDashboardData();
    }, []);
 
    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError("");
            const token = localStorage.getItem("authToken") || localStorage.getItem("token");
 
            if (!token) {
                navigate("/login");
                return;
            }
 
            const headers = { Authorization: `Bearer ${token}` };
 
            const [statsRes, templatesRes] = await Promise.all([
                axios.get(`${API_BASE}/admin/users/dashboard/stats`, { headers }),
                axios.get(`${API_BASE}/templates/admin/templates/all`, { headers }),
            ]);
 
            const statsData = statsRes.data.data;
            const allTemplates = templatesRes.data.templates || [];
 
            setStats({
                totalUsers: statsData.users,
                templates: statsData.templates,
            });
 
            // Pure JavaScript – no TypeScript, no :any, nothing
            const sortedTemplates = allTemplates
                .sort((a, b) => (b.uploadDate || 0) - (a.uploadDate || 0))
                .slice(0, 10)
                .map(t => ({
                    id: t.id,
                    title: t.title || t.file_name || "Untitled Template",
                    user: t.user?.email || "Unknown User",
                    status: t.status || "pending",
                    uploadDate: new Date((t.uploadDate || 0) * 1000).toISOString(),
                }));
 
            setRecentTemplates(sortedTemplates);
        } catch (err) {
            console.error("Dashboard fetch error:", err);
            setError(err.response?.data?.detail || "Failed to load dashboard data");
        } finally {
            setLoading(false);
        }
    };
 
    const getStatusBadge = (status) => {
        switch (status?.toLowerCase()) {
            case "approved":
                return { bg: "bg-emerald-100", text: "text-emerald-700", icon: <FaCheckCircle className="text-xs" />, label: "Approved" };
            case "pending":
                return { bg: "bg-orange-100", text: "text-orange-700", icon: <FaClock className="text-xs" />, label: "Pending" };
            case "rejected":
                return { bg: "bg-red-100", text: "text-red-700", icon: <FaTimesCircle className="text-xs" />, label: "Rejected" };
            default:
                return { bg: "bg-gray-100", text: "text-gray-700", icon: null, label: status || "Unknown" };
        }
    };
 
    const StatCard = ({ icon, label, value, color, onClick, tooltip }) => {
        const colors = {
            orange: "from-orange-500 to-orange-600 hover:border-orange-200",
            emerald: "from-emerald-500 to-emerald-600 hover:border-emerald-200",
            amber: "from-amber-500 to-amber-600 hover:border-amber-200",
            red: "from-red-500 to-red-600 hover:border-red-200",
            purple: "from-purple-500 to-purple-600 hover:border-purple-200",
        };
 
        return (
            <div
                onClick={onClick}
                title={tooltip}
                className={`bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-100 hover:shadow-lg transition-all ${colors[color]} ${onClick ? "cursor-pointer hover:scale-[1.02]" : ""}`}
            >
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-sm text-slate-500 font-medium">{label}</p>
                        <p className="text-3xl font-bold text-slate-900 mt-1">{value}</p>
                    </div>
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${colors[color]} shadow-lg`}>
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
 
    if (error) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center max-w-md">
                    <p className="text-red-600 font-medium mb-4">{error}</p>
                    <button onClick={fetchDashboardData} className="px-6 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600">
                        Retry
                    </button>
                </div>
            </div>
        );
    }
 
    const { total, approved, pending, rejected } = stats.templates;
 
    return (
        <div className="min-h-screen bg-slate-50">
            <header className="bg-white border-b border-gray-200 px-8 py-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
                        <p className="text-slate-500 text-sm mt-1">Welcome back, Admin!</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-500 bg-orange-50 px-4 py-2 rounded-xl">
                        <FaCalendarAlt className="text-orange-500" />
                        <span className="font-medium">
                            {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                        </span>
                    </div>
                </div>
            </header>
 
            <main className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
                    <StatCard icon={<FaFileContract />} label="Total Templates" value={total} color="orange" onClick={() => navigate("/admin/templates")} />
                    <StatCard icon={<FaCheckCircle />} label="Approved" value={approved} color="emerald" onClick={() => navigate("/admin/templates?status=approved")} />
                    <StatCard icon={<FaClock />} label="Pending Review" value={pending} color="amber" onClick={() => navigate("/admin/templates?status=pending")} />
                    <StatCard icon={<FaTimesCircle />} label="Rejected" value={rejected} color="red" onClick={() => navigate("/admin/templates?status=rejected")} />
                    <StatCard icon={<FaUsers />} label="Total Users" value={stats.totalUsers} color="purple" onClick={() => navigate("/admin/users")} />
                </div>
 
                {pending > 0 && (
                    <div className="mb-8 bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-200 rounded-2xl p-5">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-orange-100 rounded-xl">
                                    <FaExclamationTriangle className="text-2xl text-orange-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800">Templates Awaiting Review</h3>
                                    <p className="text-sm text-slate-600">
                                        You have <span className="font-bold text-orange-600">{pending}</span> templates pending approval
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => navigate("/admin/templates?status=pending")}
                                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-medium hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg"
                            >
                                Review Now →
                            </button>
                        </div>
                    </div>
                )}
 
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
                    <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-bold text-slate-800">Recent Template Submissions</h2>
                            <p className="text-sm text-slate-500">Latest uploads from users</p>
                        </div>
                        <button onClick={() => navigate("/admin/templates")} className="text-orange-600 hover:bg-orange-50 px-4 py-2 rounded-lg text-sm font-medium">
                            View All →
                        </button>
                    </div>
 
                    <div className="divide-y divide-gray-100">
                        {recentTemplates.length === 0 ? (
                            <div className="p-12 text-center text-slate-500">No templates uploaded yet.</div>
                        ) : (
                            recentTemplates.map((template) => {
                                const badge = getStatusBadge(template.status);
                                return (
                                    <div
                                        key={template.id}
                                        className="p-5 hover:bg-slate-50 transition-colors flex items-center justify-between cursor-pointer"
                                        onClick={() => navigate(`/admin/templates/view/${template.id}`)}
                                    >
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
                                        <div className="flex items-center gap-4">
                                            <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
                                                {badge.icon}
                                                {badge.label}
                                            </span>
                                            <FaEye className="text-slate-400 hover:text-orange-500" />
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};
 
export default AdminDashboard;
 