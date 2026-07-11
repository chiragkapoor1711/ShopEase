"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-wrap justify-between items-center gap-4 mt-8">

      {/* Previous */}

      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-2 border px-4 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-white dark:border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronLeft size={18} />
        Previous
      </button>

      {/* Page Numbers */}

      <div className="flex gap-2">

        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => onPageChange(index + 1)}
            className={`w-10 h-10 rounded-lg transition ${
              currentPage === index + 1
                ? "bg-blue-600 text-white"
                : "border dark:border-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            {index + 1}
          </button>
        ))}

      </div>

      {/* Next */}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center gap-2 border px-4 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-white dark:border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
        <ChevronRight size={18} />
      </button>

    </div>
  );
}