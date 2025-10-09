/* eslint-disable react/no-unescaped-entities */
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  TrendingUp,
  Sparkles,
  Award,
  DollarSign,
} from "lucide-react";

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

  // Add founders state
  const [founders, setFounders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [allocations, setAllocations] = useState({});
  const [investorName, setInvestorName] = useState("");
  const [showThankYou, setShowThankYou] = useState(false);
  const totalBudget = 50000;

  useEffect(() => {
    fetchFounders();
  }, []);

  const fetchFounders = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/founders`);

      if (!response.ok) {
        throw new Error("Failed to fetch founders");
      }

      const data = await response.json();
      console.log(data);
      setFounders(data);
    } catch (error) {
      console.error("Error fetching founders:", error);
      alert("Failed to load founders from database");
    } finally {
      setLoading(false);
    }
  };

  // Generate investor name only on client side to avoid hydration mismatch
  useEffect(() => {
    setInvestorName(generateInvestorName());
  }, []);

  const allocatedAmount = Object.values(allocations).reduce(
    (sum, val) => sum + (val || 0),
    0
  );
  const remainingBudget = totalBudget - allocatedAmount;

  const currentFounder = founders[currentIndex];
  const currentAllocation = currentFounder
    ? allocations[currentFounder.id] || 0
    : 0;

  const handleAllocationChange = (value) => {
    const numValue = parseInt(value) || 0;
    const otherAllocations = Object.entries(allocations)
      .filter(([id]) => parseInt(id) !== currentFounder.id)
      .reduce((sum, [, val]) => sum + val, 0);

    const maxAllowable = totalBudget - otherAllocations;
    const finalValue = Math.min(Math.max(0, numValue), maxAllowable);

    setAllocations((prev) => ({
      ...prev,
      [currentFounder.id]: finalValue,
    }));
  };

  const handleNext = () => {
    if (currentIndex < founders.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

const handleSubmit = async () => {
  if (allocatedAmount !== totalBudget) {
    alert(
      `Please allocate all €${totalBudget.toLocaleString()}! You have €${remainingBudget.toLocaleString()} remaining.`
    );
    return;
  }

  // Get access code from localStorage
  const accessCode = localStorage.getItem('access_code');
  
  if (!accessCode) {
    alert('No access code found. Please scan a valid QR code.');
    window.location.href = '/';
    return;
  }

  try {
    // Submit vote to API
    const response = await fetch(`${API_URL}/api/submit-vote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        accessCode: accessCode,
        investorName: investorName,
        allocations: allocations,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to submit vote');
    }

    // Clear access code from localStorage
    localStorage.removeItem('access_code');

    // Show thank you page
    setShowThankYou(true);

  } catch (error) {
    console.error('Error submitting vote:', error);
    alert(error.message || 'Failed to submit vote. Please try again.');
  }
};

  const quickAllocate = (amount) => {
    handleAllocationChange(currentAllocation + amount);
  };

  if (showThankYou) {
    return (
      <ThankYouPage
        allocations={allocations}
        founders={founders}
        investorName={investorName}
      />
    );
  }
  // Show loading state while fetching founders
  if (loading) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-2xl">Loading founders...</div>
      </div>
    );
  }

  // Show message if no founders available
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
      <div className="relative z-20 bg-black/30 backdrop-blur-md border-b border-white/10 px-6 py-4">
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
              className="text-2xl font-light text-white"
              animate={{
                color:
                  remainingBudget < 10000
                    ? "#f87171"
                    : remainingBudget < 25000
                    ? "#fbbf24"
                    : "#ffffff",
              }}
            >
              €{remainingBudget.toLocaleString()}
            </motion.div>
          </div>

          <div className="text-right">
            <div className="text-white/60 text-xs mb-1">Allocated</div>
            <div className="text-2xl font-light text-cyan-400">
              €{allocatedAmount.toLocaleString()}
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

      {/* Founder Card */}
      <div className="relative z-10 px-6 py-6 flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentFounder.id}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
            className="mb-6"
          >
            {/* Founder Info Card */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-3xl p-6 border border-white/20 shadow-2xl mb-6">
              {/* Profile Photo */}
              <div className="flex justify-center mb-4">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white/20 shadow-xl">
                  {currentFounder.profile ? (
                    <img
                      src={
                        currentFounder.profile.startsWith("http")
                          ? currentFounder.profile
                          : `${API_URL}${currentFounder.profile}`
                      }
                      alt={currentFounder.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-600" />
                  )}
                </div>
              </div>

              <div className="flex items-start space-x-4 mb-4">
                {/* Logo */}
                <div
                  className={`w-16 h-16 rounded-2xl ${
                    currentFounder.logo.startsWith("/")
                      ? "bg-white"
                      : `bg-gradient-to-br ${currentFounder.color}`
                  } flex items-center justify-center shadow-lg flex-shrink-0`}
                >
                  {currentFounder.logo ? (
                    <img
                      src={
                        currentFounder.logo.startsWith("http")
                          ? currentFounder.logo
                          : `${API_URL}${currentFounder.logo}`
                      }
                      alt={currentFounder.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl">{currentFounder.logo}</span>
                  )}
                </div>

                {/* Name & Company */}
                <div className="flex-grow">
                  <h2 className="text-white text-2xl font-light mb-1">
                    {currentFounder.name}
                  </h2>
                  <div
                    className={`inline-block px-3 py-1 rounded-full ${
                      currentFounder.logo.startsWith("/")
                        ? "bg-green-500"
                        : `bg-gradient-to-r ${currentFounder.color}`
                    } text-white text-sm`}
                  >
                    {currentFounder.company}
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-white/80 text-sm leading-relaxed tracking-wide">
                {currentFounder.description}
              </p>
            </div>

            {/* Investment Input */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-3xl p-6 border border-white/20 shadow-2xl mb-4">
              <label className="text-white/60 text-sm mb-3 block">
                Your Investment Amount
              </label>

              <div className="flex items-center space-x-3 mb-4">
                <div className="flex-grow relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-xl">
                    €
                  </span>
                  <input
                    type="number"
                    value={currentAllocation || ""}
                    onChange={(e) => handleAllocationChange(e.target.value)}
                    placeholder="0"
                    className="w-full bg-white/10 text-white text-2xl font-light pl-10 pr-4 py-4 rounded-xl border border-white/20 focus:border-cyan-400 focus:outline-none transition-all"
                    min="0"
                    max={remainingBudget + currentAllocation}
                  />
                </div>
              </div>

              {/* Quick Allocate Buttons */}
              <div className="grid grid-cols-4 gap-2">
                {[5000, 10000, 15000, 20000].map((amount) => (
                  <motion.button
                    key={amount}
                    onClick={() => quickAllocate(amount)}
                    disabled={remainingBudget + currentAllocation < amount}
                    className={`py-2 rounded-lg text-sm ${
                      remainingBudget + currentAllocation >= amount
                        ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/50"
                        : "bg-white/5 text-white/30 border border-white/10"
                    }`}
                    whileHover={{
                      scale:
                        remainingBudget + currentAllocation >= amount
                          ? 1.05
                          : 1,
                    }}
                    whileTap={{
                      scale:
                        remainingBudget + currentAllocation >= amount
                          ? 0.95
                          : 1,
                    }}
                  >
                    +€{amount / 1000}k
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Progress */}
        <div className="flex justify-center space-x-2 mb-6">
          {founders.map((founder, idx) => (
            <motion.div
              key={founder.id}
              className={`h-2 rounded-full transition-all ${
                idx === currentIndex
                  ? "w-8 bg-gradient-to-r from-cyan-400 to-pink-500"
                  : allocations[founder.id] > 0
                  ? "w-2 bg-green-400"
                  : "w-2 bg-white/20"
              }`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: idx * 0.1 }}
            />
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="flex space-x-3">
          <motion.button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className={`flex-1 py-4 rounded-xl flex items-center justify-center space-x-2 ${
              currentIndex === 0
                ? "bg-white/5 text-white/30"
                : "bg-white/10 text-white border border-white/20"
            }`}
            whileHover={{ scale: currentIndex > 0 ? 1.02 : 1 }}
            whileTap={{ scale: currentIndex > 0 ? 0.98 : 1 }}
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Previous</span>
          </motion.button>

          {currentIndex < founders.length - 1 ? (
            <motion.button
              onClick={handleNext}
              className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-600 text-white py-4 rounded-xl flex items-center justify-center space-x-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>Next</span>
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          ) : (
            <motion.button
              onClick={handleSubmit}
              disabled={allocatedAmount !== totalBudget}
              className={`flex-1 py-4 rounded-xl flex items-center justify-center space-x-2 ${
                allocatedAmount === totalBudget
                  ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                  : "bg-white/10 text-white/40 border border-white/20"
              }`}
              whileHover={{ scale: allocatedAmount === totalBudget ? 1.02 : 1 }}
              whileTap={{ scale: allocatedAmount === totalBudget ? 0.98 : 1 }}
            >
              <Check className="w-5 h-5" />
              <span>Cast Vote</span>
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}

// Thank You Page Component
function ThankYouPage({ allocations, founders, investorName }) {
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
          <p className="text-white/60">Your vote has been recorded</p>
        </motion.div>

        {/* Investment Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 mb-6"
        >
          <h2 className="text-white text-xl font-light mb-4 flex items-center space-x-2">
            <DollarSign className="w-5 h-5 text-cyan-400" />
            <span>Your Investment Portfolio</span>
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
                    className={`w-10 h-10 rounded-lg bg-gradient-to-br ${founder.color} flex items-center justify-center text-lg`}
                  >
                  {founder.logo ? (
                    <img
                      src={
                        founder.logo.startsWith("http")
                          ? founder.logo
                          : `${API_URL}${founder.logo}`
                      }
                      alt={founder.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-600" />
                  )}
                  </div>
                  <div>
                    <div className="text-white text-sm">{founder.company}</div>
                    <div className="text-white/50 text-xs">{founder.name}</div>
                  </div>
                </div>
                <div className="text-cyan-400 font-semibold">
                  €{founder.amount.toLocaleString()}
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
