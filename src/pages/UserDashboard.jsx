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
  FaCoins,
  FaChartLine,
  FaExclamationTriangle,
} from "react-icons/fa";

const UserDashboard = () => {
  const [userEmail, setUserEmail] = useState("");
  const [userImage, setUserImage] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [recentDownloads, setRecentDownloads] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [tokenUsage, setTokenUsage] = useState({
    used: 0,
    limit: 10000,
    history: []
  });

  const navigate = useNavigate();

  // Helper function to get initials from email
  const getInitials = (email) => {
    if (!email || email === "Guest") return "GU";
    const name = email.split("@")[0];
    const words = name.split(/[._-]/);
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  /* ============ LOAD USER DATA ============ */
  useEffect(() => {
    const email = localStorage.getItem("Email") || "Guest";
    setUserEmail(email);

    const image = localStorage.getItem("profileImage");
    setUserImage(image || null);
  }, []);
useEffect(() => {
  const fetchTokenUsage = async () => {
    console.log("[TOKEN][UI] Fetching token usage...");

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/templates/user/token-usage`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      console.log("[TOKEN][UI] API response status:", res.status);

      if (!res.ok) {
        throw new Error("Token usage fetch failed");
      }

      const data = await res.json();
      console.log("[TOKEN][UI] Token usage data received:", data);

      setTokenUsage({
        used: data.used,
        limit: data.limit,
        history: []
      });

      console.log(
        `[TOKEN][UI] Token state updated | used=${data.used}, limit=${data.limit}`
      );

    } catch (err) {
      console.error("[TOKEN][UI] Failed to load token usage:", err);
    }
  };

  fetchTokenUsage();
}, []);


  useEffect(() => {
    const fetchRecentDownloads = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/templates/downloads/recent`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch downloads");

        const data = await res.json();

        setRecentDownloads(
          (data.downloads || []).map((d) => ({
            name: d.file_name,
            timestamp: d.downloaded_at,
            type: "Document",
            template_id: d.template_id,
          }))
        );
      } catch (err) {
        console.error("Recent downloads fetch error:", err);
      }
    };

    fetchRecentDownloads();
  }, []);

  useEffect(() => {
    const fetchThreads = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/chat/threads`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch chat threads");

        const data = await res.json();

        // Convert backend threads → dashboard structure
        const mapped = data.map((t) => ({
          threadId: t.thread_id,
          title: t.title || "New Chat",
          timestamp: t.updated_at || t.created_at || new Date(),
        }));

        setChatHistory(mapped);
      } catch (err) {
        console.error("Error fetching threads:", err);
      }
    };

    fetchThreads();
  }, []);

  useEffect(() => {
  const fetchTemplates = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/templates/list`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch templates");

      const data = await res.json();

      // Normalize backend templates → dashboard format
      const mappedTemplates = (data.templates || []).map((t) => ({
        id: t.template_id,
        title: t.file_name,
        uploadedAt: t.uploaded_at,
        status: t.status,
        source: t.source, // "admin" | "user"
      }));

      setTemplates(mappedTemplates);
    } catch (err) {
      console.error("Template fetch error:", err);
    }
  };

  fetchTemplates();
}, []);


  // Stats calculations
  const stats = {
    totalChats: chatHistory.length,
    totalTemplates: templates.length,
    approvedTemplates: templates.filter((t) => t.status === "approved").length,
    pendingTemplates: templates.filter((t) => t.status === "pending").length,
    inReviewTemplates: templates.filter((t) => t.status === "inreview").length,
    totalDownloads: recentDownloads.length,
  };

  // Token usage percentage
  const tokenPercentage = Math.round((tokenUsage.used / tokenUsage.limit) * 100);
  const isTokenLow = tokenPercentage >= 80;

  // Get status badge styles
  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return {
          bg: "bg-green-100",
          text: "text-green-700",
          icon: <FaCheckCircle className="text-xs" />,
        };
      case "pending":
        return {
          bg: "bg-amber-100",
          text: "text-amber-700",
          icon: <FaClock className="text-xs" />,
        };
      case "inreview":
        return {
          bg: "bg-blue-100",
          text: "text-blue-700",
          icon: <FaHourglass className="text-xs" />,
        };
      default:
        return { bg: "bg-gray-100", text: "text-gray-700", icon: null };
    }
  };

  // Get file icon
  const getFileIcon = (fileName = "") => {
    const ext = fileName.split(".").pop()?.toLowerCase();
    if (ext === "pdf") return <FaFilePdf className="text-red-500" />;
    if (ext === "doc" || ext === "docx")
      return <FaFileWord className="text-blue-500" />;
    return <FaDownload className="text-gray-500" />;
  };

  // Format number with commas
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <div className="bg-white rounded-l-4xl shadow-[0_15px_40px_rgba(0,0,0,0.2)] h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <header className="border-b border-gray-200 px-8 py-6 bg-gradient-to-r from-slate-50 to-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              {userImage ? (
                <img
                  src={userImage}
                  alt="User"
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-orange-400"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 
                            flex items-center justify-center text-white font-bold">
                  {getInitials(userEmail)}
                </div>
              )}
            </div>
            <div className="flex flex-col">
              <p className="text-slate-500 text-sm mt-1">Welcome back!</p>
              <div className="text-sm text-slate-700">{userEmail}</div>
            </div>
          </div>
          <p className="text-slate-400 text-sm">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8 bg-slate-50">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Token Usage Alert (if low) */}
            {isTokenLow && (
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-4 flex items-center gap-4">
                <div className="p-3 bg-amber-100 rounded-xl">
                  <FaExclamationTriangle className="text-amber-600 text-xl" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-amber-800">Token Usage High</h3>
                  <p className="text-sm text-amber-600">
                    You've used {tokenPercentage}% of your monthly token limit. Consider upgrading your plan.
                  </p>
                </div>
                <button className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-medium transition cursor-pointer">
                  Upgrade Plan
                </button>
              </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {/* Token Usage Card - NEW */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 col-span-1 lg:col-span-2">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-orange-100 to-amber-100">
                      <FaCoins className="text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Token Usage</p>
                      <p className="text-2xl font-bold text-slate-900">
                        {formatNumber(tokenUsage.used)} <span className="text-sm font-normal text-slate-400">/ {formatNumber(tokenUsage.limit)}</span>
                      </p>
                    </div>
                  </div>
                  {/* <button
                    onClick={() => setActiveTab("tokens")}
                    className="text-xs text-orange-600 hover:text-orange-700 font-medium cursor-pointer"
                  >
                    View Details →
                  </button> */}
                </div>

                {/* Progress Bar */}
                <div className="relative">
                  <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${tokenPercentage >= 90 ? "bg-red-500" :
                        tokenPercentage >= 70 ? "bg-amber-500" :
                          "bg-gradient-to-r from-orange-500 to-amber-500"
                        }`}
                      style={{ width: `${Math.min(tokenPercentage, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-slate-400">
                    <span>{tokenPercentage}% used</span>
                    <span>{formatNumber(tokenUsage.limit - tokenUsage.used)} remaining</span>
                  </div>
                </div>
              </div>

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
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-slate-800 mb-4">
                Quick Actions
              </h2>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() =>
                    navigate("/lexi-chat", { state: { newChat: true } })
                  }
                  className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-lg font-medium transition-all duration-300 cursor-pointer shadow-md hover:shadow-lg"
                >
                  + New Chat
                </button>
                <button
                  onClick={() => navigate("/template-library")}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-all duration-300 cursor-pointer"
                >
                  Browse Templates
                </button>
                {/* <button
                  onClick={() => setActiveTab("tokens")}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-all duration-300 cursor-pointer flex items-center gap-2"
                >
                  <FaChartLine className="text-sm" />
                  Token Usage
                </button> */}
              </div>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Chats */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-slate-800">
                    Recent Chats
                  </h2>
                  <button
                    onClick={() => navigate("/lexi-chat")}
                    className="text-sm text-orange-600 hover:text-orange-700 font-medium cursor-pointer transition-colors"
                  >
                    View All →
                  </button>
                </div>
                {chatHistory.length === 0 ? (
                  <div className="text-center py-8">
                    <FaComments className="text-3xl text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500 text-sm">No chats yet</p>
                    <button
                      onClick={() =>
                        navigate("/lexi-chat", { state: { newChat: true } })
                      }
                      className="mt-3 text-sm text-orange-600 hover:text-orange-700 hover:underline cursor-pointer transition-colors"
                    >
                      Start your first chat →
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {chatHistory.slice(0, 4).map((chat) => (
                      <div
                        key={chat.threadId}
                        onClick={() =>
                          navigate("/lexi-chat", {
                            state: {
                              threadId: chat.threadId,
                              restoreTitle: chat.title,
                            },
                          })
                        }
                        className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-all duration-300 cursor-pointer group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
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
                        <FaEye className="text-slate-400 group-hover:text-slate-600 text-sm transition-colors" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Template Status Overview */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-slate-800">
                    Template Status
                  </h2>
                  <button
                    onClick={() => setActiveTab("templates")}
                    className="text-sm text-orange-600 hover:text-orange-700 font-medium cursor-pointer transition-colors"
                  >
                    View All →
                  </button>
                </div>
                {templates.length === 0 ? (
                  <div className="text-center py-8">
                    <FaFileContract className="text-3xl text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500 text-sm">
                      No templates uploaded
                    </p>
                    <button
                      onClick={() => navigate("/template-library")}
                      className="mt-3 text-sm text-orange-600 hover:text-orange-700 hover:underline cursor-pointer transition-colors"
                    >
                      Upload a template →
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {templates.slice(0, 4).map((template) => {
                      const badge = getStatusBadge(template.status);
                      return (
                        <div
                          key={template.id}
                          className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-all duration-300 group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-amber-100 rounded-lg group-hover:bg-amber-200 transition-colors">
                              <FaFileContract className="text-amber-600 text-sm" />
                            </div>
                            <p className="font-medium text-slate-800 text-sm truncate max-w-[150px]">
                              {template.title}
                            </p>
                          </div>
                          <span
                            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text} group-hover:shadow-sm transition-shadow`}
                          >
                            {badge.icon}
                            {template.status === "inreview"
                              ? "In Review"
                              : template.status?.charAt(0).toUpperCase() +
                              template.status?.slice(1)}
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
                <h2 className="text-lg font-bold text-slate-800">
                  Recent Downloads
                </h2>
                <button
                  onClick={() => setActiveTab("downloads")}
                  className="text-sm text-orange-600 hover:text-orange-700 font-medium cursor-pointer transition-colors"
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
                    <div
                      key={idx}
                      className="flex-shrink-0 p-4 bg-slate-50 rounded-xl border border-slate-100 w-48 hover:shadow-md transition-all duration-300 hover:border-slate-200 cursor-default"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {getFileIcon(file.name)}
                        <span className="text-xs text-slate-500">
                          {file.type || "Document"}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-slate-800 truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        {new Date(file.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Token Usage Tab - NEW */}
        {activeTab === "tokens" && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-slate-800">
                  Token Usage
                </h2>
                <p className="text-slate-500 text-sm mt-1">
                  Track your AI token consumption
                </p>
              </div>

              <div className="p-6">
                {/* Main Usage Display */}
                <div className="flex items-center gap-8 mb-8">
                  <div className="relative">
                    <svg className="w-32 h-32 transform -rotate-90">
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="#f1f5f9"
                        strokeWidth="12"
                        fill="none"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="url(#gradient)"
                        strokeWidth="12"
                        fill="none"
                        strokeDasharray={`${(tokenPercentage / 100) * 352} 352`}
                        strokeLinecap="round"
                      />
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#f97316" />
                          <stop offset="100%" stopColor="#f59e0b" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-slate-800">{tokenPercentage}%</p>
                        <p className="text-xs text-slate-500">Used</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="p-4 bg-orange-50 rounded-xl border border-orange-100">
                        <p className="text-xs text-orange-600 font-medium">Tokens Used</p>
                        <p className="text-xl font-bold text-slate-800 mt-1">{formatNumber(tokenUsage.used)}</p>
                      </div>
                      <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                        <p className="text-xs text-emerald-600 font-medium">Remaining</p>
                        <p className="text-xl font-bold text-slate-800 mt-1">{formatNumber(tokenUsage.limit - tokenUsage.used)}</p>
                      </div>
                      <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                        <p className="text-xs text-blue-600 font-medium">Monthly Limit</p>
                        <p className="text-xl font-bold text-slate-800 mt-1">{formatNumber(tokenUsage.limit)}</p>
                      </div>
                    </div>

                    <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${tokenPercentage >= 90 ? "bg-red-500" :
                          tokenPercentage >= 70 ? "bg-amber-500" :
                            "bg-gradient-to-r from-orange-500 to-amber-500"
                          }`}
                        style={{ width: `${Math.min(tokenPercentage, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Usage History */}
                <div>
                  <h3 className="font-semibold text-slate-700 mb-4">Daily Usage (Last 7 Days)</h3>
                  <div className="flex items-end gap-2 h-40">
                    {tokenUsage.history && tokenUsage.history.map((day, idx) => {
                      const maxTokens = Math.max(...tokenUsage.history.map(d => d.tokens));
                      const height = (day.tokens / maxTokens) * 100;
                      return (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                          <div
                            className="w-full bg-gradient-to-t from-orange-500 to-amber-400 rounded-t-lg transition-all hover:from-orange-600 hover:to-amber-500 cursor-pointer group relative"
                            style={{ height: `${height}%`, minHeight: "20px" }}
                            title={`${day.tokens} tokens`}
                          >
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                              {formatNumber(day.tokens)} tokens
                            </div>
                          </div>
                          <span className="text-xs text-slate-400">
                            {new Date(day.date).toLocaleDateString("en-US", { weekday: "short" })}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Back Button */}
            <button
              onClick={() => setActiveTab("overview")}
              className="text-sm text-orange-600 hover:text-orange-700 font-medium cursor-pointer"
            >
              ← Back to Overview
            </button>
          </div>
        )}

        {/* My Templates Tab */}
        {activeTab === "templates" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-slate-800">
                My Uploaded Templates
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                Track the approval status of your templates
              </p>
            </div>

            {templates.length === 0 ? (
              <div className="p-12 text-center">
                <FaFileContract className="text-4xl text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 mb-4">
                  You haven't uploaded any templates yet
                </p>
                <button
                  onClick={() => navigate("/template-library", { state: { upload: true } })}
                  className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-lg font-medium transition-all duration-300 cursor-pointer shadow-md hover:shadow-lg"
                >
                  Upload Template
                </button>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {templates.map((template) => {
                  const badge = getStatusBadge(template.status);
                  return (
                    <div
                      key={template.id}
                      className="flex items-center justify-between p-4 hover:bg-slate-50 transition-all duration-300 group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2.5 bg-amber-100 rounded-lg group-hover:bg-amber-200 transition-colors">
                          <FaFileContract className="text-amber-600" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-800">
                            {template.title}
                          </p>
                          <p className="text-xs text-slate-500">
                            {template.description || "Custom template"}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${badge.bg} ${badge.text} group-hover:shadow-sm transition-shadow`}
                      >
                        {badge.icon}
                        {template.status === "inreview"
                          ? "In Review"
                          : template.status?.charAt(0).toUpperCase() +
                          template.status?.slice(1)}
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
              <h2 className="text-xl font-bold text-slate-800">
                Recent Downloads
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                Documents you've downloaded from Lexi
              </p>
            </div>

            {recentDownloads.length === 0 ? (
              <div className="p-12 text-center">
                <FaDownload className="text-4xl text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">No downloads yet</p>
                <p className="text-slate-400 text-sm mt-2">
                  Downloads from chat will appear here
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {recentDownloads.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-4 hover:bg-slate-50 transition-all duration-300 group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2.5 bg-slate-100 rounded-lg group-hover:bg-slate-200 transition-colors">
                        {getFileIcon(file.name)}
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">
                          {file.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {new Date(file.timestamp * 1000).toLocaleString(
                            "en-IN",
                            {
                              timeZone: "Asia/Kolkata",
                            }
                          )}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        if (file.url) window.open(file.url, "_blank");
                      }}
                      className="p-2 hover:bg-blue-100 text-blue-600 rounded-lg transition-all duration-300 cursor-pointer group/button"
                      title="Download Again"
                    >
                      <FaDownload className="group-hover/button:scale-110 transition-transform" />
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
      className={`bg-white rounded-2xl p-6 shadow-sm border transition-all duration-300 ${highlight ? "border-amber-300 ring-2 ring-amber-100" : "border-gray-100"
        } ${onClick ? "cursor-pointer hover:shadow-md hover:scale-[1.02]" : ""}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${colors[color]}`}>{icon}</div>
        {highlight && (
          <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-full animate-pulse">
            Awaiting
          </span>
        )}
      </div>
      <p className="text-3xl font-bold text-slate-900">{value}</p>
      <p className="text-sm text-slate-500 mt-1">{label}</p>
    </div>
  );
};

export default UserDashboard;