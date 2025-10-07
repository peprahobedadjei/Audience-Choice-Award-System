import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, TrendingUp, DollarSign, ArrowRight, Sparkles,Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/router";

export default function DisruptInfoPage() {
  const [budget, setBudget] = useState(0);
  const targetBudget = 50000;
  const router = useRouter();

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
        setTimeout(() => {
      router.push("/audience-choice-award");
    }, 800);
   
  };

  const steps = [
    {
      number: "1",
      title: "Swipe & Explore",
      description: "Browse through each founder's",
      icon: TrendingUp,
      color: "from-cyan-400 to-cyan-600"
    },
    {
      number: "2",
      title: "Allocate Wisely",
      description: "Distribute your investment",
      icon: DollarSign,
      color: "from-purple-400 to-purple-600"
    },
    {
      number: "3",
      title: "Submit Your Vote",
      description: "Invest all €50k to cast your final decision",
      icon: Sparkles,
      color: "from-pink-400 to-pink-600"
    }
  ];

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
                className="text-5xl font-light text-white text-center tracking-wider"
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
                €{budget.toLocaleString()}
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Steps Section */}
        <motion.div
          className="space-y-4 mb-8 flex-grow"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.7 + index * 0.15 }}
              whileHover={{ scale: 1.02, x: 5 }}
              className="relative"
            >
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 shadow-xl">
                <div className="flex items-start space-x-4">
                  {/* Step Number */}
                  <motion.div
                    className={`flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center text-white text-xl font-semibold shadow-lg`}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    {step.number}
                  </motion.div>
                  
                  {/* Step Content */}
                  <div className="flex-grow">
                    <div className="flex items-center space-x-2 mb-2">
                      <step.icon className="w-5 h-5 text-cyan-300" />
                      <h3 className="text-white text-lg font-light tracking-wide">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-white/70 text-sm tracking-wide">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
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
          </motion.button>

          <motion.p
            className="text-white/60 text-center mt-4 text-sm tracking-wide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
          >
            May the best founder win!
          </motion.p>
        </motion.div>

      </div>
    </div>
  );
}