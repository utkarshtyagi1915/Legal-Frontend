import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaMagic,
  FaFilePdf,
  FaFileWord,
  FaDownload,
  FaCopy,
  FaEdit,
  FaPaperPlane,
} from "react-icons/fa";
import logo from "../../public/logo.png";
import ChatInput from "../chat/ChatInput";
import defaultProfile from "../assets/profile.png";
import jsPDF from "jspdf";

// Helper function to get user initials
const getInitials = (email) => {
  if (!email || email === "Guest") return "GU";
  const name = email.split("@")[0];
  const words = name.split(/[._-]/);
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

// Enhanced text formatting with full markdown support
function htmlToCleanText(html = "") {
  let text = html;

  // Headings
  text = text.replace(
    /<h1[^>]*>(.*?)<\/h1>/gi,
    "\n\n$1\n====================\n"
  );
  text = text.replace(
    /<h2[^>]*>(.*?)<\/h2>/gi,
    "\n\n$1\n--------------------\n"
  );
  text = text.replace(/<h3[^>]*>(.*?)<\/h3>/gi, "\n\n$1\n");
  text = text.replace(/<h4[^>]*>(.*?)<\/h4>/gi, "\n\n$1\n");

  // Lists
  text = text.replace(/<li[^>]*>(.*?)<\/li>/gi, "• $1\n");
  text = text.replace(/<\/?(ul|ol)[^>]*>/gi, "\n");

  // Paragraphs & breaks
  text = text.replace(/<p[^>]*>/gi, "");
  text = text.replace(/<\/p>/gi, "\n\n");
  text = text.replace(/<br\s*\/?>/gi, "\n");

  // Blockquotes
  text = text.replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gi, '\n"$1"\n');

  // Remove remaining HTML tags
  text = text.replace(/<[^>]+>/g, "");

  // Decode HTML entities
  text = text
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");

  // Normalize spacing
  text = text.replace(/\n{3,}/g, "\n\n").trim();

  return text;
}

// Extract and sanitize a single HTML table from backend text
function extractTableBlock(raw = "") {
  if (!raw) return { rawText: "", tableHTML: null };
  const match = raw.match(/<table[\s\S]*?<\/table>/i);
  if (!match) return { rawText: raw, tableHTML: null };
  const tableHTMLRaw = match[0];
  const rawText = raw.replace(tableHTMLRaw, "").trim();
  return { rawText, tableHTML: sanitizeTableHTML(tableHTMLRaw) };
}

