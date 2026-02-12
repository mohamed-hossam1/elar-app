export interface AdminAnalyticsFilters {
  range: 'last_7_days' | 'last_30_days' | 'mtd' | 'custom';
  from?: string;
  to?: string;
  timezone?: string;
}

export interface TrendPoint {
  date: string;
  value: number;
  comparisonValue?: number;
}

export interface KpiMetrics {
  recognizedRevenue: number;
  deliveredOrders: number;
  totalOrders: number;
  averageOrderValue: number;
  uniqueBuyers: number;
  repeatBuyerRate: number;
}

export interface TrendData {
  revenueSeries: TrendPoint[];
  ordersSeries: TrendPoint[];
}

export interface OrderDistributions {
  orderStatus: Record<string, number>;
  paymentMethod: Record<string, number>;
  guestShare: number;
}

export interface TopProductRow {
  productId: string;
  title: string;
  unitsSold: number;
  revenue: number;
}

export interface CustomerActivitySummary {
  newUsers: number;
  activeBuyers: number;
  repeatBuyers: number;
  repeatBuyerRate: number;
}

export interface RecentTransactionRow {
  id: string;
  createdAt: string;
  customerLabel: string;
  customerType: 'guest' | 'registered';
  status: string;
  paymentMethod: string;
  totalPrice: number;
}

export interface AdminAnalyticsDashboard {
  kpis: KpiMetrics;
  trends: TrendData;
  distributions: OrderDistributions;
  topProducts: TopProductRow[];
  customerActivity: CustomerActivitySummary;
  recentTransactions: RecentTransactionRow[];
}

export interface AdminAnalyticsResponse {
  success: boolean;
  data?: AdminAnalyticsDashboard;
  message?: string;
}
