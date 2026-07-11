"use client";

import Image from "next/image";
import { Pencil, Trash2 } from "lucide-react";

export function StatusBadge({ status }) {
  const styles =
    status === "Active"
      ? "bg-green-100 text-green-700"
      : "bg-red-100 text-red-700";
  return (
    <span
      className={`${styles} px-3 py-1 rounded-full text-xs sm:text-sm whitespace-nowrap`}
    >
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
    <div className="border dark:border-gray-800 rounded-xl p-3 flex gap-3">
      {cat.category_image ? (
        <Image
          src={cat.category_image}
          alt={cat.category_name}
          width={56}
          height={56}
          className="w-14 h-14 rounded-lg object-cover shrink-0"
        />
      ) : (
        <div className="w-14 h-14 rounded-lg bg-gray-200 dark:bg-gray-700 shrink-0" />
      )}

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="font-medium dark:text-white truncate">
            {cat.category_name}
          </p>
          <StatusBadge status={cat.status} />
        </div>
        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
          {cat.description}
        </p>
        <div className="flex items-center justify-between mt-2">
          <p className="text-xs text-gray-400">
            {formatDate(cat.created_at || cat.created)}
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => onEdit(cat)}
              className="text-blue-600 hover:scale-110"
              aria-label="Edit category"
            >
              <Pencil size={16} />
            </button>
            <button
              onClick={() => onDelete(cat)}
              className="text-red-600 hover:scale-110"
              aria-label="Delete category"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}