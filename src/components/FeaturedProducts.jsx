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
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900">
            Featured Products
          </h2>

          <p className="mt-3 text-gray-600">
            Explore our best-selling products at amazing prices.
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
            >
              {/* Product Image */}
              <div className="h-60 w-full relative flex items-center justify-center ">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 100vw,
           (max-width: 768px) 50vw,
           (max-width: 1024px) 33vw,
           25vw"
                  className="object-contain"
                />
              </div>

              {/* Product Details */}
              <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-800">
                  {product.name}
                </h3>

                <p className="mt-2 text-2xl font-bold text-blue-600">
                  ₹{product.price}
                </p>

                {/* Rating */}
                <div className="flex items-center gap-2 mt-3">
                  <Star size={18} className="fill-yellow-400 text-yellow-400" />
                  <span className="text-gray-600">{product.rating}</span>
                </div>

                {/* Button */}
                <button className="mt-5 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition">
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
