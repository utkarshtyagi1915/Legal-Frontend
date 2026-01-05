import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  FaFileContract,
  FaSearch,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaEye,
  FaEdit,
  FaChevronDown,
  FaSortAmountDown,
  FaSortAmountUp,
  FaDownload,
  FaCalendarAlt,
  FaTimes,
  FaSave,
  FaArrowLeft,
} from "react-icons/fa";
import { toast } from "react-toastify";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
 
const AdminTemplates = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
 
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState(
    searchParams.get("status") || "all"
  );
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  // Edit form state
  const [editContent, setEditContent] = useState("");
  const [editStatus, setEditStatus] = useState("");
 
  const quillRef = useRef(null);
 
  useEffect(() => {
    fetchTemplates();
  }, [statusFilter, sortBy, sortOrder]);
 
  const fetchTemplates = async () => {
    try {
      setLoading(true);
 
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/templates/admin/templates/all`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
 
      if (!res.ok) throw new Error("Failed to fetch templates");
 
      const data = await res.json();
 
      let fetched = data.templates || [];
 
      // Status filter
      if (statusFilter !== "all") {
        fetched = fetched.filter((t) => t.status === statusFilter);
      }
 
      // Sorting
      fetched.sort((a, b) => {
        let cmp = 0;
        if (sortBy === "date") {
          cmp = (b.uploadDate || 0) - (a.uploadDate || 0);
        } else if (sortBy === "title") {
          cmp = (a.title || "").localeCompare(b.title || "");
        }
        return sortOrder === "desc" ? cmp : -cmp;
      });
 
      setTemplates(fetched);
    } catch (err) {
      console.error("Admin template fetch error:", err);
      toast.error("Failed to load templates");
    } finally {
      setLoading(false);
    }
  };
 
  const fetchTemplateContent = async (templateId) => {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/templates/view/${templateId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      }
    );
 
    if (!res.ok) {
      throw new Error("Failed to fetch template content");
    }
 
    return await res.json();
  };
 
  const openPreviewModal = async (template) => {
    try {
      setLoading(true);
      const data = await fetchTemplateContent(template.id);
 
      setSelectedTemplate({
        ...template,
        content: data.content,
        edited: data.edited,
      });
      setShowPreviewModal(true);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load template content");
    } finally {
      setLoading(false);
    }
  };
 
  const openEditModal = async (template) => {
    try {
      setLoading(true);
 
      const data = await fetchTemplateContent(template.id);
 
      setSelectedTemplate({
        ...template,
        content: data.content,
        edited: data.edited,
      });
 
      setEditContent(data.content);
      setEditStatus(template.status);
      setRejectionReason("");
      setShowEditModal(true);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load template for editing");
    } finally {
      setLoading(false);
    }
  };
 
  const closeEditModal = () => {
    setShowEditModal(false);
    setSelectedTemplate(null);
    setEditContent("");
    setEditStatus("")
  };
 
  const closePreviewModal = () => {
    setShowPreviewModal(false);
    setSelectedTemplate(null);
  };
 
  const handleSaveTemplate = async () => {
    if (!selectedTemplate) return;
 
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      toast.error("Authentication token missing");
      return;
    }
 
    // Get user ID from the template's user object
    const userId = selectedTemplate.user?.id;
    const templateId = selectedTemplate.id;
 
    if (!userId || !templateId) {
      console.error("Missing IDs:", { userId, templateId, selectedTemplate });
      toast.error("Invalid user or template reference");
      return;
    }
 
    // Validate status change
    if (editStatus === selectedTemplate.status) {
      toast.info("No status change detected");
      return;
    }
 
    try {
      setSaving(true);
 
      let endpoint = "";
      let queryParams = new URLSearchParams({
        user_id: userId,
        template_id: templateId,
      });
 
      if (editStatus === "approved") {
        endpoint = `${import.meta.env.VITE_BACKEND_URL}/templates/approve-template`;
      } else if (editStatus === "rejected") {
        endpoint = `${import.meta.env.VITE_BACKEND_URL}/templates/reject-template`;
        queryParams.append("reason", "Admin Rejected");
      } else {
        toast.info("Please select a valid status (Approved or Rejected)");
        return;
      }
 
      const res = await fetch(`${endpoint}?${queryParams.toString()}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
 
      const data = await res.json();
 
      if (!res.ok) {
        throw new Error(data.detail || `Failed to ${editStatus} template`);
      }
 
      if (editStatus === "approved") {
        toast.success("Template approved successfully!");
      } else {
        toast.info("Template rejected");
      }
 
      closeEditModal();
      fetchTemplates(); // Refresh the list
    } catch (err) {
      console.error("Save template error:", err);
      toast.error(err.message || "Failed to save template");
    } finally {
      setSaving(false);
    }
  };
 
  const handleContentChange = (content) => {
    setEditContent(content);
  };
 
  const getStatusBadge = (status) => {
    const badges = {
      approved: {
        bg: "bg-emerald-100",
        text: "text-emerald-700",
        border: "border-emerald-300",
        icon: <FaCheckCircle />,
        label: "Approved",
      },
      pending: {
        bg: "bg-orange-100",
        text: "text-orange-700",
        border: "border-orange-300",
        icon: <FaClock />,
        label: "Pending",
      },
      rejected: {
        bg: "bg-red-100",
        text: "text-red-700",
        border: "border-red-300",
        icon: <FaTimesCircle />,
        label: "Rejected",
      },
    };
    return badges[status] || badges.pending;
  };
 
  const filteredTemplates = templates.filter(
    (t) =>
      (t.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.user?.email || "").toLowerCase().includes(searchQuery.toLowerCase())
  );
 
  const statuses = [
    {
      value: "pending",
      label: "Pending",
      icon: <FaClock />,
      bgColor: "bg-orange-50",
      borderColor: "border-orange-500",
      textColor: "text-orange-600",
      activeBg: "bg-orange-100",
    },
    {
      value: "approved",
      label: "Approved",
      icon: <FaCheckCircle />,
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-500",
      textColor: "text-emerald-600",
      activeBg: "bg-emerald-100",
    },
    {
      value: "rejected",
      label: "Rejected",
      icon: <FaTimesCircle />,
      bgColor: "bg-red-50",
      borderColor: "border-red-500",
      textColor: "text-red-600",
      activeBg: "bg-red-100",
    },
  ];
 
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/admin/dashboard")}
              className="p-2 hover:bg-gray-100 rounded-lg transition cursor-pointer"
              title="Back to Dashboard"
            >
              <FaArrowLeft className="text-slate-500" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Template Management
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                Review, edit, and manage all user-submitted templates
              </p>
            </div>
          </div>
        </div>
      </header>
 
      {/* Filters Bar */}
      <div className="bg-white border-b border-gray-200 px-8 py-4">
        <div className="flex flex-wrap items-center gap-4">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by template name or user email..."
              className="w-full pl-11 pr-4 py-2.5 bg-slate-100 rounded-xl border-2 border-transparent focus:border-orange-500 focus:bg-white focus:outline-none transition"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
 
          {/* Status Filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none pl-4 pr-10 py-2.5 bg-slate-100 rounded-xl border-2 border-transparent focus:border-orange-500 focus:bg-white focus:outline-none transition cursor-pointer font-medium"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
 
          {/* Sort */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none pl-4 pr-10 py-2.5 bg-slate-100 rounded-xl border-2 border-transparent focus:border-orange-500 focus:bg-white focus:outline-none transition cursor-pointer font-medium"
              >
                <option value="date">Sort by Date</option>
                <option value="title">Sort by Title</option>
                <option value="downloads">Sort by Downloads</option>
              </select>
              <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
            <button
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="p-2.5 bg-slate-100 rounded-xl hover:bg-orange-100 transition cursor-pointer"
              title={sortOrder === "desc" ? "Descending" : "Ascending"}
            >
              {sortOrder === "desc" ? (
                <FaSortAmountDown className="text-slate-600" />
              ) : (
                <FaSortAmountUp className="text-slate-600" />
              )}
            </button>
          </div>
        </div>
      </div>
 
      {/* Templates Table */}
      <main className="p-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600">Loading templates...</p>
          </div>
        ) : filteredTemplates.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaFileContract className="text-4xl text-orange-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700">
              No templates found
            </h3>
            <p className="text-slate-500 mt-1">
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 p-4 bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100 text-sm font-semibold text-slate-700">
              <div className="col-span-4">Template</div>
              <div className="col-span-3">Submitted By</div>
              <div className="col-span-2">Date</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-1">Actions</div>
            </div>
 
            {/* Table Body */}
            <div className="divide-y divide-gray-100">
              {filteredTemplates.map((template) => {
                const badge = getStatusBadge(template.status);
                return (
                  <div
                    key={template.id}
                    className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-orange-50/50 transition"
                  >
                    {/* Template */}
                    <div className="col-span-4 flex items-center gap-3">
                      <div className="p-2.5 bg-orange-100 rounded-lg">
                        <FaFileContract className="text-orange-600" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">
                          {template.title}
                        </p>
                        <p className="text-sm text-slate-500 truncate max-w-[250px]">
                          {template.description}
                        </p>
                      </div>
                    </div>
 
                    {/* User */}
                    <div className="col-span-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white text-xs font-bold">
                          {(template.user?.name || "U").charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-700">
                            {template.user?.name || "Unknown"}
                          </p>
                          <p className="text-xs text-slate-500 truncate">
                            {template.user?.email || "—"}
                          </p>
                        </div>
                      </div>
                    </div>
 
                    {/* Date */}
                    <div className="col-span-2">
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <FaCalendarAlt className="text-xs text-orange-400" />
                        {template.uploadDate
                          ? new Date(
                              template.uploadDate * 1000
                            ).toLocaleDateString()
                          : "—"}
                      </div>
                    </div>
 
                    {/* Status */}
                    <div className="col-span-2">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${badge.bg} ${badge.text} ${badge.border}`}
                      >
                        {badge.icon}
                        {badge.label}
                      </span>
                    </div>
 
                    {/* Actions */}
                    <div className="col-span-1 flex items-center gap-1">
                      <button
                        onClick={() => openPreviewModal(template)}
                        className="p-2 hover:bg-orange-100 text-orange-600 rounded-lg transition cursor-pointer"
                        title="View Template"
                      >
                        <FaEye />
                      </button>
 
                      <button
                        onClick={() => openEditModal(template)}
                        className="p-2 hover:bg-slate-100 text-slate-600 rounded-lg transition cursor-pointer"
                        title="Edit Template"
                      >
                        <FaEdit />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
 
        {/* Results Count */}
        {!loading && filteredTemplates.length > 0 && (
          <div className="mt-4 text-sm text-slate-500">
            Showing{" "}
            <span className="font-medium text-slate-700">
              {filteredTemplates.length}
            </span>{" "}
            of{" "}
            <span className="font-medium text-slate-700">
              {templates.length}
            </span>{" "}
            templates
          </div>
        )}
      </main>
 
      {/* Preview Modal */}
      {showPreviewModal && selectedTemplate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-4 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {selectedTemplate.title}
                  </h3>
                  <p className="text-orange-100 text-sm mt-1">
                    {selectedTemplate.description}
                  </p>
                </div>
                <button
                  onClick={closePreviewModal}
                  className="p-2 hover:bg-white/20 rounded-lg transition cursor-pointer"
                >
                  <FaTimes className="text-white text-xl" />
                </button>
              </div>
            </div>
 
            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Template Info */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-orange-50 rounded-xl border border-orange-100">
                  <p className="text-xs text-orange-600 font-medium">
                    Submitted By
                  </p>
                  <p className="font-semibold text-slate-800 mt-1">
                    {selectedTemplate.user?.name || "Unknown"}
                  </p>
                  <p className="text-xs text-slate-500">
                    {selectedTemplate.user?.email || "—"}
                  </p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-xs text-slate-500 font-medium">
                    Submission Date
                  </p>
                  <p className="font-semibold text-slate-800 mt-1">
                    {selectedTemplate.uploadDate
                      ? new Date(
                          selectedTemplate.uploadDate * 1000
                        ).toLocaleDateString()
                      : "—"}
                  </p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-xs text-slate-500 font-medium">
                    Downloads
                  </p>
                  <p className="font-semibold text-slate-800 mt-1">
                    {selectedTemplate.downloads || 0}
                  </p>
                </div>
              </div>
 
              {/* Template Content Preview */}
              <div className="border-2 border-gray-200 rounded-xl p-6 bg-gray-50">
                <h4 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
                  <FaFileContract className="text-orange-500" />
                  Template Content
                </h4>
                <div className="bg-white p-4 rounded-lg border border-gray-200 max-h-64 overflow-y-auto">
                  <div
                    className="prose max-w-none text-sm"
                    dangerouslySetInnerHTML={{
                      __html:
                        selectedTemplate.content || "<p>No content available.</p>",
                    }}
                  />
                </div>
              </div>
            </div>
 
            {/* Modal Footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
              <div className="flex items-center gap-3">
                <span className="text-sm text-slate-600 font-medium">
                  Current Status:
                </span>
                {(() => {
                  const badge = getStatusBadge(selectedTemplate.status);
                  return (
                    <span
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border ${badge.bg} ${badge.text} ${badge.border}`}
                    >
                      {badge.icon}
                      {badge.label}
                    </span>
                  );
                })()}
              </div>
              <button
                onClick={() => {
                  closePreviewModal();
                  openEditModal(selectedTemplate);
                }}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-medium hover:from-orange-600 hover:to-orange-700 transition cursor-pointer shadow-lg"
              >
                <FaEdit />
                Edit & Change Status
              </button>
            </div>
          </div>
        </div>
      )}
 
      {/* Edit Modal - FIXED STRUCTURE */}
      {showEditModal && selectedTemplate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-4 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white">Edit Template</h3>
                  <p className="text-orange-100 text-sm">
                    {selectedTemplate.title}
                  </p>
                </div>
                <button
                  onClick={closeEditModal}
                  className="p-2 hover:bg-white/20 rounded-lg transition cursor-pointer"
                >
                  <FaTimes className="text-white text-lg" />
                </button>
              </div>
            </div>
 
            {/* Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Template Info */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-orange-50 rounded-xl border border-orange-100">
                  <p className="text-xs text-orange-600 font-medium">
                    Submitted By
                  </p>
                  <p className="font-semibold text-slate-800 mt-1">
                    {selectedTemplate.user?.name || "Unknown"}
                  </p>
                  <p className="text-xs text-slate-500">
                    {selectedTemplate.user?.email || "—"}
                  </p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-xs text-slate-500 font-medium">
                    Submission Date
                  </p>
                  <p className="font-semibold text-slate-800 mt-1">
                    {selectedTemplate.uploadDate
                      ? new Date(
                          selectedTemplate.uploadDate * 1000
                        ).toLocaleDateString()
                      : "—"}
                  </p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-xs text-slate-500 font-medium">Downloads</p>
                  <p className="font-semibold text-slate-800 mt-1">
                    {selectedTemplate.downloads || 0}
                  </p>
                </div>
              </div>
 
              {/* Status Selection */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Template Status
                </label>
                <div className="flex gap-3 flex-wrap">
                  {statuses.map((status) => (
                    <button
                      key={status.value}
                      type="button"
                      onClick={() => setEditStatus(status.value)}
                      disabled={status.value === "pending"}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 transition-all font-medium ${
                        status.value === "pending"
                          ? "opacity-50 cursor-not-allowed"
                          : "cursor-pointer"
                      } ${
                        editStatus === status.value
                          ? `${status.borderColor} ${status.activeBg} ${status.textColor}`
                          : "border-gray-200 hover:border-gray-300 text-slate-600 hover:bg-gray-50"
                      }`}
                    >
                      <span
                        className={
                          editStatus === status.value
                            ? status.textColor
                            : "text-slate-400"
                        }
                      >
                        {status.icon}
                      </span>
                      {status.label}
                      {editStatus === status.value && (
                        <span className="ml-1 text-xs bg-white px-1.5 py-0.5 rounded-full">
                          ✓
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
 
 
              {/* Template Content Editor */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Template Content
                </label>
                <div className="border rounded-xl overflow-hidden">
                  <ReactQuill
                    ref={quillRef}
                    theme="snow"
                    value={editContent}
                    onChange={handleContentChange}
                    className="bg-white"
                    style={{ minHeight: "200px" }}
                    modules={{
                      toolbar: [
                        [{ header: [1, 2, 3, false] }],
                        ["bold", "italic", "underline", "strike"],
                        [{ list: "ordered" }, { list: "bullet" }],
                        ["link", "clean"],
                      ],
                    }}
                  />
                </div>
              </div>
            </div>
 
            {/* Footer - INSIDE THE MODAL */}
            <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-200 flex-shrink-0">
              <div className="text-sm text-slate-500">
                <span className="font-medium">Tip:</span> Review and edit the
                content, then select a status and save.
              </div>
              <div className="flex gap-3">
                <button
                  onClick={closeEditModal}
                  disabled={saving}
                  className="px-5 py-2.5 text-slate-600 hover:bg-gray-200 rounded-xl font-medium transition cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveTemplate}
                  disabled={saving || editStatus === "pending"}
                  className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-medium hover:from-orange-600 hover:to-orange-700 transition shadow-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <FaSave />
                      Save Template
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}  
    </div>
  );
};
 
export default AdminTemplates;
 