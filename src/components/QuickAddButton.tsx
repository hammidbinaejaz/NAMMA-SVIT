"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import QuickAddModal from "./QuickAddModal";

export default function QuickAddButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-6 right-6 z-40">
        <motion.button
          onClick={() => setIsOpen(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-14 h-14 bg-[#FFD24A] rounded-full shadow-lg hover:shadow-xl flex items-center justify-center text-gray-900 transition-all duration-200 relative overflow-hidden group"
          style={{ transform: "translateZ(0)", willChange: "transform" }}
        >
          {/* Ripple effect */}
          <span className="absolute inset-0 rounded-full bg-white/20 scale-0 group-hover:scale-150 transition-transform duration-500 opacity-0 group-hover:opacity-100" />
          <Plus className="w-6 h-6 relative z-10" />
        </motion.button>
      </div>

      {/* Quick Add Modal */}
      <QuickAddModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}

