"use client";

import { useState, useEffect } from "react";
import { Bell, MessageCircle } from "lucide-react";
import GlobalSearch from "./GlobalSearch";
import ThemeToggle from "./ThemeToggle";

export default function MinimalTopbar() {
  const [user, setUser] = useState<{ id: string; username: string; role: string; name?: string } | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
        }
      });
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <header className="sticky top-0 z-30 backdrop-blur-xl border-b border-white/10" style={{
      background: "rgba(255, 255, 255, 0.05)",
      backdropFilter: "blur(20px)",
    }}>
      <div className="flex items-center justify-between p-4">
        {/* Search */}
        <div className="hidden md:flex items-center gap-2 flex-1 max-w-md">
          <GlobalSearch />
        </div>
        
        <div className="flex-1 md:hidden" />

        {/* Actions */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button className="p-2 rounded-lg hover:bg-background transition-colors relative">
            <MessageCircle className="w-5 h-5 text-textSecondary" />
          </button>
          <button className="p-2 rounded-lg hover:bg-background transition-colors relative">
            <Bell className="w-5 h-5 text-textSecondary" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
          </button>
          
          {/* User */}
          <div className="flex items-center gap-3 pl-3 border-l border-border">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-medium text-textPrimary">
                {user?.name || user?.username || "User"}
              </div>
              <div className="text-xs text-textSecondary capitalize">
                {user?.role || "guest"}
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20">
              <span className="text-primary font-semibold text-sm">
                {(user?.name || user?.username || "U")[0].toUpperCase()}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="text-sm text-textSecondary hover:text-primary hover:bg-primary/5 transition-all px-3 py-2 rounded-lg font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

