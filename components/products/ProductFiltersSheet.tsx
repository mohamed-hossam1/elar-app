"use client";

import { Fragment } from "react";
import { Dialog, Transition, DialogPanel, TransitionChild } from "@headlessui/react";
import { X } from "lucide-react";
import ProductFiltersSidebar from "./ProductFiltersSidebar";
import { Category } from "@/types/Category";

interface ProductFiltersSheetProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  minPrice: number;
  maxPrice: number;
}


export default function ProductFiltersSheet({
  isOpen,
  onClose,
  categories,
  minPrice,
  maxPrice,
}: ProductFiltersSheetProps) {
  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-100 lg:hidden" onClose={onClose}>
        <TransitionChild
          as={Fragment}
          enter="transition-opacity ease-linear duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-linear duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        </TransitionChild>

        <div className="fixed inset-0 flex z-101">
          <TransitionChild
            as={Fragment}
            enter="transition ease-in-out duration-400 transform"
            enterFrom="translate-y-full"
            enterTo="translate-y-0"
            leave="transition ease-in-out duration-400 transform"
            leaveFrom="translate-y-0"
            leaveTo="translate-y-full"
          >
            <DialogPanel className="relative mt-auto flex h-[90%] w-full flex-col overflow-y-auto bg-white pb-12 shadow-xl rounded-t-[40px]">
              
              <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-6 bg-white border-b border-black/10 rounded-t-[40px]">
                <h2 className="text-xl font-bold font-satoshi uppercase">Filters</h2>
                <button
                  type="button"
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-black/5 hover:bg-black/10 transition-colors"
                  onClick={onClose}
                >
                  <X size={20} />
                </button>
              </div>

              
              <div className="px-6 py-6">
                <ProductFiltersSidebar 
                  categories={categories}
                  minPrice={minPrice}
                  maxPrice={maxPrice}
                  onApply={onClose}
                />
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
}
