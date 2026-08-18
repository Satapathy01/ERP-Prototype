"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import Sidebar from "./Sidebar";

interface MobileSidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function MobileSidebar({
  open,
  onClose,
}: MobileSidebarProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}

          <motion.div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Drawer */}

          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 28,
            }}
            className="fixed left-0 top-0 z-50 h-screen w-72 bg-background shadow-xl lg:hidden"
          >
            {/* Header */}

            <div className="flex h-16 items-center justify-between border-b px-5">
              <div>
                <h2 className="text-lg font-bold">
                  School ERP
                </h2>

                <p className="text-xs text-muted-foreground">
                  Management System
                </p>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Sidebar */}

            <div className="h-[calc(100vh-64px)] overflow-y-auto">
              <Sidebar />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}