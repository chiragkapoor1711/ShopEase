"use client";

import {
  Users,
  UserPlus,
  ShoppingBag,
  Search,
  Filter,
  Eye,
  Mail,
  Phone,
} from "lucide-react";

const customers = [
  {
    id: 1,
    name: "Bhagya Anand",
    email: "anandbhagya37@gmail.com",
    mobile: "7015765196",
    orders: 8,
    date: "10 Jul 2026",
    status: "Active",
  },
  {
    id: 2,
    name: "Chirag Kapoor",
    email: "chirag@gmail.com",
    mobile: "9876543210",
    orders: 15,
    date: "08 Jul 2026",
    status: "Active",
  },
  {
    id: 3,
    name: "Rahul Sharma",
    email: "rahul@gmail.com",
    mobile: "9988776655",
    orders: 3,
    date: "06 Jul 2026",
    status: "Inactive",
  },
];

function StatusBadge({ status }) {
  const styles =
    status === "Active"
      ? "bg-green-100 text-green-700"
      : "bg-red-100 text-red-700";
  return (
    <span className={`${styles} px-3 py-1 rounded-full text-xs sm:text-sm whitespace-nowrap`}>
      {status}
    </span>
  );
}

export default function CustomersPage() {
  return (
    <div className="max-w-full overflow-x-hidden">

      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold dark:text-white">
          Customers
        </h1>

        <p className="text-gray-500 mt-1 sm:mt-2 text-sm sm:text-base">
          View and manage your customer information.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">

        <div className="bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl shadow-lg p-3 sm:p-5 lg:p-6">
          <div className="flex justify-between items-start sm:items-center gap-2">
            <div className="min-w-0">
              <p className="text-gray-500 text-xs sm:text-sm truncate">Total Customers</p>
              <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold mt-1 sm:mt-2 dark:text-white">
                245
              </h2>
            </div>

            <div className="w-9 h-9 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-blue-500 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0">
              <Users className="text-white" size={18} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl shadow-lg p-3 sm:p-5 lg:p-6">
          <div className="flex justify-between items-start sm:items-center gap-2">
            <div className="min-w-0">
              <p className="text-gray-500 text-xs sm:text-sm truncate">New Customers</p>
              <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold mt-1 sm:mt-2 dark:text-white">
                24
              </h2>
            </div>

            <div className="w-9 h-9 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-green-500 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0">
              <UserPlus className="text-white" size={18} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl shadow-lg p-3 sm:p-5 lg:p-6">
          <div className="flex justify-between items-start sm:items-center gap-2">
            <div className="min-w-0">
              <p className="text-gray-500 text-xs sm:text-sm truncate">Active Customers</p>
              <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold mt-1 sm:mt-2 dark:text-white">
                218
              </h2>
            </div>

            <div className="w-9 h-9 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-purple-500 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0">
              <ShoppingBag className="text-white" size={18} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl shadow-lg p-3 sm:p-5 lg:p-6">
          <div className="flex justify-between items-start sm:items-center gap-2">
            <div className="min-w-0">
              <p className="text-gray-500 text-xs sm:text-sm truncate">Inactive</p>
              <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold mt-1 sm:mt-2 dark:text-white">
                27
              </h2>
            </div>

            <div className="w-9 h-9 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-red-500 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0">
              <Users className="text-white" size={18} />
            </div>
          </div>
        </div>

      </div>

      {/* Search */}
      <div className="bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">

          <div className="relative">

            <Search
              className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />

            <input
              type="text"
              placeholder="Search Customer..."
              className="w-full border rounded-xl pl-10 sm:pl-11 py-2.5 sm:py-3 text-sm sm:text-base dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />

          </div>

          <div className="relative">

            <Filter
              className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />

            <select className="w-full border rounded-xl pl-10 sm:pl-11 py-2.5 sm:py-3 text-sm sm:text-base dark:bg-gray-800 dark:border-gray-700 dark:text-white">

              <option>All Customers</option>

              <option>Active</option>

              <option>Inactive</option>

            </select>

          </div>

        </div>

      </div>

      {/* Customer List */}
      <div className="bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6">

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0 mb-5 sm:mb-6">

          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold dark:text-white">
            Customer List
          </h2>

          <span className="text-gray-500 text-xs sm:text-sm">
            {customers.length} Customers
          </span>

        </div>

        {/* Mobile/tablet: stacked cards (no horizontal scroll) */}
        <div className="md:hidden space-y-3">
          {customers.map((customer) => (
            <div
              key={customer.id}
              className="border dark:border-gray-800 rounded-xl p-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-semibold dark:text-white truncate">{customer.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {customer.orders} orders • {customer.date}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <StatusBadge status={customer.status} />
                  <button className="text-blue-600 hover:scale-110 transition">
                    <Eye size={18} />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-2 text-sm text-gray-500 min-w-0">
                <Mail size={14} className="shrink-0" />
                <span className="truncate">{customer.email}</span>
              </div>

              <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                <Phone size={14} className="shrink-0" />
                {customer.mobile}
              </div>
            </div>
          ))}
        </div>

        {/* Desktop/tablet-landscape: table */}
        <div className="hidden md:block overflow-x-auto">

          <table className="w-full">

            <thead>

              <tr className="border-b dark:border-gray-700">

                <th className="text-left py-4">Customer</th>
                <th className="text-left py-4">Email</th>
                <th className="text-left py-4">Mobile</th>
                <th className="text-left py-4">Orders</th>
                <th className="text-left py-4">Registered</th>
                <th className="text-left py-4">Status</th>
                <th className="text-center py-4">Action</th>

              </tr>

            </thead>

            <tbody>

              {customers.map((customer) => (

                <tr
                  key={customer.id}
                  className="border-b dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >

                  <td className="py-4 font-semibold dark:text-white">
                    {customer.name}
                  </td>

                  <td className="dark:text-gray-200">
                    <div className="flex items-center gap-2">
                      <Mail size={16} />
                      {customer.email}
                    </div>
                  </td>

                  <td className="dark:text-gray-200">
                    <div className="flex items-center gap-2">
                      <Phone size={16} />
                      {customer.mobile}
                    </div>
                  </td>

                  <td className="dark:text-gray-200">{customer.orders}</td>

                  <td className="dark:text-gray-200">{customer.date}</td>

                  <td>
                    <StatusBadge status={customer.status} />
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