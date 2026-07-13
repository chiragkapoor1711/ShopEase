"use client";

import {
  FolderTree,
  Package,
  ShoppingCart,
  Users,
  IndianRupee,
  Wallet,
  Truck,
  CheckCircle,
} from "lucide-react";
import { useState, useEffect } from "react";

function StatusBadge({ status }) {
  const styles =
    status === "Delivered" || status === "Active"
      ? "bg-green-100 text-green-700"
      : "bg-blue-100 text-blue-700";
  return (
    <span className={`${styles} px-3 py-1 rounded-full text-xs sm:text-sm whitespace-nowrap`}>
      {status}
    </span>
  );
}

export default function SellerDashboard() {
  const [dashboard, setDashboard] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalOrders: 0,
    totalCustomers: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
    todayRevenue: 0,
    monthlyRevenue: 0,
  });

  const [recentProducts, setRecentProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchDashboard() {
    try {
      setLoading(true);

      const res = await fetch("/api/seller/dashboard", {
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message);
      }

      setDashboard(data.dashboard);
      setRecentOrders(data.recentOrders);
      setRecentProducts(data.lowStockProducts);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDashboard();
  }, []);

  // 8 summary cards instead of 4
  const stats = [
    {
      title: "Total Products",
      value: dashboard.totalProducts,
      icon: Package,
      color: "bg-green-500",
    },
    {
      title: "Total Categories",
      value: dashboard.totalCategories,
      icon: FolderTree,
      color: "bg-blue-500",
    },
    {
      title: "Total Orders",
      value: dashboard.totalOrders,
      icon: ShoppingCart,
      color: "bg-orange-500",
    },
    {
      title: "Total Customers",
      value: dashboard.totalCustomers,
      icon: Users,
      color: "bg-pink-500",
    },
    {
      title: "Today Revenue",
      value: `₹${Number(dashboard.todayRevenue).toLocaleString("en-IN")}`,
      icon: IndianRupee,
      color: "bg-emerald-500",
    },
    {
      title: "Monthly Revenue",
      value: `₹${Number(dashboard.monthlyRevenue).toLocaleString("en-IN")}`,
      icon: Wallet,
      color: "bg-purple-500",
    },
    {
      title: "Pending Orders",
      value: dashboard.pendingOrders,
      icon: Truck,
      color: "bg-yellow-500",
    },
    {
      title: "Delivered Orders",
      value: dashboard.deliveredOrders,
      icon: CheckCircle,
      color: "bg-teal-500",
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-950">
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-full overflow-x-hidden">

        {/* Heading */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
            Seller Dashboard
          </h1>
          <p className="text-gray-500 mt-1 sm:mt-2 text-sm sm:text-base">
            Welcome back! Here's what's happening in your store today.
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {stats.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl shadow-lg p-3 sm:p-5 lg:p-6 hover:-translate-y-1 hover:shadow-xl transition min-w-0"
              >
                <div className="flex justify-between items-start sm:items-center gap-2">
                  <div className="min-w-0">
                    <p className="text-gray-500 text-xs sm:text-sm truncate">
                      {item.title}
                    </p>
                    <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold mt-1 sm:mt-2 dark:text-white truncate">
                      {loading ? "..." : item.value}
                    </h2>
                  </div>
                  <div
                    className={`${item.color} w-9 h-9 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0`}
                  >
                    <Icon className="text-white" size={18} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Low Stock Products */}
        <div className="mt-6 sm:mt-8 lg:mt-10 bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-4 sm:mb-6 dark:text-white">
            Low Stock Products
          </h2>

          {/* Mobile/tablet: stacked cards */}
          <div className="md:hidden space-y-3">
            {recentProducts.map((p) => (
              <div
                key={p.id}
                className="border dark:border-gray-800 rounded-xl p-3 flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <p className="font-medium dark:text-white truncate">{p.product_name}</p>
                  <p className="text-sm text-gray-500 truncate">
                    Stock: {p.stock}
                  </p>
                </div>
                <StatusBadge status={p.stock > 0 ? "Active" : "Out of Stock"} />
              </div>
            ))}
          </div>

          {/* Desktop/tablet-landscape: table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b dark:border-gray-700">
                  <th className="text-left py-3 whitespace-nowrap">Product</th>
                  <th className="text-left py-3 whitespace-nowrap">Stock</th>
                  <th className="text-left py-3 whitespace-nowrap">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentProducts.map((p, i) => (
                  <tr
                    key={p.id}
                    className={i !== recentProducts.length - 1 ? "border-b dark:border-gray-800" : ""}
                  >
                    <td className="py-4 dark:text-gray-200">{p.product_name}</td>
                    <td className="dark:text-gray-200">{p.stock}</td>
                    <td><StatusBadge status={p.stock > 0 ? "Active" : "Out of Stock"} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="mt-6 sm:mt-8 lg:mt-10 bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-4 sm:mb-6 dark:text-white">
            Recent Orders
          </h2>

          {/* Mobile/tablet: stacked cards */}
          <div className="md:hidden space-y-3">
            {recentOrders.map((o) => (
              <div
                key={o.id}
                className="border dark:border-gray-800 rounded-xl p-3 flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <p className="font-medium dark:text-white truncate">{o.order_number} • {o.full_name}</p>
                  <p className="text-sm text-gray-500 truncate">
                    ₹{Number(o.total_amount).toLocaleString("en-IN")}
                  </p>
                </div>
                <StatusBadge status={o.order_status} />
              </div>
            ))}
          </div>

          {/* Desktop/tablet-landscape: table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b dark:border-gray-700">
                  <th className="text-left py-3 whitespace-nowrap">Order ID</th>
                  <th className="text-left py-3 whitespace-nowrap">Customer</th>
                  <th className="text-left py-3 whitespace-nowrap">Amount</th>
                  <th className="text-left py-3 whitespace-nowrap">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((o, i) => (
                  <tr
                    key={o.id}
                    className={i !== recentOrders.length - 1 ? "border-b dark:border-gray-800" : ""}
                  >
                    <td className="py-4 dark:text-gray-200">{o.order_number}</td>
                    <td className="dark:text-gray-200">{o.full_name}</td>
                    <td className="dark:text-gray-200">₹{Number(o.total_amount).toLocaleString("en-IN")}</td>
                    <td><StatusBadge status={o.order_status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}