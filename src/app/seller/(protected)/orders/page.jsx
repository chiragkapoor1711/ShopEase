"use client";

import {
  Eye,
  Search,
  Filter,
  ShoppingCart,
  PackageCheck,
  Clock3,
  IndianRupee,
} from "lucide-react";

const orders = [
  {
    id: "#1001",
    customer: "Bhagya Anand",
    product: "Wireless Headphones",
    quantity: 2,
    total: "₹5,998",
    payment: "Paid",
    status: "Delivered",
  },
  {
    id: "#1002",
    customer: "Chirag Kapoor",
    product: "Smart Watch",
    quantity: 1,
    total: "₹4,999",
    payment: "Pending",
    status: "Processing",
  },
  {
    id: "#1003",
    customer: "Rahul Sharma",
    product: "Gaming Mouse",
    quantity: 3,
    total: "₹4,497",
    payment: "Paid",
    status: "Shipped",
  },
];

function PaymentBadge({ payment }) {
  const styles =
    payment === "Paid"
      ? "bg-green-100 text-green-700"
      : "bg-yellow-100 text-yellow-700";
  return (
    <span className={`${styles} px-3 py-1 rounded-full text-xs sm:text-sm whitespace-nowrap`}>
      {payment}
    </span>
  );
}

function StatusBadge({ status }) {
  const styles =
    status === "Delivered"
      ? "bg-green-100 text-green-700"
      : status === "Processing"
      ? "bg-blue-100 text-blue-700"
      : "bg-purple-100 text-purple-700";
  return (
    <span className={`${styles} px-3 py-1 rounded-full text-xs sm:text-sm whitespace-nowrap`}>
      {status}
    </span>
  );
}

export default function OrdersPage() {
  return (
    <div className="max-w-full overflow-x-hidden">

      {/* Header */}
      <div className="mb-6 sm:mb-8">

        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold dark:text-white">
          Orders
        </h1>

        <p className="text-gray-500 mt-1 sm:mt-2 text-sm sm:text-base">
          Manage customer orders and track their status.
        </p>

      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">

        <div className="bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl shadow-lg p-3 sm:p-5 lg:p-6">
          <div className="flex justify-between items-start sm:items-center gap-2">
            <div className="min-w-0">
              <p className="text-gray-500 text-xs sm:text-sm truncate">Total Orders</p>
              <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold mt-1 sm:mt-2 dark:text-white">
                86
              </h2>
            </div>

            <div className="w-9 h-9 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-lg sm:rounded-xl bg-blue-500 flex items-center justify-center shrink-0">
              <ShoppingCart className="text-white" size={18} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl shadow-lg p-3 sm:p-5 lg:p-6">
          <div className="flex justify-between items-start sm:items-center gap-2">
            <div className="min-w-0">
              <p className="text-gray-500 text-xs sm:text-sm truncate">Delivered</p>
              <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold mt-1 sm:mt-2 dark:text-white">
                60
              </h2>
            </div>

            <div className="w-9 h-9 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-lg sm:rounded-xl bg-green-500 flex items-center justify-center shrink-0">
              <PackageCheck className="text-white" size={18} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl shadow-lg p-3 sm:p-5 lg:p-6">
          <div className="flex justify-between items-start sm:items-center gap-2">
            <div className="min-w-0">
              <p className="text-gray-500 text-xs sm:text-sm truncate">Processing</p>
              <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold mt-1 sm:mt-2 dark:text-white">
                18
              </h2>
            </div>

            <div className="w-9 h-9 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-lg sm:rounded-xl bg-orange-500 flex items-center justify-center shrink-0">
              <Clock3 className="text-white" size={18} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl shadow-lg p-3 sm:p-5 lg:p-6">
          <div className="flex justify-between items-start sm:items-center gap-2">
            <div className="min-w-0">
              <p className="text-gray-500 text-xs sm:text-sm truncate">Revenue</p>
              <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold mt-1 sm:mt-2 dark:text-white truncate">
                ₹1,25,000
              </h2>
            </div>

            <div className="w-9 h-9 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-lg sm:rounded-xl bg-purple-500 flex items-center justify-center shrink-0">
              <IndianRupee className="text-white" size={18} />
            </div>
          </div>
        </div>

      </div>

      {/* Search & Filter */}

      <div className="bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">

          <div className="relative">

            <Search
              size={18}
              className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search Orders..."
              className="w-full border rounded-xl pl-10 sm:pl-11 py-2.5 sm:py-3 text-sm sm:text-base dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />

          </div>

          <div className="relative">

            <Filter
              size={18}
              className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <select className="w-full border rounded-xl pl-10 sm:pl-11 py-2.5 sm:py-3 text-sm sm:text-base dark:bg-gray-800 dark:border-gray-700 dark:text-white">

              <option>All Orders</option>

              <option>Delivered</option>

              <option>Processing</option>

              <option>Shipped</option>

            </select>

          </div>

        </div>

      </div>

      {/* Orders List */}

      <div className="bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6">

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0 mb-5 sm:mb-6">

          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold dark:text-white">
            Recent Orders
          </h2>

          <span className="text-gray-500 text-xs sm:text-sm">
            {orders.length} Orders
          </span>

        </div>

        {/* Mobile/tablet: stacked cards (no horizontal scroll) */}
        <div className="md:hidden space-y-3">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border dark:border-gray-800 rounded-xl p-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-semibold dark:text-white">{order.id}</p>
                  <p className="text-sm text-gray-500 truncate">{order.customer}</p>
                </div>
                <button className="text-blue-600 hover:scale-110 transition shrink-0">
                  <Eye size={18} />
                </button>
              </div>

              <p className="text-sm text-gray-500 mt-2 truncate">
                {order.product} • Qty: {order.quantity} • {order.total}
              </p>

              <div className="flex gap-2 mt-2 flex-wrap">
                <PaymentBadge payment={order.payment} />
                <StatusBadge status={order.status} />
              </div>
            </div>
          ))}
        </div>

        {/* Desktop/tablet-landscape: table */}
        <div className="hidden md:block overflow-x-auto">

          <table className="w-full">

            <thead>

              <tr className="border-b dark:border-gray-700">

                <th className="text-left py-4">Order ID</th>
                <th className="text-left py-4">Customer</th>
                <th className="text-left py-4">Product</th>
                <th className="text-left py-4">Qty</th>
                <th className="text-left py-4">Total</th>
                <th className="text-left py-4">Payment</th>
                <th className="text-left py-4">Status</th>
                <th className="text-center py-4">Action</th>

              </tr>

            </thead>

            <tbody>

              {orders.map((order) => (

                <tr
                  key={order.id}
                  className="border-b dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >

                  <td className="py-4 font-semibold dark:text-white">
                    {order.id}
                  </td>

                  <td className="dark:text-gray-200">{order.customer}</td>

                  <td className="dark:text-gray-200">{order.product}</td>

                  <td className="dark:text-gray-200">{order.quantity}</td>

                  <td className="dark:text-gray-200">{order.total}</td>

                  <td>
                    <PaymentBadge payment={order.payment} />
                  </td>

                  <td>
                    <StatusBadge status={order.status} />
                  </td>

                  <td>

                    <div className="flex justify-center">

                      <button className="text-blue-600 hover:scale-110 transition">

                        <Eye size={18} />

                      </button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}