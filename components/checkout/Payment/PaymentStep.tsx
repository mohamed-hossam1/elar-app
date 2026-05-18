"use client";

import { useState } from "react";
import Cash from "./Cash";
import VodafoneCash from "./VodafoneCash";
import Instapay from "./Instapay";
import { Uploader } from "@/components/imageKit/Uploader";
import { PaymentMethod } from "./PaymentMethod";

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

  const handleCopy = () => {
    navigator.clipboard.writeText(vodafoneNumber);
    setIsCopyed(true);
    setTimeout(() => setIsCopyed(false), 2000);
  };

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
    <div className="space-y-6">
      <div className="p-4 bg-gray-100 border border-black flex items-start gap-3 rounded-none">
        <p className="text-sm font-medium text-black">
          Special gift: Pay using Vodafone Cash or Instapay and get a free gift!
        </p>
      </div>

      <div className="space-y-4">
        <PaymentMethod
          label="cash"
          icon={<Cash />}
          isSelected={selectedPayment === "cash"}
          onSelect={() => onSelectPayment("cash")}
        />

        <PaymentMethod
          label="vodafone cash"
          icon={<VodafoneCash />}
          isSelected={selectedPayment === "vodafone cash"}
          onSelect={() => onSelectPayment("vodafone cash")}
        >
          <div className="p-4 border border-t-0 border-black bg-gray-50 space-y-4">
            <div className="space-y-2">
              <p className="text-xs md:text-sm text-gray-700">
                Please transfer the total amount to the Vodafone Cash number below:
              </p>
              <div className="flex items-center gap-2 max-w-sm">
                <span className="flex-1 bg-white border border-black px-3 py-2 text-sm font-mono select-all">
                  {vodafoneNumber}
                </span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="px-4 py-2 border border-black bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors cursor-pointer"
                >
                  {isCopyed ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>
            
            <div className="pt-2">
              <Uploader
                value={vodafoneUrl ? [vodafoneUrl] : []}
                onChange={handleVodafoneChange}
                maxFiles={1}
                label="Transfer Receipt"
                description="Upload the transfer receipt screenshot to confirm payment"
              />
            </div>
          </div>
        </PaymentMethod>

        <PaymentMethod
          label="instapay"
          icon={<Instapay />}
          isSelected={selectedPayment === "instapay"}
          onSelect={() => onSelectPayment("instapay")}
        >
          <div className="p-4 border border-t-0 border-black bg-gray-50 space-y-4">
            <div className="space-y-2">
              <p className="text-xs md:text-sm text-gray-700">
                Please send the total amount to our Instapay account/link below:
              </p>
              <div className="flex items-center gap-2 max-w-sm">
                <a
                  href={instapayLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-white border border-black px-3 py-2 text-sm font-mono text-blue-600 underline truncate"
                >
                  {instapayLink}
                </a>
              </div>
            </div>

            <div className="pt-2">
              <Uploader
                value={instapayUrl ? [instapayUrl] : []}
                onChange={handleInstapayChange}
                maxFiles={1}
                label="Transfer Receipt"
                description="Upload the transfer receipt screenshot to confirm payment"
              />
            </div>
          </div>
        </PaymentMethod>
      </div>
    </div>
  );
}
