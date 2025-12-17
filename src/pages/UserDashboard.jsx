import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    FaChartBar,
    FaComments,
    FaFileContract,
    FaDownload,
    FaUser,
    FaClock,
    FaCheckCircle,
    FaHourglass,
    FaSearch as FaSearchIcon,
    FaBalanceScale,
    FaEye,
    FaFilePdf,
    FaFileWord,
} from "react-icons/fa";

const UserDashboard = () => {
    const navigate = useNavigate();
    const [chatHistory, setChatHistory] = useState([]);
    const [templates, setTemplates] = useState([]);
    const [recentDownloads, setRecentDownloads] = useState([]);
    const [activeTab, setActiveTab] = useState("overview");

    // Load data from localStorage
    useEffect(() => {
        // Load chat history
        const savedChats = localStorage.getItem("lexi_chat_history");
        if (savedChats) {
            try {
                setChatHistory(JSON.parse(savedChats));
            } catch {
                setChatHistory([]);
            }
        }

        // Load uploaded templates (user's own templates)
        const uploadedTemplates = JSON.parse(localStorage.getItem("uploadedTemplates")) || [];
        const processedTemplates = uploadedTemplates.map(t => ({
            ...t,
            status: t.status || "pending"
        }));
        setTemplates(processedTemplates);

        // Load recent downloads
        const savedDownloads = JSON.parse(localStorage.getItem("lexi_downloads")) || [];
        setRecentDownloads(savedDownloads);
    }, []);

    // Stats calculations
    const stats = {
        totalChats: chatHistory.length,
        totalTemplates: templates.length,
        approvedTemplates: templates.filter(t => t.status === "approved").length,
        pendingTemplates: templates.filter(t => t.status === "pending").length,
        inReviewTemplates: templates.filter(t => t.status === "inreview").length,
        totalDownloads: recentDownloads.length,
    };

    // Get status badge styles
    const getStatusBadge = (status) => {
        switch (status) {
            case "approved":
                return { bg: "bg-green-100", text: "text-green-700", icon: <FaCheckCircle className="text-xs" /> };
            case "pending":
                return { bg: "bg-amber-100", text: "text-amber-700", icon: <FaClock className="text-xs" /> };
            case "inreview":
                return { bg: "bg-blue-100", text: "text-blue-700", icon: <FaHourglass className="text-xs" /> };
            default:
                return { bg: "bg-gray-100", text: "text-gray-700", icon: null };
        }
    };

    // Get file icon
    const getFileIcon = (fileName = "") => {
        const ext = fileName.split(".").pop()?.toLowerCase();
        if (ext === "pdf") return <FaFilePdf className="text-red-500" />;
        if (ext === "doc" || ext === "docx") return <FaFileWord className="text-blue-500" />;
        return <FaDownload className="text-gray-500" />;
    };

    return (
        <div className="bg-white rounded-l-4xl shadow-[0_15px_40px_rgba(0,0,0,0.2)] h-screen flex flex-col overflow-hidden">
            {/* Header */}
            <header className="border-b border-gray-200 px-8 py-6 bg-gradient-to-r from-slate-50 to-white">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl shadow-lg">
                            <FaUser className="text-2xl text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">My Dashboard</h1>
                            <p className="text-slate-500 text-sm mt-1">
                                Welcome back! Here's your activity overview.
                            </p>
                        </div>
                    </div>
                    <p className="text-slate-400 text-sm">
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>

                {/* Tab Navigation */}
                <div className="flex gap-2 mt-6">
                    {[
                        { id: "overview", label: "Overview", icon: <FaChartBar /> },
                        { id: "templates", label: "My Templates", icon: <FaFileContract /> },
                        { id: "downloads", label: "Recent Downloads", icon: <FaDownload /> },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all cursor-pointer ${activeTab === tab.id
                                ? "bg-orange-500 text-white shadow-md"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8 bg-slate-50">
                {/* Overview Tab */}
                {activeTab === "overview" && (
                    <div className="space-y-8">
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <StatCard
                                icon={<FaComments />}
                                label="Total Chats"
                                value={stats.totalChats}
                                color="blue"
                                onClick={() => navigate("/lexi-chat")}
                            />
                            <StatCard
                                icon={<FaCheckCircle />}
                                label="Approved Templates"
                                value={stats.approvedTemplates}
                                color="green"
                            />
                            <StatCard
                                icon={<FaClock />}
                                label="Pending Approval"
                                value={stats.pendingTemplates}
                                color="amber"
                                highlight={stats.pendingTemplates > 0}
                            />
                            <StatCard
                                icon={<FaHourglass />}
                                label="In Review"
                                value={stats.inReviewTemplates}
                                color="blue"
                            />
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h2 className="text-lg font-bold text-slate-800 mb-4">Quick Actions</h2>
                            <div className="flex flex-wrap gap-3">
                                <button
                                    onClick={() => navigate("/lexi-chat", { state: { newChat: true } })}
                                    className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition cursor-pointer"
                                >
                                    + New Chat
                                </button>
                                <button
                                    onClick={() => navigate("/template-library")}
                                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition cursor-pointer"
                                >
                                    Browse Templates
                                </button>
                                <button
                                    onClick={() => setActiveTab("templates")}
                                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition cursor-pointer"
                                >
                                    My Templates
                                </button>
                            </div>
                        </div>

                        {/* Two Column Layout */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Recent Chats */}
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-bold text-slate-800">Recent Chats</h2>
                                    <button
                                        onClick={() => navigate("/lexi-chat")}
                                        className="text-sm text-orange-600 hover:text-orange-700 font-medium cursor-pointer"
                                    >
                                        View All →
                                    </button>
                                </div>
                                {chatHistory.length === 0 ? (
                                    <div className="text-center py-8">
                                        <FaComments className="text-3xl text-slate-300 mx-auto mb-3" />
                                        <p className="text-slate-500 text-sm">No chats yet</p>
                                        <button
                                            onClick={() => navigate("/lexi-chat", { state: { newChat: true } })}
                                            className="mt-3 text-sm text-orange-600 hover:underline cursor-pointer"
                                        >
                                            Start your first chat →
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {chatHistory.slice(0, 4).map(chat => (
                                            <div
                                                key={chat.threadId}
                                                onClick={() => navigate("/lexi-chat", { state: { threadId: chat.threadId } })}
                                                className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition cursor-pointer"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-blue-100 rounded-lg">
                                                        <FaComments className="text-blue-600 text-sm" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-slate-800 text-sm truncate max-w-[180px]">
                                                            {chat.title || "New Chat"}
                                                        </p>
                                                        <p className="text-xs text-slate-500">
                                                            {new Date(chat.timestamp).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>
                                                <FaEye className="text-slate-400 text-sm" />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Template Status Overview */}
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-bold text-slate-800">Template Status</h2>
                                    <button
                                        onClick={() => setActiveTab("templates")}
                                        className="text-sm text-orange-600 hover:text-orange-700 font-medium cursor-pointer"
                                    >
                                        View All →
                                    </button>
                                </div>
                                {templates.length === 0 ? (
                                    <div className="text-center py-8">
                                        <FaFileContract className="text-3xl text-slate-300 mx-auto mb-3" />
                                        <p className="text-slate-500 text-sm">No templates uploaded</p>
                                        <button
                                            onClick={() => navigate("/template-library")}
                                            className="mt-3 text-sm text-orange-600 hover:underline cursor-pointer"
                                        >
                                            Upload a template →
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {templates.slice(0, 4).map(template => {
                                            const badge = getStatusBadge(template.status);
                                            return (
                                                <div
                                                    key={template.id}
                                                    className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-amber-100 rounded-lg">
                                                            <FaFileContract className="text-amber-600 text-sm" />
                                                        </div>
                                                        <p className="font-medium text-slate-800 text-sm truncate max-w-[150px]">
                                                            {template.title}
                                                        </p>
                                                    </div>
                                                    <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
                                                        {badge.icon}
                                                        {template.status === "inreview" ? "In Review" : template.status?.charAt(0).toUpperCase() + template.status?.slice(1)}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Recent Downloads */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-bold text-slate-800">Recent Downloads</h2>
                                <button
                                    onClick={() => setActiveTab("downloads")}
                                    className="text-sm text-orange-600 hover:text-orange-700 font-medium cursor-pointer"
                                >
                                    View All →
                                </button>
                            </div>
                            {recentDownloads.length === 0 ? (
                                <div className="text-center py-6">
                                    <FaDownload className="text-2xl text-slate-300 mx-auto mb-2" />
                                    <p className="text-slate-500 text-sm">No recent downloads</p>
                                </div>
                            ) : (
                                <div className="flex gap-4 overflow-x-auto pb-2">
                                    {recentDownloads.slice(0, 5).map((file, idx) => (
                                        <div key={idx} className="flex-shrink-0 p-4 bg-slate-50 rounded-xl border border-slate-100 w-48">
                                            <div className="flex items-center gap-2 mb-2">
                                                {getFileIcon(file.name)}
                                                <span className="text-xs text-slate-500">{file.type || "Document"}</span>
                                            </div>
                                            <p className="text-sm font-medium text-slate-800 truncate">{file.name}</p>
                                            <p className="text-xs text-slate-400 mt-1">{new Date(file.timestamp).toLocaleDateString()}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* My Templates Tab */}
                {activeTab === "templates" && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
                        <div className="p-6 border-b border-gray-100">
                            <h2 className="text-xl font-bold text-slate-800">My Uploaded Templates</h2>
                            <p className="text-slate-500 text-sm mt-1">Track the approval status of your templates</p>
                        </div>

                        {templates.length === 0 ? (
                            <div className="p-12 text-center">
                                <FaFileContract className="text-4xl text-slate-300 mx-auto mb-4" />
                                <p className="text-slate-500 mb-4">You haven't uploaded any templates yet</p>
                                <button
                                    onClick={() => navigate("/template-library")}
                                    className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition cursor-pointer"
                                >
                                    Upload Template
                                </button>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-100">
                                {templates.map(template => {
                                    const badge = getStatusBadge(template.status);
                                    return (
                                        <div key={template.id} className="flex items-center justify-between p-4 hover:bg-slate-50 transition">
                                            <div className="flex items-center gap-4">
                                                <div className="p-2.5 bg-amber-100 rounded-lg">
                                                    <FaFileContract className="text-amber-600" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-slate-800">{template.title}</p>
                                                    <p className="text-xs text-slate-500">{template.description || "Custom template"}</p>
                                                </div>
                                            </div>
                                            <span className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${badge.bg} ${badge.text}`}>
                                                {badge.icon}
                                                {template.status === "inreview" ? "In Review" : template.status?.charAt(0).toUpperCase() + template.status?.slice(1)}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                {/* Recent Downloads Tab */}
                {activeTab === "downloads" && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
                        <div className="p-6 border-b border-gray-100">
                            <h2 className="text-xl font-bold text-slate-800">Recent Downloads</h2>
                            <p className="text-slate-500 text-sm mt-1">Documents you've downloaded from Lexi</p>
                        </div>

                        {recentDownloads.length === 0 ? (
                            <div className="p-12 text-center">
                                <FaDownload className="text-4xl text-slate-300 mx-auto mb-4" />
                                <p className="text-slate-500">No downloads yet</p>
                                <p className="text-slate-400 text-sm mt-2">Downloads from chat will appear here</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-100">
                                {recentDownloads.map((file, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-4 hover:bg-slate-50 transition">
                                        <div className="flex items-center gap-4">
                                            <div className="p-2.5 bg-slate-100 rounded-lg">
                                                {getFileIcon(file.name)}
                                            </div>
                                            <div>
                                                <p className="font-medium text-slate-800">{file.name}</p>
                                                <p className="text-xs text-slate-500">{new Date(file.timestamp).toLocaleString()}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => {
                                                if (file.url) window.open(file.url, "_blank");
                                            }}
                                            className="p-2 hover:bg-blue-100 text-blue-600 rounded-lg transition cursor-pointer"
                                            title="Download Again"
                                        >
                                            <FaDownload />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

// Stat Card Component
const StatCard = ({ icon, label, value, color, highlight, onClick }) => {
    const colors = {
        blue: "bg-blue-100 text-blue-600",
        green: "bg-green-100 text-green-600",
        amber: "bg-amber-100 text-amber-600",
        orange: "bg-orange-100 text-orange-600",
    };

    return (
        <div
            onClick={onClick}
            className={`bg-white rounded-2xl p-6 shadow-sm border transition ${highlight ? "border-amber-300 ring-2 ring-amber-100" : "border-gray-100"
                } ${onClick ? "cursor-pointer hover:shadow-md" : ""}`}
        >
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${colors[color]}`}>
                    {icon}
                </div>
                {highlight && <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-full">Awaiting</span>}
            </div>
            <p className="text-3xl font-bold text-slate-900">{value}</p>
            <p className="text-sm text-slate-500 mt-1">{label}</p>
        </div>
    );
};

export default UserDashboard;