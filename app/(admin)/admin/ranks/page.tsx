import { AdminPageHeader } from "@/components/admin/AdminUI";
import RankListContent from "@/components/admin/ranks/RankListContent";
import AdminRankListSkeleton from "@/components/skeleton/AdminRankListSkeleton";
import SuspenseWithSearchParams from "@/components/SuspenseWithSearchParams";

export default function AdminRanksPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Ranks"
        description="Manage product ranking and display order."
      />
      <SuspenseWithSearchParams fallback={<AdminRankListSkeleton />}>
        <RankListContent searchParams={searchParams} />
      </SuspenseWithSearchParams>
    </div>
  );
}
