import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Plus,
  Key,
  Check,
  X,
  Clock,
  Shield,
  Download,
  Copy,
  CheckCircle,
  XCircle,
} from "lucide-react";

export default function AccessCodesManager() {
  const API_URL = "https://audience-choice-award-backend.vercel.app";

  const [codes, setCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [numberOfCodes, setNumberOfCodes] = useState(10);
  const [copiedCode, setCopiedCode] = useState(null);
  const [showPrintView, setShowPrintView] = useState(false);

  useEffect(() => {
    fetchCodes();
  }, []);

  const fetchCodes = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/access-codes`);

      if (!response.ok) {
        throw new Error("Failed to fetch codes");
      }

      const data = await response.json();
      setCodes(data);
    } catch (error) {
      console.error("Error fetching codes:", error);
      alert("Failed to load access codes");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateCodes = async () => {
    if (numberOfCodes < 1 || numberOfCodes > 500) {
      alert("Please enter a number between 1 and 500");
      return;
    }

    setGenerating(true);
    try {
      const response = await fetch(`${API_URL}/api/access-codes/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ count: numberOfCodes }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate codes");
      }

      await fetchCodes();
      alert(`✅ Successfully generated ${numberOfCodes} access codes!`);
      setNumberOfCodes(10);
    } catch (error) {
      console.error("Error generating codes:", error);
      alert("Failed to generate codes. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleExportCodes = () => {
    const unusedCodes = codes.filter((c) => !c.used);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Code,Created At,Status\n" +
      unusedCodes
        .map(
          (c) =>
            `${c.code},${new Date(c.created_at).toLocaleString()},${
              c.used ? "Used" : "Available"
            }`
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `access_codes_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleGenerateQRCodes = () => {
    const unusedCodes = codes.filter((c) => !c.used);

    if (unusedCodes.length === 0) {
      alert("No unused codes available to generate QR codes");
      return;
    }

    // Open print view
    setShowPrintView(true);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDeleteCode = async (code) => {
    if (!window.confirm(`Are you sure you want to delete code ${code}?`)) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/access-codes/${code}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Failed to delete code");
      }

      await fetchCodes();
      alert(" Code deleted successfully!");
    } catch (error) {
      console.error("Error deleting code:", error);
      alert(error.message || "Failed to delete code. Please try again.");
    }
  };

  const stats = {
    total: codes.length,
    used: codes.filter((c) => c.used).length,
    available: codes.filter((c) => !c.used).length,
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-2xl">Loading access codes...</div>
      </div>
    );
  }

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
      <div className="relative z-10 min-h-screen px-4 py-8 md:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex flex-col space-y-4">
            {/* Back Button */}
            <motion.button
              onClick={() => (window.location.href = "/admin")}
              className="flex items-center space-x-2 text-cyan-300 hover:text-cyan-200 w-fit"
              whileHover={{ x: -5 }}
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </motion.button>

            {/* Title */}
            <div>
              <h1 className="text-4xl font-light text-white mb-2">
                Access Codes Manager
              </h1>
              <p className="text-cyan-300 text-sm">
                Generate and manage voting access codes
              </p>
            </div>
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
                <p className="text-white/60 text-sm mb-1">Total Codes</p>
                <p className="text-3xl font-light text-white">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-xl flex items-center justify-center">
                <Key className="w-6 h-6 text-white" />
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
                <p className="text-white/60 text-sm mb-1">Available</p>
                <p className="text-3xl font-light text-green-400">
                  {stats.available}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
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
                <p className="text-white/60 text-sm mb-1">Used</p>
                <p className="text-3xl font-light text-red-400">{stats.used}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-red-600 rounded-xl flex items-center justify-center">
                <XCircle className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Generate Codes Section */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-3xl p-6 border border-white/20">
            <div className="flex items-center space-x-2 mb-4">
              <Shield className="w-5 h-5 text-cyan-400" />
              <h2 className="text-2xl font-light text-white">
                Generate New Codes
              </h2>
            </div>

            <div className="flex flex-col md:flex-row md:items-end space-y-4 md:space-y-0 md:space-x-4">
              <div className="flex-grow">
                <label className="text-white/80 text-sm mb-2 block">
                  Number of Codes to Generate
                </label>
                <input
                  type="number"
                  value={numberOfCodes}
                  onChange={(e) =>
                    setNumberOfCodes(parseInt(e.target.value) || 0)
                  }
                  min="1"
                  max="500"
                  placeholder="Enter number (1-500)"
                  className="w-full bg-white/10 text-white text-lg px-4 py-3 rounded-xl border border-white/20 focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <motion.button
                onClick={handleGenerateCodes}
                disabled={generating}
                className={`px-8 py-3 rounded-xl flex items-center justify-center space-x-2 ${
                  generating
                    ? "bg-white/10 text-white/40 cursor-not-allowed"
                    : "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                }`}
                whileHover={generating ? {} : { scale: 1.05 }}
                whileTap={generating ? {} : { scale: 0.95 }}
              >
                <Plus className="w-5 h-5" />
                <span>{generating ? "Generating..." : "Generate Codes"}</span>
              </motion.button>
              <div className="flex space-x-3">
                <motion.button
                  onClick={handleExportCodes}
                  disabled={stats.available === 0}
                  className={`px-8 py-3 rounded-xl flex items-center justify-center space-x-2 ${
                    stats.available === 0
                      ? "bg-white/10 text-white/40 cursor-not-allowed"
                      : "bg-white/10 text-white border border-white/20"
                  }`}
                  whileHover={stats.available > 0 ? { scale: 1.05 } : {}}
                  whileTap={stats.available > 0 ? { scale: 0.95 } : {}}
                >
                  <Download className="w-5 h-5" />
                  <span>Export CSV</span>
                </motion.button>

                <motion.button
                  onClick={handleGenerateQRCodes}
                  disabled={stats.available === 0}
                  className={`px-8 py-3 rounded-xl flex items-center justify-center space-x-2 ${
                    stats.available === 0
                      ? "bg-white/10 text-white/40 cursor-not-allowed"
                      : "bg-gradient-to-r from-purple-500 to-pink-600 text-white"
                  }`}
                  whileHover={stats.available > 0 ? { scale: 1.05 } : {}}
                  whileTap={stats.available > 0 ? { scale: 0.95 } : {}}
                >
                  <Key className="w-5 h-5" />
                  <span>Generate QR Codes</span>
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Codes List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-3xl p-6 border border-white/20">
            <h2 className="text-2xl font-light text-white mb-4">
              All Access Codes ({codes.length})
            </h2>

            {/* Table Header - Desktop */}
            <div className="hidden md:grid md:grid-cols-5 gap-4 px-4 py-3 bg-white/5 rounded-xl mb-3 text-white/60 text-sm">
              <div>Code</div>
              <div>Status</div>
              <div>Created At</div>
              <div>Used At</div>
              <div className="text-right">Actions</div>
            </div>

            {/* Codes List - Scrollable */}
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {codes.length === 0 ? (
                <div className="text-center py-12">
                  <Key className="w-16 h-16 text-white/20 mx-auto mb-4" />
                  <p className="text-white/60">No access codes generated yet</p>
                  <p className="text-white/40 text-sm mt-2">
                    Generate codes using the form above
                  </p>
                </div>
              ) : (
                codes.map((code, index) => (
                  <motion.div
                    key={code.code}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.02 }}
                    className={`p-4 rounded-xl border transition-all ${
                      code.used
                        ? "bg-red-500/5 border-red-500/20"
                        : "bg-green-500/5 border-green-500/20 hover:bg-green-500/10"
                    }`}
                  >
                    {/* Mobile Layout */}
                    <div className="md:hidden space-y-3">
                      <div className="flex items-center justify-between">
                        <code className="text-cyan-300 text-sm font-mono bg-black/20 px-3 py-1 rounded">
                          {code.code}
                        </code>
                        <div
                          className={`px-3 py-1 rounded-full text-xs ${
                            code.used
                              ? "bg-red-500/20 text-red-300"
                              : "bg-green-500/20 text-green-300"
                          }`}
                        >
                          {code.used ? "Used" : "Available"}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <div className="text-white/40 text-xs mb-1">
                            Created
                          </div>
                          <div className="text-white/80">
                            {new Date(code.created_at).toLocaleDateString()}
                          </div>
                        </div>
                        {code.used && (
                          <div>
                            <div className="text-white/40 text-xs mb-1">
                              Used
                            </div>
                            <div className="text-white/80">
                              {new Date(code.used_at).toLocaleDateString()}
                            </div>
                          </div>
                        )}
                      </div>

                      {!code.used && (
                        <motion.button
                          onClick={() => handleCopyCode(code.code)}
                          className="w-full bg-cyan-500/20 text-cyan-300 py-2 rounded-lg flex items-center justify-center space-x-2 text-sm"
                          whileTap={{ scale: 0.95 }}
                        >
                          {copiedCode === code.code ? (
                            <>
                              <Check className="w-4 h-4" />
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4" />
                              <span>Copy Code</span>
                            </>
                          )}
                        </motion.button>
                      )}

                      {!code.used && (
                        <motion.button
                          onClick={() => handleDeleteCode(code.code)}
                          className="w-full bg-red-500/20 text-red-300 py-2 rounded-lg flex items-center justify-center space-x-2 text-sm"
                          whileTap={{ scale: 0.95 }}
                        >
                          <X className="w-4 h-4" />
                          <span>Delete Code</span>
                        </motion.button>
                      )}
                    </div>

                    {/* Desktop Layout */}
                    <div className="hidden md:grid md:grid-cols-5 gap-4 items-center">
                      <code className="text-cyan-300 font-mono text-sm bg-black/20 px-3 py-1 rounded w-fit">
                        {code.code}
                      </code>

                      <div
                        className={`px-3 py-1 rounded-full text-xs w-fit ${
                          code.used
                            ? "bg-red-500/20 text-red-300"
                            : "bg-green-500/20 text-green-300"
                        }`}
                      >
                        {code.used ? "Used" : "Available"}
                      </div>

                      <div className="text-white/80 text-sm">
                        {new Date(code.created_at).toLocaleString()}
                      </div>

                      <div className="text-white/80 text-sm">
                        {code.used
                          ? new Date(code.used_at).toLocaleString()
                          : "-"}
                      </div>

                      <div className="flex justify-end space-x-2">
                        {!code.used && (
                          <>
                            <motion.button
                              onClick={() => handleCopyCode(code.code)}
                              className="bg-cyan-500/20 text-cyan-300 px-4 py-2 rounded-lg flex items-center space-x-2 text-sm"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              {copiedCode === code.code ? (
                                <>
                                  <Check className="w-4 h-4" />
                                  <span>Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-4 h-4" />
                                  <span>Copy</span>
                                </>
                              )}
                            </motion.button>

                            <motion.button
                              onClick={() => handleDeleteCode(code.code)}
                              className="bg-red-500/20 text-red-300 px-4 py-2 rounded-lg flex items-center space-x-2 text-sm"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <X className="w-4 h-4" />
                              <span>Delete</span>
                            </motion.button>
                          </>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </motion.div>
        {/* QR Code Print View */}
        <AnimatePresence>
          {showPrintView && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 print:hidden"
              onClick={() => setShowPrintView(false)}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="bg-white rounded-2xl p-6 max-w-6xl max-h-[90vh] overflow-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    QR Codes Preview
                  </h2>
                  <div className="flex space-x-3">
                    <button
                      onClick={handlePrint}
                      className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-2 rounded-lg flex items-center space-x-2"
                    >
                      <Download className="w-5 h-5" />
                      <span>Print</span>
                    </button>
                    <button
                      onClick={() => setShowPrintView(false)}
                      className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg flex items-center space-x-2"
                    >
                      <X className="w-5 h-5" />
                      <span>Close</span>
                    </button>
                  </div>
                </div>

                <div id="qr-print-area" className="grid grid-cols-3 gap-6">
                  {codes
                    .filter((c) => !c.used)
                    .map((code) => (
                      <div
                        key={code.code}
                        className="border-2 border-gray-300 rounded-lg p-4 flex flex-col items-center bg-white"
                      >
                        <img
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                            `https://audience-choice-award-system.vercel.app/?access_code=${code.code}`
                          )}`}
                          alt={`QR Code for ${code.code}`}
                          className="w-48 h-48 mb-3"
                        />
                        <code className="text-sm font-mono bg-gray-100 px-3 py-1 rounded text-gray-800">
                          {code.code}
                        </code>
                        <p className="text-xs text-gray-500 mt-2 text-center">
                          Scan to vote
                        </p>
                      </div>
                    ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(6, 182, 212, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(6, 182, 212, 0.5);
        }

        @media print {
  @page {
    size: A4;
    margin: 1cm;
  }

  body {
    background: white !important;
  }

  /* Hide everything except the print area */
  .fixed > div:not(#qr-print-area) {
    display: none !important;
  }

  /* Show only the QR code container */
  #qr-print-area {
    display: grid !important;
    grid-template-columns: repeat(3, 1fr) !important;
    gap: 1.5rem !important;
    page-break-inside: avoid;
  }

  /* Ensure QR code cards print correctly */
  #qr-print-area > div {
    page-break-inside: avoid;
    break-inside: avoid;
  }
}


        }
      `}</style>
    </div>
  );
}
