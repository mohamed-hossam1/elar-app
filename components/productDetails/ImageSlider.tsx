"use client";

import Image from "@/components/imageKit/ImageOptimization";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

export default function ImageSlider({ images }: { images: string[] }) {
  const [curSlide, setCurSlide] = useState(0);
  const [[page, direction], setPage] = useState([0, 0]);

  const paginate = (newDirection: number) => {
    const next = (curSlide + newDirection + images.length) % images.length;
    setCurSlide(next);
    setPage([next, newDirection]);
  };

  const sliderRight = () => paginate(1);
  const sliderLeft = () => paginate(-1);

  useEffect(() => {
    if (images.length === 0) return;
    const interval = setInterval(() => {
      sliderRight();
    }, 10000);
    return () => clearInterval(interval);
  }, [images.length, curSlide]);

  const [startX, setStartX] = useState(0);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    const distance = e.changedTouches[0].clientX - startX;
    if (Math.abs(distance) > 50) {
      distance > 0 ? sliderLeft() : sliderRight();
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setStartX(e.clientX);
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    const distance = e.clientX - startX;
    if (Math.abs(distance) > 50) {
      distance > 0 ? sliderLeft() : sliderRight();
    }
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
    }),
  };

  if (images.length === 0) {
    return (
      <div className="mx-6 items-center relative">
        <div className="relative h-[420px] mb-6 rounded-2xl overflow-hidden bg-gray-200 flex items-center justify-center">
          <p className="text-gray-500">No images available</p>
        </div>
      </div>
    );
  }

  return (
    <section
      className="items-center relative"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      <div className="relative h-[350px] sm:h-[450px] md:h-[500px] mb-6 border border-black overflow-hidden bg-white">
        <AnimatePresence mode="popLayout" custom={direction}>
          <motion.div
            key={curSlide}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.35 },
            }}
            className="absolute inset-0"
          >
            <Image
              fill
              className="object-contain"
              src={images[curSlide]}
              alt={`Image ${curSlide + 1}`}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1000px"
              priority
            />
          </motion.div>
        </AnimatePresence>

        <button
          onClick={sliderLeft}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 border border-black flex items-center justify-center hover:bg-black hover:text-white transition-all z-10"
          aria-label="Previous image"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={sliderRight}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 border border-black flex items-center justify-center hover:bg-black hover:text-white transition-all z-10"
          aria-label="Next image"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="flex gap-4 items-center justify-center flex-wrap">
        {images.map((image, i) => (
          <motion.div
            key={i}
            className={`cursor-pointer w-20 h-20 border transition-all duration-300 relative bg-white ${
              i === curSlide
                ? "border-black ring-2 ring-black ring-offset-2"
                : "border-gray-200 opacity-60 hover:opacity-100"
            }`}
            onClick={() => {
              setCurSlide(i);
              setPage([i, i > curSlide ? 1 : -1]);
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Image
              fill
              className="object-cover"
              src={image}
              alt={`Thumbnail ${i + 1}`}
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
