"use client";

import Image from "next/image";
import { Pencil, Trash2, ImageOff } from "lucide-react";

export function StatusBadge({ status }) {
  const isActive = status === "Active";
  const styles = isActive
    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
    : "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400";
  return (
    <span
      className={`${styles} inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          isActive ? "bg-emerald-500" : "bg-red-500"
        }`}
      />
      {status}
    </span>
  );
}

export function formatDate(value) {
  if (!value) return "";
  const d = new Date(value);
  if (isNaN(d.getTime())) return String(value);
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

// Card used on mobile/tablet where a table doesn't fit well.
export default function CategoryCard({ cat, onEdit, onDelete }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl ring-1 ring-black/5 dark:ring-white/10 shadow-sm hover:shadow-md transition-shadow p-3.5 flex gap-3">
      {cat.category_image ? (
        <Image
          src={cat.category_image}
          alt={cat.category_name}
          width={56}
          height={56}
          className="w-14 h-14 rounded-lg object-cover shrink-0 ring-1 ring-black/5 dark:ring-white/10"
        />
      ) : (
        <div className="w-14 h-14 rounded-lg bg-gray-100 dark:bg-gray-800 shrink-0 flex items-center justify-center">
          <ImageOff size={18} className="text-gray-300 dark:text-gray-600" />
        </div>
      )}

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="font-medium text-gray-900 dark:text-white truncate">
            {cat.category_name}
          </p>
          <StatusBadge status={cat.status} />
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
          {cat.description || (
            <span className="italic text-gray-300 dark:text-gray-600">
              No description
            </span>
          )}
        </p>
        <div className="flex items-center justify-between mt-2.5 pt-2.5 border-t border-gray-100 dark:border-gray-800">
          <p className="text-xs text-gray-400">
            {formatDate(cat.created_at || cat.created)}
          </p>
          <div className="flex items-center gap-1 -mr-1.5">
            <button
              onClick={() => onEdit(cat)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 dark:hover:text-blue-400 transition-colors"
              aria-label={`Edit ${cat.category_name}`}
            >
              <Pencil size={15} />
            </button>
            <button
              onClick={() => onDelete(cat)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 dark:hover:text-red-400 transition-colors"
              aria-label={`Delete ${cat.category_name}`}
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}