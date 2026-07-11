"use client";

import { Loader2, TriangleAlert } from "lucide-react";

// Generic delete confirmation modal. Reuse this same component
// (or rename it something neutral like DeleteConfirmModal) for
// Products and anything else that needs a delete confirmation,
// so the whole dashboard has one consistent dialog.
export default function DeleteModal({
  isOpen,
  itemName,
  loading,
  onCancel,
  onConfirm,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-sm p-6">
        <div className="flex items-start gap-3">
          <div className="shrink-0 w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
            <TriangleAlert size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Delete category
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Are you sure you want to delete{" "}
              <span className="font-medium">{itemName}</span>? This can't be
              undone.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 rounded-xl text-sm bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white transition disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm bg-red-600 hover:bg-red-700 text-white transition disabled:opacity-60"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}