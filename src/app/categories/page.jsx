"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function AllCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    try {
      const res = await fetch("/api/home/main-categories");
      const data = await res.json();

      if (data.success) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Loading Categories...
        </p>
      </section>
    );
  }

  return (
    <section className="min-h-screen py-16 bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            All Categories
          </h1>

          <p className="mt-3 text-gray-600 dark:text-gray-400">
            Browse all available shopping categories.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.id}`}
              className="group bg-white dark:bg-gray-800 rounded-2xl shadow-md dark:shadow-gray-900/40 overflow-hidden transition duration-300 hover:-translate-y-2 hover:shadow-xl"
            >
              <div className="relative w-full h-60">
                <Image
                  src={category.category_image || "/uploads/no-image.png"}
                  alt={category.category_name}
                  fill
                  className="object-cover group-hover:scale-105 transition duration-500"
                />
              </div>

              <div className="p-5 text-center">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {category.category_name}
                </h2>

                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  {category.vendor_count} Seller
                  {category.vendor_count !== 1 ? "s" : ""}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {categories.length === 0 && (
          <div className="text-center py-20">
            <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">
              No Categories Found
            </h2>

            <p className="mt-3 text-gray-500">
              Categories will appear here once added by the administrator.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}