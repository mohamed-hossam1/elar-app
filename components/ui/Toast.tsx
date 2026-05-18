"use client";

import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, AlertCircle, X } from "lucide-react";
import { useEffect } from "react";

export type ToastType = "success" | "error" | "info";

export type ToastPosition = "top-right" | "top-center" | "bottom-right" | "bottom-center";

interface ToastProps {
  message: string;
  type?: ToastType;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
  position?: ToastPosition;
}

export default function Toast({
  message,
  type = "success",
  isVisible,
  onClose,
  duration = 3000,
  position = "top-right",
}: ToastProps) {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  const getPositionClasses = () => {
    switch (position) {
      case "top-center":
        
      case "bottom-right":
        return "bottom-3 right-3";
      case "bottom-center":
        return "bottom-3 left-1/2";
      case "top-right":
      default:
        return "top-30 right-3";
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: position.includes("top") ? -20 : 20, x: position.includes("center") ? "-50%" : 20 }}
          animate={{ opacity: 1, y: 0, x: position.includes("center") ? "-50%" : 0 }}
          exit={{ opacity: 0, y: position.includes("top") ? -20 : 20, x: position.includes("center") ? "-50%" : 20 }}
          className={`fixed z-[9999] flex items-center gap-2 bg-black text-white px-4 py-2.5 border border-white/10 shadow-2xl min-w-[220px] max-w-[300px] ${getPositionClasses()}`}
        >
          {type === "success" && (
            <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
          )}
          {type === "error" && (
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
          )}
          
          <div className="flex-1">
            <p className="text-[14px] font-medium font-satoshi tracking-wide">{message}</p>
          </div>

          <button 
            onClick={onClose}
            className="p-1 hover:bg-white/10 transition-colors shrink-0"
          >
            <X className="w-3.5 h-3.5 text-white/50" />
          </button>

          <motion.div
            initial={{ scaleX: 1 }}
            animate={{ scaleX: 0 }}
            transition={{ duration: duration / 1000, ease: "linear" }}
            className="absolute bottom-0 left-0 right-0 h-[2px] bg-white origin-left"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
