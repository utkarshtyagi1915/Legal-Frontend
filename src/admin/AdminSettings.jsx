import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    FaCog,
    FaShieldAlt,
    FaBell,
    FaEnvelope,
    FaToggleOn,
    FaToggleOff,
    FaSave,
    FaArrowLeft,
    FaExclamationTriangle,
} from "react-icons/fa";
import { toast } from "react-toastify";

const AdminSettings = () => {
    const navigate = useNavigate();
    const [settings, setSettings] = useState({
        // Notification Settings
        emailNotifications: true,
        approvalAlerts: true,
        newTemplateAlerts: true,
        userSignupAlerts: false,

        // Security Settings
        twoFactorAuth: true,
        sessionTimeout: 30,
        ipWhitelist: "",

        // Platform Settings
        autoApprove: false,
        requireReview: true,
        maxUploadsPerUser: 10,

        // Email Settings
        smtpHost: "smtp.example.com",
        smtpPort: "587",
        senderEmail: "noreply@lexi.com",
    });

    const [saving, setSaving] = useState(false);

    const handleToggle = (key) => {
        setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const handleChange = (key, value) => {
        setSettings((prev) => ({ ...prev, [key]: value }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            // API call to save settings
            // await fetch(`${import.meta.env.VITE_BACKEND_URL}/admin/settings`, {
            //   method: 'PUT',
            //   headers: { 
            //     Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
            //     'Content-Type': 'application/json'
            //   },
            //   body: JSON.stringify(settings)
            // });

            setTimeout(() => {
                toast.success("Settings saved successfully!");
                setSaving(false);
            }, 1000);
        } catch (error) {
            console.error("Error saving settings:", error);
            toast.error("Failed to save settings");
            setSaving(false);
        }
    };

    const ToggleSwitch = ({ enabled, onChange }) => (
        <button onClick={onChange} className="focus:outline-none cursor-pointer">
            {enabled ? (
                <FaToggleOn className="text-3xl text-orange-500 hover:text-orange-600 transition" />
            ) : (
                <FaToggleOff className="text-3xl text-slate-300 hover:text-slate-400 transition" />
            )}
        </button>
    );

    const SettingCard = ({ icon, title, description, children, iconBg = "bg-orange-100", iconColor = "text-orange-600" }) => (
        <div className="bg-white rounded-2xl border-2 border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-orange-50/50 to-amber-50/50">
                <div className="flex items-center gap-3">
                    <div className={`p-2.5 ${iconBg} rounded-xl`}>
                        {React.cloneElement(icon, { className: `text-lg ${iconColor}` })}
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800">{title}</h3>
                        <p className="text-sm text-slate-500">{description}</p>
                    </div>
                </div>
            </div>
            <div className="p-5 space-y-4">
                {children}
            </div>
        </div>
    );

    const SettingRow = ({ label, description, children }) => (
        <div className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
            <div>
                <p className="font-medium text-slate-700">{label}</p>
                {description && (
                    <p className="text-sm text-slate-500 mt-0.5">{description}</p>
                )}
            </div>
            {children}
        </div>
    );

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
                            <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
                            <p className="text-slate-500 text-sm mt-1">
                                Configure admin panel preferences
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-orange-200 disabled:opacity-50 cursor-pointer"
                    >
                        <FaSave />
                        {saving ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </header>

            {/* Settings Content */}
            <main className="p-8">
                <div className="max-w-4xl mx-auto space-y-6">
                    {/* Notification Settings */}
                    <SettingCard
                        icon={<FaBell />}
                        title="Notification Settings"
                        description="Configure email and alert preferences"
                    >
                        <SettingRow
                            label="Email Notifications"
                            description="Receive email notifications for important events"
                        >
                            <ToggleSwitch
                                enabled={settings.emailNotifications}
                                onChange={() => handleToggle("emailNotifications")}
                            />
                        </SettingRow>
                        <SettingRow
                            label="Approval Alerts"
                            description="Get notified when templates need approval"
                        >
                            <ToggleSwitch
                                enabled={settings.approvalAlerts}
                                onChange={() => handleToggle("approvalAlerts")}
                            />
                        </SettingRow>
                        <SettingRow
                            label="New Template Alerts"
                            description="Get notified when new templates are submitted"
                        >
                            <ToggleSwitch
                                enabled={settings.newTemplateAlerts}
                                onChange={() => handleToggle("newTemplateAlerts")}
                            />
                        </SettingRow>
                        <SettingRow
                            label="User Signup Alerts"
                            description="Get notified when new users sign up"
                        >
                            <ToggleSwitch
                                enabled={settings.userSignupAlerts}
                                onChange={() => handleToggle("userSignupAlerts")}
                            />
                        </SettingRow>
                    </SettingCard>

                    {/* Security Settings */}
                    <SettingCard
                        icon={<FaShieldAlt />}
                        title="Security Settings"
                        description="Manage security and access controls"
                        iconBg="bg-emerald-100"
                        iconColor="text-emerald-600"
                    >
                        <SettingRow
                            label="Two-Factor Authentication"
                            description="Require 2FA for all admin logins"
                        >
                            <ToggleSwitch
                                enabled={settings.twoFactorAuth}
                                onChange={() => handleToggle("twoFactorAuth")}
                            />
                        </SettingRow>
                        <SettingRow
                            label="Session Timeout (minutes)"
                            description="Auto logout after inactivity"
                        >
                            <select
                                value={settings.sessionTimeout}
                                onChange={(e) => handleChange("sessionTimeout", e.target.value)}
                                className="px-4 py-2 bg-slate-100 rounded-xl border-2 border-transparent focus:border-orange-500 focus:outline-none transition cursor-pointer font-medium"
                            >
                                <option value={15}>15 minutes</option>
                                <option value={30}>30 minutes</option>
                                <option value={60}>1 hour</option>
                                <option value={120}>2 hours</option>
                            </select>
                        </SettingRow>
                        <SettingRow
                            label="IP Whitelist"
                            description="Restrict admin access to specific IPs (comma separated)"
                        >
                            <input
                                type="text"
                                value={settings.ipWhitelist}
                                onChange={(e) => handleChange("ipWhitelist", e.target.value)}
                                placeholder="e.g., 192.168.1.1, 10.0.0.1"
                                className="w-64 px-4 py-2 bg-slate-100 rounded-xl border-2 border-transparent focus:border-orange-500 focus:outline-none transition text-sm"
                            />
                        </SettingRow>
                    </SettingCard>

                    {/* Platform Settings */}
                    <SettingCard
                        icon={<FaCog />}
                        title="Platform Settings"
                        description="Configure template approval workflow"
                        iconBg="bg-purple-100"
                        iconColor="text-purple-600"
                    >
                        <SettingRow
                            label="Auto-Approve Templates"
                            description="Automatically approve all submitted templates"
                        >
                            <ToggleSwitch
                                enabled={settings.autoApprove}
                                onChange={() => handleToggle("autoApprove")}
                            />
                        </SettingRow>
                        <SettingRow
                            label="Require Manual Review"
                            description="All templates must be reviewed before publishing"
                        >
                            <ToggleSwitch
                                enabled={settings.requireReview}
                                onChange={() => handleToggle("requireReview")}
                            />
                        </SettingRow>
                        <SettingRow
                            label="Max Uploads Per User"
                            description="Maximum templates a user can upload"
                        >
                            <input
                                type="number"
                                value={settings.maxUploadsPerUser}
                                onChange={(e) => handleChange("maxUploadsPerUser", e.target.value)}
                                className="w-24 px-4 py-2 bg-slate-100 rounded-xl border-2 border-transparent focus:border-orange-500 focus:outline-none transition text-center font-medium"
                                min={1}
                                max={100}
                            />
                        </SettingRow>
                    </SettingCard>

                    {/* Email Configuration */}
                    <SettingCard
                        icon={<FaEnvelope />}
                        title="Email Configuration"
                        description="Configure SMTP settings for notifications"
                        iconBg="bg-blue-100"
                        iconColor="text-blue-600"
                    >
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    SMTP Host
                                </label>
                                <input
                                    type="text"
                                    value={settings.smtpHost}
                                    onChange={(e) => handleChange("smtpHost", e.target.value)}
                                    className="w-full px-4 py-2.5 bg-slate-100 rounded-xl border-2 border-transparent focus:border-orange-500 focus:outline-none transition"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    SMTP Port
                                </label>
                                <input
                                    type="text"
                                    value={settings.smtpPort}
                                    onChange={(e) => handleChange("smtpPort", e.target.value)}
                                    className="w-full px-4 py-2.5 bg-slate-100 rounded-xl border-2 border-transparent focus:border-orange-500 focus:outline-none transition"
                                />
                            </div>
                        </div>
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Sender Email
                            </label>
                            <input
                                type="email"
                                value={settings.senderEmail}
                                onChange={(e) => handleChange("senderEmail", e.target.value)}
                                className="w-full px-4 py-2.5 bg-slate-100 rounded-xl border-2 border-transparent focus:border-orange-500 focus:outline-none transition"
                            />
                        </div>
                    </SettingCard>

                    {/* Danger Zone */}
                    <div className="bg-red-50 rounded-2xl border-2 border-red-200 p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2.5 bg-red-100 rounded-xl">
                                <FaExclamationTriangle className="text-lg text-red-600" />
                            </div>
                            <div>
                                <h3 className="font-bold text-red-800">Danger Zone</h3>
                                <p className="text-sm text-red-600">
                                    These actions are irreversible. Please proceed with caution.
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button className="px-4 py-2.5 bg-white border-2 border-red-300 text-red-600 rounded-xl font-medium hover:bg-red-50 hover:border-red-400 transition cursor-pointer">
                                Clear All Logs
                            </button>
                            <button className="px-4 py-2.5 bg-white border-2 border-red-300 text-red-600 rounded-xl font-medium hover:bg-red-50 hover:border-red-400 transition cursor-pointer">
                                Reset All Settings
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminSettings;
