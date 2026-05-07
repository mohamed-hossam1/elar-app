import ROUTES from "@/constants/routes";
import Link from "next/link";
import React from "react";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 font-satoshi overflow-y-auto">
      <div className="w-full max-w-md text-center pb-10">
        <Link href={ROUTES.HOME} className="inline-block hover:opacity-80 transition-opacity">
          <span className="text-4xl font-integral font-black tracking-widest text-black">
            ELAR
          </span>
        </Link>
        <h2 className="mt-5 text-center text-2xl sm:text-3xl font-satoshi font-bold tracking-tight text-black">
          Welcome to Elar
        </h2>
        <p className="mt-2 text-center text-sm text-black/40 font-satoshi">
          Sign in to your account or create a new one to continue.
        </p>
      </div>

      <div className="sm:mx-auto w-full sm:max-w-md px-4 sm:px-0">
        {children}
      </div>
    </div>
  );
}
