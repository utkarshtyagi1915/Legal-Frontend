import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import bluelogo from "../../public/bluelogo.png";
import favicon from "../../public/favicon.ico";
import { FaTrash, FaHistory } from "react-icons/fa";
import SidebarProfile from "./SidebarProfile";
import { toast } from "react-toastify";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_BASE = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("authToken");
  
  // 🔹 Fetch chat threads from backend
  const fetchChatHistory = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API_BASE}/chat/threads`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to load chat history");

      const data = await res.json();
      setChatHistory(data || []);
    } catch (err) {
      console.error(err);
      toast.error("Unable to load chat history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChatHistory();
  }, []);

  const menuItems = [
    { label: "Dashboard", path: "/dashboard", icon: "🏠" },
    { label: "Template Library", path: "/template-library", icon: "📁" },
    { label: "AI Chat Assistant", path: "/lexi-chat", icon: "💬" },
    { label: "Admin & Settings", path: "/admin-settings", icon: "⚙️" },
  ];

  const handleChatClick = (threadId, title) => {
    navigate("/lexi-chat", {
      state: { threadId, restoreTitle: title },
    });
  };

  // 🔹 Delete chat thread
  const handleDeleteChat = async (e, threadId) => {
    e.stopPropagation();

    try {
      const res = await fetch(`${API_BASE}/chat/threads/${threadId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Delete failed");

      setChatHistory((prev) =>
        prev.filter((chat) => chat.thread_id !== threadId)
      );

      toast.success("Chat deleted");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete chat");
    }
  };

  return (
    <aside
      className={`${
        collapsed ? "w-16" : "w-60"
      } bg-gray-50 shadow-lg flex flex-col justify-between transition-all duration-300 border-r border-gray-200`}
    >
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <img
          src={collapsed ? favicon : bluelogo}
          alt="Logo"
          className={`${collapsed ? "w-9" : "w-32"} h-8 object-contain`}
        />

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="bg-orange-500 hover:bg-orange-600 text-white rounded-full text-lg px-2 py-1"
        >
          {collapsed ? "❯" : "❮"}
        </button>
      </div>

      {/* Middle */}
      <div className="flex-1 overflow-y-auto pb-5">
        {/* Menu */}
        <nav className="px-2 space-y-1 mt-2">
          {menuItems.map((item) => (
            <Link key={item.path} to={item.path}>
              <div
                className={`flex items-center gap-5 px-2 py-2 rounded-xl text-sm font-medium ${
                  location.pathname === item.path
                    ? "bg-orange-500 text-white"
                    : "hover:bg-orange-100 text-gray-700"
                }`}
              >
                <span>{item.icon}</span>
                {!collapsed && <span>{item.label}</span>}
              </div>
            </Link>
          ))}

          {!collapsed && (
            <button
              onClick={() =>
                navigate("/lexi-chat", {
  replace: false,
  state: { newChat: true, ts: Date.now() },
})
              }
              className="w-full mt-2 bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg"
            >
              ➕ New Chat
            </button>
          )}
        </nav>

        {!collapsed && <div className="mx-4 my-4 border-t" />}

        {/* Chat History */}
        {!collapsed && (
          <div className="px-4">
            <div className="flex items-center gap-2 mb-2 text-gray-600">
              <FaHistory />
              <span className="text-sm font-semibold">Recent Chats</span>
            </div>

            {loading ? (
              <p className="text-xs text-gray-500 text-center py-4">
                Loading chats...
              </p>
            ) : chatHistory.length === 0 ? (
              <p className="text-xs text-gray-500 text-center py-4">
                No chat history yet
              </p>
            ) : (
              <div className="space-y-2">
                {chatHistory.map((chat) => (
                  <div
                    key={chat.thread_id}
                    onClick={() =>
                      handleChatClick(chat.thread_id, chat.title)
                    }
                    className="group flex items-center justify-between px-3 py-2 rounded-lg hover:bg-orange-100 cursor-pointer"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {chat.title || "New Chat"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(chat.updated_at).toLocaleDateString()}
                      </p>
                    </div>

                    <button
                      onClick={(e) =>
                        handleDeleteChat(e, chat.thread_id)
                      }
                      className="opacity-0 group-hover:opacity-100 text-red-500 hover:bg-red-100 p-1 rounded"
                    >
                      <FaTrash className="text-xs" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom */}
      <div className="p-4 border-t bg-white">
        <button
          onClick={() => {
            localStorage.clear();
            sessionStorage.clear();
            navigate("/login");
          }}
          className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 mb-3"
        >
          🔒 Logout
        </button>

        <SidebarProfile />
      </div>
    </aside>
  );
};

export default Sidebar;
