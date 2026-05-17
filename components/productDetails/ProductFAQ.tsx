"use client";

import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const faqItems = [
  {
    question: "What is the delivery time?",
    answer: "Orders are typically delivered within 3-5 business days across Egypt. You will receive a notification once your order is on its way.",
  },
  {
    question: "What are the available payment methods?",
    answer: "We support multiple payment options including Cash on Delivery (COD), Vodafone Cash, and Instapay for your convenience.",
  },
  {
    question: "Can I return or exchange a product?",
    answer: "Yes, we have a hassle-free 14-day return and exchange policy. The product must be in its original packaging and unused.",
  },
  {
    question: "How do I track my order?",
    answer: "After placing your order, you can view its status in your profile under 'My Orders'. We also send updates via email/SMS.",
  },
  {
    question: "Is there a shipping fee?",
    answer: "Shipping fees vary by city and will be calculated at checkout. Look out for seasonal promotions that might offer free shipping!",
  },
];

export default function ProductFAQ() {
  return (
    <div className="w-full">
      <div className="flex border-b border-black/10 mb-6 sm:mb-8">
        <span className="pb-3 text-lg sm:text-xl font-black font-integral uppercase border-b-2 border-black tracking-widest">
          Frequently Asked Questions
        </span>
      </div>

      <div className="space-y-4">
        {faqItems.map((item, index) => (
          <Disclosure key={index} as="div" className="border border-black/10 rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
            {({ open }) => (
              <>
                <DisclosureButton className="flex w-full justify-between items-center px-6 py-5 text-left focus:outline-none group">
                  <span className="text-lg font-bold font-satoshi text-black group-hover:text-black/70 transition-colors">
                    {item.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-black transition-transform duration-300 ${
                      open ? "rotate-180" : ""
                    }`}
                  />
                </DisclosureButton>
                <AnimatePresence>
                  {open && (
                    <DisclosurePanel static>
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6 pt-0 text-black/60 font-satoshi leading-relaxed text-base">
                          {item.answer}
                        </div>
                      </motion.div>
                    </DisclosurePanel>
                  )}
                </AnimatePresence>
              </>
            )}
          </Disclosure>
        ))}
      </div>
    </div>
  );
}