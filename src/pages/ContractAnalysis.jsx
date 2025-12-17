import React, { useState, useRef, useEffect } from "react";
import { FaMagic, FaPlus, FaFilePdf, FaFileWord } from "react-icons/fa";
import logo from "../../public/logo.png";
import ChatInput from "../chat/ChatInput";
import profile from "../assets/profile.png";
 
// Format text coming from backend
function formatBackendText(raw = "") {
  if (!raw) return "";
  // ### Heading → <h3>
  const withHeadings = raw.replace(
    /^###\s*(.*)$/gm,
    "<h3 class='text-xl font-semibold text-gray-800 mt-4 mb-2'>$1</h3>"
  );
  // **bold** → <strong>
  const withBold = withHeadings.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  // Line breaks
  const withBreaks = withBold.replace(/\\n\d*/g, "<br />");
  return withBreaks;
}
 
function getFileIcon(fileName = "") {
  const ext = fileName.split(".").pop().toLowerCase();
  if (ext === "pdf") return <FaFilePdf className="text-red-500 text-lg" />;
  if (ext === "doc" || ext === "docx") return <FaFileWord className="text-blue-500 text-lg" />;
  return null;
}
 
const ContractAnalysis = () => {
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef(null);
  const [loading, setLoading] = useState(false);
 
  const backendUrl = `${import.meta.env.VITE_BACKEND_UR}/upload`;
  async function fetchWithTimeout(resource, options = {}) {
  const { timeout = 300000 } = options; // default 5 min
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  const response = await fetch(resource, {
    ...options,
    signal: controller.signal,
  });
  clearTimeout(id);
  return response;
 }
  const handleSend = async (msg) => {
    // Add user message
    setMessages((prev) => [
      ...prev,
      { type: "user", text: msg.text, file: msg.file, timestamp: new Date() },
    ]);
 
    setLoading(true);
 
    try {
      const formData = new FormData();
      if (msg.file) formData.append("file", msg.file); // ✅ must be `file`
 
      const res = await fetchWithTimeout(backendUrl, {
  method: "POST",
  body: formData,
  timeout: 300000 // 5 minutes
});
 
      if (!res.ok) throw new Error("Failed to upload file");
      const data = await res.json();
 
      // ✅ Construct formatted response
      const formattedResponse = `
<h3>📄 Document Processed</h3>
<p><strong>File:</strong> ${data.filename}</p>
<p><strong>Classification:</strong> ${data.classification?.type || "Unknown"}</p>
<p><strong>Overall Risk:</strong> ${data.overall_risk}</p>
        ${
          data.high_risk_pdf
            ? `<p><a href="${data.high_risk_pdf}" target="_blank" class="text-blue-600 underline">Download High-Risk Clauses PDF</a></p>`
            : "<p>No high-risk clauses found.</p>"
        }
      `;
 
      setMessages((prev) => [
        ...prev,
        { type: "bot", text: formattedResponse, timestamp: new Date() },
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { type: "bot", text: "❌ Error uploading file.", timestamp: new Date() },
      ]);
    } finally {
      setLoading(false);
    }
  };
 
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
 
  return (
<main className="flex flex-col w-[47rem] h-full bg-white rounded-l-4xl shadow-[0_15px_40px_rgba(0,0,0,0.2)] overflow-hidden">
      {/* Header */}
<header className="flex items-center justify-between p-4 shadow-sm">
<div className="flex items-center space-x-2">
<img src={logo} alt="Logo" className="w-8 h-8 rounded-full object-cover" />
<h1 className="text-lg font-semibold text-gray-800">Legal Assistance</h1>
</div>
</header>
 
      {messages.length === 0 ? (
<div className="flex-1 flex items-center justify-center p-6 text-center overflow-auto">
<div className="bg-orange-50 rounded-2xl shadow-md p-8 w-full flex flex-col items-center">
<FaMagic className="text-orange-500 text-5xl mb-4" />
<h2 className="text-2xl font-bold text-gray-800 mb-2">
              Drag & Drop Contracts Here
</h2>
<span className="text-sm text-gray-600 mb-6">
              Supported Formats: <strong>PDF, DOCX, DOC</strong>
</span>
 
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              className="hidden"
              id="fileUpload"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) handleSend({ text: "", file });
              }}
            />
 
            <button
              type="button"
              onClick={() => document.getElementById("fileUpload").click()}
              className="cursor-pointer bg-orange-500 hover:bg-orange-600 text-white
                p-4 rounded-xl transition-colors flex items-center justify-center"
>
<FaPlus className="text-xl" />
</button>
</div>
</div>
      ) : (
<div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4">
          {messages.map((msg, idx) => (
<div
              key={idx}
              className={`flex gap-2 ${
                msg.type === "user" ? "justify-end" : "justify-start"
              }`}
>
              {msg.type === "bot" && (
<img src={logo} alt="Lexi" className="w-8 h-8 rounded-full mt-2 object-cover" />
              )}
              {msg.type === "user" && (
<img src={profile} alt="You" className="w-8 h-8 rounded-full" />
              )}
 
              <div
                className={`px-4 py-3 rounded-2xl max-w-lg ${
                  msg.type === "user"
                    ? "bg-white border border-gray-200"
                    : "bg-gray-50 border border-gray-200"
                }`}
>
                {msg.file && (
<div className="flex items-center gap-2 mb-1">
                    {getFileIcon(msg.file.name)}
<span className="text-sm text-orange-600">{msg.file.name}</span>
</div>
                )}
 
                {msg.type === "bot" ? (
<div
                    className="whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{ __html: formatBackendText(msg.text) }}
                  />
                ) : (
<p>{msg.text}</p>
                )}
 
                <p className="text-xs text-gray-400 mt-1 text-right">
                  {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
</p>
</div>
</div>
          ))}
 
          {loading && (
<div className="text-gray-500 italic text-sm mt-2">Bot is analyzing...</div>
          )}
<div ref={scrollRef} />
</div>
      )}
 
      {/* Chat Input */}
<ChatInput onSend={handleSend} />
</main>
  );
};
 
export default ContractAnalysis;