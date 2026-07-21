"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import clsx from "clsx";
import {
  IndianRupee,
  Package,
  Trophy,
  TrendingUp,
  TrendingDown,
  Download,
  CreditCard,
  Users,
  ShoppingBag,
  Tag,
  BarChart3,
  Loader2,
} from "lucide-react";

const cardShell =
  "bg-white dark:bg-gray-900 rounded-2xl shadow-sm ring-1 ring-black/5 dark:ring-white/10";

const BAR_COLORS = [
  "#3b82f6",
  "#22c55e",
  "#f97316",
  "#a855f7",
  "#ef4444",
  "#14b8a6",
];

/* ---------- building blocks ---------- */

function StatCard({ icon: Icon, label, value, color, trend }) {
  return (
    <div className={`${cardShell} p-5 sm:p-6`}>
      <div className="flex justify-between items-start gap-3">
        <div className="min-w-0">
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{label}</p>
          <h2 className="text-xl sm:text-2xl font-bold mt-2 text-gray-900 dark:text-white truncate">
            {value}
          </h2>
          {trend && (
            <div
              className={clsx(
                "inline-flex items-center gap-1 text-xs font-semibold mt-2 px-2 py-0.5 rounded-full",
                trend.direction === "up"
                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                  : "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400"
              )}
            >
              {trend.direction === "up" ? (
                <TrendingUp size={12} />
              ) : (
                <TrendingDown size={12} />
              )}
              {trend.label}
            </div>
          )}
        </div>
        <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl ${color} flex items-center justify-center shrink-0`}>
          <Icon size={20} className="text-white" />
        </div>
      </div>
    </div>
  );
}

function SectionCard({ icon: Icon, title, subtitle, children }) {
  return (
    <div className={`${cardShell} p-5 sm:p-6`}>
      <div className="mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center shrink-0">
            <Icon size={16} className="text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
            {title}
          </h2>
        </div>
        {subtitle && (
          <p className="text-xs text-gray-400 mt-1.5 ml-[42px]">{subtitle}</p>
        )}
      </div>
      {children}
    </div>
  );
}

/** Proportional horizontal bar list — replaces the removed chart components. */
function BarList({ data, labelKey, valueKey, subKey, emptyLabel }) {
  if (!data.length) {
    return (
      <div className="py-10 text-center text-sm text-gray-400">{emptyLabel}</div>
    );
  }

  const max = Math.max(...data.map((d) => Number(d[valueKey])), 1);

  return (
    <div className="space-y-4">
      {data.map((d, i) => {
        const value = Number(d[valueKey]);
        const pct = Math.max((value / max) * 100, 4);

        return (
          <div key={i}>
            <div className="flex justify-between items-baseline gap-3 mb-1.5">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                {d[labelKey]}
                {subKey && (
                  <span className="text-gray-400 font-normal"> · {d[subKey]}</span>
                )}
              </span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white tabular-nums shrink-0">
                ₹{value.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${pct}%`, backgroundColor: BAR_COLORS[i % BAR_COLORS.length] }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ---------- page ---------- */

export default function ReportsPage() {
  const [summary, setSummary] = useState({
    todaySales: 0,
    monthlySales: 0,
    totalOrders: 0,
    totalCustomers: 0,
  });

  const [monthlyChart, setMonthlyChart] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [categorySales, setCategorySales] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);

  const [loading, setLoading] = useState(true);

  async function fetchReports() {
    try {
      setLoading(true);

      const res = await fetch("/api/seller/reports", {
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message);
      }

      setSummary(data.summary);
      setMonthlyChart(data.monthlyChart);
      setTopProducts(data.topProducts);
      setCategorySales(data.categorySales);
      setPaymentMethods(data.paymentMethods);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchReports();
  }, []);

  // Month-over-month growth, derived from the same data the old bar chart used.
  let monthlyTrend = null;
  if (monthlyChart.length >= 2) {
    const prev = Number(monthlyChart[monthlyChart.length - 2].revenue);
    const curr = Number(monthlyChart[monthlyChart.length - 1].revenue);
    if (prev > 0) {
      const pct = ((curr - prev) / prev) * 100;
      monthlyTrend = {
        direction: pct >= 0 ? "up" : "down",
        label: `${pct >= 0 ? "+" : ""}${pct.toFixed(1)}% vs last month`,
      };
    }
  }

  if (loading) {
    return (
      <div className={`${cardShell} flex items-center justify-center gap-2 py-24 text-gray-500 dark:text-gray-400`}>
        <Loader2 size={18} className="animate-spin" />
        <span className="text-sm">Loading reports...</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Reports
          </h1>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-1.5">
            Monitor your sales performance and business insights.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl transition text-sm sm:text-base font-medium shadow-sm shrink-0"
        >
          <Download size={16} />
          Export report
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
        <StatCard
          icon={IndianRupee}
          label="Today's sales"
          value={`₹${Number(summary.todaySales).toLocaleString("en-IN")}`}
          color="bg-emerald-500"
        />
        <StatCard
          icon={TrendingUp}
          label="Monthly sales"
          value={`₹${Number(summary.monthlySales).toLocaleString("en-IN")}`}
          color="bg-blue-500"
          trend={monthlyTrend}
        />
        <StatCard
          icon={Trophy}
          label="Best selling product"
          value={topProducts.length ? topProducts[0].product_name : "—"}
          color="bg-orange-500"
        />
        <StatCard
          icon={Package}
          label="Top category"
          value={categorySales.length ? categorySales[0].category_name : "—"}
          color="bg-purple-500"
        />
      </div>

      {/* Monthly performance + Category revenue share */}
      <div className="grid lg:grid-cols-2 gap-5">
        <SectionCard
          icon={BarChart3}
          title="Monthly performance"
          subtitle="Revenue by month"
        >
          <BarList
            data={monthlyChart}
            labelKey="month"
            valueKey="revenue"
            emptyLabel="No sales data yet."
          />
        </SectionCard>

        <SectionCard
          icon={Tag}
          title="Category revenue share"
          subtitle="Where your revenue comes from"
        >
          <BarList
            data={categorySales}
            labelKey="category_name"
            valueKey="revenue"
            emptyLabel="No category data yet."
          />
        </SectionCard>
      </div>

      {/* Top products + Payment methods */}
      <div className="grid lg:grid-cols-2 gap-5">
        <div className={`${cardShell} p-5 sm:p-6`}>
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center shrink-0">
              <Trophy size={16} className="text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
              Top selling products
            </h2>
          </div>

          {topProducts.length ? (
            <div className="overflow-x-auto -mx-1">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-xs uppercase tracking-wide text-gray-400 border-b border-gray-100 dark:border-gray-800">
                    <th className="pb-2.5 px-1 font-semibold">Product</th>
                    <th className="pb-2.5 px-1 font-semibold text-right">Sold</th>
                    <th className="pb-2.5 px-1 font-semibold text-right">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {topProducts.map((p, i) => (
                    <tr key={i} className="border-b border-gray-50 dark:border-gray-800/60 last:border-0">
                      <td className="py-3 px-1 text-sm font-medium text-gray-900 dark:text-white truncate max-w-[180px]">
                        {p.product_name}
                      </td>
                      <td className="py-3 px-1 text-sm text-gray-500 dark:text-gray-400 text-right tabular-nums">
                        {p.sold}
                      </td>
                      <td className="py-3 px-1 text-sm font-semibold text-gray-900 dark:text-white text-right tabular-nums">
                        ₹{Number(p.revenue).toLocaleString("en-IN")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-10 text-center text-sm text-gray-400">
              No products sold yet.
            </div>
          )}
        </div>

        <SectionCard
          icon={CreditCard}
          title="Payment methods"
          subtitle="Revenue share by method"
        >
          <BarList
            data={paymentMethods}
            labelKey="payment_method"
            valueKey="revenue"
            subKey="orders"
            emptyLabel="No payment data yet."
          />
        </SectionCard>
      </div>

      {/* Compact performance strip */}
      <div className={`${cardShell} grid grid-cols-3 divide-x divide-gray-100 dark:divide-gray-800 overflow-hidden`}>
        {[
          { icon: ShoppingBag, label: "Total orders", value: summary.totalOrders },
          { icon: Users, label: "Total customers", value: summary.totalCustomers },
          { icon: CreditCard, label: "Payment methods used", value: paymentMethods.length },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="p-5 sm:p-6 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0">
              <Icon size={18} className="text-gray-500 dark:text-gray-400" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-400 truncate">{label}</p>
              <p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white tabular-nums">
                {value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}