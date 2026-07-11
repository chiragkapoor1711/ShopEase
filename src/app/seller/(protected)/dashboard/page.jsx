"use client";

import {
  FolderTree,
  Package,
  ShoppingCart,
  IndianRupee,
} from "lucide-react";

const stats = [
  { title: "Total Categories", value: 12, icon: FolderTree, color: "bg-blue-500" },
  { title: "Total Products", value: 248, icon: Package, color: "bg-green-500" },
  { title: "Total Orders", value: 86, icon: ShoppingCart, color: "bg-orange-500" },
  { title: "Total Revenue", value: "₹1,25,000", icon: IndianRupee, color: "bg-purple-500" },
];

const recentProducts = [
  { name: "Wireless Headphones", category: "Electronics", price: "₹2,999", stock: 45, status: "Active" },
  { name: "Smart Watch", category: "Accessories", price: "₹4,999", stock: 22, status: "Active" },
];

const recentOrders = [
  { id: "#1001", customer: "Bhagya Anand", amount: "₹4,999", status: "Processing" },
  { id: "#1002", customer: "Chirag Kapoor", amount: "₹2,999", status: "Delivered" },
];

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
                      {item.value}
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

        {/* Recent Products */}
        <div className="mt-6 sm:mt-8 lg:mt-10 bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-4 sm:mb-6 dark:text-white">
            Recent Products
          </h2>

          {/* Mobile/tablet: stacked cards (no horizontal scroll) */}
          <div className="md:hidden space-y-3">
            {recentProducts.map((p) => (
              <div
                key={p.name}
                className="border dark:border-gray-800 rounded-xl p-3 flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <p className="font-medium dark:text-white truncate">{p.name}</p>
                  <p className="text-sm text-gray-500 truncate">
                    {p.category} • {p.price} • Stock: {p.stock}
                  </p>
                </div>
                <StatusBadge status={p.status} />
              </div>
            ))}
          </div>

          {/* Desktop/tablet-landscape: table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b dark:border-gray-700">
                  <th className="text-left py-3 whitespace-nowrap">Product</th>
                  <th className="text-left py-3 whitespace-nowrap">Category</th>
                  <th className="text-left py-3 whitespace-nowrap">Price</th>
                  <th className="text-left py-3 whitespace-nowrap">Stock</th>
                  <th className="text-left py-3 whitespace-nowrap">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentProducts.map((p, i) => (
                  <tr
                    key={p.name}
                    className={i !== recentProducts.length - 1 ? "border-b dark:border-gray-800" : ""}
                  >
                    <td className="py-4 dark:text-gray-200">{p.name}</td>
                    <td className="dark:text-gray-200">{p.category}</td>
                    <td className="dark:text-gray-200">{p.price}</td>
                    <td className="dark:text-gray-200">{p.stock}</td>
                    <td><StatusBadge status={p.status} /></td>
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
                  <p className="font-medium dark:text-white truncate">{o.id} • {o.customer}</p>
                  <p className="text-sm text-gray-500 truncate">{o.amount}</p>
                </div>
                <StatusBadge status={o.status} />
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
                    <td className="py-4 dark:text-gray-200">{o.id}</td>
                    <td className="dark:text-gray-200">{o.customer}</td>
                    <td className="dark:text-gray-200">{o.amount}</td>
                    <td><StatusBadge status={o.status} /></td>
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