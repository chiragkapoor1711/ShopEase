"use client";

import { TriangleAlert, X } from "lucide-react";

export default function DeleteModal({
  isOpen,
  onClose,
  onDelete,
  productName,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <TriangleAlert className="text-red-600" />
            </div>

            <h2 className="text-xl font-bold dark:text-white">
              Delete Product
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X />
          </button>
        </div>

        {/* Content */}

        <div className="mt-6">
          <p className="text-gray-600 dark:text-gray-300">
            Are you sure you want to delete
            <span className="font-semibold text-red-600"> "{productName}"</span>
            ?
          </p>

          <p className="mt-3 text-sm text-gray-500">
            This action cannot be undone.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 mt-8">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl border hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Cancel
          </button>

          <button
            onClick={onDelete}
            className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
