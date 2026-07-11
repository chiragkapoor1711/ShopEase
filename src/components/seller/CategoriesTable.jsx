"use client";

import Image from "next/image";
import { Pencil, Trash2 } from "lucide-react";
import { StatusBadge, formatDate } from "./CategoryCard";

// Table used on desktop/tablet-landscape.
export default function CategoriesTable({ categories, onEdit, onDelete }) {
  return (
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
              key={cat.id}
              className={
                i !== categories.length - 1
                  ? "border-b dark:border-gray-800"
                  : ""
              }
            >
              <td className="py-4">
                {cat.category_image ? (
                  <Image
                    src={cat.category_image}
                    alt={cat.category_name}
                    width={56}
                    height={56}
                    className="w-14 h-14 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-lg bg-gray-200 dark:bg-gray-700" />
                )}
              </td>
              <td className="dark:text-gray-200">{cat.category_name}</td>
              <td className="dark:text-gray-200 max-w-xs">
                {cat.description}
              </td>
              <td>
                <StatusBadge status={cat.status} />
              </td>
              <td className="dark:text-gray-200 whitespace-nowrap">
                {formatDate(cat.created_at || cat.created)}
              </td>
              <td>
                <div className="flex gap-3">
                  <button
                    onClick={() => onEdit(cat)}
                    className="text-blue-600 hover:scale-110"
                    aria-label="Edit category"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => onDelete(cat)}
                    className="text-red-600 hover:scale-110"
                    aria-label="Delete category"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}