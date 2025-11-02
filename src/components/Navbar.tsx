"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import GlobalSearch from "./GlobalSearch";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
  const router = useRouter();
  const [user, setUser] = useState<{ id: string; username: string; role: string; name?: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-between p-4">
        <div className="flex-1" />
        <div className="flex items-center gap-6 justify-end w-full">
          <div className="text-xs text-gray-500">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between p-4 md:p-6 bg-white/60 backdrop-blur-md border-b border-white/20 sticky top-0 z-40">
      {/* Global Search Integration */}
      <GlobalSearch />
      
      {/* ICONS AND USER */}
      <div className="flex items-center gap-4 md:gap-6 justify-end w-full">
        <ThemeToggle />
        <div className="bg-white/80 backdrop-blur-sm rounded-full w-9 h-9 flex items-center justify-center cursor-pointer hover:bg-svitPrimary/10 hover:shadow-[0_0_10px_rgba(11,60,125,0.2)] transition-all">
          <Image src="/message.png" alt="" width={20} height={20} />
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-full w-9 h-9 flex items-center justify-center cursor-pointer relative hover:bg-svitAccent/10 hover:shadow-[0_0_10px_rgba(229,168,35,0.2)] transition-all">
          <Image src="/announcement.png" alt="" width={20} height={20} />
          <div className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center bg-gradient-to-br from-svitAccent to-svitAccentDark text-white rounded-full text-xs shadow-lg">
            1
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-sm leading-4 font-semibold text-gray-800">
            {user?.name || user?.username || "User"}
          </span>
          <span className="text-xs text-gray-500 capitalize">
            {user?.role || "guest"}
          </span>
        </div>
        <button
          onClick={handleLogout}
          className="text-sm text-gray-600 hover:text-svitPrimary hover:bg-svitPrimary/10 transition-all px-4 py-2 rounded-lg font-medium"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
