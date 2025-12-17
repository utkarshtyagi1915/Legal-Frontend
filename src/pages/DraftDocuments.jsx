import React, { useState, useRef, useEffect } from "react";
import {
  FaMagic,
  FaGavel,
  FaExclamationCircle,
  FaFileContract,
  FaPenFancy,
  FaDownload,
  FaFilePdf, 
  FaFileWord,
} from "react-icons/fa";
import logo from "../../public/logo.png";
import ChatInput from "../chat/ChatInput";
import profile from "../assets/profile.png";

function formatBackendText(raw = "") {
    // ### Heading → <h3>
    // match lines starting with ### and capture the rest of the line
    const withHeadings = raw.replace(
        /^###\s*(.*)$/gm,
        "<h3 class='text-xl font-semibold text-gray-800 mt-4 mb-2'>$1</h3>"
    );

    // **bold** → <strong>
    const withBold = withHeadings.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

    // \n or \n1, \n2 … → <br/>
    const withBreaks = withBold.replace(/\\n\d*/g, "<br />");

    return withBreaks;
}

function getFileIcon(fileName = "") {
  const ext = fileName.split(".").pop().toLowerCase();
  if (ext === "pdf") return <FaFilePdf className="text-red-500 text-lg" />;
  if (ext === "doc" || ext === "docx") return <FaFileWord className="text-blue-500 text-lg" />;
  return null;
}

const DraftDocuments = () => {
  const [messages, setMessages] = useState([]);
  const [selected, setSelected] = useState(null);
  const [threadId, setThreadId] = useState(null);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  const buttons = [
    { label: "Legal Notice", icon: <FaGavel /> },
    { label: "Complaint", icon: <FaExclamationCircle /> },
    { label: "Petition", icon: <FaFileContract /> },
    { label: "Affidavit", icon: <FaPenFancy /> },
  ];

  const handleSend = async (msg) => {
    setMessages((prev) => [
      ...prev,
      { type: "user", text: msg.text, file: msg.file, timestamp: new Date() },
    ]);

    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/generate-legal-template`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: msg.text, thread_id: threadId }),
        }
      );

      if (!res.ok) throw new Error("Failed to generate template");
      const data = await res.json();
      if (data.thread_id) setThreadId(data.thread_id);

      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          // ✅ format backend text for bold + line breaks
          text: formatBackendText(data.template || "No response from backend."),
          files: data.pdf_files || [],
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          text: formatBackendText(
            "Error: Unable to generate template. Please try again."
          ),
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleDownload = async (file) => {
    const response = await fetch(
      `https://92tg3qvw-8000.inc1.devtunnels.ms/files/${file}`
    );
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = file;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <main className="flex flex-col w-[47rem] h-full bg-white rounded-l-4xl shadow-[0_15px_40px_rgba(0,0,0,0.2)] overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between p-4 shadow-sm">
        <div className="flex items-center space-x-2">
          <img src={logo} alt="Logo" className="w-8 h-8 rounded-full object-cover" />
          <h1 className="text-lg font-semibold text-gray-800">Legal Assistance</h1>
        </div>
      </header>

      {/* Main Section */}
      {messages.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center overflow-auto relative">
          <div className="bg-[#E3E3E3] inline-flex items-center justify-center gap-2 text-gray-500 px-4 py-2 rounded-full mb-5">
            <span className="text-orange-500 flex items-center gap-1 cursor-pointer hover:underline font-semibold">
              <FaMagic className="inline-block" /> Upgrade
            </span>
            <span className="text-gray-700">free plan to full access</span>
          </div>

          <div className="w-16 h-16 mx-auto mb-4">
            <img src={logo} alt="Lexi Logo" className="w-full h-full object-contain" />
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            What do you want to draft today?
          </h2>

          <div className="flex gap-4 flex-wrap justify-center">
            {buttons.map((btn) => (
              <button
                key={btn.label}
                onClick={() => setSelected(btn.label)}
                className={`flex items-center gap-2 border-2 px-4 py-2 rounded-full cursor-pointer transition ${selected === btn.label
                    ? "border-orange-500 text-orange-500"
                    : "border-gray-300 text-gray-700 hover:border-orange-500 hover:text-orange-500"
                  }`}
              >
                <span className="text-orange-500">{btn.icon}</span>
                {btn.label}
              </button>
            ))}
          </div>

          {selected && (
            <div className="absolute bottom-4 left-4">
              <button className="flex items-center gap-2 border-2 border-orange-500 text-orange-500 px-4 py-2 rounded-full">
                {buttons.find((b) => b.label === selected)?.icon}
                {selected}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-2 ${msg.type === "user" ? "justify-end" : "justify-start"
                }`}
            >
              {msg.type === "bot" && (
                <img
                  src={logo}
                  alt="Lexi"
                  className="w-8 h-8 rounded-full mt-2 flex-shrink-0 object-cover"
                />
              )}
              {msg.type === "user" && (
                <img src={profile} alt="You" className="w-8 h-8 rounded-full" />
              )}

              <div
                className={`px-4 py-3 rounded-2xl max-w-lg ${msg.type === "user"
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

                {/* ✅ Render formatted backend text */}
                {msg.type === "bot" ? (
                  <p
                    className="whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{ __html: msg.text }}
                  />
                ) : (
                  <p>{msg.text}</p>
                )}

                {/* ✅ PDF download links */}
                {msg.files && msg.files.length > 0 && (
                  <div className="mt-3 space-y-1">
                    {msg.files.map((file, i) => (
                      <button
                        key={i}
                        onClick={() => handleDownload(file)}
                        className="cursor-pointer flex items-center gap-2 text-orange-600 underline text-sm hover:text-orange-800"
                      >
                        <FaDownload className="text-base" />
                        Download {file}
                      </button>
                    ))}
                  </div>
                )}

                <p className="text-xs text-gray-400 mt-1 text-right">
                  {msg.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="text-gray-500 italic text-sm mt-2">Lexi is typing...</div>
          )}
          <div ref={scrollRef} />
        </div>
      )}

      <ChatInput onSend={handleSend} />
    </main>
  );
};

export default DraftDocuments;