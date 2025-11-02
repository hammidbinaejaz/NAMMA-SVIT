"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, UserPlus, GraduationCap, Bell, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickAddModal({ isOpen, onClose }: QuickAddModalProps) {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const quickActions = [
    { 
      icon: <UserPlus className="w-6 h-6" />, 
      label: "Add Student", 
      href: "/admin/students",
      color: "blue"
    },
    { 
      icon: <GraduationCap className="w-6 h-6" />, 
      label: "Add Faculty", 
      href: "/admin/faculty",
      color: "gold"
    },
    { 
      icon: <Bell className="w-6 h-6" />, 
      label: "New Announcement", 
      href: "/admin/announcements",
      color: "blue"
    },
    { 
      icon: <Calendar className="w-6 h-6" />, 
      label: "Create Event", 
      href: "/admin/events",
      color: "gold"
    },
  ];

  const handleAction = (href: string) => {
    router.push(href);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full max-w-md bg-card rounded-2xl border border-border p-6 shadow-[0_20px_60px_rgba(0,0,0,0.1)] relative">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 hover:bg-background rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-textSecondary" />
              </button>

              {/* Header */}
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-textPrimary mb-2">
                  Quick Add
                </h2>
                <p className="text-sm text-textSecondary">
                  Create a new record quickly
                </p>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-4">
                {quickActions.map((action) => (
                  <motion.button
                    key={action.label}
                    onClick={() => handleAction(action.href)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="p-4 rounded-xl border border-border hover:border-primary hover:bg-primary/5 transition-all group"
                  >
                    <div className="mb-3 p-3 rounded-lg inline-block bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                      {action.icon}
                    </div>
                    <div className="text-sm font-semibold text-textPrimary text-left">
                      {action.label}
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

