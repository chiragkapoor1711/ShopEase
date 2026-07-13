"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  IndianRupee,
  Package,
  Trophy,
  BarChart3,
  TrendingUp,
  Calendar,
  Download,
} from "lucide-react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const COLORS = [
  "#3b82f6",
  "#22c55e",
  "#f97316",
  "#a855f7",
  "#ef4444",
  "#14b8a6",
];

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

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold dark:text-white">Reports</h1>
          <p className="text-gray-500 mt-2">
            Monitor your sales performance and business insights.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl transition mt-4 md:mt-0"
        >
          <Download size={18} />
          Export Report
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500">Today's Sales</p>
              <h2 className="text-3xl font-bold mt-2 dark:text-white">
                ₹{Number(summary.todaySales).toLocaleString("en-IN")}
              </h2>
            </div>
            <div className="w-14 h-14 rounded-xl bg-green-500 flex items-center justify-center">
              <IndianRupee className="text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500">Monthly Sales</p>
              <h2 className="text-3xl font-bold mt-2 dark:text-white">
                ₹{Number(summary.monthlySales).toLocaleString("en-IN")}
              </h2>
            </div>
            <div className="w-14 h-14 rounded-xl bg-blue-500 flex items-center justify-center">
              <TrendingUp className="text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500">Best Selling Product</p>
              <h2 className="text-xl font-bold mt-2 dark:text-white">
                {topProducts.length ? topProducts[0].product_name : "-"}
              </h2>
            </div>
            <div className="w-14 h-14 rounded-xl bg-orange-500 flex items-center justify-center">
              <Trophy className="text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500">Top Category</p>
              <h2 className="text-xl font-bold mt-2 dark:text-white">
                {categorySales.length ? categorySales[0].category_name : "-"}
              </h2>
            </div>
            <div className="w-14 h-14 rounded-xl bg-purple-500 flex items-center justify-center">
              <Package className="text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-8 mt-10">
        {/* Sales Chart */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold dark:text-white">
              Sales Overview
            </h2>
            <Calendar className="text-blue-600" />
          </div>

          {monthlyChart.length ? (
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={monthlyChart}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(value) =>
                    `₹${Number(value).toLocaleString("en-IN")}`
                  }
                />
                <Bar dataKey="revenue" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-80 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 flex flex-col items-center justify-center">
              <BarChart3 size={60} className="text-blue-500" />
              <p className="mt-4 text-gray-500">No sales data yet</p>
            </div>
          )}
        </div>

        {/* Revenue Chart (category split) */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold dark:text-white">
              Revenue Analytics
            </h2>
            <IndianRupee className="text-green-600" />
          </div>

          {categorySales.length ? (
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={categorySales}
                  dataKey="revenue"
                  nameKey="category_name"
                  cx="50%"
                  cy="50%"
                  outerRadius={110}
                  label={({ category_name }) => category_name}
                >
                  {categorySales.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) =>
                    `₹${Number(value).toLocaleString("en-IN")}`
                  }
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-80 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 flex flex-col items-center justify-center">
              <TrendingUp size={60} className="text-green-500" />
              <p className="mt-4 text-gray-500">No revenue data yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Top Selling Products */}
      <div className="mt-10 bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 dark:text-white">
          🔥 Top Selling Products
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-500 border-b dark:border-gray-700">
                <th className="pb-3">Product</th>
                <th className="pb-3">Sold</th>
                <th className="pb-3">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.length ? (
                topProducts.map((p, i) => (
                  <tr key={i} className="border-b dark:border-gray-800">
                    <td className="py-3 dark:text-white">{p.product_name}</td>
                    <td className="py-3 dark:text-white">{p.sold}</td>
                    <td className="py-3 dark:text-white">
                      ₹{Number(p.revenue).toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="py-6 text-center text-gray-500">
                    No products sold yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Category Sales */}
      <div className="mt-10 bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 dark:text-white">
          📂 Category Sales
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-500 border-b dark:border-gray-700">
                <th className="pb-3">Category</th>
                <th className="pb-3">Items Sold</th>
                <th className="pb-3">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {categorySales.length ? (
                categorySales.map((c, i) => (
                  <tr key={i} className="border-b dark:border-gray-800">
                    <td className="py-3 dark:text-white">{c.category_name}</td>
                    <td className="py-3 dark:text-white">{c.total_items}</td>
                    <td className="py-3 dark:text-white">
                      ₹{Number(c.revenue).toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="py-6 text-center text-gray-500">
                    No category data yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="mt-10 bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 dark:text-white">
          💳 Payment Methods
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {paymentMethods.length ? (
            paymentMethods.map((pm, i) => (
              <div
                key={i}
                className="rounded-xl bg-gray-100 dark:bg-gray-800 p-6"
              >
                <p className="text-gray-500">{pm.payment_method}</p>
                <h3 className="text-2xl font-bold mt-2 dark:text-white">
                  {pm.orders} orders
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  ₹{Number(pm.revenue).toLocaleString("en-IN")}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 col-span-3 text-center py-4">
              No payment data yet.
            </p>
          )}
        </div>
      </div>

      {/* Performance Summary */}
      <div className="mt-10 bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 dark:text-white">
          Performance Summary
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="rounded-xl bg-gray-100 dark:bg-gray-800 p-6">
            <p className="text-gray-500">Total Orders</p>
            <h3 className="text-3xl font-bold mt-3 dark:text-white">
              {summary.totalOrders}
            </h3>
          </div>

          <div className="rounded-xl bg-gray-100 dark:bg-gray-800 p-6">
            <p className="text-gray-500">Total Customers</p>
            <h3 className="text-3xl font-bold mt-3 dark:text-white">
              {summary.totalCustomers}
            </h3>
          </div>

          <div className="rounded-xl bg-gray-100 dark:bg-gray-800 p-6">
            <p className="text-gray-500">Payment Methods Used</p>
            <h3 className="text-3xl font-bold mt-3 dark:text-white">
              {paymentMethods.length}
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}
