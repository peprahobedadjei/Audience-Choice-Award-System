import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, TrendingUp, DollarSign, Users, Crown, Medal, Award,X } from "lucide-react";

export default function Leaderboard() {
  const API_URL = "https://audience-choice-award-backend.vercel.app";
  
  const [results, setResults] = useState([]);
  const [totalVotes, setTotalVotes] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch results from API
  const fetchResults = async () => {
    try {
      const response = await fetch(`${API_URL}/api/results`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch results');
      }
      
      const data = await response.json();
      setResults(data.results);
      setTotalVotes(data.total_votes);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching results:', error);
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchResults();
  }, []);

  // Auto-refresh every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchResults();
    }, 5000);

    return () => clearInterval(interval);
  }, []);


  const handleResetVotes = async () => {
  if (!window.confirm('⚠️ Are you sure you want to delete ALL votes? This cannot be undone!')) {
    return;
  }

  try {
    const response = await fetch(`${API_URL}/api/reset-votes`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to reset votes');
    }

    alert('All votes have been reset successfully!');
    fetchResults(); 
  } catch (error) {
    console.error('Error resetting votes:', error);
    alert('Failed to reset votes. Please try again.');
  }
};
  // Get medal/crown icon based on position
  const getPositionIcon = (position) => {
    switch (position) {
      case 0:
        return <Crown className="w-8 h-8 text-yellow-400" />;
      case 1:
        return <Medal className="w-7 h-7 text-gray-300" />;
      case 2:
        return <Award className="w-7 h-7 text-amber-600" />;
      default:
        return null;
    }
  };

  // Get position styling
  const getPositionStyles = (position) => {
    switch (position) {
      case 0:
        return "from-yellow-500/20 to-amber-600/20 border-yellow-500/50 scale-105";
      case 1:
        return "from-gray-400/20 to-gray-500/20 border-gray-400/50";
      case 2:
        return "from-amber-700/20 to-amber-800/20 border-amber-600/50";
      default:
        return "from-white/5 to-white/10 border-white/20";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
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
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-white text-xl">Loading leaderboard...</p>
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

      {/* Animated Background Particles */}
      {[...Array(30)].map((_, i) => (
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

      <div className="relative z-10 min-h-screen px-4 py-8 md:px-8 max-w-6xl mx-auto">
        
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.div
            className="inline-block mb-4"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Trophy className="w-16 h-16 text-yellow-400 mx-auto" />
          </motion.div>
          
          <h1 className="text-5xl font-light text-white mb-3">
            Live Leaderboard
          </h1>
          <p className="text-cyan-300 text-lg">
            Audience Choice Award Results
          </p>
          
          {/* Live Indicator */}
          <motion.div
            className="inline-flex items-center space-x-2 mt-4 bg-red-500/20 px-4 py-2 rounded-full border border-red-500/50"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="w-2 h-2 bg-red-500 rounded-full" />
            <span className="text-red-300 text-sm">LIVE</span>
          </motion.div>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm mb-1">Total Votes Cast</p>
                <p className="text-3xl font-light text-white">{totalVotes}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm mb-1">Total Invested</p>
                <p className="text-2xl font-light text-white">
                {(totalVotes * 50000).toLocaleString()} Disrupt Dollars
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Results */}
        {totalVotes== 0 ? (
          <motion.div
            className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-3xl p-12 border border-white/20 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Trophy className="w-20 h-20 text-white/20 mx-auto mb-6" />
            <h2 className="text-3xl text-white font-light mb-3">
              No Votes Yet
            </h2>
            <p className="text-white/60 text-lg mb-6">
              Be the first to cast your vote!
            </p>
            <motion.button
              onClick={() => window.location.href = '/'}
              className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-8 py-3 rounded-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Cast Your Vote
            </motion.button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {results.map((founder, index) => (
                <motion.div
                  key={founder.id}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`bg-gradient-to-br ${getPositionStyles(index)} backdrop-blur-lg rounded-2xl p-6 border shadow-xl`}
                  layout
                >
                  <div className="flex items-center space-x-4">
                    {/* Position */}
                    <div className="flex flex-col items-center">
                      {getPositionIcon(index)}
                      <span className="text-white/60 text-sm mt-1">
                        #{index + 1}
                      </span>
                    </div>

                    {/* Logo */}
                    <div className="w-16 h-16 rounded-xl bg-white flex items-center justify-center flex-shrink-0 shadow-lg">
                      {founder.logo ? (
                        <img
                          src={founder.logo.startsWith('http') ? founder.logo : `${API_URL}${founder.logo}`}
                          alt={founder.company}
                          className="w-full h-full object-cover rounded-xl"
                        />
                      ) : (
                        <span className="text-2xl">{founder.company[0]}</span>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-grow">
                      <h3 className="text-white text-xl font-light mb-1">
                        {founder.company}
                      </h3>
                      <p className="text-white/60 text-sm">{founder.name}</p>
                    </div>

                    {/* Amount */}
                    <div className="text-right">
                      <motion.div
                        className="text-2xl font-light text-cyan-400"
                        key={founder.total_allocated}
                        initial={{ scale: 1.2 }}
                        animate={{ scale: 1 }}
                      >
                        {founder.total_allocated.toLocaleString()} Disrupt Dollars
                      </motion.div>
                      <div className="text-white/60 text-xs mt-1">
                        {totalVotes > 0 ? Math.round((founder.total_allocated / (totalVotes * 50000)) * 100) : 0}% of total
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4 bg-white/10 rounded-full h-2 overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-cyan-400 to-purple-600"
                      initial={{ width: 0 }}
                      animate={{
                        width: totalVotes > 0 ? `${(founder.total_allocated / (totalVotes * 50000)) * 100}%` : '0%'
                      }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

{/* Back Button & Reset */}
<motion.div
  className="flex justify-center items-center space-x-6 mt-8"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ delay: 0.5 }}
>
  <motion.button
    onClick={() => window.location.href = '/'}
    className="text-cyan-400 hover:text-cyan-300 underline"
    whileHover={{ scale: 1.05 }}
  >
    Back to Voting
  </motion.button>

  <motion.button
    onClick={handleResetVotes}
    className="bg-gradient-to-r from-red-500 to-red-700 text-white px-6 py-2 rounded-xl flex items-center space-x-2"
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    <X className="w-4 h-4" />
    <span>Reset All Votes</span>
  </motion.button>
</motion.div>
      </div>
    </div>
  );
}