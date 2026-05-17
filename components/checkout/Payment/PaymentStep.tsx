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
    <div
      className="space-y-6"
    >
      <div
        className="p-4 bg-gray-100 border border-black flex items-start gap-3 rounded-none"
      >
        <p className="text-sm font-medium text-black">
          Special gift: Pay using Vodafone Cash or Instapay and get a free gift!
        </p>
      </div>
    </div>
  );
}
