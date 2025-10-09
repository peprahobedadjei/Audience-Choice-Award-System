import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import {
  Upload,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  Image as ImageIcon,
  FileText,
  Briefcase,
  User,
  Palette,
  Eye,
  ChevronDown,
  Trophy
} from "lucide-react";

// Color options for founders
const colorOptions = [
  {
    name: "Green",
    value: "from-green-400 to-emerald-600",
    preview: "bg-gradient-to-r from-green-400 to-emerald-600",
  },
  {
    name: "Blue",
    value: "from-blue-400 to-cyan-600",
    preview: "bg-gradient-to-r from-blue-400 to-cyan-600",
  },
  {
    name: "Purple",
    value: "from-purple-400 to-indigo-600",
    preview: "bg-gradient-to-r from-purple-400 to-indigo-600",
  },
  {
    name: "Pink",
    value: "from-pink-400 to-rose-600",
    preview: "bg-gradient-to-r from-pink-400 to-rose-600",
  },
  {
    name: "Orange",
    value: "from-orange-400 to-amber-600",
    preview: "bg-gradient-to-r from-orange-400 to-amber-600",
  },
  {
    name: "Teal",
    value: "from-teal-400 to-cyan-600",
    preview: "bg-gradient-to-r from-teal-400 to-cyan-600",
  },
  {
    name: "Red",
    value: "from-red-400 to-rose-600",
    preview: "bg-gradient-to-r from-red-400 to-rose-600",
  },
  {
    name: "Indigo",
    value: "from-indigo-400 to-purple-600",
    preview: "bg-gradient-to-r from-indigo-400 to-purple-600",
  },
];

