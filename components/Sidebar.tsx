"use client";

import { AnimatePresence, motion } from "framer-motion";
import SidebarContent from "@/components/SidebarContent";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isTeacher?: boolean;
}

export default function Sidebar({ isOpen, onClose, isTeacher }: SidebarProps) {
  return (
    <>
      {/* Desktop: always visible */}
      <div className="hidden md:flex w-64 min-h-screen flex-col shrink-0">
        <SidebarContent onClose={onClose} isTeacher={isTeacher} />
      </div>

      {/* Mobile: overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/60 z-40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
            />
            <motion.div
              className="fixed inset-y-0 left-0 w-64 z-50 md:hidden"
              initial={{ x: -264 }}
              animate={{ x: 0 }}
              exit={{ x: -264 }}
              transition={{ type: "spring", damping: 28, stiffness: 250 }}
            >
              <SidebarContent onClose={onClose} isTeacher={isTeacher} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
