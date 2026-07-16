"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Package, Star } from "lucide-react";

export default function VendorCard({ product }) {
  return (
    <div className="mt-12 bg-white border rounded-2xl shadow-sm p-6">

      <div className="flex flex-col md:flex-row items-center gap-6">

        {/* Store Logo */}
        <div className="w-24 h-24 rounded-full overflow-hidden border bg-gray-100 flex items-center justify-center">

          <Image
            src={product.store_logo}
            alt={product.store_name}
            width={96}
            height={96}
            className="w-full h-full object-cover"
          />

        </div>

        {/* Store Info */}
        <div className="flex-1">

          <h2 className="text-2xl font-bold">
            {product.store_name}
          </h2>

          <div className="flex items-center gap-2 mt-2 text-yellow-500">
            <Star size={18} fill="currentColor" />
            <span className="font-medium">
              4.8 Store Rating
            </span>
          </div>

          <div className="flex items-center gap-2 mt-2 text-gray-600">
            <MapPin size={18} />
            {product.store_address}
          </div>

          <div className="flex items-center gap-2 mt-2 text-gray-600">
            <Package size={18} />
            {product.total_products} Products
          </div>

        </div>

        {/* Visit Store Button */}
        <Link
          href={`/category/${product.main_category_id}/vendor/${product.store_id}`}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition font-medium"
        >
          Visit Store
        </Link>

      </div>

    </div>
  );
}