import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUsers,
  FaSearch,
  FaEnvelope,
  FaCalendarAlt,
  FaFileContract,
  FaChevronDown,
  FaSortAmountDown,
  FaSortAmountUp,
  FaBan,
  FaCheckCircle,
  FaTimes,
  FaUserPlus,
  FaTrashAlt,
  FaPauseCircle,
  FaPlayCircle,
  FaExclamationTriangle,
  FaArrowLeft,
  FaEllipsisV,
  FaEdit,
  FaEye,
  FaCoins,
  FaChartLine,
} from "react-icons/fa";
import { toast } from "react-toastify";

const AdminUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");

  // Modal states
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editUserData, setEditUserData] = useState({
    name: "",
    email: "",
    role: "user",
  });

  // Dropdown menu state
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const dropdownRef = useRef(null);

  // New user form
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "" });

  useEffect(() => {
    fetchUsers();
  }, [statusFilter, sortBy, sortOrder]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdownId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/admin/users`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch users");

      const data = await res.json();
      let fetched = data.users || [];

      // Status filter
      if (statusFilter !== "all") {
        fetched = fetched.filter((u) => u.status === statusFilter);
      }

      // Sorting
      fetched.sort((a, b) => {
        let cmp = 0;
        if (sortBy === "date") cmp = b.joinDate - a.joinDate;
        if (sortBy === "name") cmp = a.name.localeCompare(b.name);
        if (sortBy === "templates") cmp = b.templatesCount - a.templatesCount;
        if (sortBy === "tokens") cmp = b.tokenUsage.used - a.tokenUsage.used;
        return sortOrder === "desc" ? cmp : -cmp;
      });

      setUsers(fetched);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const newUserObj = {
        id: users.length + 1,
        ...newUser,
        status: "active",
        role: "user",
        joinDate: new Date().toISOString(),
        templatesCount: 0,
        lastActive: new Date().toISOString(),
        tokenUsage: {
          used: 0,
          limit: 10000,
          history: [],
        },
      };

      setUsers([newUserObj, ...users]);
      setShowAddUserModal(false);
      setNewUser({ name: "", email: "", password: "" });
      toast.success(`User "${newUser.name}" added successfully!`);
    } catch (error) {
      console.error("Error adding user:", error);
      toast.error("Failed to add user");
    }
  };

  const handleSuspendUser = async (userId) => {
    try {
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, status: "suspended" } : u))
      );
      toast.warning(`User has been suspended`);
    } catch (error) {
      console.error("Error suspending user:", error);
      toast.error("Failed to suspend user");
    }
  };

  const handleActivateUser = async (userId) => {
    try {
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, status: "active" } : u))
      );
      toast.success(`User account activated`);
    } catch (error) {
      console.error("Error activating user:", error);
      toast.error("Failed to activate user");
    }
  };

  const handleRemoveUser = async (userId) => {
    try {
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      toast.success(`User removed successfully`);
    } catch (error) {
      console.error("Error removing user:", error);
      toast.error("Failed to remove user");
    }
  };

  const openConfirmModal = (action, user) => {
    setConfirmAction(action);
    setSelectedUser(user);
    setShowConfirmModal(true);
    setOpenDropdownId(null);
  };

  const openTokenModal = (user) => {
    setSelectedUser(user);
    setShowTokenModal(true);
    setOpenDropdownId(null);
  };

  const executeConfirmAction = () => {
    if (!selectedUser || !confirmAction) return;

    switch (confirmAction) {
      case "suspend":
        handleSuspendUser(selectedUser.id);
        break;
      case "activate":
        handleActivateUser(selectedUser.id);
        break;
      case "remove":
        handleRemoveUser(selectedUser.id);
        break;
    }

    setShowConfirmModal(false);
    setConfirmAction(null);
    setSelectedUser(null);
  };

  const getStatusBadge = (status) => {
    const badges = {
      active: {
        bg: "bg-emerald-100",
        text: "text-emerald-700",
        border: "border-emerald-300",
        label: "Active",
        icon: <FaCheckCircle className="text-xs" />,
      },
      inactive: {
        bg: "bg-gray-100",
        text: "text-gray-700",
        border: "border-gray-300",
        label: "Inactive",
        icon: <FaPauseCircle className="text-xs" />,
      },
      suspended: {
        bg: "bg-red-100",
        text: "text-red-700",
        border: "border-red-300",
        label: "Suspended",
        icon: <FaBan className="text-xs" />,
      },
    };
    return badges[status] || badges.inactive;
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getConfirmModalContent = () => {
    if (!confirmAction || !selectedUser) return {};

    const content = {
      suspend: {
        title: "Suspend User",
        message: `Are you sure you want to suspend "${selectedUser.name}"? They will no longer be able to access the platform.`,
        icon: <FaBan className="text-amber-500 text-2xl" />,
        buttonText: "Suspend User",
        buttonClass: "bg-amber-500 hover:bg-amber-600",
      },
      activate: {
        title: "Activate User",
        message: `Are you sure you want to activate "${selectedUser.name}"? They will regain access to the platform.`,
        icon: <FaPlayCircle className="text-emerald-500 text-2xl" />,
        buttonText: "Activate User",
        buttonClass: "bg-emerald-500 hover:bg-emerald-600",
      },
      remove: {
        title: "Remove User",
        message: `Are you sure you want to permanently remove "${selectedUser.name}"? This action cannot be undone.`,
        icon: <FaExclamationTriangle className="text-red-500 text-2xl" />,
        buttonText: "Remove User",
        buttonClass: "bg-red-500 hover:bg-red-600",
      },
    };

    return content[confirmAction] || {};
  };

  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const getTokenPercentage = (used, limit) => {
    return Math.round((used / limit) * 100);
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Stats
  const stats = {
    total: users.length,
    active: users.filter((u) => u.status === "active").length,
    inactive: users.filter((u) => u.status === "inactive").length,
    suspended: users.filter((u) => u.status === "suspended").length,
  };

  // Action Dropdown Menu
  const ActionDropdown = ({ user }) => {
    const isOpen = openDropdownId === user.id;

    const menuItems = [
      // {
      //     label: "View Token Usage",
      //     icon: <FaCoins />,
      //     onClick: () => openTokenModal(user),
      //     color: "text-orange-600",
      //     hoverBg: "hover:bg-orange-50",
      // },
      {
        label: "View Details",
        icon: <FaEye />,
        onClick: () => {
          setOpenDropdownId(null);
          setSelectedUser(user);
          setShowDetailsModal(true);
        },
        color: "text-slate-600",
        hoverBg: "hover:bg-slate-50",
      },
      {
        label: "Edit User",
        icon: <FaEdit />,
        onClick: () => {
          setOpenDropdownId(null);
          setSelectedUser(user);
          setEditUserData({
            name: user.name,
            email: user.email,
            role: user.role,
          });
          setShowEditModal(true);
        },
        color: "text-blue-600",
        hoverBg: "hover:bg-blue-50",
      },
      ...(user.status === "suspended"
        ? [
            {
              label: "Activate User",
              icon: <FaPlayCircle />,
              onClick: () => openConfirmModal("activate", user),
              color: "text-emerald-600",
              hoverBg: "hover:bg-emerald-50",
            },
          ]
        : [
            {
              label: "Suspend User",
              icon: <FaBan />,
              onClick: () => openConfirmModal("suspend", user),
              color: "text-amber-600",
              hoverBg: "hover:bg-amber-50",
            },
          ]),
      {
        label: "Remove User",
        icon: <FaTrashAlt />,
        onClick: () => openConfirmModal("remove", user),
        color: "text-red-600",
        hoverBg: "hover:bg-red-50",
        divider: true,
      },
    ];

    return (
      <div className="relative" ref={isOpen ? dropdownRef : null}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setOpenDropdownId(isOpen ? null : user.id);
          }}
          className="p-2 hover:bg-slate-100 rounded-lg transition cursor-pointer"
          title="More actions"
        >
          <FaEllipsisV className="text-slate-400" />
        </button>

        {isOpen && (
          <div className="absolute right-0 top-full mt-1 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50 animate-fadeIn">
            {menuItems.map((item, index) => (
              <React.Fragment key={index}>
                {item.divider && (
                  <div className="border-t border-gray-100 my-1"></div>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    item.onClick();
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium ${item.color} ${item.hoverBg} transition cursor-pointer`}
                >
                  <span className="text-base">{item.icon}</span>
                  {item.label}
                </button>
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Token Usage Modal
  const TokenModal = () => {
    if (!showTokenModal || !selectedUser) return null;

    const tokenPercentage = getTokenPercentage(
      selectedUser.tokenUsage.used,
      selectedUser.tokenUsage.limit
    );

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold">
                  {getInitials(selectedUser.name)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {selectedUser.name}
                  </h3>
                  <p className="text-orange-100 text-sm">
                    {selectedUser.email}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowTokenModal(false);
                  setSelectedUser(null);
                }}
                className="p-1.5 hover:bg-white/20 rounded-lg transition cursor-pointer"
              >
                <FaTimes className="text-white" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Usage Overview */}
            <div className="flex items-center gap-8 mb-8">
              <div className="relative">
                <svg className="w-28 h-28 transform -rotate-90">
                  <circle
                    cx="56"
                    cy="56"
                    r="48"
                    stroke="#f1f5f9"
                    strokeWidth="10"
                    fill="none"
                  />
                  <circle
                    cx="56"
                    cy="56"
                    r="48"
                    stroke="url(#gradientAdmin)"
                    strokeWidth="10"
                    fill="none"
                    strokeDasharray={`${(tokenPercentage / 100) * 302} 302`}
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient
                      id="gradientAdmin"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop offset="0%" stopColor="#f97316" />
                      <stop offset="100%" stopColor="#f59e0b" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-xl font-bold text-slate-800">
                      {tokenPercentage}%
                    </p>
                    <p className="text-xs text-slate-500">Used</p>
                  </div>
                </div>
              </div>

              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 bg-orange-50 rounded-xl border border-orange-100">
                    <p className="text-xs text-orange-600 font-medium">
                      Tokens Used
                    </p>
                    <p className="text-lg font-bold text-slate-800 mt-0.5">
                      {formatNumber(selectedUser.tokenUsage.used)}
                    </p>
                  </div>
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                    <p className="text-xs text-emerald-600 font-medium">
                      Remaining
                    </p>
                    <p className="text-lg font-bold text-slate-800 mt-0.5">
                      {formatNumber(
                        selectedUser.tokenUsage.limit -
                          selectedUser.tokenUsage.used
                      )}
                    </p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                    <p className="text-xs text-blue-600 font-medium">
                      Monthly Limit
                    </p>
                    <p className="text-lg font-bold text-slate-800 mt-0.5">
                      {formatNumber(selectedUser.tokenUsage.limit)}
                    </p>
                  </div>
                </div>

                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      tokenPercentage >= 90
                        ? "bg-red-500"
                        : tokenPercentage >= 70
                        ? "bg-amber-500"
                        : "bg-gradient-to-r from-orange-500 to-amber-500"
                    }`}
                    style={{ width: `${Math.min(tokenPercentage, 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Usage History */}
            <div>
              <h4 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
                <FaChartLine className="text-orange-500" />
                Daily Usage (Last 7 Days)
              </h4>
              <div className="flex items-end gap-2 h-32">
                {selectedUser.tokenUsage.history &&
                  selectedUser.tokenUsage.history.map((day, idx) => {
                    const maxTokens = Math.max(
                      ...selectedUser.tokenUsage.history.map((d) => d.tokens),
                      1
                    );
                    const height = (day.tokens / maxTokens) * 100;
                    return (
                      <div
                        key={idx}
                        className="flex-1 flex flex-col items-center gap-2"
                      >
                        <div
                          className="w-full bg-gradient-to-t from-orange-500 to-amber-400 rounded-t-lg transition-all hover:from-orange-600 hover:to-amber-500 cursor-pointer group relative"
                          style={{
                            height: `${Math.max(height, 5)}%`,
                            minHeight: "8px",
                          }}
                          title={`${day.tokens} tokens`}
                        >
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-10">
                            {formatNumber(day.tokens)} tokens
                          </div>
                        </div>
                        <span className="text-xs text-slate-400">
                          {new Date(day.date).toLocaleDateString("en-US", {
                            weekday: "short",
                          })}
                        </span>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end px-6 py-4 bg-gray-50 border-t border-gray-200">
            <button
              onClick={() => {
                setShowTokenModal(false);
                setSelectedUser(null);
              }}
              className="px-5 py-2.5 text-slate-600 hover:bg-gray-200 rounded-xl font-medium transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Add User Modal
  const AddUserModal = () => {
    if (!showAddUserModal) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FaUserPlus className="text-white text-xl" />
                <h3 className="text-lg font-bold text-white">Add New User</h3>
              </div>
              <button
                onClick={() => {
                  setShowAddUserModal(false);
                  setNewUser({ name: "", email: "", password: "" });
                }}
                className="p-1.5 hover:bg-white/20 rounded-lg transition cursor-pointer"
              >
                <FaTimes className="text-white" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={newUser.name}
                onChange={(e) =>
                  setNewUser({ ...newUser, name: e.target.value })
                }
                placeholder="Enter full name"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={newUser.email}
                onChange={(e) =>
                  setNewUser({ ...newUser, email: e.target.value })
                }
                placeholder="Enter email address"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={newUser.password}
                onChange={(e) =>
                  setNewUser({ ...newUser, password: e.target.value })
                }
                placeholder="Enter password"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 px-6 py-4 bg-gray-50 border-t border-gray-200">
            <button
              onClick={() => {
                setShowAddUserModal(false);
                setNewUser({ name: "", email: "", password: "" });
              }}
              className="px-5 py-2.5 text-slate-600 hover:bg-gray-200 rounded-xl font-medium transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleAddUser}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-medium hover:from-orange-600 hover:to-orange-700 transition shadow-lg cursor-pointer"
            >
              <FaUserPlus />
              Add User
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Confirmation Modal
  const ConfirmModal = () => {
    if (!showConfirmModal) return null;

    const content = getConfirmModalContent();

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              {content.icon}
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">
              {content.title}
            </h3>
            <p className="text-slate-600">{content.message}</p>
          </div>

          <div className="flex items-center justify-center gap-3 px-6 py-4 bg-gray-50 border-t border-gray-200">
            <button
              onClick={() => {
                setShowConfirmModal(false);
                setConfirmAction(null);
                setSelectedUser(null);
              }}
              className="px-6 py-2.5 text-slate-600 hover:bg-gray-200 rounded-xl font-medium transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={executeConfirmAction}
              className={`px-6 py-2.5 text-white rounded-xl font-medium transition shadow-lg cursor-pointer ${content.buttonClass}`}
            >
              {content.buttonText}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // View Details Modal
  const DetailsModal = () => {
    if (!showDetailsModal || !selectedUser) return null;

    const badge = getStatusBadge(selectedUser.status);
    const tokenPercentage = getTokenPercentage(
      selectedUser.tokenUsage?.used || 0,
      selectedUser.tokenUsage?.limit || 10000
    );

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-2xl">
                  {getInitials(selectedUser.name)}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {selectedUser.name}
                  </h3>
                  <p className="text-orange-100">{selectedUser.email}</p>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 mt-2 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}
                  >
                    {badge.icon} {badge.label}
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedUser(null);
                }}
                className="p-2 hover:bg-white/20 rounded-lg transition cursor-pointer"
              >
                <FaTimes className="text-white text-lg" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* User Info Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl">
                <p className="text-xs text-slate-500 font-medium">Role</p>
                <p className="font-semibold text-slate-800 mt-1 capitalize">
                  {selectedUser.role}
                </p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl">
                <p className="text-xs text-slate-500 font-medium">Joined</p>
                <p className="font-semibold text-slate-800 mt-1">
                  {new Date(selectedUser.joinDate * 1000).toLocaleDateString()}
                </p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl">
                <p className="text-xs text-slate-500 font-medium">
                  Last Active
                </p>
                <p className="font-semibold text-slate-800 mt-1">
                 {new Date(selectedUser.joinDate * 1000).toLocaleDateString()}
                </p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl">
                <p className="text-xs text-slate-500 font-medium">Templates</p>
                <p className="font-semibold text-slate-800 mt-1">
                  {selectedUser.templatesCount}
                </p>
              </div>
            </div>

            {/* Token Usage */}
            <div className="p-4 bg-orange-50 rounded-xl border border-orange-100">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-orange-700 flex items-center gap-2">
                  <FaCoins /> Token Usage
                </p>
                <span className="text-sm text-slate-600">
                  {formatNumber(selectedUser.tokenUsage?.used || 0)} /{" "}
                  {formatNumber(selectedUser.tokenUsage?.limit || 10000)}
                </span>
              </div>
              <div className="w-full h-3 bg-orange-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    tokenPercentage >= 90
                      ? "bg-red-500"
                      : tokenPercentage >= 70
                      ? "bg-amber-500"
                      : "bg-orange-500"
                  }`}
                  style={{ width: `${Math.min(tokenPercentage, 100)}%` }}
                />
              </div>
              <p className="text-xs text-slate-500 mt-2">
                {tokenPercentage}% of monthly limit used
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 bg-gray-50 border-t">
            <button
              onClick={() => {
                setShowDetailsModal(false);
                setSelectedUser(null);
              }}
              className="px-5 py-2.5 text-slate-600 hover:bg-gray-200 rounded-xl font-medium transition cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={() => {
                setShowDetailsModal(false);
                setEditUserData({
                  name: selectedUser.name,
                  email: selectedUser.email,
                  role: selectedUser.role,
                });
                setShowEditModal(true);
              }}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-medium hover:from-orange-600 hover:to-orange-700 transition cursor-pointer"
            >
              <FaEdit /> Edit User
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Edit User Modal
  const EditModal = () => {
    if (!showEditModal || !selectedUser) return null;

    const handleSaveUser = () => {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === selectedUser.id
            ? {
                ...u,
                name: editUserData.name,
                email: editUserData.email,
                role: editUserData.role,
              }
            : u
        )
      );
      toast.success(`User "${editUserData.name}" updated successfully!`);
      setShowEditModal(false);
      setSelectedUser(null);
      setEditUserData({ name: "", email: "", role: "user" });
    };

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-500 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FaEdit className="text-white text-xl" />
                <h3 className="text-lg font-bold text-white">Edit User</h3>
              </div>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedUser(null);
                  setEditUserData({ name: "", email: "", role: "user" });
                }}
                className="p-1.5 hover:bg-white/20 rounded-lg transition cursor-pointer"
              >
                <FaTimes className="text-white" />
              </button>
            </div>
          </div>

          {/* Form */}
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={editUserData.name}
                onChange={(e) =>
                  setEditUserData({ ...editUserData, name: e.target.value })
                }
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={editUserData.email}
                onChange={(e) =>
                  setEditUserData({ ...editUserData, email: e.target.value })
                }
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Role
              </label>
              <select
                value={editUserData.role}
                onChange={(e) =>
                  setEditUserData({ ...editUserData, role: e.target.value })
                }
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition cursor-pointer"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 bg-gray-50 border-t">
            <button
              onClick={() => {
                setShowEditModal(false);
                setSelectedUser(null);
                setEditUserData({ name: "", email: "", role: "user" });
              }}
              className="px-5 py-2.5 text-slate-600 hover:bg-gray-200 rounded-xl font-medium transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveUser}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 transition cursor-pointer"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    );
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
              <h1 className="text-2xl font-bold text-slate-900">
                User Management
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                Add, manage, and control user access
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowAddUserModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-medium hover:from-orange-600 hover:to-orange-700 transition shadow-lg cursor-pointer"
          >
            <FaUserPlus />
            Add User
          </button>
        </div>
      </header>

      {/* Stats */}
      <div className="px-8 py-6">
        <div className="grid grid-cols-4 gap-4">
          <div
            className="bg-white rounded-2xl p-5 border-2 border-gray-100 shadow-sm hover:border-orange-200 transition cursor-pointer"
            onClick={() => setStatusFilter("all")}
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 rounded-xl">
                <FaUsers className="text-orange-600 text-xl" />
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-900">
                  {stats.total}
                </p>
                <p className="text-sm text-slate-500 font-medium">
                  Total Users
                </p>
              </div>
            </div>
          </div>
          <div
            className="bg-white rounded-2xl p-5 border-2 border-gray-100 shadow-sm hover:border-emerald-200 transition cursor-pointer"
            onClick={() => setStatusFilter("active")}
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-100 rounded-xl">
                <FaCheckCircle className="text-emerald-600 text-xl" />
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-900">
                  {stats.active}
                </p>
                <p className="text-sm text-slate-500 font-medium">Active</p>
              </div>
            </div>
          </div>
          <div
            className="bg-white rounded-2xl p-5 border-2 border-gray-100 shadow-sm hover:border-gray-300 transition cursor-pointer"
            onClick={() => setStatusFilter("inactive")}
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gray-100 rounded-xl">
                <FaPauseCircle className="text-gray-600 text-xl" />
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-900">
                  {stats.inactive}
                </p>
                <p className="text-sm text-slate-500 font-medium">Inactive</p>
              </div>
            </div>
          </div>
          <div
            className="bg-white rounded-2xl p-5 border-2 border-gray-100 shadow-sm hover:border-red-200 transition cursor-pointer"
            onClick={() => setStatusFilter("suspended")}
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-100 rounded-xl">
                <FaBan className="text-red-600 text-xl" />
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-900">
                  {stats.suspended}
                </p>
                <p className="text-sm text-slate-500 font-medium">Suspended</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-y border-gray-200 px-8 py-4">
        <div className="flex flex-wrap items-center gap-4">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              className="w-full pl-11 pr-4 py-2.5 bg-slate-100 rounded-xl border-2 border-transparent focus:border-orange-500 focus:bg-white focus:outline-none transition"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none pl-4 pr-10 py-2.5 bg-slate-100 rounded-xl border-2 border-transparent focus:border-orange-500 focus:bg-white focus:outline-none transition cursor-pointer font-medium"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
            <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none pl-4 pr-10 py-2.5 bg-slate-100 rounded-xl border-2 border-transparent focus:border-orange-500 focus:bg-white focus:outline-none transition cursor-pointer font-medium"
              >
                <option value="date">Join Date</option>
                <option value="name">Name</option>
                <option value="templates">Templates</option>
                <option value="tokens">Token Usage</option>
              </select>
              <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
            <button
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="p-2.5 bg-slate-100 rounded-xl hover:bg-orange-100 transition cursor-pointer"
              title={sortOrder === "desc" ? "Descending" : "Ascending"}
            >
              {sortOrder === "desc" ? (
                <FaSortAmountDown className="text-slate-600" />
              ) : (
                <FaSortAmountUp className="text-slate-600" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <main className="p-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600">Loading users...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaUsers className="text-4xl text-orange-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700">
              No users found
            </h3>
            <p className="text-slate-500 mt-1">
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-visible">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 p-4 bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100 text-sm font-semibold text-slate-700">
              <div className="col-span-3">User</div>
              <div className="col-span-2">Email</div>
              <div className="col-span-2">Token Usage</div>
              <div className="col-span-1">Templates</div>
              <div className="col-span-2">Joined</div>
              <div className="col-span-1">Status</div>
              <div className="col-span-1 text-center">Actions</div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-100">
              {filteredUsers.map((user) => {
                const badge = getStatusBadge(user.status);
                const tokenPercentage = getTokenPercentage(
                  user.tokenUsage.used,
                  user.tokenUsage.limit
                );
                return (
                  <div
                    key={user.id}
                    className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-orange-50/50 transition"
                  >
                    {/* User */}
                    <div className="col-span-3 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                        {getInitials(user.name)}
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">
                          {user.name}
                        </p>
                        <p className="text-xs text-slate-500 capitalize">
                          {user.role}
                        </p>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="col-span-2">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <FaEnvelope className="text-xs text-orange-400" />
                        <span className="truncate">{user.email}</span>
                      </div>
                    </div>

                    {/* Token Usage */}
                    <div className="col-span-2">
                      <button
                        onClick={() => openTokenModal(user)}
                        className="w-full text-left hover:bg-orange-50 p-2 -m-2 rounded-lg transition cursor-pointer group"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <FaCoins className="text-xs text-orange-500" />
                          <span className="text-sm font-medium text-slate-700">
                            {formatNumber(user.tokenUsage.used)} /{" "}
                            {formatNumber(user.tokenUsage.limit)}
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              tokenPercentage >= 90
                                ? "bg-red-500"
                                : tokenPercentage >= 70
                                ? "bg-amber-500"
                                : "bg-gradient-to-r from-orange-500 to-amber-500"
                            }`}
                            style={{
                              width: `${Math.min(tokenPercentage, 100)}%`,
                            }}
                          />
                        </div>
                        {/* <p className="text-xs text-slate-400 mt-0.5 group-hover:text-orange-500 transition">Click for details</p> */}
                      </button>
                    </div>

                    {/* Templates */}
                    <div className="col-span-1">
                      <div className="flex items-center gap-1.5 text-sm text-slate-600">
                        <FaFileContract className="text-xs text-orange-500" />
                        <span className="font-medium">
                          {user.templatesCount}
                        </span>
                      </div>
                    </div>

                    {/* Joined */}
                    <div className="col-span-2">
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <FaCalendarAlt className="text-xs text-orange-400" />
                        {new Date(user.joinDate * 1000).toLocaleDateString()}
                      </div>
                    </div>

                    {/* Status */}
                    <div className="col-span-1">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${badge.bg} ${badge.text} ${badge.border}`}
                      >
                        {badge.icon}
                        {badge.label}
                      </span>
                    </div>

                    {/* Actions - 3 dot menu */}
                    <div className="col-span-1 flex justify-center">
                      <ActionDropdown user={user} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Results Count */}
        {!loading && filteredUsers.length > 0 && (
          <div className="mt-4 text-sm text-slate-500">
            Showing{" "}
            <span className="font-medium text-slate-700">
              {filteredUsers.length}
            </span>{" "}
            of{" "}
            <span className="font-medium text-slate-700">{users.length}</span>{" "}
            users
          </div>
        )}
      </main>

      {/* Modals */}
      <AddUserModal />
      <ConfirmModal />
      <DetailsModal />
      <EditModal />

      {/* Custom animation styles */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.15s ease-out;
        }
      `}</style>
    </div>
  );
};

export default AdminUsers;
