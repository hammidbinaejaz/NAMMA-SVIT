"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Radio, Bell, Calendar, Users, AlertCircle } from "lucide-react";

interface FeedItem {
  id: string;
  type: "event" | "announcement" | "attendance" | "alert";
  message: string;
  timestamp: Date | string;
  icon: React.ReactNode;
  color: string;
}

const ICON_MAP = {
  event: <Calendar className="w-4 h-4" />,
  announcement: <Bell className="w-4 h-4" />,
  attendance: <Users className="w-4 h-4" />,
  alert: <AlertCircle className="w-4 h-4" />,
};

export default function LiveCampusFeed() {
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    // Initial load
    fetch("/api/live-feed")
      .then((res) => res.json())
      .then((data) => {
        if (data.items) {
          // Convert timestamp strings to Date objects
          const items = data.items.map((item: any) => ({
            ...item,
            timestamp: typeof item.timestamp === 'string' ? new Date(item.timestamp) : item.timestamp,
          }));
          setFeedItems(items);
        }
      })
      .catch(() => {
        // Fallback mock data
        setFeedItems([
          {
            id: "1",
            type: "event",
            message: "🚀 Robotics Club Workshop starts in 10 mins!",
            timestamp: new Date(),
            icon: ICON_MAP.event,
            color: "text-blue-400",
          },
        ]);
      });

    // Poll for updates every 5 seconds
    const interval = setInterval(() => {
      if (isLive) {
        fetch("/api/live-feed")
          .then((res) => res.json())
          .then((data) => {
            if (data.items && data.items.length > feedItems.length) {
              // Convert timestamp strings to Date objects
              const newItems = data.items.slice(feedItems.length).map((item: any) => ({
                ...item,
                timestamp: typeof item.timestamp === 'string' ? new Date(item.timestamp) : item.timestamp,
              }));
              setFeedItems((prev) => [...prev, ...newItems]);
            }
          })
          .catch(() => {
            // Add mock feed items
            const mockTypes: FeedItem["type"][] = ["event", "announcement", "attendance", "alert"];
            const mockMessages = [
              "🎯 Mathematics Quiz scheduled for tomorrow",
              "📢 New library hours announced",
              "✅ 45 students marked present in CSE-A",
              "⚠️ Lab maintenance scheduled this weekend",
            ];
            
            const randomType = mockTypes[Math.floor(Math.random() * mockTypes.length)];
            const randomMsg = mockMessages[Math.floor(Math.random() * mockMessages.length)];
            
            const newItem: FeedItem = {
              id: Date.now().toString(),
              type: randomType,
              message: randomMsg,
              timestamp: new Date(),
              icon: ICON_MAP[randomType],
              color:
                randomType === "alert"
                  ? "text-red-400"
                  : randomType === "event"
                  ? "text-blue-400"
                  : randomType === "announcement"
                  ? "text-yellow-400"
                  : "text-green-400",
            };
            
            setFeedItems((prev) => [...prev, newItem].slice(-10)); // Keep last 10
          });
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isLive, feedItems.length]);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl border border-white/20 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-blue-600/5 to-purple-600/0 animate-pulse" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Live Campus Feed</h3>
          </div>
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                isLive ? "bg-green-400 animate-pulse" : "bg-gray-400"
              }`}
            />
            <span className="text-xs text-gray-400">{isLive ? "LIVE" : "OFFLINE"}</span>
          </div>
        </div>

        {/* Ticker Container */}
        <div className="h-32 overflow-hidden relative">
          <AnimatePresence mode="popLayout">
            {feedItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`mb-3 p-3 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors cursor-pointer flex items-center gap-3 ${item.color}`}
              >
                <div className={`${item.color} flex-shrink-0`}>{item.icon}</div>
                <div className="flex-1 min-w-0">
                      <p className="text-sm text-white font-medium truncate">{item.message}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(item.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {feedItems.length === 0 && (
            <div className="flex items-center justify-center h-full text-gray-400 text-sm">
              No live updates yet...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

