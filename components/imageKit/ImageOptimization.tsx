"use client";

import Image, { ImageLoaderProps, ImageProps } from "next/image";
import { useMemo, useState } from "react";

const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;

function isValidImageKitEndpoint(endpoint?: string) {
  return !!endpoint && !endpoint.includes("6gp4ra1mb");
}

function normalizeSrc(src: ImageProps["src"]): string {
  if (typeof src === "string") {
    return src;
  }

  if ("src" in src) {
    return src.src;
  }

  return "";
}

function buildImageUrl(src: string, width?: number, quality?: number) {
  if (!isValidImageKitEndpoint(urlEndpoint) || !src) {
    return src;
  }

  const params = [
    width ? `w-${width}` : "w-auto",
    "dpr-auto",
    quality ? `q-${quality}` : "q-auto",
    "f-auto",
  ].join(",");

  const normalizedPath = src.startsWith("/") ? src : `/${src}`;

  return `${urlEndpoint}/tr:${params}${normalizedPath}`;
}

function buildBlurUrl(src: string) {
  if (!isValidImageKitEndpoint(urlEndpoint) || !src) {
    return src;
  }

  const normalizedPath = src.startsWith("/") ? src : `/${src}`;

  return `${urlEndpoint}/tr:w-40,q-10,bl-90,f-auto${normalizedPath}`;
}

const imageLoader = ({ src, width, quality }: ImageLoaderProps) => {
  return buildImageUrl(src, width, quality);
};

type Props = ImageProps & {
  blur?: boolean;
};

export default function ImageOptimization({
  src,
  quality,
  sizes = "100vw",
  blur = true,
  style,
  ...props
}: Props) {
  const [isLoading, setIsLoading] = useState(true);

  const normalizedSrc = useMemo(() => normalizeSrc(src), [src]);

  const blurSrc = useMemo(() => buildBlurUrl(normalizedSrc), [normalizedSrc]);

  const isUsingImageKit = isValidImageKitEndpoint(urlEndpoint);

  return (
    <Image
      {...props}
      src={src}
      quality={quality}
      sizes={sizes}
      loader={isUsingImageKit ? imageLoader : undefined}
      style={{
        ...style,

        ...(blur && isLoading && isUsingImageKit
          ? {
              backgroundImage: `url(${blurSrc})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }
          : {}),
      }}
      onLoad={() => {
        setIsLoading(false);

        props.onLoad?.({} as React.SyntheticEvent<HTMLImageElement, Event>);
      }}
    />
  );
}
