"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  UserRound,
  Package,
  IndianRupee,
  ShoppingCart,
  FolderTree,
  Store,
  Clock3,
  ArrowRight,
  Plus,
  FolderPlus,
  ClipboardList,
} from "lucide-react";

const cardShell =
  "bg-white dark:bg-gray-900 rounded-2xl shadow-lg ring-1 ring-black/5 dark:ring-white/10";

function StatCardSkeleton() {
  return (
    <div className={`${cardShell} p-5 sm:p-6 animate-pulse`}>
      <div className="flex justify-between items-start">
        <div className="flex-1 min-w-0">
          <div className="h-3.5 w-20 bg-gray-100 dark:bg-gray-800 rounded" />
          <div className="h-7 w-16 bg-gray-100 dark:bg-gray-800 rounded mt-3" />
        </div>
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gray-100 dark:bg-gray-800 shrink-0" />
      </div>
    </div>
  );
}

function ListRowSkeleton() {
  return (
    <div className="flex justify-between items-center py-3.5 animate-pulse">
      <div className="space-y-2">
        <div className="h-4 w-32 bg-gray-100 dark:bg-gray-800 rounded" />
        <div className="h-3 w-24 bg-gray-100 dark:bg-gray-800 rounded" />
      </div>
      <div className="h-4 w-16 bg-gray-100 dark:bg-gray-800 rounded" />
    </div>
  );
}

