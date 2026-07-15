"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function FeaturedCategories() {
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
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <section className="py-16 text-center">
        <p>Loading Categories...</p>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}
        <div className="text-center mb-14 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
            Featured Categories
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Browse our most popular shopping categories.
          </p>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {categories.map((category, index) => (
            <Link
              key={category.id}
              href={`/category/${category.id}`}
              style={{ animationDelay: `${index * 100}ms` }}
              className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-md dark:shadow-gray-900/40 p-8 flex flex-col items-center cursor-pointer overflow-hidden transition-all duration-500 ease-out hover:shadow-2xl hover:-translate-y-3 hover:scale-[1.04] animate-fade-in-up opacity-0"
            >
              {/* Soft gradient glow on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-600/0 group-hover:from-blue-500/5 group-hover:to-blue-600/10 transition-all duration-500 rounded-2xl" />

              {/* Image */}
              <div className="relative w-36 h-36 md:w-44 md:h-44 shrink-0 overflow-hidden rounded-xl z-10">
                <Image
                  src={category.category_image || "/uploads/no-image.png"}
                  alt={category.category_name}
                  fill
                  sizes="(min-width: 768px) 176px, 144px"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-115 group-hover:rotate-1"
                />
              </div>

              <h3 className="mt-6 text-xl font-semibold text-gray-800 dark:text-white text-center z-10 transition-colors duration-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                {category.category_name}
              </h3>

              <p className="mt-2 text-sm text-gray-500 z-10">
                {category.vendor_count} Seller
                {category.vendor_count != 1 ? "s" : ""}
              </p>

              {/* Animated underline */}
              <span className="mt-3 h-0.5 w-0 bg-blue-600 rounded-full transition-all duration-500 group-hover:w-12 z-10" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
