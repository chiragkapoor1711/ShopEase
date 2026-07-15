"use client";

import { useState, useEffect, useMemo } from "react";
import {
  FolderTree,
  CheckCircle,
  XCircle,
  Eye,
  Plus,
  Search,
  Filter,
  Pencil,
  Trash2,
  Loader2,
} from "lucide-react";
import MainCategoryModal from "@/components/admin/MainCategoryModal";
import toast from "react-hot-toast";

const ITEMS_PER_PAGE = 10;

export default function MainCategoriesPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [openModal, setOpenModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  async function fetchCategories() {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/main-categories");
      const data = await res.json();

      if (data.success) {
        setCategories(data.categories);
      } else {
        toast.error(data.message || "Failed to load categories");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while loading categories");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  // Derived, always in sync with the latest data — no stale "0" placeholders.
  const stats = useMemo(() => {
    return {
      total: categories.length,
      active: categories.filter((c) => c.status === "Active").length,
      inactive: categories.filter((c) => c.status === "Inactive").length,
      visible: categories.filter((c) => c.status === "Active").length, // same as active
    };
  }, [categories]);

  const filteredCategories = useMemo(() => {
    let data = [...categories];

    if (search.trim() !== "") {
      const query = search.toLowerCase();
      data = data.filter((item) =>
        item.category_name?.toLowerCase().includes(query),
      );
    }

    if (status !== "All") {
      data = data.filter((item) => item.status === status);
    }

    return data;
  }, [categories, search, status]);

  // Keep pagination valid whenever the filtered set changes.
  useEffect(() => {
    setCurrentPage(1);
  }, [search, status]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredCategories.length / ITEMS_PER_PAGE),
  );

  const paginatedCategories = filteredCategories.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  async function handleDelete(id) {
    if (!confirm("Delete this category? This action cannot be undone.")) return;

    try {
      setDeletingId(id);
      const res = await fetch(`/api/admin/main-categories/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to delete category");
      }

      toast.success(data.message || "Category deleted");
      fetchCategories();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setDeletingId(null);
    }
  }

  const summaryCards = [
    {
      label: "Total Categories",
      value: stats.total,
      icon: FolderTree,
      color: "text-blue-600",
    },
    {
      label: "Active",
      value: stats.active,
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      label: "Inactive",
      value: stats.inactive,
      icon: XCircle,
      color: "text-red-600",
    },
    {
      label: "Visible",
      value: stats.visible,
      icon: Eye,
      color: "text-purple-600",
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold dark:text-white">
            Main Categories
          </h1>
          <p className="text-gray-500 mt-2">
            Manage all marketplace main categories.
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedCategory(null);
            setOpenModal(true);
          }}
          className="mt-4 md:mt-0 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl transition"
        >
          <Plus size={18} />
          Add Main Category
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-6">
        {summaryCards.map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500">{label}</p>
                <h2 className="text-3xl font-bold mt-3 dark:text-white">
                  {loading ? "—" : value}
                </h2>
              </div>
              <Icon size={40} className={color} />
            </div>
          </div>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 mt-8">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search Main Category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border rounded-xl pl-11 py-3 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
          </div>

          <div className="relative">
            <Filter
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border rounded-xl pl-11 py-3 dark:bg-gray-800 dark:border-gray-700 dark:text-white appearance-none"
            >
              <option value="All">All</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Categories Table */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg mt-8 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-4 text-left">Image</th>
                <th className="px-6 py-4 text-left">Category Name</th>
                <th className="px-6 py-4 text-left">Description</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-14">
                    <div className="flex flex-col items-center gap-3 text-gray-500">
                      <Loader2 size={28} className="animate-spin" />
                      Loading categories...
                    </div>
                  </td>
                </tr>
              ) : filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-14">
                    <div className="flex flex-col items-center gap-2 text-gray-500">
                      <FolderTree size={32} className="text-gray-300" />
                      <p className="font-medium">No main categories found</p>
                      <p className="text-sm">
                        {categories.length === 0
                          ? "Add your first main category to get started."
                          : "Try adjusting your search or filter."}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedCategories.map((category) => (
                  <tr
                    key={category.id}
                    className="border-t dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition"
                  >
                    <td className="px-6 py-4">
                      <img
                        src={category.category_image || "/uploads/no-image.png"}
                        alt={category.category_name || "Category image"}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    </td>

                    <td className="px-6 py-4 font-semibold dark:text-white">
                      {category.category_name}
                    </td>

                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300 max-w-xs truncate">
                      {category.description || "—"}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          category.status === "Active"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {category.status}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() => {
                            setSelectedCategory(category);
                            setOpenModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-800 disabled:opacity-40"
                          title="Edit category"
                        >
                          <Pencil size={18} />
                        </button>

                        <button
                          onClick={() => handleDelete(category.id)}
                          disabled={deletingId === category.id}
                          className="text-red-600 hover:text-red-800 disabled:opacity-40"
                          title="Delete category"
                        >
                          {deletingId === category.id ? (
                            <Loader2 size={18} className="animate-spin" />
                          ) : (
                            <Trash2 size={18} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {!loading && filteredCategories.length > 0 && (
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-6">
              <p className="text-gray-500 text-sm">
                Showing {paginatedCategories.length} of{" "}
                {filteredCategories.length}
              </p>

              <div className="flex gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                  className="px-4 py-2 border rounded-lg disabled:opacity-50 dark:border-gray-700 dark:text-white"
                >
                  Previous
                </button>

                <span className="px-4 py-2 dark:text-white">
                  {currentPage} / {totalPages}
                </span>

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  className="px-4 py-2 border rounded-lg disabled:opacity-50 dark:border-gray-700 dark:text-white"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <MainCategoryModal
        open={openModal}
        initialData={selectedCategory}
        onClose={() => {
          setOpenModal(false);
          setSelectedCategory(null);
          fetchCategories();
        }}
      />
    </div>
  );
}
