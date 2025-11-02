"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Home,
  GraduationCap,
  Users,
  UserCheck,
  BookOpen,
  School,
  Calendar,
  MessageSquare,
  Bell,
  Briefcase,
  FileText,
  ClipboardList,
  BarChart3,
  Settings,
  LogOut,
  User,
  Shield,
  Menu as MenuIcon,
} from "lucide-react";
import { getSession } from "@/lib/auth";

const iconMap: Record<string, React.ReactNode> = {
  "/": <Home className="w-5 h-5" />,
  "/admin/students": <Users className="w-5 h-5" />,
  "/admin/faculty": <GraduationCap className="w-5 h-5" />,
  "/admin/announcements": <Bell className="w-5 h-5" />,
  "/admin/events": <Calendar className="w-5 h-5" />,
  "/list/teachers": <GraduationCap className="w-5 h-5" />,
  "/list/students": <Users className="w-5 h-5" />,
  "/list/parents": <UserCheck className="w-5 h-5" />,
  "/list/subjects": <BookOpen className="w-5 h-5" />,
  "/list/classes": <School className="w-5 h-5" />,
  "/list/lessons": <FileText className="w-5 h-5" />,
  "/list/exams": <ClipboardList className="w-5 h-5" />,
  "/list/assignments": <FileText className="w-5 h-5" />,
  "/list/results": <BarChart3 className="w-5 h-5" />,
  "/list/attendance": <ClipboardList className="w-5 h-5" />,
  "/list/events": <Calendar className="w-5 h-5" />,
  "/list/messages": <MessageSquare className="w-5 h-5" />,
  "/list/announcements": <Bell className="w-5 h-5" />,
  "/list/placements": <Briefcase className="w-5 h-5" />,
  "/list/feedback": <MessageSquare className="w-5 h-5" />,
  "/profile": <User className="w-5 h-5" />,
  "/settings": <Settings className="w-5 h-5" />,
};

const menuItems = [
  {
    title: "MENU",
    items: [
      { icon: "/home.png", label: "Home", href: "/", visible: ["admin", "teacher", "student", "parent"] },
      { icon: "/student.png", label: "Manage Students", href: "/admin/students", visible: ["admin"] },
      { icon: "/teacher.png", label: "Manage Faculty", href: "/admin/faculty", visible: ["admin"] },
      { icon: "/announcement.png", label: "Manage Announcements", href: "/admin/announcements", visible: ["admin"] },
      { icon: "/calendar.png", label: "Manage Events", href: "/admin/events", visible: ["admin"] },
      { icon: "/teacher.png", label: "Faculty", href: "/list/teachers", visible: ["admin", "teacher"] },
      { icon: "/student.png", label: "Students", href: "/list/students", visible: ["admin", "teacher"] },
      { icon: "/parent.png", label: "Parents", href: "/list/parents", visible: ["admin", "teacher"] },
      { icon: "/subject.png", label: "Subjects", href: "/list/subjects", visible: ["admin"] },
      { icon: "/class.png", label: "Classes", href: "/list/classes", visible: ["admin", "teacher"] },
      { icon: "/lesson.png", label: "Lessons", href: "/list/lessons", visible: ["admin", "teacher"] },
      { icon: "/exam.png", label: "Exams", href: "/list/exams", visible: ["admin", "teacher", "student", "parent"] },
      { icon: "/assignment.png", label: "Assignments", href: "/list/assignments", visible: ["admin", "teacher", "student", "parent"] },
      { icon: "/result.png", label: "Results", href: "/list/results", visible: ["admin", "teacher", "student", "parent"] },
      { icon: "/attendance.png", label: "Attendance", href: "/list/attendance", visible: ["admin", "teacher", "student", "parent"] },
      { icon: "/calendar.png", label: "Events", href: "/list/events", visible: ["admin", "teacher", "student", "parent"] },
      { icon: "/message.png", label: "Messages", href: "/list/messages", visible: ["admin", "teacher", "student", "parent"] },
      { icon: "/announcement.png", label: "Announcements", href: "/list/announcements", visible: ["admin", "teacher", "student", "parent"] },
      { icon: "/result.png", label: "Placement Cell", href: "/list/placements", visible: ["admin", "teacher", "student"] },
      { icon: "/message.png", label: "Feedback", href: "/list/feedback", visible: ["admin", "teacher", "student", "parent"] },
    ],
  },
  {
    title: "OTHER",
    items: [
      { icon: "/profile.png", label: "Profile", href: "/profile", visible: ["admin", "teacher", "student", "parent"] },
      { icon: "/setting.png", label: "Settings", href: "/settings", visible: ["admin", "teacher", "student", "parent"] },
      { icon: "/logout.png", label: "Logout", href: "/logout", visible: ["admin", "teacher", "student", "parent"] },
    ],
  },
];

