/* eslint-disable react/no-unescaped-entities */
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Zap } from "lucide-react";
import Image from "next/image";

export default function DisruptLanding() {
  const [isStarting, setIsStarting] = useState(false);

  const handleStart = () => {
    setIsStarting(true);
    // Navigate to voting page after animation
    setTimeout(() => {
      // This would be router.push('/vote') in actual Next.js
      alert("Navigating to voting page...");
    }, 800);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500">
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
          src="/bg.jpeg"
          alt="Disrupt by the Sea Background"
          className="w-full h-full object-cover"
        />
        {/* Dark Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/60 via-cyan-900/90 to-pink-900/70"></div>
      </div>

      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px)`,
          }}
        ></div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-between px-6 py-8">
        {/* Top Section - Logos */}
        <motion.div
          className="w-full flex flex-col items-center space-y-4"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Alpha Innovation Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <Image
              src="/ALPHA.png"
              alt="Alpha Innovation"
              width={150}
              height={48}
              className="object-contain"
            />
          </motion.div>
        </motion.div>

        {/* Center Section - Main Logo and Tagline */}
        <motion.div
          className="flex flex-col items-center space-y-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Disrupt by the Sea Logo */}
          <div className="relative">
            <motion.div
              className="absolute -inset-4 bg-gradient-to-r from-cyan-300 via-pink-300 to-purple-300 rounded-full blur-2xl opacity-50"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.5, 0.7, 0.5],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <div className="relative text-center">
              <Image
                src="/Disrupt.png"
                alt="Alpha Innovation"
                width={385}
                height={48}
                className="object-contain"
              />
            </div>
          </div>

          {/* Tagline */}
          <motion.div
            className="text-center space-y-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <div className="text-white text-xl font-light tracking-wide">
              WHO WILL PITCH?
            </div>
            <div className="text-white text-xl font-light tracking-wide">
              WHO WILL DISRUPT?
            </div>
          </motion.div>

          {/* Date Badge */}
          <motion.div
            className="flex items-center space-x-3 bg-gradient-to-r from-pink-400 to-pink-500 px-8 py-4 rounded-full shadow-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 20px 40px rgba(236, 72, 153, 0.4)",
            }}
          >
            <Calendar className="w-6 h-6 text-white" />
            <span className="text-white text-xl font-light tracking-wider">
              Thu 16 October
            </span>
          </motion.div>
        </motion.div>

        {/* Bottom Section - Start Button */}
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          <motion.button
            onClick={handleStart}
            className="w-full bg-white py-4 rounded-2xl text-2xl font-light tracking-widest shadow-2xl relative overflow-hidden"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isStarting}
          >
            {/* Button Glow Effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 opacity-0"
              whileHover={{ opacity: 0.1 }}
            />

            <span className="relative z-10 flex items-center justify-center space-x-3">
              <Zap className="w-6 h-6 text-purple-600" />
              <span className=" text-sm bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-600 bg-clip-text text-transparent font-semibold">
                GET STARTED 
              </span>
            </span>
          </motion.button>

          {/* Subtitle */}
          <motion.p
            className="text-white/80 text-center mt-4 text-sm tracking-wide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            Cast your vote for the Audience Choice Award
          </motion.p>
        </motion.div>
      </div>

      {/* Floating Particles Effect */}
      {[...Array(20)].map((_, i) => (
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
    </div>
  );
}
