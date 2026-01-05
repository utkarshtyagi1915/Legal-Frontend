import React, { useEffect, useState } from "react";
import { FaFileContract, FaUpload, FaTrash, FaSpinner, FaLock, FaCheckCircle, FaClock, FaTimesCircle } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
 
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
 
const TemplateLibrary = () => {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
 
  /* ================= FETCH PRIVATE TEMPLATES ================= */
  const fetchTemplates = async () => {
    try {
      const token = localStorage.getItem("authToken");
 
      if (!token) {
        toast.error("You are not logged in");
        return;
      }
 
      const res = await fetch(`${BACKEND_URL}/templates/list`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
 
      if (!res.ok) throw new Error("Failed to fetch templates");
 
      const data = await res.json();
 
      const files = data.templates.map((t) => ({
        id: t.template_id,
        fileName: t.file_name,
        blob: t.blob_name,
        uploadedAt: t.uploaded_at,
        status: t.status,
        rejectionReason: t.rejection_reason || null, // Include rejection reason if available
      }));
 
      setTemplates(files);
    } catch (err) {
      console.error("Fetch templates error:", err);
      toast.error("Failed to load templates");
    }
  };
 
  useEffect(() => {
    fetchTemplates();
  }, []);
 
  /* ================= UPLOAD ================= */
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
 
    // File type validation
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
   
    if (!allowedTypes.includes(file.type)) {
      toast.error("Please upload PDF or Word documents only");
      e.target.value = "";
      return;
    }
 
    const MAX_FILE_SIZE = 20 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      toast.error("File size must be less than 20 MB");
      e.target.value = "";
      return;
    }
 
    // Show upload progress
    const uploadToast = toast.info("Uploading template...", {
      autoClose: false,
      closeButton: false
    });
 
    try {
      const token = localStorage.getItem("authToken");
 
      if (!token) {
        toast.dismiss(uploadToast);
        toast.error("You are not logged in");
        return;
      }
 
      const formData = new FormData();
      formData.append("file", file);
 
      const res = await fetch(`${BACKEND_URL}/templates/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
 
      toast.dismiss(uploadToast);
 
      if (!res.ok) throw new Error("Upload failed");
 
      const data = await res.json();
      const t = data.template;
 
      setTemplates((prev) => [
        {
          id: t.template_id,
          fileName: t.file_name,
          blob: t.blob_name,
          uploadedAt: t.uploaded_at,
          status: t.status,
          rejectionReason: null,
        },
        ...prev, // Add new template at the beginning
      ]);
 
      toast.success("Template uploaded! Awaiting admin approval.");
    } catch (err) {
      toast.dismiss(uploadToast);
      console.error("Upload error:", err);
      toast.error("Upload failed");
    } finally {
      e.target.value = "";
    }
  };
 
  /* ================= DELETE ================= */
  const handleDelete = async (templateId) => {
    // Confirm deletion
    if (!window.confirm("Are you sure you want to delete this template?")) {
      return;
    }
 
    try {
      const token = localStorage.getItem("authToken");
 
      if (!token) {
        toast.error("Not authenticated");
        return;
      }
 
      const res = await fetch(`${BACKEND_URL}/templates/${templateId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
 
      if (!res.ok) {
        toast.error("Failed to delete template");
        return;
      }
 
      setTemplates((prev) => prev.filter((t) => t.id !== templateId));
      toast.success("Template deleted");
    } catch (error) {
      console.error("DELETE ERROR:", error);
      toast.error("Delete failed");
    }
  };
 
  /* ================= USE TEMPLATE - Updated with validation ================= */
  const handleUseTemplate = async (template) => {
    // Prevent using pending/rejected templates
    if (template.status === "pending") {
      toast.warning("This template is pending admin approval");
      return;
    }
   
    if (template.status === "rejected") {
      toast.error("This template has been rejected and cannot be used");
      return;
    }
 
    try {
      setLoadingId(template.id);
 
      navigate(`/template-view/${template.id}`, {
        state: {
          templateMeta: {
            id: template.id,
            fileName: template.fileName,
            blob: template.blob,
            uploadedAt: template.uploadedAt,
            status: template.status,
          },
        },
      });
    } catch (err) {
      toast.error("Failed to open template");
    } finally {
      setLoadingId(null);
    }
  };
 
  /* ================= GET STATUS BADGE ================= */
  const getStatusBadge = (status) => {
    const badges = {
      approved: {
        bg: "bg-green-100",
        text: "text-green-700",
        border: "border-green-300",
        icon: <FaCheckCircle className="text-xs" />,
        label: "Approved"
      },
      active: {
        bg: "bg-green-100",
        text: "text-green-700",
        border: "border-green-300",
        icon: <FaCheckCircle className="text-xs" />,
        label: "Active"
      },
      pending: {
        bg: "bg-yellow-100",
        text: "text-yellow-700",
        border: "border-yellow-300",
        icon: <FaClock className="text-xs" />,
        label: "Pending Review"
      },
      rejected: {
        bg: "bg-red-100",
        text: "text-red-700",
        border: "border-red-300",
        icon: <FaTimesCircle className="text-xs" />,
        label: "Rejected"
      }
    };
    return badges[status] || badges.pending;
  };
 
  return (
    <div className="bg-white h-screen flex flex-col rounded-l-3xl shadow-xl">
      <ToastContainer position="bottom-center" autoClose={2000} />
 
      {/* HEADER */}
      <div className="px-8 py-6 border-b flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Template Library</h1>
          <p className="text-sm text-gray-500 mt-1">
            Your uploaded document templates
          </p>
        </div>
 
        <label className="cursor-pointer bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-colors">
          <FaUpload />
          Upload Template
          <input
            hidden
            type="file"
            onChange={handleUpload}
            accept=".pdf,.doc,.docx"
          />
        </label>
      </div>
 
      {/* CONTENT */}
      <div className="flex-1 overflow-y-auto px-8 py-8">
        {templates.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <FaFileContract className="text-6xl mb-4 opacity-20" />
            <p className="text-lg font-medium">No templates found</p>
            <p className="text-sm mt-2">Upload a template to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => {
              const statusBadge = getStatusBadge(template.status);
              const isUsable = template.status === "approved" || template.status === "active";
              const isPending = template.status === "pending";
              const isRejected = template.status === "rejected";
 
              return (
                <div
                  key={template.id}
                  className="relative bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  {/* DELETE BUTTON */}
                  <button
                    onClick={() => handleDelete(template.id)}
                    className="cursor-pointer absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                    title="Delete template"
                  >
                    <FaTrash />
                  </button>
 
                  <div>
                    {/* ICON */}
                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                      <FaFileContract className="text-orange-600 text-xl" />
                    </div>
 
                    {/* FILE NAME */}
                    <h3 className="font-semibold text-gray-800 break-all pr-6">
                      {template.fileName}
                    </h3>
 
                    {/* STATUS BADGE */}
                    <div className="mt-3 mb-2">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${statusBadge.bg} ${statusBadge.text} ${statusBadge.border}`}>
                        {statusBadge.icon}
                        {statusBadge.label}
                      </span>
                    </div>
 
                    {/* REJECTION REASON (if rejected) */}
                    {isRejected && template.rejectionReason && (
                      <div className="mt-2 p-2 bg-red-50 rounded-lg border border-red-200">
                        <p className="text-xs text-red-600">
                          <span className="font-semibold">Reason:</span> {template.rejectionReason}
                        </p>
                      </div>
                    )}
 
                    {/* DATE */}
                    <p className="text-xs text-gray-400 mt-2">
                      Uploaded: {new Date(template.uploadedAt * 1000).toLocaleDateString()} at{" "}
                      {new Date(template.uploadedAt * 1000).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
 
                  {/* USE TEMPLATE BUTTON */}
                  <button
                    onClick={() => isUsable && handleUseTemplate(template)}
                    disabled={!isUsable || loadingId === template.id}
                    className={`mt-6 py-2.5 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                      isUsable
                        ? loadingId === template.id
                          ? "bg-orange-300 cursor-not-allowed text-white"
                          : "bg-orange-500 hover:bg-orange-600 text-white cursor-pointer transform hover:scale-[1.02]"
                        : isPending
                        ? "bg-yellow-50 border border-yellow-200 text-yellow-700 cursor-not-allowed"
                        : "bg-red-50 border border-red-200 text-red-700 cursor-not-allowed"
                    }`}
                  >
                    {loadingId === template.id ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        Opening...
                      </>
                    ) : isUsable ? (
                      <>Use Template →</>
                    ) : isPending ? (
                      <>
                        <FaClock className="text-sm" />
                        Awaiting Approval
                      </>
                    ) : (
                      <>
                        <FaLock className="text-sm" />
                        Template Rejected
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
 
export default TemplateLibrary;
 