export default function MenuDock() {
  const pathname = usePathname();
  const [hoveredIndex, setHoveredIndex] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [role, setRole] = useState<string>("");

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setRole(data.user.role);
        }
      });
  }, []);

  const getIcon = (href: string) => {
    return iconMap[href] || <MenuIcon className="w-5 h-5" />;
  };

  return (
    <motion.div
      className="fixed left-4 top-1/2 -translate-y-1/2 z-50"
      onHoverStart={() => setExpanded(true)}
      onHoverEnd={() => setExpanded(false)}
    >
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-3 transition-all duration-300">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center justify-center mb-4 p-2 rounded-xl hover:bg-svitPrimary/10 transition-colors group"
        >
          <div className="p-2 bg-gradient-to-br from-svitPrimary to-svitPrimaryDark rounded-lg group-hover:shadow-[0_0_20px_rgba(11,60,125,0.4)] transition-shadow">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="ml-2 overflow-hidden"
              >
                <div className="text-sm font-bold text-svitPrimary whitespace-nowrap">NAMMA SVIT</div>
                <div className="text-xs text-gray-500 whitespace-nowrap">ERP Portal</div>
              </motion.div>
            )}
          </AnimatePresence>
        </Link>

        {/* Menu Items */}
        <div className="space-y-1">
          {menuItems.map((section) => (
            <div key={section.title} className="mb-4">
              <AnimatePresence>
                {expanded && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-xs text-gray-400 font-semibold mb-2 px-2 uppercase tracking-wider"
                  >
                    {section.title}
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="space-y-1">
                {section.items.map((item) => {
                  if (!role || !item.visible.includes(role)) return null;
                  const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                  
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onMouseEnter={() => setHoveredIndex(item.href)}
                      onMouseLeave={() => setHoveredIndex(null)}
                      className="relative flex items-center gap-3 p-3 rounded-xl transition-all duration-300 group"
                    >
                      {/* Active Indicator - Gold Glow Line */}
                      {isActive && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-10 bg-gradient-to-b from-svitAccent via-svitAccent to-svitAccentDark rounded-r-full shadow-[0_0_15px_rgba(229,168,35,0.8)]"
                          initial={false}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      )}

                      {/* Icon */}
                      <div
                        className={cn(
                          "p-2 rounded-lg transition-all duration-300",
                          isActive
                            ? "bg-svitPrimary text-white shadow-[0_0_15px_rgba(11,60,125,0.5)]"
                            : hoveredIndex === item.href
                            ? "bg-svitAccent/20 text-svitAccent shadow-[0_0_10px_rgba(229,168,35,0.3)]"
                            : "bg-svitLight text-gray-600"
                        )}
                      >
                        {getIcon(item.href)}
                      </div>

                      {/* Label */}
                      <AnimatePresence>
                        {expanded && (
                          <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className={cn(
                              "text-sm font-medium whitespace-nowrap transition-colors",
                              isActive ? "text-svitPrimary" : "text-gray-700 group-hover:text-svitAccent"
                            )}
                          >
                            {item.label}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

