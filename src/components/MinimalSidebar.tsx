"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

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

export default function MinimalSidebar() {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(false);
  const [role, setRole] = useState<string>("");
  const [mobileOpen, setMobileOpen] = useState(false);

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
    return iconMap[href] || <Menu className="w-5 h-5" />;
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-card rounded-lg border border-border shadow-sm"
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          width: expanded ? 240 : 72,
        }}
        className="hidden lg:flex fixed left-0 top-0 h-screen bg-card border-r border-border z-40 flex-col"
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
      >
        {/* Logo */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="overflow-hidden"
                >
                  <div className="font-semibold text-textPrimary">NAMMA SVIT</div>
                  <div className="text-xs text-textSecondary">ERP Portal</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto p-2">
          {menuItems.map((section) => (
            <div key={section.title} className="mb-4">
              <AnimatePresence>
                {expanded && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-xs text-textSecondary font-medium mb-2 px-2 uppercase tracking-wider"
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
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-lg transition-all",
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-textSecondary hover:bg-background"
                      )}
                      title={expanded ? "" : item.label}
                    >
                      {getIcon(item.href)}
                      <AnimatePresence>
                        {expanded && (
                          <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="text-sm font-medium whitespace-nowrap"
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
      </motion.aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            className="lg:hidden fixed left-0 top-0 h-screen w-70 bg-card border-r border-border z-40 flex-col shadow-xl"
          >
            <div className="p-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="font-semibold text-textPrimary">NAMMA SVIT</div>
                  <div className="text-xs text-textSecondary">ERP Portal</div>
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              {menuItems.map((section) => (
                <div key={section.title} className="mb-4">
                  <div className="text-xs text-textSecondary font-medium mb-2 px-2 uppercase tracking-wider">
                    {section.title}
                  </div>
                  <div className="space-y-1">
                    {section.items.map((item) => {
                      if (!role || !item.visible.includes(role)) return null;
                      const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMobileOpen(false)}
                          className={cn(
                            "flex items-center gap-3 p-3 rounded-lg transition-all",
                            isActive
                              ? "bg-primary/10 text-primary"
                              : "text-textSecondary hover:bg-background"
                          )}
                        >
                          {getIcon(item.href)}
                          <span className="text-sm font-medium">{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}


