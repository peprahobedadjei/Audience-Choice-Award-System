import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, TrendingUp, DollarSign, ArrowRight, Sparkles,Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/router";

export default function DisruptInfoPage() {
  const [budget, setBudget] = useState(0);
  const targetBudget = 50000;
  const router = useRouter();
    const [isStarting, setIsStarting] = useState(false);

  // Animate budget counter on mount
  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const increment = targetBudget / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= targetBudget) {
        setBudget(targetBudget);
        clearInterval(timer);
      } else {
        setBudget(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, []);

  const handleStartInvesting = () => {
      setIsStarting(true);
        setTimeout(() => {
      router.push("/audience-choice-award");
    }, 800);
   
  };


  return (
    <div className="relative min-h-screen w-full overflow-hidden">
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

      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/bg2.png"
          alt="Disrupt by the Sea Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/70 via-cyan-900/80 to-pink-900/70"></div>
      </div>

      {/* Animated Background Particles */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-white rounded-full opacity-20"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}

      {/* Main Content */}
      <div className="relative z-10 flex flex-col min-h-screen px-6 py-8">
        
        {/* Header Logo */}
        <motion.div
          className="flex justify-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Image
            src="/Disrupt.png"
            alt="Disrupt by the Sea"
            width={280}
            height={48}
            className="object-contain"
          />
        </motion.div>

        {/* Title Section */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          
          <h1 className="text-2xl font-light text-white mb-3 tracking-wide">
            Audience Choice Award
          </h1>
          <p className="text-cyan-200 text-sm tracking-wide">
            Back the founders who inspire you
          </p>
        </motion.div>

        {/* Budget Display */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 p-1 rounded-3xl shadow-2xl">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl px-8 py-6">
              <div className="text-white/80 text-sm tracking-widest text-center mb-2">
                YOUR INVESTMENT BUDGET
              </div>
              <motion.div 
                className="text-2xl font-light text-white text-center tracking-wider"
                animate={{
                  textShadow: [
                    "0 0 20px rgba(255,255,255,0.3)",
                    "0 0 30px rgba(255,255,255,0.5)",
                    "0 0 20px rgba(255,255,255,0.3)",
                  ]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                  {budget.toLocaleString()} Disrupt Dollars
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Info Section */}
<motion.div
  className="mb-8 flex-grow space-y-4"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.6, delay: 0.6 }}
>
  {/* Main Explanation */}
  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl">
    <h3 className="text-cyan-300 text-lg font-light mb-3 text-center">
      How It Works
    </h3>
    <p className="text-white/80 text-sm leading-relaxed text-center">
      Allocate your <span className="text-cyan-300 font-semibold">50,000 Disrupt Dollars</span> across the founders you believe in. Browse their pitches, decide who gets your support, and cast your vote!
    </p>
  </div>

  {/* Important Notes */}
  <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-md rounded-2xl p-5 border border-purple-300/30">
    <h4 className="text-pink-300 text-sm font-semibold mb-3 flex items-center justify-center">
      <Sparkles className="w-4 h-4 mr-2" />
      Important to Know
    </h4>
    <ul className="space-y-2 text-white text-sm">
      <li>1. <span className="text-white">Disrupt Dollars are virtual currency.</span> No real money involved!</li>
      <li>2. <span className="text-white">No personal data is collected.</span> Completely anonymous voting</li>
      <li>3. <span className="text-white">Just for fun.</span> Help crown the audience favorite!</li>
    </ul>
  </div>
</motion.div>


        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          <motion.button
            onClick={handleStartInvesting}
            className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 py-5 rounded-2xl shadow-2xl relative overflow-hidden group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Animated Shine Effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              animate={{
                x: ["-100%", "200%"],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
                repeatDelay: 2
              }}
            />
            
            <AnimatePresence mode="wait">
              {isStarting ? (
                <motion.span
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="relative z-10 flex items-center justify-center space-x-3"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <Loader2 className="w-6 h-6 text-purple-600" />
                  </motion.div>
                  <span className="bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-600 bg-clip-text text-transparent font-semibold">
                    LOADING...
                  </span>
                </motion.span>
              ) : (
                <motion.span
                  key="default"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="relative z-10 flex items-center justify-center space-x-3"
                >
           <span className="relative z-10 flex items-center justify-center space-x-3">
              <span className="text-white text-xl font-light tracking-widest">
                START INVESTING
              </span>
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <ArrowRight className="w-6 h-6 text-white" />
              </motion.div>
            </span>
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          <motion.p
            className="text-white/60 text-center mt-4 text-sm tracking-wide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
          >
           Virtual investing • No real money • No data collected
          </motion.p>
        </motion.div>

      </div>
    </div>
  );
}