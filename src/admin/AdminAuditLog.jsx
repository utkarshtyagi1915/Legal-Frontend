import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    FaHistory,
    FaSearch,
    FaUser,
    FaCheckCircle,
    FaClock,
    FaTimesCircle,
    FaEdit,
    FaEye,
    FaChevronDown,
    FaArrowLeft,
    FaUserMinus,
    FaSignInAlt,
    FaUserPlus,
} from "react-icons/fa";

const AdminAuditLog = () => {
    const navigate = useNavigate();
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [actionFilter, setActionFilter] = useState("all");
    const [dateFilter, setDateFilter] = useState("all");

    useEffect(() => {
        fetchLogs();
    }, [actionFilter, dateFilter]);

    const fetchLogs = async () => {
        try {
            setLoading(true);

            // Mock data - replace with actual API
            setTimeout(() => {
                const mockLogs = [
                    {
                        id: 1,
                        action: "status_change",
                        description: "Changed template status from 'Pending' to 'Approved'",
                        template: { id: 1, title: "Non-Disclosure Agreement" },
                        admin: { email: "admin@lexi.com", name: "Admin User" },
                        previousStatus: "pending",
                        newStatus: "approved",
                        timestamp: new Date().toISOString(),
                        ip: "192.168.1.100",
                    },
                    {
                        id: 2,
                        action: "template_view",
                        description: "Viewed template details",
                        template: { id: 2, title: "Employment Contract" },
                        admin: { email: "admin@lexi.com", name: "Admin User" },
                        timestamp: new Date(Date.now() - 3600000).toISOString(),
                        ip: "192.168.1.100",
                    },
                    {
                        id: 3,
                        action: "status_change",
                        description: "Changed template status from 'Pending' to 'Rejected'",
                        template: { id: 3, title: "Service Agreement" },
                        admin: { email: "reviewer@lexi.com", name: "Reviewer" },
                        previousStatus: "pending",
                        newStatus: "rejected",
                        timestamp: new Date(Date.now() - 7200000).toISOString(),
                        ip: "192.168.1.101",
                    },
                    {
                        id: 4,
                        action: "admin_login",
                        description: "Admin logged into the system",
                        admin: { email: "admin@lexi.com", name: "Admin User" },
                        timestamp: new Date(Date.now() - 14400000).toISOString(),
                        ip: "192.168.1.100",
                    },
                    {
                        id: 5,
                        action: "status_change",
                        description: "Changed template status from 'Pending' to 'Rejected'",
                        template: { id: 5, title: "Partnership Agreement" },
                        admin: { email: "admin@lexi.com", name: "Admin User" },
                        previousStatus: "pending",
                        newStatus: "rejected",
                        timestamp: new Date(Date.now() - 86400000).toISOString(),
                        ip: "192.168.1.100",
                    },
                    {
                        id: 6,
                        action: "user_suspend",
                        description: "Suspended user account",
                        user: { email: "user@example.com", name: "Suspended User" },
                        admin: { email: "admin@lexi.com", name: "Admin User" },
                        timestamp: new Date(Date.now() - 172800000).toISOString(),
                        ip: "192.168.1.100",
                    },
                    {
                        id: 7,
                        action: "user_add",
                        description: "Added new user to the platform",
                        user: { email: "newuser@example.com", name: "New User" },
                        admin: { email: "admin@lexi.com", name: "Admin User" },
                        timestamp: new Date(Date.now() - 259200000).toISOString(),
                        ip: "192.168.1.100",
                    },
                ];

                // Filter by action
                let filtered = mockLogs;
                if (actionFilter !== "all") {
                    filtered = filtered.filter((l) => l.action === actionFilter);
                }

                // Filter by date
                if (dateFilter !== "all") {
                    const now = Date.now();
                    const ranges = {
                        today: 86400000,
                        week: 604800000,
                        month: 2592000000,
                    };
                    filtered = filtered.filter(
                        (l) => now - new Date(l.timestamp).getTime() <= ranges[dateFilter]
                    );
                }

                setLogs(filtered);
                setLoading(false);
            }, 800);
        } catch (error) {
            console.error("Error fetching audit logs:", error);
            setLoading(false);
        }
    };

    const getActionIcon = (action) => {
        const icons = {
            status_change: <FaEdit className="text-orange-500" />,
            template_view: <FaEye className="text-blue-500" />,
            admin_login: <FaSignInAlt className="text-emerald-500" />,
            user_suspend: <FaUserMinus className="text-red-500" />,
            user_add: <FaUserPlus className="text-purple-500" />,
        };
        return icons[action] || <FaHistory className="text-slate-500" />;
    };

    const getActionLabel = (action) => {
        const labels = {
            status_change: "Status Change",
            template_view: "Template View",
            admin_login: "Admin Login",
            user_suspend: "User Suspended",
            user_add: "User Added",
        };
        return labels[action] || action;
    };

    const getActionColor = (action) => {
        const colors = {
            status_change: "bg-orange-100 border-orange-200",
            template_view: "bg-blue-100 border-blue-200",
            admin_login: "bg-emerald-100 border-emerald-200",
            user_suspend: "bg-red-100 border-red-200",
            user_add: "bg-purple-100 border-purple-200",
        };
        return colors[action] || "bg-slate-100 border-slate-200";
    };

    const getStatusBadge = (status) => {
        const badges = {
            approved: { bg: "bg-emerald-100", text: "text-emerald-700", border: "border-emerald-300", icon: <FaCheckCircle className="text-[10px]" />, label: "Approved" },
            pending: { bg: "bg-orange-100", text: "text-orange-700", border: "border-orange-300", icon: <FaClock className="text-[10px]" />, label: "Pending" },
            rejected: { bg: "bg-red-100", text: "text-red-700", border: "border-red-300", icon: <FaTimesCircle className="text-[10px]" />, label: "Rejected" },
        };
        return badges[status] || badges.pending;
    };

    const filteredLogs = logs.filter(
        (l) =>
            l.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            l.admin.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (l.template?.title || "").toLowerCase().includes(searchQuery.toLowerCase())
    );

    const formatRelativeTime = (timestamp) => {
        const diff = Date.now() - new Date(timestamp).getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return "Just now";
        if (minutes < 60) return `${minutes} min ago`;
        if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
        if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;
        return new Date(timestamp).toLocaleDateString();
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 px-8 py-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate("/admin/dashboard")}
                            className="p-2 hover:bg-gray-100 rounded-lg transition cursor-pointer"
                            title="Back to Dashboard"
                        >
                            <FaArrowLeft className="text-slate-500" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">Audit Log</h1>
                            <p className="text-slate-500 text-sm mt-1">
                                Track all admin actions and changes
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600 bg-orange-50 px-4 py-2 rounded-xl border border-orange-200">
                        <FaHistory className="text-orange-500" />
                        <span className="font-medium">{logs.length} total entries</span>
                    </div>
                </div>
            </header>

            {/* Filters */}
            <div className="bg-white border-b border-gray-200 px-8 py-4">
                <div className="flex flex-wrap items-center gap-4">
                    {/* Search */}
                    <div className="relative flex-1 min-w-[200px] max-w-md">
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by description, admin, or template..."
                            className="w-full pl-11 pr-4 py-2.5 bg-slate-100 rounded-xl border-2 border-transparent focus:border-orange-500 focus:bg-white focus:outline-none transition"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* Action Filter */}
                    <div className="relative">
                        <select
                            value={actionFilter}
                            onChange={(e) => setActionFilter(e.target.value)}
                            className="appearance-none pl-4 pr-10 py-2.5 bg-slate-100 rounded-xl border-2 border-transparent focus:border-orange-500 focus:bg-white focus:outline-none transition cursor-pointer font-medium"
                        >
                            <option value="all">All Actions</option>
                            <option value="status_change">Status Changes</option>
                            <option value="template_view">Template Views</option>
                            <option value="admin_login">Admin Logins</option>
                            <option value="user_suspend">User Suspensions</option>
                            <option value="user_add">User Additions</option>
                        </select>
                        <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>

                    {/* Date Filter */}
                    <div className="relative">
                        <select
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                            className="appearance-none pl-4 pr-10 py-2.5 bg-slate-100 rounded-xl border-2 border-transparent focus:border-orange-500 focus:bg-white focus:outline-none transition cursor-pointer font-medium"
                        >
                            <option value="all">All Time</option>
                            <option value="today">Today</option>
                            <option value="week">This Week</option>
                            <option value="month">This Month</option>
                        </select>
                        <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* Audit Log List */}
            <main className="p-8">
                {loading ? (
                    <div className="text-center py-12">
                        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-slate-600">Loading audit log...</p>
                    </div>
                ) : filteredLogs.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FaHistory className="text-4xl text-orange-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-700">No audit log entries found</h3>
                        <p className="text-slate-500 mt-1">Try adjusting your search or filter criteria</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredLogs.map((log) => (
                            <div
                                key={log.id}
                                className={`bg-white rounded-2xl p-5 border-2 shadow-sm hover:shadow-md transition-shadow ${getActionColor(log.action)}`}
                            >
                                <div className="flex items-start gap-4">
                                    {/* Icon */}
                                    <div className="p-3 bg-white rounded-xl shadow-sm border border-gray-200">
                                        <span className="text-xl">{getActionIcon(log.action)}</span>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className="font-semibold text-slate-800">
                                                        {getActionLabel(log.action)}
                                                    </span>
                                                    {log.template && (
                                                        <span className="text-sm text-slate-500 bg-white px-2 py-0.5 rounded-lg border border-slate-200">
                                                            {log.template.title}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-slate-600 mt-1">
                                                    {log.description}
                                                </p>

                                                {/* Status Change Details */}
                                                {log.action === "status_change" && log.previousStatus && log.newStatus && (
                                                    <div className="flex items-center gap-3 mt-3">
                                                        {(() => {
                                                            const prevBadge = getStatusBadge(log.previousStatus);
                                                            const newBadge = getStatusBadge(log.newStatus);
                                                            return (
                                                                <>
                                                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${prevBadge.bg} ${prevBadge.text} ${prevBadge.border}`}>
                                                                        {prevBadge.icon}
                                                                        {prevBadge.label}
                                                                    </span>
                                                                    <span className="text-slate-400 font-bold">→</span>
                                                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${newBadge.bg} ${newBadge.text} ${newBadge.border}`}>
                                                                        {newBadge.icon}
                                                                        {newBadge.label}
                                                                    </span>
                                                                </>
                                                            );
                                                        })()}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Timestamp */}
                                            <div className="text-right">
                                                <p className="text-sm font-medium text-slate-700">
                                                    {formatRelativeTime(log.timestamp)}
                                                </p>
                                                <p className="text-xs text-slate-400 mt-0.5">
                                                    {new Date(log.timestamp).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Footer */}
                                        <div className="flex items-center gap-4 mt-4 pt-3 border-t border-gray-200/50">
                                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white text-[10px] font-bold">
                                                    {log.admin.name.charAt(0)}
                                                </div>
                                                <span className="font-medium">{log.admin.email}</span>
                                            </div>
                                            {log.ip && (
                                                <div className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded-lg">
                                                    IP: {log.ip}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Results Count */}
                {!loading && filteredLogs.length > 0 && (
                    <div className="mt-4 text-sm text-slate-500">
                        Showing <span className="font-medium text-slate-700">{filteredLogs.length}</span> of <span className="font-medium text-slate-700">{logs.length}</span> entries
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminAuditLog;
