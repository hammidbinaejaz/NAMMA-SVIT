"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Command } from "lucide-react";
import { useRouter } from "next/navigation";

export default function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const quickLinks = [
    { label: "Students", href: "/list/students", category: "Data" },
    { label: "Faculty", href: "/list/teachers", category: "Data" },
    { label: "Manage Students", href: "/admin/students", category: "Admin" },
    { label: "Manage Faculty", href: "/admin/faculty", category: "Admin" },
    { label: "Announcements", href: "/list/announcements", category: "Communication" },
    { label: "Events", href: "/list/events", category: "Communication" },
  ];

  const filteredLinks = quickLinks.filter((link) =>
    link.label.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl mx-4"
            >
              <div className="bg-card backdrop-blur-xl rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.1)] border border-border overflow-hidden">
                {/* Search Input */}
                <div className="flex items-center gap-3 p-4 border-b border-border">
                  <Search className="w-5 h-5 text-textSecondary" />
                  <input
                    type="text"
                    placeholder="Search anything..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    autoFocus
                    className="flex-1 outline-none text-lg bg-transparent text-textPrimary placeholder:text-textSecondary"
                  />
                  <div className="flex items-center gap-2 text-xs text-textSecondary">
                    <kbd className="px-2 py-1 bg-background rounded">Esc</kbd>
                    <span>to close</span>
                  </div>
                </div>

                {/* Results */}
                <div className="max-h-96 overflow-y-auto">
                  {filteredLinks.length > 0 ? (
                    <div className="p-2">
                      {filteredLinks.map((link) => (
                        <button
                          key={link.href}
                          onClick={() => {
                            router.push(link.href);
                            setIsOpen(false);
                          }}
                          className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-primary/5 transition-colors text-left group"
                        >
                          <div>
                            <div className="font-medium text-textPrimary group-hover:text-primary">
                              {link.label}
                            </div>
                            <div className="text-xs text-textSecondary">{link.category}</div>
                          </div>
                          <div className="text-xs text-textSecondary opacity-0 group-hover:opacity-100 transition-opacity">
                            →
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center text-textSecondary">
                      No results found for &quot;{query}&quot;
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Search Trigger */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-card rounded-lg border border-border hover:border-primary transition-all text-sm text-textSecondary w-full"
      >
        <Search className="w-4 h-4" />
        <span className="flex-1 text-left">Search anything...</span>
        <kbd className="px-2 py-0.5 bg-background rounded text-xs hidden sm:inline">⌘K</kbd>
      </button>
    </>
  );
}

