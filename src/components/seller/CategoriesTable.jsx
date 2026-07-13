"use client";

import Image from "next/image";
import { Pencil, Trash2, ImageOff, Inbox } from "lucide-react";
import { StatusBadge, formatDate } from "./CategoryCard";

// Table used on desktop/tablet-landscape.
export default function CategoriesTable({ categories, onEdit, onDelete }) {
  if (!categories?.length) {
    return (
      <div className="hidden md:flex flex-col items-center justify-center gap-3 py-16 bg-white dark:bg-gray-900 rounded-2xl shadow-lg ring-1 ring-black/5 dark:ring-white/10">
        <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          <Inbox size={20} className="text-gray-400" />
        </div>
        <p className="text-sm font-medium text-gray-900 dark:text-white">
          No categories yet
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Categories you add will show up here.
        </p>
      </div>
    );
  }

  return (
    <div className="hidden md:block bg-white dark:bg-gray-900 rounded-2xl shadow-lg ring-1 ring-black/5 dark:ring-white/10 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800/60">
              <th className="text-left py-3 pl-5 pr-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Image
              </th>
              <th className="text-left py-3 px-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Category
              </th>
              <th className="text-left py-3 px-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Description
              </th>
              <th className="text-left py-3 px-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Status
              </th>
              <th className="text-left py-3 px-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Created
              </th>
              <th className="text-right py-3 pl-3 pr-5 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr
                key={cat.id}
                className="border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors"
              >
                <td className="py-3 pl-5 pr-3">
                  {cat.category_image ? (
                    <Image
                      src={cat.category_image}
                      alt={cat.category_name}
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded-lg object-cover ring-1 ring-black/5 dark:ring-white/10"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      <ImageOff size={16} className="text-gray-300 dark:text-gray-600" />
                    </div>
                  )}
                </td>
                <td className="py-3 px-3 font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">
                  {cat.category_name}
                </td>
                <td className="py-3 px-3 text-sm text-gray-500 dark:text-gray-400 max-w-xs">
                  <p className="truncate" title={cat.description}>
                    {cat.description || (
                      <span className="italic text-gray-300 dark:text-gray-600">
                        No description
                      </span>
                    )}
                  </p>
                </td>
                <td className="py-3 px-3">
                  <StatusBadge status={cat.status} />
                </td>
                <td className="py-3 px-3 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                  {formatDate(cat.created_at || cat.created)}
                </td>
                <td className="py-3 pl-3 pr-5">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => onEdit(cat)}
                      className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 dark:hover:text-blue-400 transition-colors"
                      aria-label={`Edit ${cat.category_name}`}
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(cat)}
                      className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 dark:hover:text-red-400 transition-colors"
                      aria-label={`Delete ${cat.category_name}`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}