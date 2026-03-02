import {
  AdminAnalyticsFilters,
  AdminAnalyticsDashboard,
  AdminAnalyticsResponse,
  KpiMetrics,
  TrendData,
  TrendPoint,
  OrderDistributions,
  TopProductRow,
  CustomerActivitySummary,
  RecentTransactionRow,
} from '@/types/AdminAnalytics';
import { createClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/auth/admin';
import { Order, OrderItem } from '@/types/Order';
import { User } from '@/types/User';

function parseAnalyticsRange(
  filters: AdminAnalyticsFilters,
): { from: Date; to: Date } | null {
  const now = new Date();
  const timezone = filters.timezone || 'Africa/Cairo';
  let from: Date;
  let to: Date;

  if (filters.range === 'custom') {
    if (!filters.from || !filters.to) {
      return null;
    }

    try {
      from = new Date(filters.from);
      to = new Date(filters.to);

      if (isNaN(from.getTime()) || isNaN(to.getTime())) {
        return null;
      }

      if (from > to) {
        return null;
      }

      const daysDiff = Math.floor(
        (to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24),
      );
      if (daysDiff > 366) {
        return null;
      }

      from = new Date(from.toISOString().split('T')[0] + 'T00:00:00Z');
      to = new Date(to.toISOString().split('T')[0] + 'T23:59:59Z');
    } catch {
      return null;
    }
  } else if (filters.range === 'last_7_days') {
    to = new Date(now);
    to.setUTCHours(23, 59, 59, 999);
    from = new Date(to);
    from.setUTCDate(from.getUTCDate() - 6);
    from.setUTCHours(0, 0, 0, 0);
  } else if (filters.range === 'last_30_days') {
    to = new Date(now);
    to.setUTCHours(23, 59, 59, 999);
    from = new Date(to);
    from.setUTCDate(from.getUTCDate() - 29);
    from.setUTCHours(0, 0, 0, 0);
  } else if (filters.range === 'mtd') {
    to = new Date(now);
    to.setUTCHours(23, 59, 59, 999);
    from = new Date(now);
    from.setUTCDate(1);
    from.setUTCHours(0, 0, 0, 0);
  } else {
    return null;
  }

  return { from, to };
}

function getComparisonRange(
  primary: { from: Date; to: Date },
): { from: Date; to: Date } {
  const spanMs = primary.to.getTime() - primary.from.getTime();
  const comparisonTo = new Date(primary.from.getTime() - 1000);
  const comparisonFrom = new Date(comparisonTo.getTime() - spanMs);
  return { from: comparisonFrom, to: comparisonTo };
}

function generateDateLabels(from: Date, to: Date): string[] {
  const labels: string[] = [];
  const current = new Date(from);

  while (current <= to) {
    labels.push(current.toISOString().split('T')[0]);
    current.setUTCDate(current.getUTCDate() + 1);
  }

  return labels;
}

async function fetchOrdersInRange(
  supabase: Awaited<ReturnType<typeof createClient>>,
  from: Date,
  to: Date,
): Promise<(Order & { order_items?: OrderItem[] })[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items!inner(id, quantity, price_at_purchase, product_title)')
    .gte('created_at', from.toISOString())
    .lte('created_at', to.toISOString())
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching orders:', error);
    return [];
  }

  return (data || []) as (Order & { order_items?: OrderItem[] })[];
}

async function fetchUsersCreatedInRange(
  supabase: Awaited<ReturnType<typeof createClient>>,
  from: Date,
  to: Date,
): Promise<User[]> {
  const { data, error } = await supabase
    .from('users')
    .select('id, name, email, phone, created_at')
    .gte('created_at', from.toISOString())
    .lte('created_at', to.toISOString());

  if (error) {
    console.error('Error fetching users:', error);
    return [];
  }

  return (data || []) as User[];
}

