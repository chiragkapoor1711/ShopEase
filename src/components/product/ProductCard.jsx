"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Eye, Star } from "lucide-react";

export default function ProductCard({ product, categoryName }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg overflow-hidden hover:-translate-y-2 hover:shadow-xl transition">

      {/* Product Image */}
      <div className="relative h-60 bg-gray-100">
        <Image
          src={product.product_image || "/uploads/no-image.png"}
          alt={product.product_name}
          fill
          sizes="(max-width:768px)100vw,(max-width:1200px)50vw,25vw"
          className="object-cover"
        />
      </div>

      {/* Content */}
      <div className="p-5">

        <span className="inline-block bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full">
          {categoryName || "Category"}
        </span>

        <h2 className="mt-4 text-xl font-bold dark:text-white">
          {product.product_name}
        </h2>

        <p className="text-gray-500 mt-2">
          {product.brand || "No Brand"}
        </p>

        <div className="flex items-center gap-2 mt-4">
          <Star size={18} className="text-yellow-500 fill-yellow-500" />
          <span>4.8</span>
        </div>

        <div className="mt-4">

          {Number(product.discount_price) > 0 ? (

            <div className="flex items-center gap-3">

              <span className="text-2xl font-bold text-blue-600">
                ₹{Number(product.discount_price).toLocaleString("en-IN")}
              </span>

              <span className="line-through text-gray-400">
                ₹{Number(product.price).toLocaleString("en-IN")}
              </span>

            </div>

          ) : (

            <span className="text-2xl font-bold text-blue-600">
              ₹{Number(product.price).toLocaleString("en-IN")}
            </span>

          )}

        </div>

        <div className="mt-4">

          {product.stock > 0 ? (
            <span className="text-green-600 font-medium">
              In Stock ({product.stock})
            </span>
          ) : (
            <span className="text-red-600 font-medium">
              Out of Stock
            </span>
          )}

        </div>

        <div className="grid grid-cols-2 gap-3 mt-6">

          <button
            disabled={product.stock <= 0}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 rounded-xl transition"
          >
            <ShoppingCart size={18} />
            Cart
          </button>

          <Link
            href={`/product/${product.id}`}
            className="flex items-center justify-center gap-2 border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white py-3 rounded-xl transition"
          >
            <Eye size={18} />
            Details
          </Link>

        </div>

      </div>

    </div>
  );
}