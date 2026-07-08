import Image from "next/image";
import { Star } from "lucide-react";

const products = [
  {
    id: 1,
    name: "Wireless Headphones",
    price: 2499,
    rating: 4.8,
    image: "/products/headphone.jpg",
  },
  {
    id: 2,
    name: "Smart Watch",
    price: 3999,
    rating: 4.6,
    image: "/products/watch.jpg",
  },
  {
    id: 3,
    name: "Running Shoes",
    price: 2999,
    rating: 4.7,
    image: "/products/shoes.jpg",
  },
  {
    id: 4,
    name: "Leather Backpack",
    price: 1999,
    rating: 4.5,
    image: "/products/bag.jpg",
  },
  {
    id: 5,
    name: "Bluetooth Speaker",
    price: 1799,
    rating: 4.4,
    image: "/products/speaker.jpg",
  },
  {
    id: 6,
    name: "Gaming Mouse",
    price: 999,
    rating: 4.8,
    image: "/products/mouse.jpg",
  },
  {
    id: 7,
    name: "Wireless Headphones",
    price: 2499,
    rating: 4.8,
    image: "/products/headphone.jpg",
  },
  {
    id: 8,
    name: "Smart Watch",
    price: 3999,
    rating: 4.6,
    image: "/products/watch.jpg",
  },
];

export default function FeaturedProducts() {
  return (
    <section className="py-16 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
            Featured Products
          </h2>

          <p className="mt-3 text-gray-600 dark:text-gray-300">
            Explore our best-selling products at amazing prices.
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">

          {products.map((product, index) => (
            <div
              key={product.id}
              style={{ animationDelay: `${index * 80}ms` }}
              className="group bg-white dark:bg-gray-800 rounded-2xl shadow-md dark:shadow-gray-900/40 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 animate-fade-in-up opacity-0"
            >
              {/* Product Image */}
              <div className="h-60 w-full relative flex items-center justify-center bg-gray-50 dark:bg-gray-700 overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 100vw,
                         (max-width: 768px) 50vw,
                         (max-width: 1024px) 33vw,
                         25vw"
                  className="object-contain transition-transform duration-300 group-hover:scale-110"
                />
              </div>

              {/* Product Details */}
              <div className="p-5">

                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  {product.name}
                </h3>

                <p className="mt-2 text-2xl font-bold text-blue-600 dark:text-blue-400">
                  ₹{product.price}
                </p>

                {/* Rating */}
                <div className="flex items-center gap-2 mt-3">
                  <Star
                    size={18}
                    className="fill-yellow-400 text-yellow-400"
                  />

                  <span className="text-gray-600 dark:text-gray-300">
                    {product.rating}
                  </span>
                </div>

                {/* Button */}
                <button className="mt-5 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-all duration-300 hover:scale-[1.02] active:scale-95">
                  Add to Cart
                </button>

              </div>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}