export default function AdminPanel() {
  const API_URL = "https://audience-choice-award-backend.vercel.app";

  const [founders, setFounders] = useState([]);

  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    company: "",
    logo: null,
    logoPreview: "",
    profile: null,
    profilePreview: "",
    description: "",
    color: "from-green-400 to-emerald-600",
  });
  useEffect(() => {
    fetchFounders();
  }, []);

  const fetchFounders = async () => {
    try {
      const response = await fetch(`${API_URL}/api/founders`);
      if (!response.ok) {
        throw new Error("Failed to fetch founders");
      }
      const data = await response.json();
      setFounders(data);
    } catch (error) {
      console.error("Error fetching founders:", error);
      alert("Failed to load founders from database");
    }
  };
  const handleAddNew = () => {
    setIsAddingNew(true);
    setFormData({
      name: "",
      company: "",
      logo: null,
      logoPreview: "",
      profile: null,
      profilePreview: "",
      description: "",
      color: "from-green-400 to-emerald-600",
    });
  };
  const router = useRouter();
  const handleAcessCodesPage = () => {
    router.push("/admin/codes");
  };

    const handleLeadBoard = () => {
    router.push("/admin/leadboard");
  };
  const handleEdit = (founder) => {
    setEditingId(founder.id);
    setFormData({
      ...founder,
      logo: null,
      logoPreview: founder.logo,
      profile: null,
      profilePreview: founder.profile,
    });
    setIsAddingNew(true);
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === "logo") {
          setFormData({
            ...formData,
            logo: file,
            logoPreview: reader.result,
          });
        } else {
          setFormData({
            ...formData,
            profile: file,
            profilePreview: reader.result,
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setUploading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("company", formData.company);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("color", formData.color);

      if (formData.logo) {
        formDataToSend.append("logo", formData.logo);
      }

      if (formData.profile) {
        formDataToSend.append("profile", formData.profile);
      }

      // CHANGE THIS PART - Check if editing or creating
      const url = editingId
        ? `${API_URL}/api/founders/${editingId}` // UPDATE
        : `${API_URL}/api/founders`; // CREATE

      const method = editingId ? "PUT" : "POST"; // ADD THIS LINE

      const response = await fetch(url, {
        method: method, // CHANGE FROM 'POST' to method variable
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error(`Failed to ${editingId ? "update" : "create"} founder`);
      }

      await fetchFounders();

      setIsAddingNew(false);
      setEditingId(null);
      alert("Founder saved successfully!");
    } catch (error) {
      console.error("Error saving founder:", error);
      alert("Failed to save founder. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this founder?")) {
      try {
        const response = await fetch(`${API_URL}/api/founders/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete founder");
        }

        // Refresh the founders list from database
        await fetchFounders();
        alert("Founder deleted successfully!");
      } catch (error) {
        console.error("Error deleting founder:", error);
        alert("Failed to delete founder. Please try again.");
      }
    }
  };

  const handlePreview = (founder) => {
    setPreviewData(founder);
    setShowPreview(true);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Custom Font Loading */}
      <style jsx global>{`
        @font-face {
          font-family: "Squartiqa";
          src: url("/fonts/Squartiqa4FUltraLight.ttf") format("truetype");
          font-weight: 200;
          font-style: normal;
        }
        * {
          font-family: "Squartiqa", -apple-system, BlinkMacSystemFont,
            "Segoe UI", sans-serif;
        }
      `}</style>

      {/* Animated Background Particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-white rounded-full opacity-10"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}

      {/* Main Content */}
      <div className="relative z-10 min-h-screen px-4 py-8 md:px-8">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div>
              <h1 className="text-4xl font-light text-white mb-2">
                Admin Panel
              </h1>
              <p className="text-cyan-300 text-sm">
                Manage Disrupt by the Sea Founders
              </p>
            </div>
            <motion.button
              onClick={handleAcessCodesPage}
              className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-3 rounded-xl flex items-center justify-center space-x-2 shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FileText className="w-5 h-5" />
              <span>Access Codes</span>
            </motion.button>
            <motion.button
              onClick={handleAddNew}
              className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-6 py-3 rounded-xl flex items-center space-x-2 shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus className="w-5 h-5" />
              <span>Add New Founder</span>
            </motion.button>

            <motion.button
   onClick={handleLeadBoard}
  className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-6 py-3 rounded-xl flex items-center space-x-2 shadow-lg"
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
  <Trophy className="w-5 h-5" />
  <span>View Leaderboard</span>
</motion.button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <motion.div
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm mb-1">Total Founders</p>
                <p className="text-3xl font-light text-white">
                  {founders.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-xl flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm mb-1">Expected Voters</p>
                <p className="text-3xl font-light text-white">120+</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm mb-1">Budget per Voter</p>
                <p className="text-3xl font-light text-white">€50k</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-pink-600 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Add/Edit Form */}
        <AnimatePresence>
          {isAddingNew && (
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-3xl p-6 border border-white/20">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-light text-white">
                    {editingId ? "Edit Founder" : "Add New Founder"}
                  </h2>
                  <button
                    onClick={() => {
                      setIsAddingNew(false);
                      setEditingId(null);
                    }}
                    className="text-white/60 hover:text-white"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <label className="text-white/80 text-sm mb-2 flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span>Founder Name</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="e.g., John Doe"
                      className="w-full bg-white/10 text-white px-4 py-3 rounded-xl border border-white/20 focus:border-cyan-400 focus:outline-none"
                    />
                  </div>

                  {/* Company */}
                  <div>
                    <label className="text-white/80 text-sm mb-2 flex items-center space-x-2">
                      <Briefcase className="w-4 h-4" />
                      <span>Company Name</span>
                    </label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) =>
                        setFormData({ ...formData, company: e.target.value })
                      }
                      placeholder="e.g., Biota"
                      className="w-full bg-white/10 text-white px-4 py-3 rounded-xl border border-white/20 focus:border-cyan-400 focus:outline-none"
                    />
                  </div>

                  {/* Logo Upload */}
                  <div>
                    <label className="text-white/80 text-sm mb-2 flex items-center space-x-2">
                      <ImageIcon className="w-4 h-4" />
                      <span>Company Logo</span>
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, "logo")}
                        className="hidden"
                        id="logo-upload"
                      />
                      <label
                        htmlFor="logo-upload"
                        className="w-full bg-white/10 text-white px-4 py-3 rounded-xl border border-white/20 focus:border-cyan-400 cursor-pointer flex items-center justify-between hover:bg-white/15 transition-colors"
                      >
                        <span className="text-sm truncate">
                          {formData.logo
                            ? formData.logo.name
                            : "Choose logo file..."}
                        </span>
                        <Upload className="w-5 h-5 text-cyan-400 flex-shrink-0 ml-2" />
                      </label>
                      {formData.logoPreview && (
                        <div className="mt-2 w-20 h-20 rounded-xl overflow-hidden border-2 border-white/20">
                          <img
                            src={formData.logoPreview}
                            alt="Logo preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Profile Upload */}
                  <div>
                    <label className="text-white/80 text-sm mb-2 flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span>Profile Picture</span>
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, "profile")}
                        className="hidden"
                        id="profile-upload"
                      />
                      <label
                        htmlFor="profile-upload"
                        className="w-full bg-white/10 text-white px-4 py-3 rounded-xl border border-white/20 focus:border-cyan-400 cursor-pointer flex items-center justify-between hover:bg-white/15 transition-colors"
                      >
                        <span className="text-sm truncate">
                          {formData.profile
                            ? formData.profile.name
                            : "Choose profile picture..."}
                        </span>
                        <Upload className="w-5 h-5 text-cyan-400 flex-shrink-0 ml-2" />
                      </label>
                      {formData.profilePreview && (
                        <div className="mt-2 w-20 h-20 rounded-full overflow-hidden border-2 border-white/20">
                          <img
                            src={formData.profilePreview}
                            alt="Profile preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Color Selection */}
                  <div className="md:col-span-2">
                    <label className="text-white/80 text-sm mb-2 flex items-center space-x-2">
                      <Palette className="w-4 h-4" />
                      <span>Brand Color</span>
                    </label>
                    <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
                      {colorOptions.map((color) => (
                        <button
                          key={color.value}
                          onClick={() =>
                            setFormData({ ...formData, color: color.value })
                          }
                          className={`h-12 rounded-xl ${
                            color.preview
                          } relative transition-all ${
                            formData.color === color.value
                              ? "ring-2 ring-white scale-110"
                              : "hover:scale-105"
                          }`}
                        >
                          {formData.color === color.value && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                                <div className="w-3 h-3 bg-black rounded-full" />
                              </div>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="md:col-span-2">
                    <label className="text-white/80 text-sm mb-2 flex items-center space-x-2">
                      <FileText className="w-4 h-4" />
                      <span>Description</span>
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      placeholder="Brief description of the company and what they do..."
                      rows={4}
                      className="w-full bg-white/10 text-white px-4 py-3 rounded-xl border border-white/20 focus:border-cyan-400 focus:outline-none resize-none"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3 mt-6">
                  <motion.button
                    onClick={handleSave}
                    disabled={uploading}
                    className={`flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-xl flex items-center justify-center space-x-2 ${
                      uploading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    whileHover={uploading ? {} : { scale: 1.02 }}
                    whileTap={uploading ? {} : { scale: 0.98 }}
                  >
                    <Save className="w-5 h-5" />
                    <span>{uploading ? "Uploading..." : "Save Founder"}</span>
                  </motion.button>

                  <motion.button
                    onClick={() => handlePreview(formData)}
                    disabled={uploading}
                    className="flex-1 bg-white/10 text-white py-3 rounded-xl flex items-center justify-center space-x-2 border border-white/20"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Eye className="w-5 h-5" />
                    <span>Preview</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Founders List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-light text-white mb-4">
            Current Founders ({founders.length})
          </h2>

          {founders.map((founder, index) => (
            <motion.div
              key={founder.id}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex flex-col md:flex-row md:items-center md:space-x-6">
                {/* Logo & Profile Preview */}
                <div className="flex items-center space-x-4 mb-4 md:mb-0">
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${founder.color} flex items-center justify-center overflow-hidden`}
                  >
                    {founder.logo ? (
                      <img
                        src={
                          founder.logo.startsWith("http")
                            ? founder.logo
                            : `${API_URL}${founder.logo}`
                        }
                        alt={`${founder.company} logo`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl">🏢</span>
                    )}
                  </div>
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 overflow-hidden">
                    {founder.profile ? (
                      <img
                        src={
                          founder.profile.startsWith("http")
                            ? founder.profile
                            : `${API_URL}${founder.profile}`
                        }
                        alt={founder.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl">👤</span>
                    )}
                  </div>
                </div>

                {/* Info */}
                <div className="flex-grow">
                  <h3 className="text-xl text-white font-light mb-1">
                    {founder.name}
                  </h3>
                  <p className="text-cyan-300 text-sm mb-2">
                    {founder.company}
                  </p>
                  <p className="text-white/60 text-sm line-clamp-2">
                    {founder.description}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex md:flex-col space-x-2 md:space-x-0 md:space-y-2 mt-4 md:mt-0">
                  <motion.button
                    onClick={() => handlePreview(founder)}
                    className="flex-1 md:flex-none bg-cyan-500/20 text-cyan-300 p-3 rounded-xl border border-cyan-500/30"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Eye className="w-5 h-5 mx-auto" />
                  </motion.button>

                  <motion.button
                    onClick={() => handleEdit(founder)}
                    className="flex-1 md:flex-none bg-purple-500/20 text-purple-300 p-3 rounded-xl border border-purple-500/30"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Edit2 className="w-5 h-5 mx-auto" />
                  </motion.button>

                  <motion.button
                    onClick={() => handleDelete(founder.id)}
                    className="flex-1 md:flex-none bg-red-500/20 text-red-300 p-3 rounded-xl border border-red-500/30"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Trash2 className="w-5 h-5 mx-auto" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Preview Modal */}
      <AnimatePresence>
        {showPreview && previewData && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowPreview(false)}
          >
            <motion.div
              className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-3xl p-6 border border-white/20 max-w-2xl w-full"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-light text-white">Preview</h2>
                <button
                  onClick={() => setShowPreview(false)}
                  className="text-white/60 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div
                    className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${previewData.color} flex items-center justify-center shadow-lg`}
                  >
                    <span className="text-3xl">🏢</span>
                  </div>
                  <div>
                    <h3 className="text-2xl text-white font-light">
                      {previewData.name}
                    </h3>
                    <p
                      className={`inline-block px-3 py-1 rounded-full bg-gradient-to-r ${previewData.color} text-white text-sm mt-1`}
                    >
                      {previewData.company}
                    </p>
                  </div>
                </div>

                <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                  <p className="text-white/80 text-sm leading-relaxed">
                    {previewData.description}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
