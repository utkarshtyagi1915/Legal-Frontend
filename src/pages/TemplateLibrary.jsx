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
      const res = await fetch(`${BACKEND_URL}/templates/list`);
      if (!res.ok) throw new Error("Failed to fetch templates");

      const data = await res.json();

      const files = data.map((filename, index) => ({
        id: `template-${index}`,
        title: filename,
        filename,
      }));

      setTemplates(files);
    } catch (err) {
      console.error(err);
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
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`${BACKEND_URL}/templates/upload`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error();

      const data = await res.json();

      setTemplates((prev) => [
        ...prev,
        {
          id: `template-${Date.now()}`,
          title: data.file_name,
          filename: data.file_name,
        },
      ]);

      toast.success("Template uploaded successfully");
    } catch {
      toast.error("Upload failed");
    } finally {
      e.target.value = "";
    }
  };

  /* ================= DELETE (UI ONLY) ================= */
  const handleDelete = (filename) => {
    setTemplates((prev) =>
      prev.filter((t) => t.filename !== filename)
    );
    toast.info("Template removed");
  };

  /* ================= USE TEMPLATE ================= */
  const handleUseTemplate = async (template) => {
    try {
      setLoadingId(template.id);

      const res = await fetch(
        `${BACKEND_URL}/templates/view?filename=${encodeURIComponent(
          template.filename
        )}`
      );

      if (!res.ok) throw new Error();

      const text = await res.text();

      navigate(`/template-view/${template.id}`, {
        state: {
          template: {
            ...template,
            content: text,
          },
        },
      });
    } catch {
      toast.error("Failed to open template");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="bg-white h-screen flex flex-col rounded-l-3xl shadow-xl">
      <ToastContainer position="bottom-center" autoClose={2000} />

      {/* ================= HEADER ================= */}
      <div className="px-8 py-6 border-b flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Template Library
          </h1>
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

      {/* ================= CONTENT ================= */}
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
                  onClick={() => handleDelete(template.filename)}
                  className="cursor-pointer absolute top-4 right-4 text-gray-400 hover:text-red-500"
                >
                  <FaTrash />
                </button>

                <div>
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                    <FaFileContract className="text-orange-600" />
                  </div>

                  <h3 className="font-semibold break-all">
                    {template.title}
                  </h3>

                  <p className="text-sm text-gray-500 mt-2">
                    Uploaded document template
                  </p>
                </div>

                <button
                  onClick={() => handleUseTemplate(template)}
                  disabled={loadingId === template.id}
                  className={`cursor-pointer mt-6 py-2.5 rounded-xl font-medium transition ${
                    loadingId === template.id
                      ? "bg-orange-300 cursor-not-allowed"
                      : "bg-orange-500 hover:bg-orange-600 text-white"
                  }`}
                >
                  {loadingId === template.id ? (
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
