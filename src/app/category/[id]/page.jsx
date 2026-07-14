"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Package, Star } from "lucide-react";

export default function VendorListingPage() {
  const { id } = useParams();

  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVendors();
  }, []);

  async function fetchVendors() {
    try {
      const res = await fetch(`/api/categories/${id}/vendors`);

      const data = await res.json();

      if (data.success) {
        setVendors(data.vendors);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="flex justify-center py-20">Loading Vendors...</div>;
  }

  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-10 dark:text-white">Vendors</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {vendors.map((vendor) => (
          <div
            key={vendor.id}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg overflow-hidden hover:-translate-y-2 hover:shadow-xl transition"
          >
            <div className="h-40 bg-gray-100 relative">
              <Image
                src={vendor.store_logo || "/uploads/no-image.png"}
                alt={vendor.store_name}
                fill
                sizes="(max-width: 640px) 100vw,
         (max-width: 1024px) 50vw,
         25vw"
                className="object-cover"
              />
            </div>

            <div className="p-6">
              <h2 className="text-2xl font-bold dark:text-white">
                {vendor.store_name}
              </h2>

              <p className="text-gray-500 mt-2 line-clamp-2">
                {vendor.description || "No description available"}
              </p>

              <div className="flex items-center gap-2 mt-5">
                <Star size={18} className="text-yellow-500 fill-yellow-500" />

                <span>4.8</span>
              </div>

              <div className="flex items-center gap-2 mt-3">
                <Package size={18} />

                <span>{vendor.product_count} Products</span>
              </div>

              <div className="flex items-center gap-2 mt-3">
                <MapPin size={18} />

                <span>{vendor.address || "Location not available"}</span>
              </div>

              <Link
                href={`/category/${id}/vendor/${vendor.id}`}
                className="mt-6 block text-center bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl transition"
              >
                Visit Store
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
