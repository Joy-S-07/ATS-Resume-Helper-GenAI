"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface FloatingActionMenuOption {
  label: string;
  Icon: React.ReactNode;
  onClick: () => void;
}

interface FloatingActionMenuProps {
  options: FloatingActionMenuOption[];
  className?: string;
}

const FloatingActionMenu = ({
  options,
  className,
}: FloatingActionMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={cn("fixed bottom-8 right-8 z-50", className)}>
      <Button
        onClick={toggleMenu}
        className="w-14 h-14 rounded-full bg-white text-black hover:bg-slate-200 shadow-[0_0_20px_rgba(255,255,255,0.2)] flex items-center justify-center p-0 cursor-pointer"
      >
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{
            duration: 0.3,
            ease: "easeInOut",
            type: "spring",
            stiffness: 300,
            damping: 20,
          }}
          className="flex items-center justify-center"
        >
          <Plus className="w-7 h-7" />
        </motion.div>
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 10, y: 10, filter: "blur(10px)" }}
            animate={{ opacity: 1, x: 0, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, x: 10, y: 10, filter: "blur(10px)" }}
            transition={{
              duration: 0.6,
              type: "spring",
              stiffness: 300,
              damping: 20,
              delay: 0.1,
            }}
            className="absolute bottom-20 right-0 mb-2"
          >
            <div className="flex flex-col items-end gap-3">
              {options.map((option, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.05,
                  }}
                >
                  <Button
                    onClick={() => {
                      option.onClick();
                      setIsOpen(false);
                    }}
                    size="sm"
                    className="flex items-center gap-3 px-5 py-5 bg-[#111111d1] hover:bg-white/10 shadow-[0_0_20px_rgba(0,0,0,0.3)] border border-white/10 rounded-full backdrop-blur-md text-white cursor-pointer"
                  >
                    {option.Icon}
                    <span className="font-semibold text-sm">{option.label}</span>
                  </Button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FloatingActionMenu;
