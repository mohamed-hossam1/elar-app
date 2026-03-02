import { GetUser } from "@/lib/queries/users";
import AccountSettingsForm from "@/components/profile/AccountSettingsForm";
import { redirect } from "next/navigation";
import ROUTES from "@/constants/routes";
import PasswordSettingsForm from "@/components/profile/PasswordSettingsForm";
import Link from "next/link";
import ProfileSettingsSkeleton from "@/components/skeleton/ProfileSettingsSkeleton";

import { Suspense } from "react";

export default function ProfileSettingsPage() {
  return (
    <Suspense fallback={<ProfileSettingsSkeleton />}>
      <SettingsContent />
    </Suspense>
  );
}

async function SettingsContent() {
  const data = await GetUser();

  if (!data.success || !data.data) {
    redirect(ROUTES.SIGNIN);
  }

  const user = data.data;
  const initialName = user.name || "";
  const initialEmail = user.email || "";
  const initialPhone = user.phone || "";

  return (
    <div className="bg-white font-satoshi">
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-24">
        <div className="mb-16">
          <Link 
            href="/profile" 
            className="text-[10px] uppercase font-black tracking-[0.3em] text-black/60 hover:text-black transition-all mb-8 inline-block"
          >
            ← Back to Profile
          </Link>
          <h1 className="headline mb-4">
            Settings
          </h1>
          <div className="h-2 w-32 bg-black" />
        </div>

        <div className="space-y-16">
          <AccountSettingsForm
            initialName={initialName}
            initialEmail={initialEmail}
            initialPhone={initialPhone}
          />
          <PasswordSettingsForm />
        </div>
      </div>
    </div>
  );
}
