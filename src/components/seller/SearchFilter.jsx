"use client";

import { useEffect, useState } from "react";
import { Search, Filter, ArrowUpDown } from "lucide-react";

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

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 mb-8">

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* Search */}

        <div className="relative">

          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search Product..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border rounded-xl pl-11 pr-4 py-3 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />

        </div>

        {/* Category */}

        <div className="relative">

          <Filter
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border rounded-xl pl-11 pr-4 py-3 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          >

            <option value="">
              All Categories
            </option>

            {categories.map((cat) => (
              <option
                key={cat.id}
                value={cat.id}
              >
                {cat.category_name}
              </option>
            ))}

          </select>

        </div>

        {/* Sort */}

        <div className="relative">

          <ArrowUpDown
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="w-full border rounded-xl pl-11 pr-4 py-3 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          >

            <option value="newest">
              Newest First
            </option>

            <option value="oldest">
              Oldest First
            </option>

            <option value="price_low">
              Price Low → High
            </option>

            <option value="price_high">
              Price High → Low
            </option>

            <option value="name">
              Name A → Z
            </option>

          </select>

        </div>

      </div>

    </div>
  );
}