export default function AdminDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await fetch("/api/admin/dashboard");
      const data = await res.json();

      if (data.success) {
        setDashboard(data);
      }
    } catch (error) {
      console.error("Dashboard Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      title: "Total Sellers",
      value: dashboard?.stats?.totalSellers ?? 0,
      icon: Store,
      color: "bg-blue-500",
    },
    {
      title: "Customers",
      value: dashboard?.stats?.customers ?? 0,
      icon: UserRound,
      color: "bg-emerald-500",
    },
    {
      title: "Products",
      value: dashboard?.stats?.products ?? 0,
      icon: Package,
      color: "bg-orange-500",
    },
    {
      title: "Revenue",
      value: `₹${Number(dashboard?.stats?.revenue ?? 0).toLocaleString("en-IN")}`,
      icon: IndianRupee,
      color: "bg-purple-500",
    },
    {
      title: "Pending Orders",
      value: dashboard?.stats?.pendingOrders ?? 0,
      icon: Clock3,
      color: "bg-amber-500",
    },
    {
      title: "Completed Orders",
      value: dashboard?.stats?.completedOrders ?? 0,
      icon: ShoppingCart,
      color: "bg-teal-500",
    },
    {
      title: "Main Categories",
      value: dashboard?.stats?.mainCategories ?? 0,
      icon: FolderTree,
      color: "bg-indigo-500",
    },
    {
      title: "Active Vendors",
      value: dashboard?.stats?.activeVendors ?? 0,
      icon: Users,
      color: "bg-pink-500",
    },
  ];

  // const quickActions = [
  //   { label: "Create Seller", href: "/admin/create-seller", icon: Plus, color: "bg-blue-600 hover:bg-blue-700" },
  //   { label: "Main Categories", href: "/admin/main-categories", icon: FolderPlus, color: "bg-emerald-600 hover:bg-emerald-700" },
  //   { label: "Products", href: "/admin/products", icon: Package, color: "bg-orange-600 hover:bg-orange-700" },
  //   { label: "Orders", href: "/admin/orders", icon: ClipboardList, color: "bg-purple-600 hover:bg-purple-700" },
  //   { label: "Customers", href: "/admin/customers", icon: UserRound, color: "bg-pink-600 hover:bg-pink-700" },
  //   { label: "Reports", href: "/admin/reports", icon: ShoppingCart, color: "bg-gray-800 hover:bg-black dark:bg-gray-700 dark:hover:bg-gray-600" },
  // ];

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl  ml-10 mt-5 font-bold text-gray-900 dark:text-white">
            Admin Dashboard
          </h1>
          <p className="text-sm sm:text-base text-gray-500 ml-10 dark:text-gray-400 mt-1.5">
            Welcome back! Here&apos;s an overview of your marketplace.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3">
          <Link
            href="/admin/create-seller"
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl transition text-sm sm:text-base font-medium shadow-sm"
          >
            <Plus size={16} />
            Create Seller
          </Link>

          <Link
            href="/admin/main-categories"
            className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl transition text-sm sm:text-base font-medium shadow-sm"
          >
            <FolderPlus size={16} />
            Main Category
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-6">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => <StatCardSkeleton key={i} />)
          : stats.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className={`${cardShell} p-5 sm:p-6 hover:shadow-xl hover:-translate-y-0.5 transition`}
                >
                  <div className="flex justify-between items-start gap-3">
                    <div className="min-w-0">
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {item.title}
                      </p>
                      <h2 className="text-2xl sm:text-3xl font-bold mt-2 sm:mt-3 text-gray-900 dark:text-white tabular-nums truncate">
                        {item.value}
                      </h2>
                    </div>

                    <div
                      className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl ${item.color} flex items-center justify-center shrink-0`}
                    >
                      <Icon className="text-white" size={24} />
                    </div>
                  </div>
                </div>
              );
            })}
      </div>

      {/* Recent Sellers & Orders */}
      <div className="grid lg:grid-cols-2 gap-5 sm:gap-8 mt-6 sm:mt-10">
        {/* Recent Sellers */}
        <div className={`${cardShell} p-5 sm:p-6`}>
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
              Recent Sellers
            </h2>
            <Link
              href="/admin/sellers"
              className="flex items-center gap-1.5 text-sm sm:text-base text-blue-600 dark:text-blue-400 font-medium hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
            >
              View all
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => <ListRowSkeleton key={i} />)
            ) : dashboard?.recentSellers?.length > 0 ? (
              dashboard.recentSellers.map((seller, index) => (
                <div key={index} className="flex justify-between items-center py-3.5 gap-3">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                      {seller.store_name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Joined {new Date(seller.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`text-sm font-medium px-2.5 py-1 rounded-full whitespace-nowrap shrink-0 ${
                      seller.status === "Active"
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                        : "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400"
                    }`}
                  >
                    {seller.status}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400 py-6 text-center text-sm">
                No sellers found.
              </p>
            )}
          </div>
        </div>

        {/* Recent Orders */}
        <div className={`${cardShell} p-5 sm:p-6`}>
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
              Recent Orders
            </h2>
            <Link
              href="/admin/orders"
              className="flex items-center gap-1.5 text-sm sm:text-base text-blue-600 dark:text-blue-400 font-medium hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
            >
              View all
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => <ListRowSkeleton key={i} />)
            ) : dashboard?.recentOrders?.length > 0 ? (
              dashboard.recentOrders.map((order, index) => {
                const statusClasses =
                  order.order_status === "Pending"
                    ? "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"
                    : order.order_status === "Delivered"
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                    : order.order_status === "Cancelled"
                    ? "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400"
                    : "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400";

                return (
                  <div key={index} className="flex justify-between items-center py-3.5 gap-3">
                    <div className="min-w-0">
                      <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                        {order.order_number}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        ₹{Number(order.total_amount).toLocaleString("en-IN")}
                      </p>
                    </div>
                    <span
                      className={`text-sm font-medium px-2.5 py-1 rounded-full whitespace-nowrap shrink-0 ${statusClasses}`}
                    >
                      {order.order_status}
                    </span>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-500 dark:text-gray-400 py-6 text-center text-sm">
                No orders found.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions
      <div className={`${cardShell} p-5 sm:p-6 mt-6 sm:mt-10`}>
        <h2 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
          Quick Actions
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-5">
          {quickActions.map(({ label, href, icon: Icon, color }) => (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center justify-center gap-2 text-white text-center rounded-xl py-4 sm:py-5 px-2 transition text-sm sm:text-base font-medium ${color}`}
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </div>
      </div> */}
    </div>
  );
}