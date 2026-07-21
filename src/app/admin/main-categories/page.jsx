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
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Trash2,
  Loader2,
} from "lucide-react";
import MainCategoryModal from "@/components/admin/MainCategoryModal";
import toast from "react-hot-toast";

const ITEMS_PER_PAGE = 10;

const cardShell =
  "bg-white dark:bg-gray-900 rounded-2xl shadow-lg ring-1 ring-black/5 dark:ring-white/10";

const inputWrapperClass =
  "flex items-center rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 outline-none transition focus-within:ring-2 focus-within:ring-blue-200 dark:focus-within:ring-blue-500/30 focus-within:border-blue-400";

function StatusBadge({ status }) {
  const isActive = status === "Active";
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap ${
        isActive
          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
          : "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400"
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-emerald-500" : "bg-red-500"}`} />
      {status}
    </span>
  );
}

function RowActions({ category, onEdit, onDelete, deleting }) {
  return (
    <div className="flex items-center gap-1">
      <button
        onClick={onEdit}
        aria-label={`Edit ${category.category_name}`}
        title="Edit category"
        className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 dark:hover:text-blue-400 transition-colors"
      >
        <Pencil size={17} />
      </button>
      <button
        onClick={onDelete}
        disabled={deleting}
        aria-label={`Delete ${category.category_name}`}
        title="Delete category"
        className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 dark:hover:text-red-400 disabled:opacity-40 transition-colors"
      >
        {deleting ? <Loader2 size={17} className="animate-spin" /> : <Trash2 size={17} />}
      </button>
    </div>
  );
}

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
      data = data.filter((item) => item.category_name?.toLowerCase().includes(query));
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

  const totalPages = Math.max(1, Math.ceil(filteredCategories.length / ITEMS_PER_PAGE));

  const paginatedCategories = filteredCategories.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
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
      color: "bg-blue-500",
    },
    {
      label: "Active",
      value: stats.active,
      icon: CheckCircle,
      color: "bg-emerald-500",
    },
    {
      label: "Inactive",
      value: stats.inactive,
      icon: XCircle,
      color: "bg-red-500",
    },
    {
      label: "Visible",
      value: stats.visible,
      icon: Eye,
      color: "bg-purple-500",
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4 sm:mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mt-5 ml-10 dark:text-white">
            Main Categories
          </h1>
          <p className="text-sm sm:text-base text-gray-500 ml-10 dark:text-gray-400 mt-1.5">
            Manage all marketplace main categories.
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedCategory(null);
            setOpenModal(true);
          }}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl transition text-base font-semibold shadow-sm"
        >
          <Plus size={18} />
          Add Main Category
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-5">
        {summaryCards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className={`${cardShell} p-5 sm:p-6`}>
            <div className="flex justify-between items-start gap-3">
              <div className="min-w-0">
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{label}</p>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mt-2 text-gray-900 dark:text-white tabular-nums">
                  {loading ? "—" : value}
                </h2>
              </div>
              <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl ${color} flex items-center justify-center shrink-0`}>
                <Icon size={24} className="text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search & Filter */}
      <div className={`${cardShell} p-4 sm:p-6 mt-4 sm:mt-6`}>
        <div className="grid md:grid-cols-2 gap-3 sm:gap-4">
          <div className={`relative ${inputWrapperClass}`}>
            <Search size={18} className="absolute left-3.5 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search main category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent pl-10 pr-4 py-3.5 text-base text-gray-900 dark:text-white placeholder:text-gray-400 outline-none"
            />
          </div>

          <div className={`relative flex items-center ${inputWrapperClass}`}>
            <Filter size={18} className="absolute left-3.5 text-gray-400 pointer-events-none" />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full appearance-none bg-transparent pl-10 pr-9 py-3.5 text-base font-medium text-gray-900 dark:text-white outline-none"
            >
              <option value="All">All statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            <ChevronDown size={16} className="absolute right-3.5 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Categories Table (desktop) */}
      <div className={`hidden md:block ${cardShell} mt-4 sm:mt-6 overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/60">
                <th className="px-5 py-3.5 text-left text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Image
                </th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Category name
                </th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Description
                </th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Status
                </th>
                <th className="px-5 py-3.5 text-right text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-14">
                    <div className="flex flex-col items-center gap-3 text-gray-500 dark:text-gray-400">
                      <Loader2 size={28} className="animate-spin" />
                      <span className="text-base">Loading categories...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-14">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-14 h-14 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-1">
                        <FolderTree size={22} className="text-gray-400" />
                      </div>
                      <p className="font-semibold text-base text-gray-900 dark:text-white">No main categories found</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
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
                    className="border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <img
                        src={category.category_image || "/uploads/no-image.png"}
                        alt={category.category_name || "Category image"}
                        className="w-14 h-14 rounded-lg object-cover ring-1 ring-black/5 dark:ring-white/10"
                      />
                    </td>

                    <td className="px-3 py-3.5 font-semibold text-base text-gray-900 dark:text-gray-100 whitespace-nowrap">
                      {category.category_name}
                    </td>

                    <td className="px-3 py-3.5 text-base text-gray-500 dark:text-gray-400 max-w-xs">
                      <p className="truncate" title={category.description}>
                        {category.description || (
                          <span className="italic text-gray-300 dark:text-gray-600">No description</span>
                        )}
                      </p>
                    </td>

                    <td className="px-3 py-3.5">
                      <StatusBadge status={category.status} />
                    </td>

                    <td className="px-5 py-3.5">
                      <div className="flex justify-end">
                        <RowActions
                          category={category}
                          deleting={deletingId === category.id}
                          onEdit={() => {
                            setSelectedCategory(category);
                            setOpenModal(true);
                          }}
                          onDelete={() => handleDelete(category.id)}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Categories cards (mobile) */}
      <div className="md:hidden mt-4 space-y-3">
        {loading ? (
          <div className={`${cardShell} flex flex-col items-center justify-center gap-3 py-14 text-gray-500 dark:text-gray-400`}>
            <Loader2 size={28} className="animate-spin" />
            <span className="text-base">Loading categories...</span>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className={`${cardShell} flex flex-col items-center justify-center gap-2 py-14 px-6 text-center`}>
            <div className="w-14 h-14 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-1">
              <FolderTree size={22} className="text-gray-400" />
            </div>
            <p className="font-semibold text-base text-gray-900 dark:text-white">No main categories found</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {categories.length === 0
                ? "Add your first main category to get started."
                : "Try adjusting your search or filter."}
            </p>
          </div>
        ) : (
          paginatedCategories.map((category) => (
            <div
              key={category.id}
              className="bg-white dark:bg-gray-900 rounded-xl ring-1 ring-black/5 dark:ring-white/10 shadow-sm p-4 flex gap-3.5"
            >
              <img
                src={category.category_image || "/uploads/no-image.png"}
                alt={category.category_name || "Category image"}
                className="w-16 h-16 rounded-lg object-cover shrink-0 ring-1 ring-black/5 dark:ring-white/10"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-semibold text-base text-gray-900 dark:text-white truncate">
                    {category.category_name}
                  </p>
                  <StatusBadge status={category.status} />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                  {category.description || (
                    <span className="italic text-gray-300 dark:text-gray-600">No description</span>
                  )}
                </p>
                <div className="flex justify-end mt-2.5 pt-2.5 border-t border-gray-100 dark:border-gray-800">
                  <RowActions
                    category={category}
                    deleting={deletingId === category.id}
                    onEdit={() => {
                      setSelectedCategory(category);
                      setOpenModal(true);
                    }}
                    onDelete={() => handleDelete(category.id)}
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {!loading && filteredCategories.length > 0 && (
        <div className={`${cardShell} flex flex-col sm:flex-row justify-between items-center gap-4 p-4 sm:p-6 mt-4`}>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Showing {paginatedCategories.length} of {filteredCategories.length}
          </p>

          <div className="flex items-center gap-1">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="flex items-center gap-1 px-3.5 py-2.5 rounded-lg text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
            >
              <ChevronLeft size={17} />
              Previous
            </button>

            <span className="px-3.5 py-2.5 text-sm font-semibold text-gray-900 dark:text-white">
              {currentPage} / {totalPages}
            </span>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="flex items-center gap-1 px-3.5 py-2.5 rounded-lg text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
            >
              Next
              <ChevronRight size={17} />
            </button>
          </div>
        </div>
      )}

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