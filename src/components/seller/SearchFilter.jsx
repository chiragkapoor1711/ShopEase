"use client";

import { Search, Filter, ArrowUpDown } from "lucide-react";

export default function SearchFilter() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8">

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">

        {/* Search */}

        <div className="relative">

          <Search
            size={18}
            className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search Products..."
            className="w-full border rounded-xl pl-10 sm:pl-11 pr-4 py-2.5 sm:py-3 text-sm sm:text-base dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />

        </div>

        {/* Category */}

        <div className="relative">

          <Filter
            size={18}
            className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <select
            className="w-full border rounded-xl pl-10 sm:pl-11 pr-4 py-2.5 sm:py-3 text-sm sm:text-base dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          >
            <option>All Categories</option>
            <option>Electronics</option>
            <option>Fashion</option>
            <option>Accessories</option>
            <option>Beauty</option>
          </select>

        </div>

        {/* Sort */}

        <div className="relative">

          <ArrowUpDown
            size={18}
            className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <select
            className="w-full border rounded-xl pl-10 sm:pl-11 pr-4 py-2.5 sm:py-3 text-sm sm:text-base dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          >
            <option>Newest First</option>
            <option>Oldest First</option>
            <option>Price Low → High</option>
            <option>Price High → Low</option>
            <option>Name A → Z</option>
          </select>

        </div>

      </div>

    </div>
  );
}