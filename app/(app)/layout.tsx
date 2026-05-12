"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { MotionConfig } from "framer-motion";
import { Menu, GraduationCap } from "lucide-react";
import Link from "next/link";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <MotionConfig reducedMotion="user">
      <div className="flex min-h-screen">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex flex-col min-w-0">
          {/* Mobile header */}
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
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </MotionConfig>
  );
}
