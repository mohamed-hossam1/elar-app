import type { Metadata } from "next";
import { getCanonicalUrl } from "@/lib/metadata/canonical";
import AuthForm from "@/components/forms/AuthForm";

export const metadata: Metadata = {
  title: "Sign Up | ELAR",
  description:
    "Create a new ELAR account to start shopping premium men's fashion.",
  alternates: {
    canonical: getCanonicalUrl("/sign-up"),
  },
};

export default function SignUp() {
  return <AuthForm fromType="Sign Up" />;
}
