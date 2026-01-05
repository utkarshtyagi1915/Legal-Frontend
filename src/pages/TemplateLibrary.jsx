import React, { useEffect, useState } from "react";
import {
  FaFileContract,
  FaUpload,
  FaTrash,
  FaSpinner,
} from "react-icons/fa";
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

    const MAX_FILE_SIZE = 20 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      toast.error("File size must be less than 20 MB");
      e.target.value = "";
      return;
    }

    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
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

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();

      const t = data.template;

      setTemplates((prev) => [
        ...prev,
        {
          id: t.template_id,
          fileName: t.file_name,
          blob: t.blob_name,
          uploadedAt: t.uploaded_at,
          status: t.status,
        },
      ]);

      toast.success("Template uploaded successfully");
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Upload failed");
    } finally {
      e.target.value = "";
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (templateId) => {
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

  /* ================= USE TEMPLATE ================= */
  const handleUseTemplate = async (template) => {
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

        <label className="cursor-pointer bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl flex items-center gap-2">
          <FaUpload />
          Upload
          <input hidden type="file" onChange={handleUpload} />
        </label>
      </div>

      {/* CONTENT */}
      <div className="flex-1 overflow-y-auto px-8 py-8">
        {templates.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-400">
            No templates found
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {templates.map((template) => (
              <div
                key={template.id}
                className="relative bg-white border rounded-2xl p-6 shadow-sm hover:shadow-md flex flex-col justify-between"
              >
                {/* DELETE */}
                <button
                  onClick={() => handleDelete(template.id)}
                  className="cursor-pointer absolute top-4 right-4 text-gray-400 hover:text-red-500"
                >
                  <FaTrash />
                </button>

                <div>
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                    <FaFileContract className="text-orange-600" />
                  </div>

                  {/* FILE NAME */}
                  <h3 className="font-semibold break-all">
                    {template.fileName}
                  </h3>

                  {/* STATUS */}
                  <p className="text-sm text-gray-500 mt-2">
                    Status:{" "}
                    <span
                      className={`font-medium capitalize ${template.status === "active"
                        ? "text-green-600"
                        : template.status === "pending"
                          ? "text-yellow-600"
                          : "text-gray-500"
                        }`}
                    >
                      {template.status}
                    </span>
                  </p>

                  {/* DATE */}
                  <p className="text-xs text-gray-400 mt-1">
                    Uploaded:{" "}
                    {new Date(template.uploadedAt * 1000).toLocaleString()}
                  </p>
                </div>

                {/* USE TEMPLATE */}
                <button
                  onClick={() => handleUseTemplate(template)}
                  disabled={
                    loadingId === template.id ||
                    template.status === "pending"
                  }
                  className={`cursor-pointer mt-6 py-2.5 rounded-xl font-medium transition ${template.status === "pending"
                    ? "bg-gray-300 cursor-not-allowed text-gray-600"
                    : loadingId === template.id
                      ? "bg-orange-300 cursor-not-allowed"
                      : "bg-orange-500 hover:bg-orange-600 text-white"
                    }`}
                >
                  {template.status === "pending" ? (
                    "Pending..."
                  ) : loadingId === template.id ? (
                    <span className="flex items-center justify-center gap-2">
                      <FaSpinner className="animate-spin" />
                      Opening...
                    </span>
                  ) : (
                    "Use Template →"
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplateLibrary;