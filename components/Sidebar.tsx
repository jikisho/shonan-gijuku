"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  BookOpen,
  Brain,
  ChevronRight,
  GraduationCap,
  FileText,
  PenLine,
  Paperclip,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    href: "/dashboard",
    icon: LayoutDashboard,
    label: "ダッシュボード",
  },
  {
    href: "/courses/statement",
    icon: FileText,
    label: "志望理由書",
    color: "text-blue-400",
  },
  {
    href: "/courses/activity",
    icon: BookOpen,
    label: "活動報告書",
    color: "text-green-400",
  },
  {
    href: "/courses/free-writing",
    icon: PenLine,
    label: "自由記述",
    color: "text-orange-400",
  },
  {
    href: "/courses/optional",
    icon: Paperclip,
    label: "任意提出資料",
    color: "text-purple-400",
  },
  {
    href: "/analysis",
    icon: Brain,
    label: "自己分析シート",
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen flex flex-col border-r border-white/5 bg-[oklch(0.09_0.012_265)]">
      {/* Logo */}
      <Link href="/dashboard" className="flex items-center gap-3 px-6 py-6 border-b border-white/5">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center">
          <GraduationCap className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-sm font-bold tracking-wide text-white">湘南義塾</p>
          <p className="text-[10px] text-white/40 tracking-wider">SFC AO 完全攻略</p>
        </div>
      </Link>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                  isActive
                    ? "bg-amber-500/10 text-amber-400 font-medium"
                    : "text-white/50 hover:text-white/80 hover:bg-white/5"
                )}
              >
                <item.icon
                  className={cn(
                    "w-4 h-4 shrink-0",
                    isActive ? "text-amber-400" : (item.color ?? "text-white/40")
                  )}
                />
                <span className="flex-1">{item.label}</span>
                {isActive && (
                  <ChevronRight className="w-3 h-3 text-amber-400/60" />
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-white/5">
        <p className="text-[10px] text-white/20 text-center">
          © 2025 湘南義塾
        </p>
      </div>
    </aside>
  );
}
