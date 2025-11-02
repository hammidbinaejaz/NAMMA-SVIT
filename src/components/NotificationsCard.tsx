"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Bell, Check, X } from "lucide-react";
import { toast } from "react-toastify";
import Link from "next/link";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "error";
  read: boolean;
  createdAt: string;
  link?: string;
}

export default function NotificationsCard() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
    
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await fetch("/api/notifications");
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
        const unread = data.filter((n: Notification) => !n.read).length;
        setUnreadCount(unread);
        
        // Show toast for new unread notifications
        const newNotifications = data.filter((n: Notification) => !n.read);
        if (newNotifications.length > 0 && notifications.length > 0) {
          // Only show if we have existing notifications (to avoid showing on first load)
          newNotifications.slice(0, 1).forEach((notif: Notification) => {
            toast.info(`${notif.title}: ${notif.message}`);
          });
        }
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}`, { method: "PATCH" });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch("/api/notifications/read-all", { method: "PATCH" });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const typeColors = {
    info: "bg-blue-50 border-blue-200 text-blue-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
    success: "bg-green-50 border-green-200 text-green-800",
    error: "bg-red-50 border-red-200 text-red-800",
  };

  if (loading) {
    return (
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="h-4 bg-background rounded w-1/3 mb-4 animate-pulse"></div>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-background rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-textPrimary">Notifications</h3>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-xs text-primary hover:underline"
          >
            Mark all read
          </button>
        )}
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="text-center py-8 text-textSecondary">
            <Bell className="w-12 h-12 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No notifications</p>
          </div>
        ) : (
          notifications.slice(0, 5).map((notif) => (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={`p-3 rounded-lg border ${
                notif.read ? "bg-background" : typeColors[notif.type]
              } ${!notif.read ? "border-2" : "border-border"}`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <p className={`font-medium text-sm ${notif.read ? "text-textSecondary" : ""}`}>
                    {notif.title}
                  </p>
                  <p className={`text-xs mt-1 ${notif.read ? "text-textSecondary/80" : ""}`}>
                    {notif.message}
                  </p>
                  <p className="text-xs text-textSecondary/60 mt-1">
                    {new Date(notif.createdAt).toLocaleDateString()}
                  </p>
                </div>
                {!notif.read && (
                  <button
                    onClick={() => markAsRead(notif.id)}
                    className="p-1 hover:bg-white/50 rounded transition-colors"
                    title="Mark as read"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>

      {notifications.length > 5 && (
        <Link
          href="/admin/notifications"
          className="block text-center text-sm text-primary hover:underline mt-4"
        >
          View all notifications
        </Link>
      )}
    </div>
  );
}

