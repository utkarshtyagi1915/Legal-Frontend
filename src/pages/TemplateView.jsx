import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaDownload,
  FaPrint,
  FaSave,
  FaEdit,
  FaEye,
} from "react-icons/fa";
import { useQuill } from "react-quilljs";
import { jsPDF } from "jspdf";
import { toast, ToastContainer } from "react-toastify";
import html2canvas from "html2canvas";

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
  const { state } = useLocation();
  const { template } = state || {};

  const [content, setContent] = useState("");
  const [isEditing, setIsEditing] = useState(true);

  const { quill, quillRef } = useQuill({
    theme: "snow",
    modules: quillModules,
  });

  /* ================= LOAD CONTENT ================= */
  useEffect(() => {
    if (!template || !quill) return;

    const saved = localStorage.getItem(`draft-${template.filename}`);
    const initialContent = saved || template.content || "";

    setContent(initialContent);
    quill.root.innerHTML = initialContent;

    quill.on("text-change", () => {
      setContent(quill.root.innerHTML);
    });
  }, [template, quill]);

  /* ================= SAVE DRAFT ================= */
  const handleSaveDraft = () => {
    localStorage.setItem(`draft-${template.filename}`, content);
    toast.success("Draft saved successfully");
  };

  /* ================= DOWNLOAD PDF (FIXED) ================= */
  const handleDownloadPDF = async () => {
    const temp = document.createElement("div");

    temp.className = "ql-editor";
    temp.innerHTML = content;

    // A4 width @ 96 DPI
    temp.style.width = "794px";
    temp.style.padding = "40px";
    temp.style.fontSize = "14px";
    temp.style.lineHeight = "1.6";
    temp.style.fontFamily = "Arial";
    temp.style.background = "#ffffff";

    document.body.appendChild(temp);

    const canvas = await html2canvas(temp, {
      scale: 2, // HIGH QUALITY
      useCORS: true,
      backgroundColor: "#ffffff",
    });

    document.body.removeChild(temp);

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "pt", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position -= pageHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`${template.title || "document"}.pdf`);
  };

  /* ================= PRINT ================= */
  const handlePrint = () => {
    const win = window.open("", "_blank");
    win.document.write(`
      <html>
        <head>
          <style>
            body {
              font-family: Arial;
              padding: 40px;
              line-height: 1.6;
            }
            .ql-editor {
              max-width: 800px;
              margin: auto;
            }
          </style>
        </head>
        <body>
          <div class="ql-editor">
            ${content}
          </div>
        </body>
      </html>
    `);
    win.document.close();
    win.print();
  };

  if (!template) return <div>Template not found</div>;

  return (
    <div className="bg-gray-100 h-screen flex flex-col rounded-l-4xl shadow-xl">
      <ToastContainer position="bottom-center" />

      {/* ================= TOOLBAR ================= */}
      <div className="flex justify-between items-center px-6 py-3 border-b bg-white">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2"
        >
          <FaArrowLeft /> Back
        </button>

        <div className="flex gap-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 bg-blue-100 rounded flex items-center gap-2"
          >
            {isEditing ? <FaEye /> : <FaEdit />}
            {isEditing ? "View" : "Edit"}
          </button>

          {isEditing && (
            <button
              onClick={handleSaveDraft}
              className="px-4 py-2 bg-purple-100 rounded flex items-center gap-2"
            >
              <FaSave /> Save
            </button>
          )}

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

      {/* ================= CONTENT ================= */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-[1120px] bg-white shadow-lg rounded-md min-h-[1123px]">
          {isEditing ? (
            <div
              ref={quillRef}
              className="min-h-[1123px]"
              style={{
                padding: "40px",
                fontSize: "14px",
                lineHeight: "1.6",
              }}
            />
          ) : (
            <div
              className="ql-editor p-10"
              style={{
                fontSize: "14px",
                lineHeight: "1.6",
              }}
              dangerouslySetInnerHTML={{ __html: content }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TemplateView;