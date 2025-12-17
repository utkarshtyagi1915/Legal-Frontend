import React, { useState } from "react";
import { FaPaperclip, FaArrowUp, FaTimes } from "react-icons/fa";
 
const ChatInput = ({ onSend }) => {
  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
 
  const handleFileChange = (e) => {
    if (e.target.files.length > 0) setSelectedFile(e.target.files[0]);
  };
 
  const removeFile = () => setSelectedFile(null);
 
  const sendMessage = () => {
    if (!message.trim() && !selectedFile) return;
 
    onSend({
      text: message.trim(),
      file: selectedFile,
    });
 
    setMessage("");
    setSelectedFile(null);
  };
 
  // Enter = send, Shift+Enter = newline
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };
 
  return (
    <div className="bg-white">
      {/* File preview */}
      {selectedFile && (
        <div className="mb-2 inline-flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-full px-3 py-1 text-xs text-orange-600">
          <span className="truncate max-w-[200px]">
            {selectedFile.name}
          </span>
          <button
            onClick={removeFile}
            className="hover:text-orange-800"
          >
            <FaTimes size={12} />
          </button>
        </div>
      )}
 
      {/* Input row */}
      <div className="flex items-end gap-3">
        {/* Textarea */}
        <textarea
          rows={1}
          placeholder="Lexi – Your Legal Research Assistant"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 resize-none rounded-2xl border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 placeholder-gray-400"
        />
 
        {/* File upload */}
        <label className="cursor-pointer text-gray-500 hover:text-gray-700">
          <FaPaperclip className="text-lg" />
          <input type="file" hidden onChange={handleFileChange} />
        </label>
 
        {/* Send button */}
        <button
          onClick={sendMessage}
          className="bg-orange-500 hover:bg-orange-600 text-white p-2.5 rounded-full shadow-md transition"
        >
          <FaArrowUp />
        </button>
      </div>
    </div>
  );
};
 
export default ChatInput;
 