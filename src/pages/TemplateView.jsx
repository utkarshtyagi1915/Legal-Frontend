import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaDownload,
  FaPrint,
  FaSave,
} from "react-icons/fa";
import { useQuill } from "react-quilljs";
import { jsPDF } from "jspdf";
import { toast, ToastContainer } from "react-toastify";

import "quill/dist/quill.snow.css";
import "react-toastify/dist/ReactToastify.css";

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ align: [] }],
    ["link"],
    ["clean"],
  ],
};

const TemplateView = () => {
  const navigate = useNavigate();
  const { templateId } = useParams();

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const [template, setTemplate] = useState(null);
  const [content, setContent] = useState("");
  const [isEditing] = useState(true);

  const { quill, quillRef } = useQuill({
    theme: "snow",
    modules: quillModules,
  });

  // 🔥 1️⃣ LOAD FROM BACKEND — FIRST useEffect
  // 1️⃣ LOAD BACKEND IMMEDIATELY (DO NOT WAIT FOR quill)
useEffect(() => {
  console.log("🌀 useEffect 1: backend loader triggered");
  console.log(" - templateId =", templateId);

  if (!templateId) {
    console.log("❌ templateId missing");
    return;
  }

  const loadBackend = async () => {
    try {
      const token = localStorage.getItem("authToken");
      console.log("🔑 token =", token);

      const url = `${BACKEND_URL}/templates/view/${templateId}`;
      console.log("🌍 Fetching:", url);

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("📡 Backend status:", res.status);

      const data = await res.json();
      console.log("📥 Backend JSON:", data);

      setTemplate({
        id: templateId,
        filename: data.file_name,
        content: data.content,
      });

      setContent(data.content);

      console.log("✔ Template loaded into state");

    } catch (err) {
      console.log("❌ Backend fetch failed:", err);
      toast.error("Failed to load");
    }
  };

  loadBackend();
}, [templateId]);



// 2️⃣ LOAD INTO QUILL WHEN BOTH (template + quill) ARE READY
useEffect(() => {
  console.log("🌀 useEffect 2: quill loader");
  console.log(" - template =", template);
  console.log(" - quill ready =", !!quill);

  if (!template || !quill) return;

  const saved = localStorage.getItem(`draft-${template.filename}`);
  const initial = saved || template.content;

  console.log("📝 Loading content into quill");

  quill.clipboard.dangerouslyPasteHTML(initial);
  setContent(initial);

  const handler = () => setContent(quill.root.innerHTML);

  quill.on("text-change", handler);

  return () => quill.off("text-change", handler);
}, [template, quill]);



  // 🔥  SAVE to backend
  const handleSaveDraft = async () => {
    const token = localStorage.getItem("authToken");

    const formData = new FormData();
    formData.append("content", content);

    const res = await fetch(`${BACKEND_URL}/templates/save/${template.id}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    if (res.ok) toast.success("Template saved!");
    else toast.error("Save failed");
  };



  // 🔥  DOWNLOAD PDF
  const handleDownloadPDF = async () => {
    const pdf = new jsPDF("p", "pt", "a4");

    const wrapper = document.createElement("div");
    wrapper.innerHTML = content;

    wrapper.style.width = "595px";
    wrapper.style.padding = "40px";
    wrapper.style.fontSize = "12px";
    wrapper.style.lineHeight = "1.6";
    wrapper.style.fontFamily = "Times New Roman";

    await pdf.html(wrapper, {
      x: 0,
      y: 0,
      width: 515,
      windowWidth: 595,
      html2canvas: { scale: 1, useCORS: true },
      callback: (doc) => {
        doc.save(`${template?.filename || "document"}.pdf`);
      },
    });
  };



  // 🔥  PRINT
  const handlePrint = () => {
    const win = window.open("", "_blank");
    win.document.write(`
      <html><body style="padding:40px; line-height:1.6;">
        ${content}
      </body></html>
    `);
    win.document.close();
    win.print();
  };


  return (
    <div className="bg-gray-100 h-screen flex flex-col rounded-l-4xl shadow-xl">
      <ToastContainer position="bottom-center" />

      {/* Header */}
      <div className="flex justify-between items-center px-6 py-3 border-b bg-white">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2">
          <FaArrowLeft /> Back
        </button>

        <div className="flex gap-2">
          <button
            onClick={handleSaveDraft}
            className="px-4 py-2 bg-purple-100 rounded flex items-center gap-2"
          >
            <FaSave /> Save
          </button>

          <button
            onClick={handleDownloadPDF}
            className="px-4 py-2 bg-green-100 rounded flex items-center gap-2"
          >
            <FaDownload /> Download
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-orange-100 rounded flex items-center gap-2"
          >
            <FaPrint /> Print
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-[1120px] bg-white shadow-lg rounded-md min-h-[1123px]">
          <div
            ref={quillRef}
            className="min-h-[1123px]"
            style={{
              padding: "40px",
              fontSize: "14px",
              lineHeight: "1.6",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default TemplateView;
