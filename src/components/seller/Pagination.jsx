"use client";

import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function Pagination() {
  return (

    <div className="flex flex-wrap justify-between items-center gap-3 mt-6 sm:mt-8">

      <button className="flex items-center gap-1.5 sm:gap-2 border px-3 sm:px-4 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-sm sm:text-base dark:text-white dark:border-gray-700">

        <ChevronLeft size={18} />

        <span className="hidden sm:inline">Previous</span>

      </button>

      <div className="flex gap-1.5 sm:gap-2 order-last sm:order-none w-full sm:w-auto justify-center">

        <button className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-blue-600 text-white text-sm sm:text-base">
          1
        </button>

        <button className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg border text-sm sm:text-base dark:text-white dark:border-gray-700">
          2
        </button>

        <button className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg border text-sm sm:text-base dark:text-white dark:border-gray-700">
          3
        </button>

      </div>

      <button className="flex items-center gap-1.5 sm:gap-2 border px-3 sm:px-4 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-sm sm:text-base dark:text-white dark:border-gray-700">

        <span className="hidden sm:inline">Next</span>

        <ChevronRight size={18} />

      </button>

    </div>

  );
}