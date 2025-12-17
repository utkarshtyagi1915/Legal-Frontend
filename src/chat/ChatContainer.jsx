import React, { useState, useRef, useEffect } from "react";
import ChatInput from "./ChatInput";
import { FaRobot } from "react-icons/fa";
import userAvatar from "../assets/userAvatar.png";

const ChatContainer = ({ backendUrl }) => {
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef(null);

  const handleSend = async (msg) => {
    // Add user message
    setMessages((prev) => [
      ...prev,
      { type: "user", text: msg.text, file: msg.file, timestamp: new Date() },
    ]);

    if (!backendUrl) return;

    try {
      const formData = new FormData();
      formData.append("message", msg.text);
      if (msg.file) formData.append("file", msg.file);

      const res = await fetch(backendUrl, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { type: "bot", text: data.reply, timestamp: new Date() },
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          text: "Sorry, something went wrong!",
          timestamp: new Date(),
        },
      ]);
    }
  };

  // Auto-scroll to bottom
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-[500px] w-[400px] border rounded-xl overflow-hidden shadow-lg">
      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex gap-2 ${
              msg.type === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.type === "bot" ? (
              <FaRobot className="text-orange-500 text-xl mt-2 flex-shrink-0" />
            ) : (
              <img src={userAvatar} alt="You" className="w-8 h-8 rounded-full" />
            )}

            <div
              className={`px-4 py-3 rounded-2xl max-w-xs shadow-sm ${
                msg.type === "user"
                  ? "bg-white border border-gray-200"
                  : "bg-gray-50 border border-gray-200"
              }`}
            >
              {msg.file && (
                <p className="text-xs text-orange-600 mb-1">{msg.file.name}</p>
              )}
              <p>{msg.text}</p>
              <p className="text-xs text-gray-400 mt-1 text-right">
                {msg.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      {/* Chat Input */}
      <ChatInput onSend={handleSend} />
    </div>
  );
};

export default ChatContainer;