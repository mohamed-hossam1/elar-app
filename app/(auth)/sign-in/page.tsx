import type { Metadata } from "next";
import { getCanonicalUrl } from "@/lib/metadata/canonical";

export const metadata: Metadata = {
  title: "Sign In | ELAR",
  description:
    "Sign in to your ELAR account to manage your orders, addresses, and more.",
  alternates: {
    canonical: getCanonicalUrl("/sign-in"),
  },
};

export default function SignIn() {
  // return <AuthForm fromType="Sign In" />;
}
