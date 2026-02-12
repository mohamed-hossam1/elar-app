import { getAdminAnalyticsDashboard } from "@/actions/analyticsAction";
import { AdminAnalyticsFilters } from "@/types/AdminAnalytics";
import { AnalyticsFilterBar } from "@/components/admin/analytics/AnalyticsFilterBar";
import { KpiGrid } from "@/components/admin/analytics/KpiGrid";
import { RevenueOrdersTrend } from "@/components/admin/analytics/RevenueOrdersTrend";
import { StatusDistribution } from "@/components/admin/analytics/StatusDistribution";
import { TopProductsTable } from "@/components/admin/analytics/TopProductsTable";
import { CustomerActivityPanel } from "@/components/admin/analytics/CustomerActivityPanel";
import { RecentTransactionsTable } from "@/components/admin/analytics/RecentTransactionsTable";
import { AdminNotice, AdminSection } from "@/components/admin/AdminUI";
import { 
  TrendingUp, 
  ShoppingBag, 
  Users, 
  Clock,
  AlertCircle,
  BarChart3,
  LayoutDashboard
} from "lucide-react";

interface DashboardContentProps {
  filters: AdminAnalyticsFilters;
}

export default async function DashboardContent({ filters }: DashboardContentProps) {
  const analyticsResponse = await getAdminAnalyticsDashboard(filters);

  if (!analyticsResponse.success) {
    const isValidationError = analyticsResponse.message?.includes("Invalid date range");

    return (
      <div className="space-y-8">
        <AdminNotice 
          title={isValidationError ? "Range Validation Error" : "Data Retrieval Error"}
          tone={isValidationError ? "warning" : "danger"}
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <p>{analyticsResponse.message}</p>
              <p className="text-xs opacity-70">
                {isValidationError
                  ? "Please select a valid date range. Custom ranges cannot exceed 366 days for performance reasons."
                  : "We encountered an issue while loading your store's analytics. This could be due to a connection timeout or temporary database issue."}
              </p>
            </div>
          </div>
        </AdminNotice>

        <div className="bg-white border border-black p-6">
          <div className="flex items-center gap-2 mb-6">
            <Clock className="h-4 w-4 text-black/40" />
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-black/60">Adjust Timeframe</h3>
          </div>
          <AnalyticsFilterBar currentFilters={filters} />
        </div>
      </div>
    );
  }

  const data = analyticsResponse.data;

  if (!data) {
    return (
      <div className="space-y-8">
        <div className="bg-white border border-black p-6">
          <AnalyticsFilterBar currentFilters={filters} />
        </div>

        <div className="border border-black border-dashed bg-black/[0.02] p-16 rounded-none text-center space-y-4">
          <LayoutDashboard className="h-12 w-12 mx-auto text-black/10" />
          <div className="space-y-1">
            <h3 className="font-integral text-xl font-black uppercase tracking-[0.05em]">No Data Found</h3>
            <p className="text-sm text-black/60 max-w-sm mx-auto">
              There is no activity recorded for the selected date range. Try expanding your timeframe or check back after new orders are placed.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const hasData =
    data.kpis.totalOrders > 0 ||
    data.topProducts.length > 0 ||
    data.recentTransactions.length > 0;

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            <h2 className="text-[11px] font-black uppercase tracking-[0.25em] text-black/60">Core Metrics</h2>
          </div>
          <span className="text-[10px] font-medium text-black/40 italic">Real-time snapshots</span>
        </div>
        <KpiGrid kpis={data.kpis} />
      </div>

      {hasData ? (
        <div className="space-y-8">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2">
              <AdminSection 
                title="Performance Analytics" 
                description="Visualizing sales velocity and order trends over time"
                actions={<BarChart3 className="h-5 w-5 text-black/20" />}
              >
                <RevenueOrdersTrend trends={data.trends} />
              </AdminSection>
            </div>
            <div>
              <AdminSection 
                title="Status & Payment" 
                description="Breakdown by operational status"
              >
                <StatusDistribution distributions={data.distributions} />
              </AdminSection>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <AdminSection 
              title="Catalog Performance" 
              description="Most popular products in your inventory"
              actions={<ShoppingBag className="h-5 w-5 text-black/20" />}
            >
              <TopProductsTable products={data.topProducts} />
            </AdminSection>
            
            <AdminSection 
              title="Customer Lifecycle" 
              description="Engagement and retention metrics"
              actions={<Users className="h-5 w-5 text-black/20" />}
            >
              <CustomerActivityPanel activity={data.customerActivity} />
            </AdminSection>
          </div>

          <AdminSection 
            title="Recent Activity" 
            description="The most recent transactions processed by your store"
          >
            <RecentTransactionsTable transactions={data.recentTransactions} />
          </AdminSection>
        </div>
      ) : (
        <div className="bg-white border border-black p-12 text-center border-dashed">
          <p className="text-sm font-medium text-black/50">
            Select a broader date range to see detailed trend charts and distribution analytics.
          </p>
        </div>
      )}
    </div>
  );
}
