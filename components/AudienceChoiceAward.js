/* eslint-disable react/no-unescaped-entities */
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Award, DollarSign } from "lucide-react";

// Generate random investor name
const generateInvestorName = () => {
  const adjectives = [
    "Visionary",
    "Bold",
    "Strategic",
    "Savvy",
    "Dynamic",
    "Innovative",
    "Future",
    "Rising",
  ];
  const nouns = [
    "Investor",
    "Backer",
    "Angel",
    "Patron",
    "Supporter",
    "Pioneer",
  ];
  const numbers = Math.floor(Math.random() * 999) + 100;
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  return `${adj}${noun}${numbers}`;
};

export default function VotingPage() {
  const API_URL = "https://audience-choice-award-backend.vercel.app";

  const [founders, setFounders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generatedVoteCode, setGeneratedVoteCode] = useState(null);
  const [allocations, setAllocations] = useState({});
  const [investorName, setInvestorName] = useState("");
  const [showThankYou, setShowThankYou] = useState(false);
  const [showAlreadyVotedModal, setShowAlreadyVotedModal] = useState(false);
  const [selectedFounder, setSelectedFounder] = useState(null);
  const [tempAmount, setTempAmount] = useState("");
  const totalBudget = 50000;
  const [amountError, setAmountError] = useState(""); // Add this line
  const VOTE_CODE_KEY = "user_vote_code";

  useEffect(() => {
    fetchFounders();
    setInvestorName(generateInvestorName());
  }, []);

  const fetchFounders = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/founders`);
      if (!response.ok) throw new Error("Failed to fetch founders");
      const data = await response.json();
      setFounders(data);
    } catch (error) {
      alert("Failed to load founders from database");
    } finally {
      setLoading(false);
    }
  };

  const allocatedAmount = Object.values(allocations).reduce(
    (sum, val) => sum + (val || 0),
    0
  );
  const remainingBudget = totalBudget - allocatedAmount;

  const handleOpenModal = (founder) => {
    setSelectedFounder(founder);
    setTempAmount(allocations[founder.id] || "");
  };

  const handleCloseModal = () => {
    setSelectedFounder(null);
    setTempAmount("");
    setAmountError("");
  };

  const handleConfirmAmount = () => {
    const numValue = parseFloat(tempAmount) || 0;
    const currentAllocation = allocations[selectedFounder.id] || 0;
    const otherAllocations = Object.entries(allocations)
      .filter(([id]) => id !== selectedFounder.id)
      .reduce((sum, [, val]) => sum + val, 0);

    const maxAllowable = totalBudget - otherAllocations;

    if (numValue > maxAllowable) {
      setAmountError(
        `Amount exceeds remaining budget! You can only allocate ${maxAllowable.toLocaleString()} Disrupt Dollars`
      );
      return;
    }

    if (numValue < 0) {
      setAmountError(`Amount cannot be negative!`);
      return;
    }

    setAllocations((prev) => ({
      ...prev,
      [selectedFounder.id]: numValue,
    }));
    setAmountError("");
    handleCloseModal();
  };

  const handleSubmit = async () => {
    if (allocatedAmount !== totalBudget) {
      alert(`Please allocate all ${totalBudget.toLocaleString()} Disrupt Dollars!`);
      return;
    }

    // Check if user has already voted
    const existingVoteCode = localStorage.getItem(VOTE_CODE_KEY);
    if (existingVoteCode) {
      setShowAlreadyVotedModal(true);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/submit-vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          investorName: investorName,
          allocations: allocations,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        // Save vote code to localStorage
        localStorage.setItem(VOTE_CODE_KEY, data.vote_code);
        setGeneratedVoteCode(data.vote_code);
        setShowThankYou(true);
      } else {
        const data = await response.json();
        console.log(data.detail);
        setShowAlreadyVotedModal(true);
      }
    } catch (error) {
      setShowAlreadyVotedModal(true);
    }
  };

  if (showThankYou) {
    return (
      <ThankYouPage
        allocations={allocations}
        founders={founders}
        investorName={investorName}
        voteCode={generatedVoteCode}
      />
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-2xl">Loading founders...</div>
      </div>
    );
  }

  if (founders.length === 0) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-center">
          <p className="text-2xl mb-2">No founders available</p>
          <p className="text-white/60">
            Please add founders in the admin panel
          </p>
        </div>
      </div>
    );
  }

  if (showAlreadyVotedModal) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
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
        <motion.div
          className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-red-500/50 max-w-md w-full text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <X className="w-10 h-10 text-red-400" />
          </div>
          <h2 className="text-3xl text-white font-light mb-4">Already Voted</h2>
          <p className="text-red-300 mb-6">
            This acess code has already been used. You can only vote once.
          </p>
          <motion.button
            onClick={() => (window.location.href = "/")}
            className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white py-4 rounded-xl"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Go to Home
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
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

      {/* Header */}
      <div className="relative z-20 bg-black/30 backdrop-blur-md border-b border-white/10 px-4 py-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-3">
            <div className="text-white/60 text-sm">Investor</div>
            <div className="text-cyan-400 font-semibold text-sm">
              {investorName}
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <div className="text-white/60 text-xs mb-1">Remaining Budget</div>
              <motion.div
                className="text-base font-light text-white"
                animate={{
                  color:
                    remainingBudget < 10000
                      ? "#f87171"
                      : remainingBudget < 25000
                      ? "#fbbf24"
                      : "#ffffff",
                }}
              >
                {remainingBudget.toLocaleString()} Disrupt Dollars
              </motion.div>
            </div>

            <div className="text-right">
              <div className="text-white/60 text-xs mb-1">Allocated</div>
              <div className="text-base font-light text-cyan-400">
                {allocatedAmount.toLocaleString()} Disrupt Dollars
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-3 bg-white/10 rounded-full h-2 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-400 to-pink-500"
              initial={{ width: 0 }}
              animate={{ width: `${(allocatedAmount / totalBudget) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>

      {/* Founders Grid */}
      <div className="relative z-10 px-4 py-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
          {founders.map((founder, idx) => (
            <motion.div
              key={founder.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => handleOpenModal(founder)}
              className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-2xl p-4 border border-white/20 cursor-pointer hover:border-cyan-400/50 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Profile Image */}
              <div className="flex justify-center mb-3">
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white/20">
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
                    <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-600" />
                  )}
                </div>
              </div>

              {/* Name & Company */}
              <div className="text-center mb-3">
                <h3 className="text-white text-sm font-light mb-1">
                  {founder.name}
                </h3>
                <p className="text-cyan-300 text-xs">{founder.company}</p>
              </div>

              {/* Allocated Amount */}
              <div className="text-center">
                {allocations[founder.id] !== undefined ? (
                  <div className="bg-green-500/20 border border-green-400/50 rounded-lg py-2 px-3">
                    <p className="text-green-300 text-sm font-semibold">
                      {allocations[founder.id].toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })} Disrupt Dollars
                    </p>
                  </div>
                ) : (
                  <div className="bg-white/5 border border-white/20 rounded-lg py-2 px-3">
                    <p className="text-white/40 text-sm">Tap to allocate</p>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Cast Vote Button */}
        {allocatedAmount === totalBudget && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-xl flex items-center justify-center space-x-2 text-lg font-semibold shadow-lg"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Check className="w-6 h-6" />
            <span>Cast Vote</span>
          </motion.button>
        )}
      </div>

      {/* Modal for Allocation */}
      <AnimatePresence>
        {selectedFounder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={handleCloseModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/30 max-w-md w-full"
            >
              {/* Close Button */}
              <button
                onClick={handleCloseModal}
                className="absolute top-4 right-4 w-8 h-8 bg-white/10 rounded-full flex items-center justify-center"
              >
                <X className="w-5 h-5 text-white" />
              </button>

              {/* Profile Image */}
              <div className="flex justify-center mb-4">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white/20">
                  {selectedFounder.profile ? (
                    <img
                      src={
                        selectedFounder.profile.startsWith("http")
                          ? selectedFounder.profile
                          : `${API_URL}${selectedFounder.profile}`
                      }
                      alt={selectedFounder.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-600" />
                  )}
                </div>
              </div>

              {/* Logo & Info */}
              <div className="flex items-center space-x-3 mb-4">
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${selectedFounder.color} flex items-center justify-center`}
                >
                  {selectedFounder.logo && (
                    <img
                      src={
                        selectedFounder.logo.startsWith("http")
                          ? selectedFounder.logo
                          : `${API_URL}${selectedFounder.logo}`
                      }
                      alt={selectedFounder.name}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  )}
                </div>
                <div>
                  <h2 className="text-white text-xl font-light">
                    {selectedFounder.name}
                  </h2>
                  <p className="text-cyan-300 text-sm">
                    {selectedFounder.company}
                  </p>
                </div>
              </div>

              <div className="max-h-40 overflow-y-auto mb-4">
                <p className="text-white/80 text-sm leading-relaxed">
                  {selectedFounder.description}
                </p>
              </div>

              {/* Amount Input */}
              <div className="mb-4">
                <label className="text-white/60 text-sm mb-2 block">
                   Amount in Disrupt Dollars
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01" // Add this to allow decimals
                    value={tempAmount}
                    onChange={(e) => setTempAmount(e.target.value)}
                    placeholder="0.00" // Change placeholder
                    className="w-full bg-white/10 text-white text-2xl font-light pl-10 pr-4 py-4 rounded-xl border border-white/20 focus:border-cyan-400 focus:outline-none"
                    min="0"
                    max={
                      remainingBudget + (allocations[selectedFounder.id] || 0)
                    }
                  />

                </div>
              </div>
              {/* Error Message - ADD THIS */}
              {amountError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 bg-red-500/20 border border-red-400/50 rounded-lg p-3"
                >
                  <p className="text-red-300 text-xs text-center">
                    {amountError}
                  </p>
                </motion.div>
              )}
              {/* Quick Amounts */}
              {/* <div className="grid grid-cols-4 gap-2 mb-4">
                {[5000, 10000, 15000, 20000].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setTempAmount(amount.toString())}
                    className="bg-cyan-500/20 text-cyan-300 py-2 rounded-lg text-sm border border-cyan-500/50"
                  >
                    {amount / 1000}k
                  </button>
                ))}
              </div> */}

              {/* Confirm Button */}
              <motion.button
                onClick={handleConfirmAmount}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-xl flex items-center justify-center space-x-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Check className="w-5 h-5" />
                <span>Confirm Amount</span>
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Thank You Page Component
function ThankYouPage({ allocations, founders, investorName, voteCode }) {
  const API_URL = "https://audience-choice-award-backend.vercel.app";

  const sortedAllocations = founders
    .map((founder) => ({
      ...founder,
      amount: allocations[founder.id] || 0,
    }))
    .filter((f) => f.amount > 0)
    .sort((a, b) => b.amount - a.amount);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-6">
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

      {/* Confetti Effect */}
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-3 rounded-full"
          style={{
            background: ["#06b6d4", "#a855f7", "#ec4899", "#f59e0b"][i % 4],
            left: `${Math.random() * 100}%`,
            top: -20,
          }}
          animate={{
            y: ["0vh", "100vh"],
            rotate: [0, 360],
            opacity: [1, 0],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            delay: Math.random() * 2,
            repeat: Infinity,
          }}
        />
      ))}

      <motion.div
        className="relative z-10 max-w-md w-full"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Success Icon */}
        <motion.div
          className="flex justify-center mb-6"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
        >
          <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center shadow-2xl">
            <Award className="w-12 h-12 text-white" />
          </div>
        </motion.div>

        {/* Thank You Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-light text-white mb-3">Thank You!</h1>
          <p className="text-cyan-200 text-lg mb-2">{investorName}</p>
          {voteCode && (
            <div className="bg-cyan-500/20 border border-cyan-400/50 rounded-lg p-3 mb-3">
              <p className="text-white/60 text-xs mb-1">
                Your Vote Confirmation Code
              </p>
              <p className="text-cyan-300 text-xl font-mono font-semibold tracking-wider">
                {voteCode}
              </p>
            </div>
          )}
          <p className="text-white/60">Your vote has been recorded</p>
        </motion.div>

        {/* Investment Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 mb-6"
        >
          <h2 className="text-white text-base font-light mb-4 flex items-center space-x-2">
            <span>Your Investment Portfolio in Disrupt Dollars</span>
          </h2>

          <div className="space-y-3">
            {sortedAllocations.map((founder, idx) => (
              <motion.div
                key={founder.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + idx * 0.1 }}
                className="flex items-center justify-between py-3 border-b border-white/10 last:border-0"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-10 h-10 rounded-lg bg-gradient-to-br ${founder.color} flex items-center justify-center`}
                  >
                    {founder.logo && (
                      <img
                        src={
                          founder.logo.startsWith("http")
                            ? founder.logo
                            : `${API_URL}${founder.logo}`
                        }
                        alt={founder.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    )}
                  </div>
                  <div>
                    <div className="text-white text-sm">{founder.company}</div>
                    <div className="text-white/50 text-xs">{founder.name}</div>
                  </div>
                </div>
                <div className="text-cyan-400 font-semibold text-sm">
                  {founder.amount.toLocaleString()}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-center"
        >
          <p className="text-white/60 text-sm mb-4">
            Final results will be seen on the LeadBoard
          </p>
          <motion.button
            onClick={() => (window.location.href = "/")}
            className="text-cyan-400 text-sm underline"
            whileHover={{ scale: 1.05 }}
          >
            Return to Home
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}
