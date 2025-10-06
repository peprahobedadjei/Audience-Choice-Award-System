/* eslint-disable react/no-unescaped-entities */
import React, { useState } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
} from "framer-motion";
import {
  Check,
  Award,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const founders = [
  {
    id: 1,
    name: "Kevin Sexton",
    startup: "EcoTrack AI",
    tagline: "Carbon footprint tracking for enterprises",
    description:
      "Helping companies achieve net-zero through intelligent monitoring",
    color: "from-emerald-500 to-teal-600",
    bgColor: "from-emerald-900/40 to-teal-900/40",
  },
  {
    id: 2,
    name: "Christina McAlinden",
    startup: "HealthSync",
    tagline: "AI-powered patient care coordination",
    description: "Reducing hospital readmissions by 40% with predictive care",
    color: "from-blue-500 to-cyan-600",
    bgColor: "from-blue-900/40 to-cyan-900/40",
  },
  {
    id: 3,
    name: "Jerry Brixton",
    startup: "FinFlow",
    tagline: "Smart cash flow management for SMEs",
    description: "Real-time financial insights for small business growth",
    color: "from-purple-500 to-pink-600",
    bgColor: "from-purple-900/40 to-pink-900/40",
  },
  {
    id: 4,
    name: "Tom O'Brien",
    startup: "FoodLoop",
    tagline: "Reducing food waste through AI logistics",
    description: "Connecting surplus food with communities in need",
    color: "from-orange-500 to-red-600",
    bgColor: "from-orange-900/40 to-red-900/40",
  },
  {
    id: 5,
    name: "Yuki Tanaka",
    startup: "LearnPath",
    tagline: "Personalized education with adaptive AI",
    description: "Every student learns at their own perfect pace",
    color: "from-indigo-500 to-purple-600",
    bgColor: "from-indigo-900/40 to-purple-900/40",
  },
];

export default function DisruptVoting() {
  const [step, setStep] = useState("welcome");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [allocations, setAllocations] = useState(
    founders.reduce((acc, f) => ({ ...acc, [f.id]: 0 }), {})
  );
  const [direction, setDirection] = useState(0);

  const totalBudget = 50000;
  const allocated = Object.values(allocations).reduce(
    (sum, val) => sum + val,
    0
  );
  const remaining = totalBudget - allocated;
  const currentFounder = founders[currentIndex];

  const formatCurrency = (num) => {
    return new Intl.NumberFormat("en-IE", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  const handleAllocation = (id, value) => {
    const numValue = parseInt(value) || 0;
    const otherAllocated = allocated - allocations[id];
    const maxPossible = totalBudget - otherAllocated;

    setAllocations({
      ...allocations,
      [id]: Math.min(Math.max(0, numValue), maxPossible),
    });
  };

  const handleQuickAdd = (id, amount) => {
    const current = allocations[id];
    const newAmount = current + amount;
    if (newAmount <= remaining + current && newAmount >= 0) {
      setAllocations({
        ...allocations,
        [id]: newAmount,
      });
    }
  };

  const swipeNext = () => {
    if (currentIndex < founders.length - 1) {
      setDirection(1);
      setCurrentIndex(currentIndex + 1);
    }
  };

  const swipePrev = () => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSubmit = () => {
    if (allocated === totalBudget) {
      setStep("submitted");
    }
  };

  if (step === "welcome") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-cyan-500/10 to-transparent rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-pink-500/10 to-transparent rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 max-w-lg w-full"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-8"
          >
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              className="inline-block mb-4"
            >
              <Sparkles className="w-16 h-16 text-cyan-400 mx-auto" />
            </motion.div>
            <h1 className="text-5xl font-bold text-white mb-2 tracking-tight">
              DISRUPT
            </h1>
            <p className="text-2xl font-light text-cyan-400 tracking-widest">
              BY THE SEA
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl"
          >
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-white mb-3">
                Audience Choice Award
              </h2>
              <p className="text-gray-300 text-lg">
                Swipe through founders and back your favorites
              </p>
            </div>

            <div className="bg-gradient-to-r from-cyan-500 to-pink-500 rounded-2xl p-6 mb-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-5xl font-bold text-white">
                  {formatCurrency(totalBudget)}
                </span>
              </div>
              <p className="text-white/90 font-medium">
                Your Investment Budget
              </p>
            </div>

            <div className="space-y-3 mb-6 text-gray-300 text-sm">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-cyan-400 font-bold">1</span>
                </div>
                <p>Swipe through each founder&apos;s card</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-cyan-400 font-bold">2</span>
                </div>
                <p>Allocate your investment on each card</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-cyan-400 font-bold">3</span>
                </div>
                <p>Use all €50k before submitting your vote</p>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setStep("voting")}
              className="w-full bg-gradient-to-r from-cyan-500 to-pink-500 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-cyan-500/50 transition-all duration-300"
            >
              Start Investing
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  if (step === "submitted") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-lg w-full text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mb-6"
          >
            <div className="w-32 h-32 bg-gradient-to-r from-cyan-500 to-pink-500 rounded-full mx-auto flex items-center justify-center">
              <Check className="w-16 h-16 text-white" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Investment Confirmed!
            </h2>
            <p className="text-gray-300 text-lg mb-8">
              Your vote has been counted. Thanks for supporting innovation at
              Disrupt by the Sea!
            </p>

            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 mb-6">
              <h3 className="text-white font-semibold mb-4 flex items-center justify-center gap-2">
                <Award className="w-5 h-5 text-cyan-400" />
                Your Investment Breakdown
              </h3>
              <div className="space-y-3">
                {founders
                  .filter((f) => allocations[f.id] > 0)
                  .map((founder) => (
                    <div
                      key={founder.id}
                      className="flex justify-between items-center"
                    >
                      <span className="text-gray-300">{founder.startup}</span>
                      <span className="text-white font-bold">
                        {formatCurrency(allocations[founder.id])}
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            <p className="text-gray-400 text-sm">
              Results will be announced at the end of the event
            </p>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
    }),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col">
      {/* Fixed Header */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="bg-slate-900/80 backdrop-blur-xl border-b border-white/10 p-4"
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-xl font-bold text-white">Audience Choice</h1>
              <p className="text-sm text-gray-400">
                Founder {currentIndex + 1} of {founders.length}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">
                {formatCurrency(remaining)}
              </div>
              <div className="text-xs text-gray-400">Remaining</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="relative h-3 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              animate={{ width: `${(allocated / totalBudget) * 100}%` }}
              className={`absolute inset-y-0 left-0 rounded-full ${
                remaining === 0
                  ? "bg-gradient-to-r from-cyan-500 to-pink-500"
                  : "bg-gradient-to-r from-gray-500 to-gray-600"
              }`}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Progress Dots */}
          <div className="flex justify-center gap-2 mt-4">
            {founders.map((_, idx) => (
              <motion.div
                key={idx}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === currentIndex
                    ? "w-8 bg-gradient-to-r from-cyan-500 to-pink-500"
                    : allocations[founders[idx].id] > 0
                    ? "w-2 bg-cyan-500/50"
                    : "w-2 bg-white/20"
                }`}
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Card Stack */}
      <div className="flex-1 flex items-center justify-center p-4 relative overflow-hidden">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
              scale: { duration: 0.2 },
            }}
            className="w-full max-w-md"
          >
            <div
              className={`relative bg-gradient-to-br ${currentFounder.bgColor} backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden`}
            >
              {/* Gradient Overlay */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${currentFounder.color} opacity-10`}
              ></div>

              {/* Content */}
              <div className="relative z-10 p-8">
                {/* Startup Badge */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className={`inline-block bg-gradient-to-r ${currentFounder.color} text-white px-4 py-2 rounded-full text-sm font-bold mb-4`}
                >
                  {currentFounder.startup}
                </motion.div>

                {/* Founder Name */}
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-4xl font-bold text-white mb-2"
                >
                  {currentFounder.name}
                </motion.h2>

                {/* Tagline */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-xl text-gray-300 mb-2"
                >
                  {currentFounder.tagline}
                </motion.p>

                {/* Description */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-gray-400 mb-8"
                >
                  {currentFounder.description}
                </motion.p>

                {/* Investment Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-300 text-sm font-medium">
                        Your Investment
                      </span>
                    </div>
                    {allocations[currentFounder.id] > 0 && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="bg-cyan-500/20 p-1.5 rounded-full"
                      >
                        <Award className="w-4 h-4 text-cyan-400" />
                      </motion.div>
                    )}
                  </div>

                  <input
                    type="number"
                    value={allocations[currentFounder.id] || ""}
                    onChange={(e) =>
                      handleAllocation(currentFounder.id, e.target.value)
                    }
                    placeholder="0"
                    className="w-full bg-slate-900/50 border-2 border-slate-700 focus:border-cyan-500 rounded-xl px-4 py-4 text-white text-3xl font-bold focus:outline-none transition-all mb-4"
                  />

                  {/* Quick Add Buttons */}
                  <div className="grid grid-cols-3 gap-2">
                    {[5000, 10000, 25000].map((amount) => (
                      <motion.button
                        key={amount}
                        whileHover={{ scale: remaining >= amount ? 1.05 : 1 }}
                        whileTap={{ scale: remaining >= amount ? 0.95 : 1 }}
                        onClick={() =>
                          handleQuickAdd(currentFounder.id, amount)
                        }
                        disabled={remaining < amount}
                        className={`py-3 rounded-lg text-sm font-semibold transition-all ${
                          remaining >= amount
                            ? "bg-white/10 text-white hover:bg-white/20 border border-white/20"
                            : "bg-white/5 text-gray-600 cursor-not-allowed border border-white/5"
                        }`}
                      >
                        +{formatCurrency(amount)}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        {currentIndex > 0 && (
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={swipePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-full shadow-xl hover:bg-white/20 transition-all"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </motion.button>
        )}

        {currentIndex < founders.length - 1 && (
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={swipeNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-full shadow-xl hover:bg-white/20 transition-all"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </motion.button>
        )}
      </div>

      {/* Fixed Submit Button */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="bg-slate-900/90 backdrop-blur-xl border-t border-white/10 p-4"
      >
        <div className="max-w-4xl mx-auto">
          {remaining > 0 ? (
            <div className="bg-orange-500/20 border border-orange-500/30 rounded-xl p-3 mb-3">
              <p className="text-orange-300 text-sm text-center font-medium">
                Allocate all {formatCurrency(remaining)} before submitting
              </p>
            </div>
          ) : (
            <div className="bg-cyan-500/20 border border-cyan-500/30 rounded-xl p-3 mb-3">
              <p className="text-cyan-300 text-sm text-center font-medium flex items-center justify-center gap-2">
                <Check className="w-4 h-4" />
                Ready to submit your investments!
              </p>
            </div>
          )}

          <motion.button
            whileHover={remaining === 0 ? { scale: 1.02 } : {}}
            whileTap={remaining === 0 ? { scale: 0.98 } : {}}
            onClick={handleSubmit}
            disabled={remaining > 0}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
              remaining === 0
                ? "bg-gradient-to-r from-cyan-500 to-pink-500 text-white shadow-lg hover:shadow-cyan-500/50"
                : "bg-gray-700 text-gray-400 cursor-not-allowed"
            }`}
          >
            {remaining === 0
              ? "Confirm Investment"
              : "Complete Allocation First"}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
