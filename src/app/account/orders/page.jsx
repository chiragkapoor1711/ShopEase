"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PackageX, ArrowRight, Loader2 } from "lucide-react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const cardShell =
  "bg-white dark:bg-gray-900 rounded-2xl shadow-lg ring-1 ring-black/5 dark:ring-white/10";

function getStatusColor(status) {
  switch (status) {
    case "Pending":
      return "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400";
    case "Processing":
      return "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400";
    case "Shipped":
      return "bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400";
    case "Delivered":
      return "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400";
    case "Cancelled":
      return "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400";
    default:
      return "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400";
  }
}

function OrderCardSkeleton() {
  return (
    <div className={`${cardShell} p-5 sm:p-6 animate-pulse`}>
      <div className="flex justify-between items-start flex-wrap gap-4">
        <div className="space-y-2">
          <div className="h-5 w-40 bg-gray-100 dark:bg-gray-800 rounded" />
          <div className="h-4 w-28 bg-gray-100 dark:bg-gray-800 rounded" />
          <div className="h-3 w-24 bg-gray-100 dark:bg-gray-800 rounded" />
        </div>
        <div className="h-7 w-24 bg-gray-100 dark:bg-gray-800 rounded-full" />
      </div>
      <div className="grid grid-cols-3 gap-4 mt-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-1.5">
            <div className="h-3 w-16 bg-gray-100 dark:bg-gray-800 rounded" />
            <div className="h-4 w-20 bg-gray-100 dark:bg-gray-800 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();

      if (data.success) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-8 sm:py-10 px-4">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-#1b0d6e-900 dark:text-white mb-6 sm:mb-8">
          My Orders
        </h1>
        <div className="space-y-4 sm:space-y-5">
          {Array.from({ length: 3 }).map((_, i) => (
            <OrderCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-6xl mx-auto py-8 sm:py-10 px-4">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-6 sm:mb-8">
          My Orders
        </h1>

        <div className={`${cardShell} p-10 sm:p-14 text-center`}>
          <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
            <PackageX size={28} className="text-gray-400" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            No orders yet
          </h2>
          <p className="text-base text-gray-500 dark:text-gray-400 mt-2">
            You haven&apos;t placed any orders.
          </p>

          <Link
            href="/"
            className="inline-flex items-center gap-2 mt-6 bg-black hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 text-white px-6 py-3 rounded-xl font-semibold transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 sm:py-10 px-4">
      <div className="mb-6 sm:mb-8">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center  mt-2 mb-2 justify-center w-10 h-10 rounded-lg border-2 border-gray-200 text-gray-600 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 active:scale-90 transition-all duration-150"
          aria-label="Go back"
        >
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
          My Orders
        </h1>
        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-1.5">
          {orders.length} order{orders.length === 1 ? "" : "s"} placed
        </p>
      </div>

      <div className="space-y-4 sm:space-y-5">
        {orders.map((order) => (
          <div key={order.id} className={`${cardShell} p-5 sm:p-6`}>
            <div className="flex justify-between items-start flex-wrap gap-3 sm:gap-4">
              <div>
                <h2 className="font-bold text-lg sm:text-xl text-gray-900 dark:text-white">
                  {order.store_name}
                </h2>
                <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-0.5">
                  Order #{order.order_number}
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1.5">
                  {new Date(order.created_at).toLocaleDateString()}
                </p>
              </div>

              <span
                className={`px-3.5 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap ${getStatusColor(
                  order.order_status,
                )}`}
              >
                {order.order_status}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-4 sm:gap-5 mt-5 sm:mt-6 pt-5 sm:pt-6 border-t border-gray-100 dark:border-gray-800">
              <div>
                <p className="text-gray-400 text-xs sm:text-sm">
                  Payment method
                </p>
                <p className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white mt-0.5">
                  {order.payment_method}
                </p>
              </div>

              <div>
                <p className="text-gray-400 text-xs sm:text-sm">
                  Payment status
                </p>
                <p className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white mt-0.5">
                  {order.payment_status}
                </p>
              </div>

              <div>
                <p className="text-gray-400 text-xs sm:text-sm">Total</p>
                <p className="font-bold text-base sm:text-lg text-gray-900 dark:text-white mt-0.5">
                  ₹{Number(order.total_amount).toLocaleString("en-IN")}
                </p>
              </div>
            </div>

            <div className="mt-5 sm:mt-6">
              <Link
                href={`/account/orders/${order.id}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-black hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 text-white rounded-xl text-sm sm:text-base font-semibold transition"
              >
                View details
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
