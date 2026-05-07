import localFont from "next/font/local";

export const satoshi = localFont({
  src: [
    {
      path: "../public/satoshi/Satoshi-Light.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/satoshi/Satoshi-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/satoshi/Satoshi-Italic.otf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../public/satoshi/Satoshi-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/satoshi/Satoshi-Bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/satoshi/Satoshi-Black.otf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-satoshi",
  display: "swap",
});

export const integralCF = localFont({
  src: [
    {
      path: "../public/Integral-CF/Webfont/IntegralCF-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/Integral-CF/Webfont/IntegralCF-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/Integral-CF/Webfont/IntegralCF-DemiBold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/Integral-CF/Webfont/IntegralCF-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/Integral-CF/Webfont/IntegralCF-ExtraBold.woff2",
      weight: "800",
      style: "normal",
    },
    {
      path: "../public/Integral-CF/Webfont/IntegralCF-Heavy.woff2",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-integral",
  display: "swap",
});
