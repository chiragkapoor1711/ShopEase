"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

import CategoriesForm from "@/components/seller/CategoriesForm";
import CategoriesTable from "@/components/seller/CategoriesTable";
import CategoryCard from "@/components/seller/CategoryCard";
import DeleteModal from "@/components/seller/DeleteModal";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loadingList, setLoadingList] = useState(true);

  const [editingCategory, setEditingCategory] = useState(null);

  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchCategories = useCallback(async () => {
    setLoadingList(true);
    try {
      const res = await fetch("/api/seller/categories", {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to load categories.");
      }

      setCategories(data.categories || []);
    } catch (err) {
      toast.error(err.message || "Something went wrong while loading categories.");
    } finally {
      setLoadingList(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  function handleEditClick(cat) {
    setEditingCategory(cat);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleConfirmDelete() {
    if (!categoryToDelete) return;

    setDeleting(true);
    try {
      const res = await fetch(`/api/seller/categories/${categoryToDelete.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to delete category.");
      }

      setCategories((prev) => prev.filter((c) => c.id !== categoryToDelete.id));
      toast.success("Category deleted.");
    } catch (err) {
      toast.error(err.message || "Something went wrong while deleting.");
    } finally {
      setDeleting(false);
      setCategoryToDelete(null);
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-950">
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-full overflow-x-hidden">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold dark:text-white">
            Categories
          </h1>
          <p className="text-gray-500 mt-1 sm:mt-2 text-sm sm:text-base">
            Create and manage product categories.
          </p>
        </div>

        <CategoriesForm
          editingCategory={editingCategory}
          onCancelEdit={() => setEditingCategory(null)}
          onSaved={fetchCategories}
        />

        <div className="mt-6 sm:mt-8 lg:mt-10 bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-4 sm:mb-6 dark:text-white">
            Categories List
          </h2>

          {loadingList && (
            <div className="flex items-center gap-2 text-gray-500 text-sm py-6">
              <Loader2 size={16} className="animate-spin" />
              Loading categories...
            </div>
          )}

          {!loadingList && categories.length === 0 && (
            <p className="text-sm text-gray-500 py-6">
              No categories yet — add one above.
            </p>
          )}

          {!loadingList && categories.length > 0 && (
            <>
              <div className="md:hidden space-y-3">
                {categories.map((cat) => (
                  <CategoryCard
                    key={cat.id}
                    cat={cat}
                    onEdit={handleEditClick}
                    onDelete={setCategoryToDelete}
                  />
                ))}
              </div>

              <CategoriesTable
                categories={categories}
                onEdit={handleEditClick}
                onDelete={setCategoryToDelete}
              />
            </>
          )}
        </div>
      </main>

      <DeleteModal
        isOpen={Boolean(categoryToDelete)}
        itemName={categoryToDelete?.category_name}
        loading={deleting}
        onCancel={() => setCategoryToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}