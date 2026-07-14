"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Eye, Star, Package } from "lucide-react";

export default function VendorProductsPage() {
  const { id, vendorId } = useParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id && vendorId) {
      fetchProducts();
    }
  }, [id, vendorId]);

  async function fetchProducts() {
    try {
      const res = await fetch(
        `/api/vendors/${vendorId}/products?category=${id}`,
      );

      const data = await res.json();

      if (data.success) {
        setProducts(data.products);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <p className="text-lg">Loading Products...</p>
      </div>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-6 py-10">
      {/* Heading */}

      <div className="mb-10">
        <h1 className="text-4xl font-bold dark:text-white">Vendor Products</h1>

        <p className="text-gray-500 mt-2">
          Browse all available products from this seller.
        </p>
      </div>

      {products.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg py-20 text-center">
          <Package size={60} className="mx-auto text-gray-400" />

          <h2 className="mt-6 text-2xl font-bold dark:text-white">
            No Products Found
          </h2>

          <p className="text-gray-500 mt-2">
            This seller has no active products in this category.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg overflow-hidden hover:-translate-y-2 hover:shadow-xl transition duration-300"
            >
              {/* Image */}

              <div className="relative h-60 bg-gray-100">
                <Image
                  src={product.product_image || "/uploads/no-image.png"}
                  alt={product.product_name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>

              {/* Content */}

              <div className="p-5">
                <span className="inline-block bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full">
                  {product.category_name}
                </span>

                <h2 className="mt-4 text-xl font-bold dark:text-white">
                  {product.product_name}
                </h2>

                <p className="text-gray-500 mt-2">
                  {product.brand || "No Brand"}
                </p>

                {/* Rating */}

                <div className="flex items-center gap-2 mt-4">
                  <Star size={18} className="text-yellow-500 fill-yellow-500" />

                  <span>4.8</span>
                </div>

                {/* Price */}

                <div className="mt-4">
                  {Number(product.discount_price) > 0 ? (
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold text-blue-600">
                        ₹
                        {Number(product.discount_price).toLocaleString("en-IN")}
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

                {/* Stock */}

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

                {/* Buttons */}

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
          ))}
        </div>
      )}
    </section>
  );
}
