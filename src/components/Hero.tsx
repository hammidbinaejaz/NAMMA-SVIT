"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function Hero() {
  const [userName, setUserName] = useState("User");
  const [userRole, setUserRole] = useState("admin");

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUserName(data.user.name || data.user.username || "User");
          setUserRole(data.user.role || "admin");
        }
      })
      .catch(() => {
        // Silently fail if not authenticated
      });
  }, []);

  const roleGreetings: Record<string, string> = {
    admin: "Welcome back",
    student: "Welcome",
    teacher: "Welcome back",
    parent: "Welcome",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative overflow-hidden rounded-2xl p-6 md:p-8 mb-6 backdrop-blur-xl border border-white/10 shadow-lg"
      style={{
        background: "linear-gradient(135deg, rgba(12,20,45,0.75), rgba(30,40,60,0.6))",
      }}
    >
      
      <div className="flex flex-col items-center text-center relative z-10">
        {/* Welcome back, [user] - Small, muted */}
        <p className="text-sm md:text-base text-gray-300 mb-2">
          {roleGreetings[userRole] || "Welcome"}, <span className="font-medium text-[#FFD24A]">{userName}</span>
        </p>
        
        {/* NAMMA SVIT - Clean with neon yellow accent */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-2">
          <span className="text-[#FFD24A]">NAMMA SVIT</span>
        </h1>
        
        {/* Smart ERP */}
        <p className="text-base md:text-lg uppercase tracking-wider text-gray-400 mb-2 font-semibold">
          Smart Campus ERP
        </p>
        
        {/* Tagline */}
        <p className="text-sm md:text-base text-gray-300 mb-6 max-w-2xl font-medium">
          Built for SVIT — Empowering Smart Campus Operations
        </p>
        
        {/* Buttons */}
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            className="px-6 py-2.5 rounded-md text-sm font-medium text-white bg-[#FFD24A] hover:bg-[#FFD24A]/90 transition-all"
            style={{ transform: "translateZ(0)", willChange: "transform" }}
          >
            Live Dashboard
          </button>
          <button className="px-6 py-2.5 rounded-md text-sm font-medium text-gray-300 border border-white/20 hover:border-[#FFD24A]/50 hover:text-[#FFD24A] transition-all">
            Learn More
          </button>
        </div>
      </div>
    </motion.div>
  );
}


