"use client";

import Image from "@/components/imageKit/ImageOptimization";
import React, { useEffect, useState } from "react";

export default function ImageSlider({ images }: { images: string[] }) {
  const [curSlide, setCurSlide] = useState(0);
  const [prevSlide, setPrevSlide] = useState<number | null>(null);
  const [direction, setDirection] = useState(0);

  const paginate = (newDirection: number) => {
    setPrevSlide(curSlide);
    setDirection(newDirection);
    const next = (curSlide + newDirection + images.length) % images.length;
    setCurSlide(next);
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
        {images.map((image, i) => {
          const isCurrent = i === curSlide;
          const isPrev = i === prevSlide;
          let x = 0;
          let opacity = 0;
          let zIndex = 0;

          if (isCurrent) {
            x = 0;
            opacity = 1;
            zIndex = 10;
          } else if (isPrev) {
            x = direction > 0 ? -300 : 300;
            opacity = 0;
            zIndex = 5;
          } else {
            x = direction > 0 ? 300 : -300;
            opacity = 0;
            zIndex = 0;
          }

          return (
            <div
              key={i}
              className="absolute inset-0"
              style={{
                transform: `translateX(${x}px)`,
                opacity,
                zIndex,
                visibility: isCurrent || isPrev ? "visible" : "hidden",
                transition:
                  isCurrent || isPrev
                    ? "transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1), opacity 0.35s ease-out"
                    : "none",
                willChange: "transform, opacity",
              }}
            >
              <Image
                fill
                className="object-contain"
                src={image}
                alt={`Image ${i + 1}`}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1000px"
                priority={isCurrent || i === 0}
              />
            </div>
          );
        })}

        <button
          onClick={sliderLeft}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 border border-black flex items-center justify-center hover:bg-black hover:text-white transition-all z-20"
          aria-label="Previous image"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={sliderRight}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 border border-black flex items-center justify-center hover:bg-black hover:text-white transition-all z-20"
          aria-label="Next image"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="flex gap-4 items-center overflow-x-auto py-2 px-2 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] w-full max-w-[420px] mx-auto">
        {images.map((image, i) => (
          <div
            key={i}
            className={`cursor-pointer shrink-0 w-20 h-20 border transition-all duration-300 ease-out relative bg-white hover:scale-105 active:scale-95 snap-center ${
              i === curSlide
                ? "border-black ring-2 ring-black ring-offset-2"
                : "border-gray-200 opacity-60 hover:opacity-100"
            }`}
            onClick={() => {
              if (i === curSlide) return;
              setPrevSlide(curSlide);
              setDirection(i > curSlide ? 1 : -1);
              setCurSlide(i);
            }}
          >
            <Image
              fill
              className="object-cover"
              src={image}
              alt={`Thumbnail ${i + 1}`}
            />
          </div>
        ))}
      </div>
    </section>
  );
}