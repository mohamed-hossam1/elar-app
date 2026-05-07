"use client";

import  { useState } from "react";
import Cash from "./Cash";
import VodafoneCash from "./VodafoneCash";
import Instapay from "./Instapay";
import { Check } from "lucide-react";
import { Uploader } from "@/components/imageKit/Uploader";

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
    <div className="space-y-6">
      <div className="p-4 bg-gray-100 border border-black flex items-start gap-3 rounded-none">
        <p className="text-sm font-medium text-black">
          Special gift: Pay using Vodafone Cash or Instapay and get a free gift!
        </p>
      </div>

      <div className="flex flex-col gap-4">
        
        <div
          onClick={() => onSelectPayment(payments[0])}
          className={`flex items-center justify-between p-4 border cursor-pointer transition-all rounded-none ${
            selectedPayment === payments[0]
              ? "border-black border-2 bg-gray-50 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              : "border-gray-200 hover:border-black/50"
          }`}
        >
          <div className="flex items-center flex-1 gap-3">
            <div
              className={`w-5 h-5 border flex items-center justify-center shrink-0 transition-colors ${
                selectedPayment === payments[0]
                  ? "border-black bg-black"
                  : "border-black bg-white"
              }`}
            >
              {selectedPayment === payments[0] && (
                <div className="w-2.5 h-2.5 bg-white"></div>
              )}
            </div>
            <Cash />
          </div>
        </div>

        
        <div
          onClick={() => onSelectPayment(payments[1])}
          className={`flex items-center justify-between p-4 border cursor-pointer transition-all rounded-none ${
            selectedPayment === payments[1]
              ? "border-black border-2 bg-gray-50 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              : "border-gray-200 hover:border-black/50"
          }`}
        >
          <div className="flex items-center flex-1 gap-3">
            <div
              className={`w-5 h-5 border flex items-center justify-center shrink-0 transition-colors ${
                selectedPayment === payments[1]
                  ? "border-black bg-black"
                  : "border-black bg-white"
              }`}
            >
              {selectedPayment === payments[1] && (
                <div className="w-2.5 h-2.5 bg-white"></div>
              )}
            </div>
            <VodafoneCash />
          </div>
        </div>

        {selectedPayment === payments[1] && (
          <div className="mt-2 p-6 border border-black rounded-none bg-white space-y-6">
            <div className="space-y-2">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-black/50">
                Send the amount to:
              </p>
              <div className="flex items-center justify-between bg-black/5 p-4 rounded-none border border-black">
                <span className="font-integral text-xl font-black tracking-wider text-black">
                  {vodafoneNumber}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigator.clipboard?.writeText(vodafoneNumber);
                    setIsCopyed(true);
                    setTimeout(() => setIsCopyed(false), 1500);
                  }}
                  className="text-[10px] font-black px-4 py-2 border border-black bg-white rounded-none hover:bg-black hover:text-white transition-colors cursor-pointer flex items-center gap-2 uppercase tracking-widest"
                >
                  {isCopyed ? <Check className="w-3.5 h-3.5" /> : "Copy"}
                </button>
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
        )}

        
        <div
          onClick={() => onSelectPayment(payments[2])}
          className={`flex items-center justify-between p-4 border cursor-pointer transition-all rounded-none ${
            selectedPayment === payments[2]
              ? "border-black border-2 bg-gray-50 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              : "border-gray-200 hover:border-black/50"
          }`}
        >
          <div className="flex items-center flex-1 gap-3">
            <div
              className={`w-5 h-5 border flex items-center justify-center shrink-0 transition-colors ${
                selectedPayment === payments[2]
                  ? "border-black bg-black"
                  : "border-black bg-white"
              }`}
            >
              {selectedPayment === payments[2] && (
                <div className="w-2.5 h-2.5 bg-white"></div>
              )}
            </div>
            <Instapay />
          </div>
        </div>

        {selectedPayment === payments[2] && (
          <div className="mt-2 p-6 border border-black rounded-none bg-white space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-black uppercase tracking-tight">
                Pay using Instapay
              </p>
              {instapayLink && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(instapayLink, "_blank", "noopener,noreferrer");
                  }}
                  className="text-[10px] font-black bg-black text-white px-4 py-2 rounded-none hover:bg-white hover:text-black border border-black transition-colors uppercase tracking-[0.2em]"
                >
                  Open App
                </button>
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
        )}
      </div>
    </div>
  );
}
