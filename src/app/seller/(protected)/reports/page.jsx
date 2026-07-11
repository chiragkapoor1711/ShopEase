"use client";

import {
  IndianRupee,
  Package,
  Trophy,
  BarChart3,
  TrendingUp,
  Calendar,
  Download,
} from "lucide-react";

export default function ReportsPage() {
  return (
    <div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8">

        <div>
          <h1 className="text-3xl font-bold dark:text-white">
            Reports
          </h1>

          <p className="text-gray-500 mt-2">
            Monitor your sales performance and business insights.
          </p>
        </div>

        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl transition mt-4 md:mt-0">
          <Download size={18} />
          Export Report
        </button>

      </div>

      {/* Summary Cards */}

      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 hover:shadow-xl transition">

          <div className="flex justify-between items-center">

            <div>

              <p className="text-gray-500">
                Today's Sales
              </p>

              <h2 className="text-3xl font-bold mt-2 dark:text-white">
                ₹18,450
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

              <p className="text-gray-500">
                Monthly Sales
              </p>

              <h2 className="text-3xl font-bold mt-2 dark:text-white">
                ₹2,85,000
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

              <p className="text-gray-500">
                Best Selling Product
              </p>

              <h2 className="text-xl font-bold mt-2 dark:text-white">
                Smart Watch
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

              <p className="text-gray-500">
                Top Category
              </p>

              <h2 className="text-xl font-bold mt-2 dark:text-white">
                Electronics
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

          <div className="h-80 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 flex flex-col items-center justify-center">

            <BarChart3
              size={60}
              className="text-blue-500"
            />

            <p className="mt-4 text-gray-500">
              Sales Chart Placeholder
            </p>

            <p className="text-sm text-gray-400 mt-2">
              Chart.js / Recharts will be integrated later.
            </p>

          </div>

        </div>

        {/* Revenue Chart */}

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6">

          <div className="flex justify-between items-center mb-6">

            <h2 className="text-xl font-bold dark:text-white">
              Revenue Analytics
            </h2>

            <IndianRupee className="text-green-600" />

          </div>

          <div className="h-80 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 flex flex-col items-center justify-center">

            <TrendingUp
              size={60}
              className="text-green-500"
            />

            <p className="mt-4 text-gray-500">
              Revenue Chart Placeholder
            </p>

            <p className="text-sm text-gray-400 mt-2">
              Monthly Revenue Analytics
            </p>

          </div>

        </div>

      </div>

      {/* Performance Summary */}

      <div className="mt-10 bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6">

        <h2 className="text-2xl font-bold mb-6 dark:text-white">
          Performance Summary
        </h2>

        <div className="grid md:grid-cols-3 gap-6">

          <div className="rounded-xl bg-gray-100 dark:bg-gray-800 p-6">

            <p className="text-gray-500">
              Conversion Rate
            </p>

            <h3 className="text-3xl font-bold mt-3 dark:text-white">
              4.8%
            </h3>

          </div>

          <div className="rounded-xl bg-gray-100 dark:bg-gray-800 p-6">

            <p className="text-gray-500">
              Average Order Value
            </p>

            <h3 className="text-3xl font-bold mt-3 dark:text-white">
              ₹2,450
            </h3>

          </div>

          <div className="rounded-xl bg-gray-100 dark:bg-gray-800 p-6">

            <p className="text-gray-500">
              Returning Customers
            </p>

            <h3 className="text-3xl font-bold mt-3 dark:text-white">
              68%
            </h3>

          </div>

        </div>

      </div>

    </div>
  );
}