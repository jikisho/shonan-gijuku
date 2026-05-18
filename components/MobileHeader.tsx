"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, GraduationCap } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import SidebarContent from "@/components/SidebarContent";

interface MobileHeaderProps {
  isTeacher?: boolean;
}

export default function MobileHeader({ isTeacher }: MobileHeaderProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      {/* Mobile-only top bar */}
      <header className="md:hidden sticky top-0 z-30 flex items-center gap-3 px-4 py-3 border-b border-white/5 bg-[oklch(0.09_0.012_265)]">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-1.5 text-white/40 hover:text-white/70 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center">
            <GraduationCap className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-bold text-white">湘南義塾</span>
        </Link>
      </header>

      {/* Mobile: sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/60 z-40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
            />
            <motion.div
              className="fixed inset-y-0 left-0 w-64 z-50 md:hidden"
              initial={{ x: -264 }}
              animate={{ x: 0 }}
              exit={{ x: -264 }}
              transition={{ type: "spring", damping: 28, stiffness: 250 }}
            >
              <SidebarContent
                onClose={() => setSidebarOpen(false)}
                isTeacher={isTeacher}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