function calculateKpis(
  orders: (Order & { order_items?: OrderItem[] })[],
  allUsersInRange: User[],
): KpiMetrics {
  const deliveredOrders = orders.filter((o) => o.status === 'delivered');
  const recognizedRevenue = deliveredOrders.reduce((sum, o) => sum + o.total_price, 0);
  const deliveredCount = deliveredOrders.length;
  const totalCount = orders.length;
  const averageOrderValue = deliveredCount > 0 ? recognizedRevenue / deliveredCount : 0;

  const buyerSet = new Set<string>();
  orders.forEach((order) => {
    if (order.user_id) buyerSet.add(order.user_id);
    else if (order.guest_id) buyerSet.add(`guest-${order.guest_id}`);
  });
  const uniqueBuyers = buyerSet.size;

  const buyerOrderCounts: Record<string, number> = {};
  orders.forEach((order) => {
    const buyerKey = order.user_id ? order.user_id : `guest-${order.guest_id}`;
    buyerOrderCounts[buyerKey] = (buyerOrderCounts[buyerKey] || 0) + 1;
  });
  const repeatBuyers = Object.values(buyerOrderCounts).filter((count) => count >= 2).length;
  const repeatBuyerRate = uniqueBuyers > 0 ? (repeatBuyers / uniqueBuyers) * 100 : 0;

  return {
    recognizedRevenue: Math.round(recognizedRevenue * 100) / 100,
    deliveredOrders: deliveredCount,
    totalOrders: totalCount,
    averageOrderValue: Math.round(averageOrderValue * 100) / 100,
    uniqueBuyers,
    repeatBuyerRate: Math.round(repeatBuyerRate * 100) / 100,
  };
}

function buildTrendSeries(
  ordersInRange: (Order & { order_items?: OrderItem[] })[],
  ordersInComparison: (Order & { order_items?: OrderItem[] })[],
  dateRange: { from: Date; to: Date },
): TrendData {
  const dateLabels = generateDateLabels(dateRange.from, dateRange.to);

  const revenueByDate: Record<string, number> = {};
  const orderCountByDate: Record<string, number> = {};
  const comparisonRevenueByDate: Record<string, number> = {};
  const comparisonOrderCountByDate: Record<string, number> = {};

  dateLabels.forEach((date) => {
    revenueByDate[date] = 0;
    orderCountByDate[date] = 0;
  });

  ordersInRange.forEach((order) => {
    const date = order.created_at.split('T')[0];
    if (order.status === 'delivered') {
      revenueByDate[date] = (revenueByDate[date] || 0) + order.total_price;
    }
    orderCountByDate[date] = (orderCountByDate[date] || 0) + 1;
  });

  ordersInComparison.forEach((order) => {
    const dateOffset = Math.floor(
      (new Date(order.created_at).getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24),
    );
    if (dateOffset >= 0 && dateOffset < dateLabels.length) {
      const mappedDate = dateLabels[dateOffset];
      if (order.status === 'delivered') {
        comparisonRevenueByDate[mappedDate] =
          (comparisonRevenueByDate[mappedDate] || 0) + order.total_price;
      }
      comparisonOrderCountByDate[mappedDate] =
        (comparisonOrderCountByDate[mappedDate] || 0) + 1;
    }
  });

  const revenueSeries: TrendPoint[] = dateLabels.map((date) => ({
    date,
    value: revenueByDate[date] || 0,
    comparisonValue: comparisonRevenueByDate[date] || 0,
  }));

  const ordersSeries: TrendPoint[] = dateLabels.map((date) => ({
    date,
    value: orderCountByDate[date] || 0,
    comparisonValue: comparisonOrderCountByDate[date] || 0,
  }));

  return { revenueSeries, ordersSeries };
}

function calculateDistributions(
  orders: (Order & { order_items?: OrderItem[] })[],
): OrderDistributions {
  const orderStatus: Record<string, number> = {};
  const paymentMethod: Record<string, number> = {};
  let guestCount = 0;

  orders.forEach((order) => {
    orderStatus[order.status] = (orderStatus[order.status] || 0) + 1;
    paymentMethod[order.payment_method] = (paymentMethod[order.payment_method] || 0) + 1;
    if (order.guest_id && !order.user_id) guestCount++;
  });

  const guestShare = orders.length > 0 ? (guestCount / orders.length) * 100 : 0;

  return {
    orderStatus,
    paymentMethod,
    guestShare: Math.round(guestShare * 100) / 100,
  };
}

