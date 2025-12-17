import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  FaMagic,
  FaFilePdf,
  FaFileWord,
  FaDownload,
  FaCopy,
} from "react-icons/fa";
import { toast } from "react-toastify";
import logo from "../../public/logo.png";
import ChatInput from "../chat/ChatInput";
import profile from "../assets/profile.png";
import jsPDF from "jspdf";

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
  text = text.replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gi, "\n“$1”\n");

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
      `<pre class="bg-slate-900 text-slate-100 p-4 rounded-xl my-4 overflow-x-auto text-sm font-mono border border-slate-700"><code class="language-${
        lang || "text"
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

const LegalAssistant = () => {
  const location = useLocation();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);
  const threadRef = useRef(null); // Stores current thread_id

  const backendUrl = `${import.meta.env.VITE_BACKEND_URL}/query`;
  const downloadBaseUrl = `${import.meta.env.VITE_BACKEND_URL}/files/`;
  const API_BASE = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
  if (location.state?.newChat) {
    // FULL RESET
    threadRef.current = null;
    setMessages([]);
    setLoading(false);

    // Clear navigation state so it doesn't re-trigger
    window.history.replaceState({}, document.title);

    toast.info("Started a new chat");
  }
}, [location.key]);

  // Restore thread from sidebar click
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

      const formatted = data.map((msg) => ({
        type: msg.sender === "user" ? "user" : "bot",
        text:
          msg.sender === "user"
            ? msg.message
            : formatBackendText(msg.message),
        files: msg.files || [],
        timestamp: new Date(msg.created_at),
      }));

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
}, [location.state]);


  // Auto-save chat to history whenever a user message is sent
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
      if (history.length > 20) history.pop(); // Limit to 20 chats

      localStorage.setItem("lexi_chat_history", JSON.stringify(history));
    }
  }, [messages]);

  const handleSend = async (msg) => {
    if (!msg.text && !msg.file) return;

    // Add user message
    const userMessage = {
      type: "user",
      text: msg.text || "",
      file: msg.file || null,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("question", msg.text || "");
      if (msg.file) formData.append("user_file", msg.file);

      if (threadRef.current) {
        formData.append("thread_id", threadRef.current);
      }

      const res = await fetch(backendUrl, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`, // pass token
        },
      });

      const data = await res.json();

      // Save thread_id on first response
      if (!threadRef.current && data.thread_id) {
        threadRef.current = data.thread_id;
      }

      let formattedText = "";
      let files = [];

      if (data.answer) {
        formattedText = formatBackendText(data.answer);
      } else if (data.template) {
        formattedText = formatBackendText(data.template);
        files = data.pdf_files || [];
      } else if (data.classification) {
        formattedText = `
          <h3>Document Analysis Complete</h3>
          <p><strong>File:</strong> ${data.filename || "Unknown"}</p>
          <p><strong>Type:</strong> ${data.classification?.type || "N/A"}</p>
          <p><strong>Risk Level:</strong> ${data.overall_risk || "N/A"}</p>
          ${
            data.high_risk_pdf
              ? `<p><a href="${data.high_risk_pdf}" target="_blank" class="text-blue-600 underline">Download Risk Report (PDF)</a></p>`
              : "<p>No high-risk clauses detected.</p>"
          }
        `;
        if (data.high_risk_pdf) files = [data.high_risk_pdf];
      } else {
        formattedText = "<p>No response from server.</p>";
      }

      // Add bot message
      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          text: formattedText,
          files,
          timestamp: new Date(),
        },
      ]);
    } catch (err) {
      console.error("Send error:", err);
      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          text: "Sorry, something went wrong. Please try again.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
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

  // Auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <main className="flex rounded-l-4xl shadow-[0_15px_40px_rgba(0,0,0,0.2)] flex-col w-full h-screen bg-white shadow-2xl overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Lexi" className="w-10 h-10 rounded-full" />
          <h1 className="text-xl font-bold text-gray-800">
            Lexi – Your Legal AI Assistant
          </h1>
        </div>
      </header>

      {/* Empty State */}
      {messages.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
          <div className="bg-gray-100 p-4 rounded-2xl mb-6">
            <FaMagic className="text-5xl text-orange-500" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Lexi – Your All-in-One Legal Assistant
          </h2>
          <p className="text-gray-600 max-w-md">
            Ask legal questions, analyze contracts, draft documents, or start
            from a template.
          </p>
        </div>
      ) : (
        /* Chat Messages */
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex gap-3 ${
                msg.type === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.type === "bot" && (
                <img
                  src={logo}
                  alt="Lexi"
                  className="w-8 h-8 rounded-full flex-shrink-0"
                />
              )}
              {msg.type === "user" && (
                <img
                  src={profile}
                  alt="You"
                  className="w-8 h-8 rounded-full flex-shrink-0"
                />
              )}

              <div
                className={`max-w-2xl ${
                  msg.type === "user" ? "order-first" : ""
                }`}
              >
                <div
                  className={`relative px-4 py-3 rounded-xl shadow-sm border ${
                    msg.type === "user"
                      ? "bg-orange-50 border-orange-200"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  {/* Action Buttons for Bot Messages - Inside the box, top right */}
                  {msg.type === "bot" && (
                    <div className="flex justify-end gap-2 mb-2 pb-2">
                      <button
                        onClick={() => {
                          // Strip HTML tags for plain text copy
                          const plainText = htmlToCleanText(msg.text);
                          navigator.clipboard.writeText(plainText);
                          toast.success("Copied to clipboard!");
                        }}
                        className="p-1.5 hover:bg-gray-200 rounded-md transition-colors cursor-pointer group"
                        title="Copy to clipboard"
                      >
                        <FaCopy className="text-gray-500 group-hover:text-orange-500 text-sm" />
                      </button>
                      <button
  onClick={() => {
    const plainText = htmlToCleanText(msg.text);

    const doc = new jsPDF({
      orientation: "p",
      unit: "mm",
      format: "a4",
    });

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
    toast.success("PDF downloaded successfully!");
  }}
  className="p-1.5 hover:bg-gray-200 rounded-md transition-colors cursor-pointer group"
  title="Download as PDF"
>
  <FaFilePdf className="text-red-500 group-hover:text-orange-500 text-sm" />
</button>

                    </div>
                  )}

                  {/* File Preview */}
                  {msg.file && (
                    <div className="flex items-center gap-2 mb-2 text-xs">
                      {getFileIcon(msg.file.name)}
                      <span className="text-orange-700 font-medium">
                        {msg.file.name}
                      </span>
                    </div>
                  )}

                  {/* Message Text */}
                  {msg.type === "bot" ? (
                    <div
                      className="prose prose-sm max-w-none text-sm"
                      dangerouslySetInnerHTML={{ __html: msg.text }}
                    />
                  ) : (
                    <p className="text-gray-800 text-sm">{msg.text}</p>
                  )}

                  {/* Download Buttons for generated files */}
                  {msg.files && msg.files.length > 0 && (
                    <div className="mt-3 space-y-1">
                      {msg.files.map((file, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleDownload(file)}
                          className="flex items-center gap-2 text-orange-600 hover:text-orange-700 text-xs font-medium hover:underline"
                        >
                          <FaDownload className="text-xs" /> Download{" "}
                          {file.split("/").pop()}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Timestamp */}
                  <p className="text-[10px] text-gray-400 mt-2 text-right">
                    {msg.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-3">
              <img src={logo} alt="Lexi" className="w-8 h-8 rounded-full" />
              <div className="bg-gray-100 px-4 py-3 rounded-xl">
                <span className="text-gray-600 italic text-sm">
                  Lexi is thinking...
                </span>
              </div>
            </div>
          )}

          <div ref={scrollRef} />
        </div>
      )}

      {/* Chat Input */}
      <div className="border-t border-gray-200 px-6 py-4 bg-white">
        <ChatInput onSend={handleSend} disabled={loading} />
      </div>
    </main>
  );
};

export default LegalAssistant;
