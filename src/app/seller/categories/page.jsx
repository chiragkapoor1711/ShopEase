"use client";

import { useState } from "react";
import { PlusCircle, RotateCcw, Pencil, Trash2 } from "lucide-react";

const categories = [
  {
    name: "Electronics",
    description: "Electronic gadgets and accessories.",
    status: "Active",
    created: "10 July 2026",
  },
  {
    name: "Fashion",
    description: "Clothing and lifestyle products.",
    status: "Inactive",
    created: "08 July 2026",
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

export default function CategoriesPage() {
  const [status, setStatus] = useState("Active");

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-950">

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-full overflow-x-hidden">

        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold dark:text-white">
            Categories
          </h1>
          <p className="text-gray-500 mt-1 sm:mt-2 text-sm sm:text-base">
            Create and manage product categories.
          </p>
        </div>

        {/* Add Category Form */}
        <div className="bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8">

          <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold dark:text-white mb-4 sm:mb-6">
            Add Category
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">

            <div>
              <label className="font-medium dark:text-white text-sm sm:text-base">
                Category Name
              </label>

              <input
                type="text"
                placeholder="Enter category name"
                className="w-full mt-2 border rounded-xl p-2.5 sm:p-3 text-sm sm:text-base dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="font-medium dark:text-white text-sm sm:text-base">
                Category Image
              </label>

              <input
                type="file"
                className="w-full mt-2 border rounded-xl p-2.5 sm:p-3 text-sm sm:text-base dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />
            </div>

            <div className="md:col-span-2">

              <label className="font-medium dark:text-white text-sm sm:text-base">
                Description
              </label>

              <textarea
                rows={4}
                placeholder="Category description..."
                className="w-full mt-2 border rounded-xl p-2.5 sm:p-3 text-sm sm:text-base dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              ></textarea>

            </div>

            <div>

              <label className="font-medium dark:text-white text-sm sm:text-base">
                Status
              </label>

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full mt-2 border rounded-xl p-2.5 sm:p-3 text-sm sm:text-base dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              >
                <option>Active</option>
                <option>Inactive</option>
              </select>

            </div>

          </div>

          {/* Buttons */}

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8">

            <button className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition text-sm sm:text-base">

              <PlusCircle size={18} />

              Save

            </button>

            <button className="flex items-center justify-center gap-2 bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white px-6 py-3 rounded-xl transition text-sm sm:text-base">

              <RotateCcw size={18} />

              Reset

            </button>

          </div>

        </div>

        {/* Categories List */}

        <div className="mt-6 sm:mt-8 lg:mt-10 bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8">

          <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-4 sm:mb-6 dark:text-white">
            Categories List
          </h2>

          {/* Mobile/tablet: stacked cards (no horizontal scroll) */}
          <div className="md:hidden space-y-3">
            {categories.map((cat) => (
              <div
                key={cat.name}
                className="border dark:border-gray-800 rounded-xl p-3 flex gap-3"
              >
                <div className="w-14 h-14 rounded-lg bg-gray-200 dark:bg-gray-700 shrink-0"></div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-medium dark:text-white truncate">{cat.name}</p>
                    <StatusBadge status={cat.status} />
                  </div>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                    {cat.description}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-gray-400">{cat.created}</p>
                    <div className="flex gap-3">
                      <button className="text-blue-600 hover:scale-110">
                        <Pencil size={16} />
                      </button>
                      <button className="text-red-600 hover:scale-110">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop/tablet-landscape: table */}
          <div className="hidden md:block overflow-x-auto">

            <table className="w-full">

              <thead>

                <tr className="border-b dark:border-gray-700">

                  <th className="text-left py-3">Image</th>

                  <th className="text-left py-3">Category</th>

                  <th className="text-left py-3">Description</th>

                  <th className="text-left py-3">Status</th>

                  <th className="text-left py-3">Created</th>

                  <th className="text-left py-3">Action</th>

                </tr>

              </thead>

              <tbody>

                {categories.map((cat, i) => (
                  <tr
                    key={cat.name}
                    className={i !== categories.length - 1 ? "border-b dark:border-gray-800" : ""}
                  >

                    <td className="py-4">
                      <div className="w-14 h-14 rounded-lg bg-gray-200 dark:bg-gray-700"></div>
                    </td>

                    <td className="dark:text-gray-200">{cat.name}</td>

                    <td className="dark:text-gray-200 max-w-xs">{cat.description}</td>

                    <td>
                      <StatusBadge status={cat.status} />
                    </td>

                    <td className="dark:text-gray-200 whitespace-nowrap">{cat.created}</td>

                    <td>

                      <div className="flex gap-3">

                        <button className="text-blue-600 hover:scale-110">

                          <Pencil size={18} />

                        </button>

                        <button className="text-red-600 hover:scale-110">

                          <Trash2 size={18} />

                        </button>

                      </div>

                    </td>

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