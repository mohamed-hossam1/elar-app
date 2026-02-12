import { AdminPageHeader } from "@/components/admin/AdminUI";
import { AdminAnalyticsFilters } from "@/types/AdminAnalytics";
import DashboardContent from "@/components/admin/analytics/DashboardContent";
import AdminDashboardSkeleton from "@/components/skeleton/AdminDashboardSkeleton";
import { Suspense } from "react";
import { AnalyticsFilterBar } from "@/components/admin/analytics/AnalyticsFilterBar";

interface AdminPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function AdminLandingPage({
  searchParams,
}: AdminPageProps) {
  const params = await searchParams;
  const range = (params.range as string) || "last_30_days";
  const from = params.from as string | undefined;
  const to = params.to as string | undefined;

  const filters: AdminAnalyticsFilters = {
    range: range as AdminAnalyticsFilters["range"],
    from,
    to,
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      <AdminPageHeader
        title="Store Overview"
        description="Monitor your sales, orders, and customer behavior insights"
        actions={<AnalyticsFilterBar currentFilters={filters} />}
      />
      
      <Suspense key={JSON.stringify(filters)} fallback={<AdminDashboardSkeleton />}>
        <DashboardContent filters={filters} />
      </Suspense>
    </div>
  );
}
