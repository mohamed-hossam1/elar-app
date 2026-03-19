"use client";

import { useState } from "react";
import Cash from "./Cash";
import VodafoneCash from "./VodafoneCash";
import Instapay from "./Instapay";
import { Check } from "lucide-react";
import { Uploader } from "@/components/imageKit/Uploader";
import { PaymentMethod } from "./PaymentMethod";
import { motion } from "motion/react";

type Props = {
  onSelectPayment: (p: string) => void;
  selectedPayment: string | null;
  vodafoneNumber?: string;
  instapayLink?: string;
  onVodafoneImageChange?: (url: string | null) => void;
  onInstapayImageChange?: (url: string | null) => void;
};

export default function PaymentStep({
  onSelectPayment,
  selectedPayment,
  vodafoneNumber = "01013429234",
  instapayLink = "https://instapay.com",
  onVodafoneImageChange,
  onInstapayImageChange,
}: Props) {
  const payments = ["cash", "vodafone cash", "instapay"];
  const [isCopyed, setIsCopyed] = useState(false);

  const [vodafoneUrl, setVodafoneUrl] = useState<string | null>(null);
  const [instapayUrl, setInstapayUrl] = useState<string | null>(null);

  const handleVodafoneChange = (urls: string[]) => {
    const url = urls[0] || null;
    setVodafoneUrl(url);
    if (onVodafoneImageChange) onVodafoneImageChange(url);
  };

  const handleInstapayChange = (urls: string[]) => {
    const url = urls[0] || null;
    setInstapayUrl(url);
    if (onInstapayImageChange) onInstapayImageChange(url);
  };

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="p-4 bg-gray-100 border border-black flex items-start gap-3 rounded-none"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
      >
        <p className="text-sm font-medium text-black">
          Special gift: Pay using Vodafone Cash or Instapay and get a free gift!
        </p>
      </motion.div>

      <div className="flex flex-col gap-4">
        <PaymentMethod
          label="Cash"
          icon={<Cash />}
          isSelected={selectedPayment === payments[0]}
          onSelect={() => onSelectPayment(payments[0])}
        />

        <PaymentMethod
          label="Vodafone Cash"
          icon={<VodafoneCash />}
          isSelected={selectedPayment === payments[1]}
          onSelect={() => onSelectPayment(payments[1])}
        >
          <div className="mt-2 p-6 border border-black rounded-none bg-white space-y-6">
            <div className="space-y-2">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-black/50">
                Send the amount to:
              </p>
              <div className="flex items-center justify-between bg-black/5 p-4 rounded-none border border-black">
                <span className="font-integral text-xl font-black tracking-wider text-black">
                  {vodafoneNumber}
                </span>
                <motion.button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigator.clipboard?.writeText(vodafoneNumber);
                    setIsCopyed(true);
                    setTimeout(() => setIsCopyed(false), 1500);
                  }}
                  className="text-[10px] font-black px-4 py-2 border border-black bg-white rounded-none hover:bg-black hover:text-white transition-colors cursor-pointer flex items-center gap-2 uppercase tracking-widest"
                  whileTap={{ scale: 0.95 }}
                >
                  {isCopyed ? (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" /> Copied
                    </motion.span>
                  ) : (
                    "Copy"
                  )}
                </motion.button>
              </div>
            </div>

            <Uploader
              label="Payment Screenshot"
              description="Upload your Vodafone Cash transfer confirmation."
              value={vodafoneUrl ? [vodafoneUrl] : []}
              onChange={handleVodafoneChange}
              maxFiles={1}
            />
          </div>
        </PaymentMethod>

        <PaymentMethod
          label="Instapay"
          icon={<Instapay />}
          isSelected={selectedPayment === payments[2]}
          onSelect={() => onSelectPayment(payments[2])}
        >
          <div className="mt-2 p-6 border border-black rounded-none bg-white space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-black uppercase tracking-tight">
                Pay using Instapay
              </p>
              {instapayLink && (
                <motion.button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(instapayLink, "_blank", "noopener,noreferrer");
                  }}
                  className="text-[10px] font-black bg-black text-white px-4 py-2 rounded-none hover:bg-white hover:text-black border border-black transition-colors uppercase tracking-[0.2em]"
                  whileTap={{ scale: 0.95 }}
                >
                  Open App
                </motion.button>
              )}
            </div>

            <Uploader
              label="Payment Screenshot"
              description="Upload your Instapay transfer confirmation."
              value={instapayUrl ? [instapayUrl] : []}
              onChange={handleInstapayChange}
              maxFiles={1}
            />
          </div>
        </PaymentMethod>
      </div>
    </motion.div>
  );
}
