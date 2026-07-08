"use client"
import Image from "next/image";

const categories = [
  {
    name: "Electronics",
    image: "/categories/electronics.jpg",
  },
  {
    name: "Fashion",
    image: "/categories/fashion.jpg",
  },
  {
    name: "Footwear",
    image: "/categories/footwear.jpg",
  },
  {
    name: "Accessories",
    image: "/categories/accessories.jpg",
  },
  {
    name: "Home Decor",
    image: "/categories/home-decor.jpg",
  },
  {
    name: "Beauty",
    image: "/categories/beauty.jpg",
  },
];

export default function FeaturedCategories() {
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
            Featured Categories
          </h2>

          <p className="mt-3 text-gray-600 dark:text-gray-300">
            Browse our most popular shopping categories.
          </p>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">

          {categories.map((category, index) => (
            <div
              key={index}
              style={{ animationDelay: `${index * 80}ms` }}
              className="group bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/40 p-6 flex flex-col items-center cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:scale-105 animate-fade-in-up opacity-0"
            >
              {/* Fixed-size image container so every card matches regardless of source image dimensions */}
              <div className="relative w-28 h-28 md:w-32 md:h-32 shrink-0 overflow-hidden rounded-lg">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  sizes="(min-width: 768px) 128px, 112px"
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>

              <h3 className="mt-4 text-lg font-semibold text-gray-800 dark:text-white text-center">
                {category.name}
              </h3>
            </div>
          ))}

        </div>

      </div>

     
    </section>
  );
}