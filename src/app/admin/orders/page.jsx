"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Eye, Search, Filter, ChevronDown, Inbox, Loader2 } from "lucide-react";

const cardShell =
  "bg-white dark:bg-gray-900 rounded-2xl shadow-lg ring-1 ring-black/5 dark:ring-white/10";

const inputWrapperClass =
  "flex items-center rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 outline-none transition focus-within:ring-2 focus-within:ring-blue-200 dark:focus-within:ring-blue-500/30 focus-within:border-blue-400";

function badgeColor(status) {
  switch (status) {
    case "Pending":
      return "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400";
    case "Confirmed":
      return "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400";
    case "Packed":
      return "bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400";
    case "Shipped":
      return "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400";
    case "Delivered":
      return "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400";
    case "Cancelled":
      return "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400";
    default:
      return "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400";
  }
}

function OrderStatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap ${badgeColor(
        status
      )}`}
    >
      {status}
    </span>
  );
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/admin/orders");
      const data = await res.json();

      if (data.success) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const keyword = search.toLowerCase();

      const matchesSearch =
        order.order_number.toLowerCase().includes(keyword) ||
        order.customer_name.toLowerCase().includes(keyword) ||
        order.store_name.toLowerCase().includes(keyword);

      const matchesStatus = status === "All" || order.order_status === status;

      return matchesSearch && matchesStatus;
    });
  }, [orders, search, status]);

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4 sm:mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold ml-10 mt-5 text-gray-900 dark:text-white">
            Order Management
          </h1>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 ml-10 mt-1.5">
            {loading
              ? "Loading orders..."
              : `${orders.length} order${orders.length === 1 ? "" : "s"} across your marketplace`}
          </p>
        </div>
      </div>

      {/* Search + Filter */}
      <div className={`${cardShell} p-4 sm:p-5 mb-4 sm:mb-6`}>
        <div className="flex flex-col md:flex-row gap-3 sm:gap-4">
          <div className={`relative flex-1 ${inputWrapperClass}`}>
            <Search size={18} className="absolute left-3.5 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search order, customer or store..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent pl-10 pr-4 py-3.5 text-base text-gray-900 dark:text-white placeholder:text-gray-400 outline-none"
            />
          </div>

          <div className={`relative flex items-center ${inputWrapperClass} md:w-56`}>
            <Filter size={18} className="absolute left-3.5 text-gray-400 pointer-events-none" />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full appearance-none bg-transparent pl-10 pr-9 py-3.5 text-base font-medium text-gray-900 dark:text-white outline-none"
            >
              <option>All</option>
              <option>Pending</option>
              <option>Confirmed</option>
              <option>Packed</option>
              <option>Shipped</option>
              <option>Delivered</option>
              <option>Cancelled</option>
            </select>
            <ChevronDown size={16} className="absolute right-3.5 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className={`${cardShell} flex items-center justify-center gap-2 py-16 text-gray-500 dark:text-gray-400`}>
          <Loader2 size={18} className="animate-spin" />
          <span className="text-base">Loading orders...</span>
        </div>
      )}

      {!loading && (
        <>
          {/* Desktop table */}
          <div className={`hidden md:block ${cardShell} overflow-hidden`}>
            {filteredOrders.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-16 px-6 text-center">
                <div className="w-14 h-14 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <Inbox size={22} className="text-gray-400" />
                </div>
                <p className="text-base font-semibold text-gray-900 dark:text-white">No orders found</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Try adjusting your search or status filter.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-800/60">
                      <th className="text-left px-5 py-3.5 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        Order
                      </th>
                      <th className="text-left px-3 py-3.5 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        Customer
                      </th>
                      <th className="text-left px-3 py-3.5 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        Store
                      </th>
                      <th className="text-left px-3 py-3.5 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        Amount
                      </th>
                      <th className="text-left px-3 py-3.5 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        Payment
                      </th>
                      <th className="text-left px-3 py-3.5 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        Status
                      </th>
                      <th className="text-left px-3 py-3.5 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        Date
                      </th>
                      <th className="text-right px-5 py-3.5 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredOrders.map((order) => (
                      <tr
                        key={order.id}
                        className="border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors"
                      >
                        <td className="px-5 py-4 font-semibold text-base text-gray-900 dark:text-gray-100 whitespace-nowrap">
                          {order.order_number}
                        </td>
                        <td className="px-3 py-4 text-base text-gray-700 dark:text-gray-300 whitespace-nowrap">
                          {order.customer_name}
                        </td>
                        <td className="px-3 py-4 text-base text-gray-700 dark:text-gray-300 whitespace-nowrap">
                          {order.store_name}
                        </td>
                        <td className="px-3 py-4 text-base font-semibold text-gray-900 dark:text-gray-100 whitespace-nowrap">
                          ₹{Number(order.total_amount).toLocaleString("en-IN")}
                        </td>
                        <td className="px-3 py-4 text-base text-gray-500 dark:text-gray-400 whitespace-nowrap">
                          {order.payment_method}
                        </td>
                        <td className="px-3 py-4">
                          <OrderStatusBadge status={order.order_status} />
                        </td>
                        <td className="px-3 py-4 text-base text-gray-500 dark:text-gray-400 whitespace-nowrap">
                          {new Date(order.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex justify-end">
                            <Link
                              href={`/admin/orders/${order.id}`}
                              className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors"
                            >
                              <Eye size={16} />
                              View
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Mobile cards */}
          <div className="space-y-3 md:hidden">
            {filteredOrders.length === 0 ? (
              <div className={`${cardShell} flex flex-col items-center justify-center gap-3 py-16 px-6 text-center`}>
                <div className="w-14 h-14 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <Inbox size={22} className="text-gray-400" />
                </div>
                <p className="text-base font-semibold text-gray-900 dark:text-white">No orders found</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Try adjusting your search or status filter.
                </p>
              </div>
            ) : (
              filteredOrders.map((order) => (
                <div key={order.id} className="bg-white dark:bg-gray-900 rounded-xl ring-1 ring-black/5 dark:ring-white/10 shadow-sm p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="font-semibold text-base text-gray-900 dark:text-white truncate">
                        {order.order_number}
                      </h3>
                      <p className="text-sm text-gray-400 truncate">
                        {order.customer_name} · {order.store_name}
                      </p>
                    </div>
                    <OrderStatusBadge status={order.order_status} />
                  </div>

                  <div className="flex items-center justify-between mt-3 text-base">
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      ₹{Number(order.total_amount).toLocaleString("en-IN")}
                    </span>
                    <span className="text-gray-400 text-sm">
                      {order.payment_method} · {new Date(order.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="mt-3 flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-colors"
                  >
                    <Eye size={16} />
                    View order
                  </Link>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}