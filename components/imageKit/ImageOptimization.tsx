"use client";

import Image, { ImageProps } from "next/image";
import { useState } from "react";

const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT

function buildImageUrl(src: string, width?: number | string, quality?: number | string) {
  if (!urlEndpoint || urlEndpoint.includes("6gp4ra1mb") || !src) {
    return src;
  }

  const params = [
    width ? `w-${width}` : "w-auto",
    "dpr-auto",
    quality ? `q-${quality}` : "q-auto",
    "f-auto",
  ].join(",");

  return `${urlEndpoint}/tr:${params}${src.startsWith("/") ? src : `/${src}`}`;
}

function buildBlurUrl(src: string) {
  if (!urlEndpoint || urlEndpoint.includes("6gp4ra1mb") || !src) {
    return src;
  }
  return `${urlEndpoint}/tr:q-10,bl-90${src.startsWith("/") ? src : `/${src}`}`;
}

type Props = ImageProps & {
  blur?: boolean;
};

export default function ImageOptimization({
  src,
  width,
  quality,
  sizes = "100vw",
  blur = true,
  ...props
}: Props) {
  const [showPlaceholder, setShowPlaceholder] = useState(true);
  const normalizedSrc = typeof src === 'string' ? src : (src as any)?.src || "";
  const finalSrc = buildImageUrl(normalizedSrc, width, quality);
  const blurSrc = buildBlurUrl(normalizedSrc);
  const isUsingImageKit = !!(urlEndpoint && !urlEndpoint.includes("6gp4ra1mb"));

  return (
    <Image
      {...props}
      width={width}
      quality={quality ? Number(quality) : undefined}
      src={isUsingImageKit ? finalSrc : src}
      sizes={sizes}
      unoptimized={isUsingImageKit}
      style={
        blur && showPlaceholder && isUsingImageKit
          ? {
              backgroundImage: `url(${blurSrc})`,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
            }
          : undefined
      }
      onLoad={() => setShowPlaceholder(false)}
    />
  );
}