function getTopProducts(
  orders: (Order & { order_items?: OrderItem[] })[],
  limit: number = 10,
): TopProductRow[] {
  const productMap: Record<string, TopProductRow> = {};

  orders
    .filter((o) => o.status === 'delivered')
    .forEach((order) => {
      (order.order_items || []).forEach((item) => {
        if (!productMap[item.product_title]) {
          productMap[item.product_title] = {
            productId: item.product_title,
            title: item.product_title,
            unitsSold: 0,
            revenue: 0,
          };
        }
        productMap[item.product_title].unitsSold += item.quantity;
        productMap[item.product_title].revenue += item.price_at_purchase * item.quantity;
      });
    });

  return Object.values(productMap)
    .sort((a, b) => {
      if (b.unitsSold !== a.unitsSold) return b.unitsSold - a.unitsSold;
      return b.revenue - a.revenue;
    })
    .slice(0, limit);
}

function calculateCustomerActivity(
  ordersInRange: (Order & { order_items?: OrderItem[] })[],
  newUsersInRange: User[],
): CustomerActivitySummary {
  const newUsersCount = newUsersInRange.length;

  const activeBuyerSet = new Set<string>();
  const buyerOrderCounts: Record<string, number> = {};

  ordersInRange.forEach((order) => {
    const buyerKey = order.user_id ? order.user_id : `guest-${order.guest_id}`;
    activeBuyerSet.add(buyerKey);
    buyerOrderCounts[buyerKey] = (buyerOrderCounts[buyerKey] || 0) + 1;
  });

  const activeBuyers = activeBuyerSet.size;
  const repeatBuyers = Object.values(buyerOrderCounts).filter((count) => count >= 2).length;
  const repeatBuyerRate =
    activeBuyers > 0 ? (repeatBuyers / activeBuyers) * 100 : 0;

  return {
    newUsers: newUsersCount,
    activeBuyers,
    repeatBuyers,
    repeatBuyerRate: Math.round(repeatBuyerRate * 100) / 100,
  };
}

function getRecentTransactions(
  orders: (Order & { order_items?: OrderItem[] })[],
  limit: number = 10,
): RecentTransactionRow[] {
  return orders.slice(0, limit).map((order) => ({
    id: order.id.toString(),
    createdAt: order.created_at,
    customerLabel: order.user_name || 'Guest',
    customerType: order.user_id ? 'registered' : 'guest',
    status: order.status,
    paymentMethod: order.payment_method,
    totalPrice: order.total_price,
  }));
}

export async function getAdminAnalyticsDashboard(
  filters: AdminAnalyticsFilters,
): Promise<AdminAnalyticsResponse> {
  try {
    await requireAdmin();

    const dateRange = parseAnalyticsRange(filters);
    if (!dateRange) {
      return {
        success: false,
        message: 'Invalid date range or custom dates',
      };
    }

    const supabase = await createClient();

    const comparisonRange = getComparisonRange(dateRange);

    const [ordersInRange, ordersInComparison, newUsersInRange] = await Promise.all([
      fetchOrdersInRange(supabase, dateRange.from, dateRange.to),
      fetchOrdersInRange(supabase, comparisonRange.from, comparisonRange.to),
      fetchUsersCreatedInRange(supabase, dateRange.from, dateRange.to),
    ]);

    const kpis = calculateKpis(ordersInRange, newUsersInRange);
    const trends = buildTrendSeries(ordersInRange, ordersInComparison, dateRange);
    const distributions = calculateDistributions(ordersInRange);
    const topProducts = getTopProducts(ordersInRange);
    const customerActivity = calculateCustomerActivity(ordersInRange, newUsersInRange);
    const recentTransactions = getRecentTransactions(ordersInRange);

    const dashboard: AdminAnalyticsDashboard = {
      kpis,
      trends,
      distributions,
      topProducts,
      customerActivity,
      recentTransactions,
    };

    return {
      success: true,
      data: dashboard,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    if (message === 'Unauthorized') {
      return {
        success: false,
        message: 'Admin access required',
      };
    }
    return {
      success: false,
      message: `Analytics retrieval failed: ${message}`,
    };
  }
}
