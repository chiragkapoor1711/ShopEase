"use client";

import { useEffect, useState } from "react";
import { Search, Filter, ArrowUpDown, X, ChevronDown } from "lucide-react";

const inputWrapperClass =
  "w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none transition focus-within:ring-2 focus-within:ring-blue-200 dark:focus-within:ring-blue-500/30 focus-within:border-blue-400";

export default function SearchFilter({
  search,
  setSearch,
  category,
  setCategory,
  sort,
  setSort,
}) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    try {
      const res = await fetch("/api/seller/categories", {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.error(error);
    }
  }

  const hasActiveFilters = Boolean(search) || Boolean(category) || sort !== "newest";

  function clearAll() {
    setSearch("");
    setCategory("");
    setSort("newest");
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg ring-1 ring-black/5 dark:ring-white/10 p-5 sm:p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
          Filter products
        </h3>
        {hasActiveFilters && (
          <button
            onClick={clearAll}
            className="flex items-center gap-1 text-xs font-medium text-gray-400 hover:text-red-500 transition-colors"
          >
            <X size={12} />
            Clear all
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search */}
        <div className={`relative flex items-center ${inputWrapperClass}`}>
          <Search size={17} className="absolute left-3.5 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent pl-10 pr-9 py-3 text-sm outline-none placeholder:text-gray-400"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              aria-label="Clear search"
              className="absolute right-3 text-gray-300 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Category */}
        <div className={`relative flex items-center ${inputWrapperClass}`}>
          <Filter size={17} className="absolute left-3.5 text-gray-400 pointer-events-none" />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full appearance-none bg-transparent pl-10 pr-9 py-3 text-sm outline-none"
          >
            <option value="">All categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.category_name}
              </option>
            ))}
          </select>
          <ChevronDown
            size={15}
            className="absolute right-3.5 text-gray-400 pointer-events-none"
          />
        </div>

        {/* Sort */}
        <div className={`relative flex items-center ${inputWrapperClass}`}>
          <ArrowUpDown size={17} className="absolute left-3.5 text-gray-400 pointer-events-none" />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="w-full appearance-none bg-transparent pl-10 pr-9 py-3 text-sm outline-none"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="price_low">Price: low to high</option>
            <option value="price_high">Price: high to low</option>
            <option value="name">Name: A to Z</option>
          </select>
          <ChevronDown
            size={15}
            className="absolute right-3.5 text-gray-400 pointer-events-none"
          />
        </div>
      </div>
    </div>
  );
}