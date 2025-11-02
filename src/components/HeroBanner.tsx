"use client";

import { motion } from "framer-motion";
import { GraduationCap, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

export default function HeroBanner() {
  const [userName, setUserName] = useState("Admin");

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUserName(data.user.name || data.user.username || "Admin");
        }
      });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-svitPrimary/95 via-svitPrimaryLight/90 to-svitPrimaryDark/95 p-8 md:p-12 mb-8 shadow-2xl border border-white/20 backdrop-blur-xl"
    >
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-0 left-0 w-96 h-96 bg-svitAccent rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -40, 0],
            y: [0, 40, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
          className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Welcome Back */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-4"
        >
          <p className="text-sm md:text-base text-gray-300 font-light">
            welcome back,
          </p>
        </motion.div>

        {/* NAMMA SVIT Gradient Text */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-2"
        >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold">
            <span className="bg-gradient-to-r from-white via-svitAccent to-svitAccent bg-clip-text text-transparent">
              NAMMA SVIT
            </span>
          </h1>
        </motion.div>

        {/* ERP PORTAL */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-6"
        >
          <p className="text-lg md:text-2xl text-white/90 font-medium">
            ERP PORTAL
          </p>
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-base md:text-lg text-white/80 italic mb-6 max-w-2xl font-light"
        >
          Built with Pride. Crafted with Care. Empowering Futures at NAMMA SVIT.
        </motion.p>

        {/* Stats Strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-wrap gap-4 mt-6"
        >
          <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg border border-white/20 hover:bg-white/15 transition-all">
            <div className="text-xs text-white/70">Empowering</div>
            <div className="text-sm font-semibold text-white">Students & Faculty</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg border border-white/20 hover:bg-white/15 transition-all">
            <div className="text-xs text-white/70">Through</div>
            <div className="text-sm font-semibold text-white">Digital Innovation</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg border border-white/20 flex items-center gap-2 hover:bg-white/15 transition-all">
            <Sparkles className="w-4 h-4 text-svitAccent" />
            <div className="text-sm font-semibold text-white">Live Dashboard</div>
          </div>
        </motion.div>
      </div>

      {/* Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-svitPrimary/0 via-svitAccent/10 to-svitPrimary/0 opacity-50 blur-2xl pointer-events-none" />
    </motion.div>
  );
}