function sanitizeTableHTML(html = "") {
  if (!html) return null;
  let out = html;

  out = out.replace(/<script[\s\S]*?<\/script>/gi, "");
  out = out.replace(/\s+on\w+=(?:"[^"]*"|'[^']*')/gi, "");
  out = out.replace(/<(?!\/?(table|thead|tbody|tr|th|td)\b)[^>]*>/gi, "");
  out = out.replace(/<thead[^>]*>/gi, "<thead>");
  out = out.replace(/<tbody[^>]*>/gi, "<tbody>");
  out = out.replace(/<tr[^>]*>/gi, "<tr>");
  out = out.replace(/<th[^>]*>/gi, "<th>");
  out = out.replace(/<td[^>]*>/gi, "<td>");
  out = out.replace(
    /<table[^>]*>/i,
    '<table class="w-full text-sm border border-slate-300 border-collapse">'
  );
  out = out.replace(
    /<th>/gi,
    '<th class="border border-slate-300 px-3 py-2 bg-slate-100 text-slate-700">'
  );
  out = out.replace(
    /<td>/gi,
    '<td class="border border-slate-200 px-3 py-2">'
  );

  return `<div class="overflow-x-auto my-3">${out}</div>`;
}

function formatBackendText(raw = "") {
  if (!raw) return "";

  let text = raw;

  // Escape HTML to prevent XSS (but preserve our own tags later)
  text = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Code blocks (``` ... ```) - must be processed first
  text = text.replace(
    /```(\w*)\n?([\s\S]*?)```/g,
    (_, lang, code) =>
      `<pre class="bg-slate-900 text-slate-100 p-4 rounded-xl my-4 overflow-x-auto text-sm font-mono border border-slate-700"><code class="language-${lang || "text"
      }">${code.trim()}</code></pre>`
  );

  // Inline code (`code`)
  text = text.replace(
    /`([^`]+)`/g,
    '<code class="bg-orange-100 text-orange-800 px-1.5 py-0.5 rounded text-sm font-mono">$1</code>'
  );

  // Headings (#### h4, ### h3, ## h2, # h1)
  text = text.replace(
    /^####\s*(.*)$/gm,
    '<h4 class="text-base font-bold text-slate-800 mt-4 mb-2 flex items-center gap-2"><span class="w-1.5 h-1.5 bg-orange-400 rounded-full"></span>$1</h4>'
  );
  text = text.replace(
    /^###\s*(.*)$/gm,
    '<h3 class="text-lg font-bold text-slate-800 mt-5 mb-2 border-l-3 border-orange-400 pl-3">$1</h3>'
  );
  text = text.replace(
    /^##\s*(.*)$/gm,
    '<h2 class="text-xl font-bold text-slate-900 mt-6 mb-3 pb-2 border-b border-slate-200">$1</h2>'
  );
  text = text.replace(
    /^#\s*(.*)$/gm,
    '<h1 class="text-2xl font-extrabold text-slate-900 mt-6 mb-4">$1</h1>'
  );

  // Bold and Italic
  text = text.replace(
    /\*\*\*(.*?)\*\*\*/g,
    '<strong class="font-bold"><em>$1</em></strong>'
  );
  text = text.replace(
    /\*\*(.*?)\*\*/g,
    '<strong class="font-semibold text-slate-900">$1</strong>'
  );
  text = text.replace(
    /\*(.*?)\*/g,
    '<em class="italic text-slate-700">$1</em>'
  );
  text = text.replace(
    /__(.*?)__/g,
    '<strong class="font-semibold text-slate-900">$1</strong>'
  );
  text = text.replace(/_(.*?)_/g, '<em class="italic text-slate-700">$1</em>');

  // Links [text](url)
  text = text.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-orange-600 hover:text-orange-700 underline underline-offset-2 font-medium transition-colors">$1</a>'
  );

  // Horizontal rule
  text = text.replace(
    /^---$/gm,
    '<hr class="my-6 border-t-2 border-slate-200" />'
  );
  text = text.replace(
    /^\*\*\*$/gm,
    '<hr class="my-6 border-t-2 border-slate-200" />'
  );

  // Numbered lists (1. item, 2. item, etc.)
  text = text.replace(
    /^(\d+)\.\s+(.*)$/gm,
    '<li class="numbered-item ml-4 mb-2 pl-2 text-slate-700 relative before:content-[attr(data-num)] before:absolute before:-left-6 before:text-orange-500 before:font-bold" data-num="$1.">$2</li>'
  );

  // Wrap consecutive numbered items in ol
  text = text.replace(
    /(<li class="numbered-item[^>]*>.*?<\/li>\n?)+/g,
    (match) => `<ol class="list-none my-4 space-y-1 pl-6">${match}</ol>`
  );

  // Bullet lists (- item or * item)
  text = text.replace(
    /^[-*]\s+(.*)$/gm,
    '<li class="bullet-item flex items-start gap-3 mb-2 text-slate-700"><span class="mt-2 w-1.5 h-1.5 rounded-full bg-orange-400 flex-shrink-0"></span><span>$1</span></li>'
  );

  // Wrap consecutive bullet items in ul
  text = text.replace(
    /(<li class="bullet-item[^>]*>[\s\S]*?<\/li>\n?)+/g,
    (match) => `<ul class="list-none my-4 space-y-1">${match}</ul>`
  );

  // Blockquotes (> text)
  text = text.replace(
    /^>\s*(.*)$/gm,
    '<blockquote class="border-l-4 border-orange-300 bg-orange-50 pl-4 py-2 my-3 italic text-slate-600 rounded-r-lg">$1</blockquote>'
  );

  // Handle line breaks and paragraphs
  // Replace \n with actual newlines first
  text = text.replace(/\\n/g, "\n");

  // Double newlines become paragraph breaks
  text = text.replace(
    /\n\n+/g,
    '</p><p class="mb-3 text-slate-700 leading-relaxed">'
  );

  // Single newlines become <br> (but not inside pre/code blocks)
  text = text.replace(/(?<!<\/pre>)\n(?!<)/g, "<br />");

  // Wrap in paragraph if not already wrapped in block element
  if (
    !text.startsWith("<h") &&
    !text.startsWith("<ul") &&
    !text.startsWith("<ol") &&
    !text.startsWith("<pre") &&
    !text.startsWith("<blockquote")
  ) {
    text = `<p class="mb-3 text-slate-700 leading-relaxed">${text}</p>`;
  }

  // Clean up empty paragraphs
  text = text.replace(/<p[^>]*>\s*<\/p>/g, "");

  return text;
}

// File icon
function getFileIcon(fileName = "") {
  const ext = fileName.split(".").pop()?.toLowerCase();
  if (ext === "pdf") return <FaFilePdf className="text-red-500 text-lg" />;
  if (ext === "doc" || ext === "docx")
    return <FaFileWord className="text-blue-500 text-lg" />;
  return null;
}

function genId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

const LegalAssistant = () => {
  const location = useLocation();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({
    email: "",
    profileImage: null
  });

  const scrollRef = useRef(null);
  const threadRef = useRef(null);
  const abortRef = useRef(null);
  const streamTimersRef = useRef({});

  const backendUrl = `${import.meta.env.VITE_BACKEND_URL}/query`;
  const downloadBaseUrl = `${import.meta.env.VITE_BACKEND_URL}/files/`;
  const API_BASE = import.meta.env.VITE_BACKEND_URL;

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const savedEmail = localStorage.getItem("Email");
        const savedImage = localStorage.getItem("profileImage");

        // Set initial data from localStorage
        setUserData({
          email: savedEmail || "Guest",
          profileImage: savedImage || null
        });

        // Try to fetch fresh data from API if token exists
        if (token) {
          const res = await fetch(`${API_BASE}/user/profile`, {
            headers: { Authorization: `Bearer ${token}` }
          });

          if (res.ok) {
            const data = await res.json();
            setUserData({
              email: data.email || savedEmail || "Guest",
              profileImage: data.profileImage || savedImage || null
            });

            // Update localStorage
            if (data.email) localStorage.setItem("Email", data.email);
            if (data.profileImage) localStorage.setItem("profileImage", data.profileImage);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        // Use localStorage data as fallback
        const savedEmail = localStorage.getItem("Email") || "Guest";
        const savedImage = localStorage.getItem("profileImage") || null;
        setUserData({
          email: savedEmail,
          profileImage: savedImage
        });
      }
    };

    fetchUserData();
  }, [API_BASE]);

  // Get user profile image or show initials in a gradient circle
  const getUserAvatar = () => {
    if (userData.profileImage) {
      return (
        <img
          src={userData.profileImage}
          alt="You"
          className="w-8 h-8 rounded-full object-cover ring-2 ring-orange-400 flex-shrink-0"
        />
      );
    }

    return (
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 
                      flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
        {getInitials(userData.email)}
      </div>
    );
  };

  useEffect(() => {
    if (location.state?.newChat) {
      threadRef.current = null;
      setMessages([]);
      setLoading(false);
      window.history.replaceState({}, document.title);
      toast.info("Started a new chat");
    }
  }, [location.key]);

  useEffect(() => {
    const restoreThreadId = location.state?.threadId;
    if (!restoreThreadId) return;

    const loadPreviousMessages = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `${API_BASE}/chat/messages/${restoreThreadId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );

        if (!res.ok) throw new Error("Failed to load messages");

        const data = await res.json();

        const formatted = data.map((msg, idx) => {
          if (msg.sender === "user") {
            return {
              type: "user",
              text: msg.message,
              files: msg.files || [],
              timestamp: new Date(msg.created_at),
              id: genId(),
              userEmail: userData.email,
              userAvatar: userData.profileImage ? (
                <img
                  src={userData.profileImage}
                  alt="You"
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-orange-400"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 
                                flex items-center justify-center text-white font-bold text-xs">
                  {getInitials(userData.email)}
                </div>
              )
            };
          }
          const { rawText, tableHTML } = extractTableBlock(msg.message || "");
          return {
            type: "bot",
            text: formatBackendText(rawText),
            tableHTML,
            files: msg.files || [],
            timestamp: new Date(msg.created_at),
            id: genId(),
            isTemplate: msg.isTemplate || false,
          };
        });

        threadRef.current = restoreThreadId;
        setMessages(formatted);
      } catch (err) {
        console.error(err);
        toast.error("Failed to restore chat");
      } finally {
        setLoading(false);
      }
    };

    loadPreviousMessages();
  }, [location.state, userData.email, userData.profileImage]);

  useEffect(() => {
    if (!threadRef.current || messages.length === 0) return;

    const lastUserMsg = [...messages].reverse().find((m) => m.type === "user");
    if (!lastUserMsg) return;

    const history = JSON.parse(
      localStorage.getItem("lexi_chat_history") || "[]"
    );
    const exists = history.some((h) => h.threadId === threadRef.current);

    if (!exists) {
      const newEntry = {
        threadId: threadRef.current,
        title: lastUserMsg.text.slice(0, 50) || "New Chat",
        timestamp: new Date().toISOString(),
      };

      history.unshift(newEntry);
      if (history.length > 20) history.pop();

      localStorage.setItem("lexi_chat_history", JSON.stringify(history));
    }
  }, [messages]);

  const handleSend = async (msg, isEditResend = false, originalMessageId = null) => {
    if (!msg.text && !msg.file) return;

    // If this is an edit-resend, we need to handle it differently
    if (isEditResend && originalMessageId) {
      // Update the original message to show "Resending..."
      setMessages((prev) =>
        prev.map((m) =>
          m.id === originalMessageId
            ? { ...m, resending: true }
            : m
        )
      );
    } else {
      // Normal user message - include user avatar
      const userMessage = {
        type: "user",
        text: msg.text || "",
        file: msg.file || null,
        timestamp: new Date(),
        id: genId(),
        userEmail: userData.email,
        userAvatar: getUserAvatar()
      };
      setMessages((prev) => [...prev, userMessage]);
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("question", msg.text || "");
      if (msg.file) formData.append("user_file", msg.file);

      if (threadRef.current) {
        formData.append("thread_id", threadRef.current);
      }

      abortRef.current = new AbortController();

      const res = await fetch(backendUrl, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        signal: abortRef.current.signal,
      });

      const data = await res.json();

      if (!threadRef.current && data.thread_id) {
        threadRef.current = data.thread_id;
      }

      let files = [];
      let rawAnswer = "";
      let tableHTML = null;
      let isTemplate = false;

      if (data.answer) {
        const extracted = extractTableBlock(data.answer || "");
        rawAnswer = extracted.rawText;
        tableHTML = extracted.tableHTML;
        isTemplate = false;
      } else if (data.template) {
        files = data.pdf_files || [];
        const extracted = extractTableBlock(data.template || "");
        rawAnswer = extracted.rawText;
        tableHTML = extracted.tableHTML;
        isTemplate = true;
      } else if (data.classification) {
        const formattedText = `
            <h3>Document Analysis Complete</h3>
            <p><strong>File:</strong> ${data.filename || "Unknown"}</p>
            <p><strong>Type:</strong> ${data.classification?.type || "N/A"}</p>
            <p><strong>Risk Level:</strong> ${data.overall_risk || "N/A"}</p>
            ${data.high_risk_pdf
            ? `<p><a href="${data.high_risk_pdf}" target="_blank" class="text-blue-600 underline">Download Risk Report (PDF)</a></p>`
            : "<p>No high-risk clauses detected.</p>"
          }
          `;
        if (data.high_risk_pdf) files = [data.high_risk_pdf];
        setMessages((prev) => [
          ...prev,
          {
            type: "bot",
            text: formattedText,
            files,
            timestamp: new Date(),
            id: genId(),
            isTemplate: false,
          },
        ]);
        setLoading(false);
        return;
      } else {
        const formattedText = "<p>No response from server.</p>";
        setMessages((prev) => [
          ...prev,
          {
            type: "bot",
            text: formattedText,
            files,
            timestamp: new Date(),
            id: genId(),
            isTemplate: false,
          },
        ]);
        setLoading(false);
        return;
      }

      const streamId = genId();
      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          text: "",
          streaming: true,
          streamBuffer: "",
          tableHTML,
          files,
          timestamp: new Date(),
          id: streamId,
          isTemplate: isTemplate,
        },
      ]);

      const plainText = htmlToCleanText(rawAnswer);
      const tokens = plainText.split(/(\s+)/);
      let idx = 0;
      const tick = () => {
        if (!streamTimersRef.current[streamId]) return;
        const chunk = tokens.slice(idx, idx + 5).join("");
        idx += 5;
        setMessages((prev) =>
          prev.map((m) =>
            m.id === streamId
              ? { ...m, streamBuffer: (m.streamBuffer || "") + chunk }
              : m
          )
        );
        if (idx < tokens.length) {
          streamTimersRef.current[streamId] = setTimeout(tick, 25);
        } else {
          const finalHTML = formatBackendText(rawAnswer);
          setMessages((prev) =>
            prev.map((m) =>
              m.id === streamId
                ? {
                  ...m,
                  text: finalHTML,
                  streaming: false,
                  streamBuffer: undefined,
                }
                : m
            )
          );
          clearTimeout(streamTimersRef.current[streamId]);
          delete streamTimersRef.current[streamId];
        }
      };
      streamTimersRef.current[streamId] = setTimeout(tick, 50);
    } catch (err) {
      console.error("Send error:", err);
      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          text: "Sorry, something went wrong. Please try again.",
          timestamp: new Date(),
          id: genId(),
          isTemplate: false,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handlePause = () => {
    try {
      abortRef.current?.abort();
    } catch { }
    setLoading(false);
    Object.keys(streamTimersRef.current).forEach((key) => {
      clearTimeout(streamTimersRef.current[key]);
      delete streamTimersRef.current[key];
    });
  };

  const startEditMessage = (id) => {
    setMessages((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          if (m.type === "bot") {
            const rawText = htmlToCleanText(m.text);
            return {
              ...m,
              editing: true,
              editValue: rawText,
              originalText: m.text,
            };
          } else {
            return {
              ...m,
              editing: true,
              editValue: m.text,
              originalText: m.text,
            };
          }
        }
        return m;
      })
    );
  };

  const updateEditValue = (id, val) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, editValue: val } : m))
    );
  };

  const cancelEditMessage = (id) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === id
          ? { ...m, editing: false, editValue: undefined, originalText: undefined }
          : m
      )
    );
  };

  const saveAndResendEditMessage = (id) => {
    const message = messages.find((m) => m.id === id);
    if (!message) return;

    const editedText = message.editValue || "";

    if (message.type === "user") {
      // For user messages: Save and send as new query
      setMessages((prev) =>
        prev.map((m) =>
          m.id === id
            ? {
              ...m,
              text: editedText,
              editing: false,
              editValue: undefined,
              originalText: undefined,
              userAvatar: getUserAvatar() // Update avatar
            }
            : m
        )
      );

      // Send the edited query to backend
      setTimeout(() => {
        handleSend({ text: editedText }, false, id);
      }, 300);
    } else if (message.type === "bot") {
      // For bot messages: Save and resend for review if it's a template
      setMessages((prev) =>
        prev.map((m) => {
          if (m.id !== id) return m;
          const formattedText = formatBackendText(editedText);
          return {
            ...m,
            text: formattedText,
            editing: false,
            editValue: undefined,
            originalText: undefined,
          };
        })
      );

      // If it's a template, resend for review
      if (message.isTemplate) {
        setTimeout(() => {
          handleSend({ text: `I've edited the template. Please review this updated version:\n\n${editedText}` }, true, id);
        }, 300);
      }
    }
  };

  const handleDownload = async (fileUrl) => {
    try {
      const res = await fetch(`${downloadBaseUrl}${fileUrl}`);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileUrl.split("/").pop() || "download.pdf";
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success("Download started!");
    } catch (err) {
      toast.error("Download failed");
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <main className="flex rounded-l-4xl shadow-[0_15px_40px_rgba(0,0,0,0.2)] flex-col w-full h-screen bg-white shadow-2xl overflow-hidden">
      {/* Header */}
      <ToastContainer
        position="bottom-center"
        autoClose={2000}
        hideProgressBar
        newestOnTop
        closeOnClick
        pauseOnHover
      />
      <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Lexi" className="w-10 h-10 rounded-full" />
          <div>
            <h1 className="text-xl font-bold text-gray-800">
              Lexi – Your Legal AI Assistant
            </h1>
            <p className="text-xs text-gray-500">
              {userData.email}
            </p>
          </div>
        </div>
      </header>

      {/* Empty State */}
      {messages.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-6 rounded-2xl mb-6 border border-orange-100">
            <FaMagic className="text-5xl text-orange-500" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Lexi – Your All-in-One Legal Assistant
          </h2>
          <p className="text-gray-600 max-w-md text-lg mb-8">
            Ask legal questions, analyze contracts, draft documents, or start
            from a template.
          </p>
        </div>
      ) : (
        /* Chat Messages */
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex gap-3 ${msg.type === "user" ? "justify-end" : "justify-start"
                }`}
            >
              {/* Bot Avatar */}
              {msg.type === "bot" && (
                <div className="flex-shrink-0">
                  <img
                    src={logo}
                    alt="Lexi"
                    className="w-9 h-9 rounded-full"
                  />
                </div>
              )}

              {/* User Avatar */}
              {msg.type === "user" && (
                <div className="flex-shrink-0">
                  {msg.userAvatar || getUserAvatar()}
                </div>
              )}

              <div
                className={`max-w-2xl ${msg.type === "user" ? "order-first" : ""
                  }`}
              >
                <div
                  className={`relative px-5 py-4 rounded-2xl shadow-sm border min-h-[60px] ${msg.type === "user"
                    ? "bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200"
                    : "bg-white border-gray-200 shadow-md"
                    } ${msg.editing ? "min-w-[500px]" : ""} ${msg.resending ? "border-2 border-orange-300 animate-pulse" : ""
                    }`}
                >
                  {/* Action Buttons - top right */}
                  <div className="flex justify-end gap-2 mb-2 pb-2">
                    {msg.type === "bot" ? (
                      <>
                        {/* COPY */}
                        <button
                          onClick={() => {
                            const plainText = htmlToCleanText(msg.text);
                            navigator.clipboard.writeText(plainText);
                            toast.success("Copied to clipboard");
                          }}
                          className="p-1.5 hover:bg-gray-100 rounded-lg transition cursor-pointer group"
                          title="Copy to clipboard"
                        >
                          <FaCopy className="text-gray-500 group-hover:text-orange-500 text-sm" />
                        </button>

                        {/* EDIT (NO TOAST) */}
                        <button
                          onClick={() => startEditMessage(msg.id)}
                          className="p-1.5 hover:bg-gray-100 rounded-lg transition cursor-pointer group"
                          title="Edit response"
                        >
                          <FaEdit className="text-gray-500 group-hover:text-orange-500 text-sm" />
                        </button>

                        {/* DOWNLOAD PDF */}
                        <button
                          onClick={() => {
                            const plainText = htmlToCleanText(msg.text);
                            const doc = new jsPDF({ orientation: "p", unit: "mm", format: "a4" });

                            const marginLeft = 15;
                            const marginTop = 20;
                            const pageHeight = doc.internal.pageSize.height;
                            const maxWidth = 180;
                            const lineHeight = 6;

                            doc.setFont("Times", "Normal");
                            doc.setFontSize(11);

                            const lines = doc.splitTextToSize(plainText, maxWidth);
                            let y = marginTop;

                            lines.forEach((line) => {
                              if (y + lineHeight > pageHeight - 20) {
                                doc.addPage();
                                y = marginTop;
                              }
                              doc.text(line, marginLeft, y);
                              y += lineHeight;
                            });

                            doc.save(`lexi-response-${Date.now()}.pdf`);
                            toast.success("PDF downloaded successfully");
                          }}
                          className="p-1.5 hover:bg-gray-100 rounded-lg transition cursor-pointer group"
                          title="Download as PDF"
                        >
                          <FaFilePdf className="text-red-500 group-hover:text-orange-500 text-sm" />
                        </button>
                      </>
                    ) : (
                      <>
                        {/* USER COPY */}
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(msg.text || "");
                            toast.success("Copied to clipboard");
                          }}
                          className="p-1.5 hover:bg-orange-100 rounded-lg transition cursor-pointer group"
                          title="Copy message"
                        >
                          <FaCopy className="text-gray-500 group-hover:text-orange-500 text-sm" />
                        </button>

                        {/* USER EDIT (NO TOAST) */}
                        <button
                          onClick={() => startEditMessage(msg.id)}
                          className="p-1.5 hover:bg-orange-100 rounded-lg transition cursor-pointer group"
                          title="Edit message"
                        >
                          <FaEdit className="text-gray-500 group-hover:text-orange-500 text-sm" />
                        </button>
                      </>
                    )}
                  </div>


                  {/* File Preview */}
                  {msg.file && (
                    <div className="flex items-center gap-2 mb-3 p-2 bg-white/50 rounded-lg border border-orange-100">
                      {getFileIcon(msg.file.name)}
                      <div className="flex-1">
                        <span className="text-xs font-medium text-orange-700">
                          {msg.file.name}
                        </span>
                        <p className="text-[10px] text-gray-500">
                          {(msg.file.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Resending indicator */}
                  {msg.resending && (
                    <div className="mb-2 text-xs text-orange-600 font-medium bg-orange-50 px-3 py-1.5 rounded-lg inline-flex items-center gap-2">
                      <FaPaperPlane className="text-xs animate-pulse" />
                      Resending to Lexi for review...
                    </div>
                  )}

                  {/* Message Text */}
                  {msg.editing ? (
                    <div className="space-y-3 w-full">
                      <div className="text-xs text-gray-500 mb-1">
                        {msg.type === "bot"
                          ? msg.isTemplate
                            ? "Editing template. After saving, it will be sent back to Lexi for review."
                            : "Editing response"
                          : "Editing your query. After saving, it will be sent to Lexi for a new response."}
                      </div>
                      <textarea
                        rows={msg.type === "user" ? 4 : 8}
                        value={msg.editValue || ""}
                        onChange={(e) => updateEditValue(msg.id, e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-y min-h-[80px] max-h-[400px]"
                        style={{
                          width: '100%',
                          minWidth: '400px',
                          boxSizing: 'border-box'
                        }}
                        autoFocus
                      />
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => saveAndResendEditMessage(msg.id)}
                          className="px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm hover:from-orange-600 hover:to-amber-600 transition-all duration-300 flex items-center gap-2 shadow-md hover:shadow-lg"
                        >
                          {msg.type === "user" ? (
                            <>
                              <FaPaperPlane className="text-xs" />
                              Send
                            </>
                          ) : msg.isTemplate ? (
                            <>
                              <FaPaperPlane className="text-xs" />
                              Save & Resend
                            </>
                          ) : (
                            "Save Changes"
                          )}
                        </button>
                        <button
                          onClick={() => cancelEditMessage(msg.id)}
                          className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 text-sm hover:bg-gray-200 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : msg.streaming ? (
                    <p className="text-gray-800 text-sm whitespace-pre-wrap">
                      {msg.streamBuffer || ""}
                    </p>
                  ) : msg.type === "bot" ? (
                    <>
                      <div
                        className="prose prose-sm max-w-none text-sm"
                        dangerouslySetInnerHTML={{ __html: msg.text }}
                      />
                      {msg.tableHTML && (
                        <div
                          className="prose prose-sm max-w-none text-sm"
                          dangerouslySetInnerHTML={{ __html: msg.tableHTML }}
                        />
                      )}
                    </>
                  ) : (
                    <p className="text-gray-800 text-sm whitespace-pre-wrap">{msg.text}</p>
                  )}

                  {/* Download Buttons for generated files */}
                  {msg.files && msg.files.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <p className="text-xs text-gray-500 font-medium">Generated Files:</p>
                      {msg.files.map((file, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleDownload(file)}
                          className="flex items-center gap-2 text-orange-600 hover:text-orange-700 text-xs font-medium hover:underline bg-orange-50 px-3 py-1.5 rounded-lg w-full justify-between"
                        >
                          <span className="flex items-center gap-2">
                            <FaDownload className="text-xs" />
                            {file.split("/").pop()}
                          </span>
                          <span className="text-[10px] bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded">
                            Download
                          </span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Timestamp */}
                  <p className="text-[10px] text-gray-400 mt-3 text-right">
                    {msg.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* Loading indicator */}
          {loading && (
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <img
                  src={logo}
                  alt="Lexi"
                  className="w-9 h-9 rounded-full"
                />
              </div>
              <div className="bg-gradient-to-r from-orange-50 to-amber-50 px-5 py-4 rounded-2xl border border-orange-200 max-w-2xl">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-sm text-gray-600 italic">
                    Lexi is thinking...
                  </span>
                </div>
              </div>
            </div>
          )}

          <div ref={scrollRef} />
        </div>
      )}

      {/* Chat Input */}
      <div className="border-t border-gray-200 px-6 py-4 bg-white">
        <ChatInput onSend={handleSend} disabled={loading} onPause={handlePause} />
      </div>
    </main>
  );
};

export default LegalAssistant;