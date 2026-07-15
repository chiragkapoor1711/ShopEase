"use client";

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
} from "lucide-react";

export default function AdminDashboard() {
  const stats = [
    {
      title: "Total Sellers",
      value: "25",
      icon: Store,
      color: "bg-blue-500",
    },
    {
      title: "Customers",
      value: "320",
      icon: UserRound,
      color: "bg-green-500",
    },
    {
      title: "Products",
      value: "1240",
      icon: Package,
      color: "bg-orange-500",
    },
    {
      title: "Revenue",
      value: "₹12.5L",
      icon: IndianRupee,
      color: "bg-purple-500",
    },
    {
      title: "Pending Orders",
      value: "48",
      icon: Clock3,
      color: "bg-yellow-500",
    },
    {
      title: "Completed Orders",
      value: "520",
      icon: ShoppingCart,
      color: "bg-emerald-500",
    },
    {
      title: "Main Categories",
      value: "6",
      icon: FolderTree,
      color: "bg-indigo-500",
    },
    {
      title: "Active Vendors",
      value: "18",
      icon: Users,
      color: "bg-pink-500",
    },
  ];

  return (
    <div>
      {/* Header */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">

        <div>
          <h1 className="text-3xl font-bold dark:text-white">
            Admin Dashboard
          </h1>

          <p className="text-gray-500 mt-2">
            Welcome back! Here's an overview of your marketplace.
          </p>
        </div>

        <div className="flex gap-3 mt-5 lg:mt-0">

          <Link
            href="/admin/create-seller"
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl transition"
          >
            + Create Seller
          </Link>

          <Link
            href="/admin/main-categories"
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-xl transition"
          >
            + Main Category
          </Link>

        </div>

      </div>

      {/* Summary Cards */}

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-6">

        {stats.map((item, index) => {
          const Icon = item.icon;

          return (
            <div
              key={index}
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 hover:shadow-xl hover:-translate-y-1 transition"
            >
              <div className="flex justify-between items-center">

                <div>

                  <p className="text-gray-500">
                    {item.title}
                  </p>

                  <h2 className="text-3xl font-bold mt-3 dark:text-white">
                    {item.value}
                  </h2>

                </div>

                <div
                  className={`w-14 h-14 rounded-xl ${item.color} flex items-center justify-center`}
                >
                  <Icon className="text-white" size={28} />
                </div>

              </div>
            </div>
          );
        })}

      </div>

      {/* Recent Sellers & Orders */}

      <div className="grid lg:grid-cols-2 gap-8 mt-10">

        {/* Sellers */}

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6">

          <div className="flex justify-between items-center mb-6">

            <h2 className="text-xl font-bold dark:text-white">
              Recent Sellers
            </h2>

            <button className="flex items-center gap-2 text-blue-600 font-medium">
              View All
              <ArrowRight size={18} />
            </button>

          </div>

          <div className="space-y-4">

            {[
              "Tech World",
              "Fashion Hub",
              "Mobile Store",
              "Beauty Point",
            ].map((seller, index) => (

              <div
                key={index}
                className="flex justify-between items-center border-b pb-4"
              >

                <div>

                  <h3 className="font-semibold dark:text-white">
                    {seller}
                  </h3>

                  <p className="text-sm text-gray-500">
                    Active Seller
                  </p>

                </div>

                <span className="text-green-600 font-medium">
                  Active
                </span>

              </div>

            ))}

          </div>

        </div>

        {/* Orders */}

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6">

          <div className="flex justify-between items-center mb-6">

            <h2 className="text-xl font-bold dark:text-white">
              Recent Orders
            </h2>

            <button className="flex items-center gap-2 text-blue-600 font-medium">
              View All
              <ArrowRight size={18} />
            </button>

          </div>

          <div className="space-y-4">

            {[
              "#ORD1001",
              "#ORD1002",
              "#ORD1003",
              "#ORD1004",
            ].map((order, index) => (

              <div
                key={index}
                className="flex justify-between items-center border-b pb-4"
              >

                <div>

                  <h3 className="font-semibold dark:text-white">
                    {order}
                  </h3>

                  <p className="text-sm text-gray-500">
                    ₹2,499
                  </p>

                </div>

                <span className="text-yellow-600 font-medium">
                  Processing
                </span>

              </div>

            ))}

          </div>

        </div>

      </div>

      {/* Quick Actions */}

      <div className="mt-10 bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6">

        <h2 className="text-2xl font-bold dark:text-white mb-6">
          Quick Actions
        </h2>

        <div className="grid md:grid-cols-3 xl:grid-cols-6 gap-5">

          <Link
            href="/admin/create-seller"
            className="bg-blue-600 hover:bg-blue-700 text-white text-center rounded-xl py-5 transition"
          >
            Create Seller
          </Link>

          <Link
            href="/admin/main-categories"
            className="bg-green-600 hover:bg-green-700 text-white text-center rounded-xl py-5 transition"
          >
            Main Categories
          </Link>

          <Link
            href="/admin/products"
            className="bg-orange-600 hover:bg-orange-700 text-white text-center rounded-xl py-5 transition"
          >
            Products
          </Link>

          <Link
            href="/admin/orders"
            className="bg-purple-600 hover:bg-purple-700 text-white text-center rounded-xl py-5 transition"
          >
            Orders
          </Link>

          <Link
            href="/admin/customers"
            className="bg-pink-600 hover:bg-pink-700 text-white text-center rounded-xl py-5 transition"
          >
            Customers
          </Link>

          <Link
            href="/admin/reports"
            className="bg-gray-800 hover:bg-black text-white text-center rounded-xl py-5 transition"
          >
            Reports
          </Link>

        </div>

      </div>
    </div>
  );
}