
import React from "react";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: {
    template: "%s | ELAR",
    default: "ELAR | Premium Men's Fashion in Egypt",
  },
};

export default function StoreLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <>
      {children}
    </>
  );
}
