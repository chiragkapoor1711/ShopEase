"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

export default function FeaturedCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentIndex, setCurrentIndex] = useState(0);

  const visibleItems = 4;

  const nextSlide = () => {
    if (categories.length <= visibleItems) return;

    if (currentIndex + visibleItems >= categories.length) {
      setCurrentIndex(0);
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevSlide = () => {
    if (categories.length <= visibleItems) return;

    if (currentIndex === 0) {
      setCurrentIndex(categories.length - visibleItems);
    } else {
      setCurrentIndex(currentIndex - 1);
    }
  };

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
        <div className="relative">
          <div className="flex justify-end mb-6">
            {categories.length > visibleItems && (
              <div className="flex gap-3">
                <button
                  onClick={prevSlide}
                  className="w-11 h-11 rounded-full bg-white dark:bg-gray-800 shadow-md hover:bg-blue-600 hover:text-white transition flex items-center justify-center"
                >
                  <ChevronLeft size={22} />
                </button>

                <button
                  onClick={nextSlide}
                  className="w-11 h-11 rounded-full bg-white dark:bg-gray-800 shadow-md hover:bg-blue-600 hover:text-white transition flex items-center justify-center"
                >
                  <ChevronRight size={22} />
                </button>
              </div>
            )}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {categories
              .slice(currentIndex, currentIndex + visibleItems)
              .map((category, index) => (
                <Link
                  key={category.id}
                  href={`/category/${category.id}`}
                  style={{ animationDelay: `${index * 100}ms` }}
                  className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-md dark:shadow-gray-900/40 p-8 flex flex-col items-center cursor-pointer overflow-hidden transition-all duration-500 ease-out hover:shadow-2xl hover:-translate-y-3 hover:scale-[1.04]"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-600/0 group-hover:from-blue-500/5 group-hover:to-blue-600/10 transition-all duration-500 rounded-2xl" />

                  <div className="relative w-36 h-36 md:w-44 md:h-44 overflow-hidden rounded-xl z-10">
                    <Image
                      src={category.category_image || "/uploads/no-image.png"}
                      alt={category.category_name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>

                  <h3 className="mt-6 text-xl font-semibold text-gray-800 dark:text-white text-center z-10">
                    {category.category_name}
                  </h3>

                  <p className="mt-2 text-sm text-gray-500 z-10">
                    {category.vendor_count} Seller
                    {category.vendor_count !== 1 ? "s" : ""}
                  </p>

                  <span className="mt-3 h-0.5 w-0 bg-blue-600 rounded-full transition-all duration-500 group-hover:w-12 z-10" />
                </Link>
              ))}
          </div>

          {/* Bottom Right */}
          <div className="flex justify-end mt-10">
            <Link
              href="/categories"
              className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition"
            >
              All Categories
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
