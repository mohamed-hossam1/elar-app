"use client";

import * as motion from "motion/react-client";

interface PaymentMethodProps {
  label: string;
  icon: React.ReactNode;
  isSelected: boolean;
  onSelect: () => void;
  children?: React.ReactNode;
}

function PaymentMethod({ label, icon, isSelected, onSelect, children }: PaymentMethodProps) {
  return (
    <>
      <motion.div
        onClick={onSelect}
        className={`flex items-center justify-between p-4 border cursor-pointer transition-all rounded-none ${
          isSelected
            ? "border-black border-2 bg-gray-50 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            : "border-gray-200 hover:border-black/50"
        }`}
        whileHover={{ x: 2 }}
        whileTap={{ scale: 0.99 }}
      >
        <div className="flex items-center flex-1 gap-3">
          <motion.div
            className={`w-5 h-5 border flex items-center justify-center shrink-0 transition-colors ${
              isSelected ? "border-black bg-black" : "border-black bg-white"
            }`}
            animate={isSelected ? { scale: [1, 1.15, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            {isSelected && (
              <motion.div
                className="w-2.5 h-2.5 bg-white"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
              />
            )}
          </motion.div>
          {icon}
        </div>
      </motion.div>
      {isSelected && children && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="overflow-hidden"
        >
          {children}
        </motion.div>
      )}
    </>
  );
}

export { PaymentMethod };
