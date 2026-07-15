"use client";


import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ShoppingCart,
  Eye,
  Star,
  Package,
  MapPin,
  ArrowLeft,
} from "lucide-react";

export default function VendorProductsPage() {
  const { vendorId } = useParams();
  const router = useRouter();
 
  const [loading, setLoading] = useState(true);

  const [store, setStore] = useState(null);

  const [products, setProducts] = useState([]);

  const [subCategories, setSubCategories] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    fetchStore();
  }, []);

  async function fetchStore() {
    try {
      setLoading(true);

      const res = await fetch(`/api/vendor-store/${vendorId}`);

      const data = await res.json();

      if (data.success) {
        setStore(data.store);
        setProducts(data.products);
        setSubCategories(data.subCategories);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter(
          (product) => Number(product.category_id) === Number(selectedCategory),
        );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="text-center">
          <Package size={60} className="mx-auto text-blue-600 animate-bounce" />

          <h2 className="mt-5 text-2xl font-bold">Loading Store...</h2>

          <p className="text-gray-500 mt-2">Please wait...</p>
        </div>
      </div>
    );
  }
  return (
    
    <section className="max-w-7xl mx-auto px-6 py-10">
      {/* Store Header */}
      {/* Back Button */}

      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 mb-6 text-blue-600 hover:text-blue-700 font-medium transition"
      >
        <ArrowLeft size={20} />
        Back
      </button>

      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 mb-10">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="relative w-36 h-36 rounded-full overflow-hidden border-4 border-blue-100">
            <Image
              src={store?.store_logo || "/uploads/no-image.png"}
              alt={store?.store_name || "Store"}
              fill
              sizes="144px"
              className="object-cover"
            />
          </div>

          <div className="flex-1">
            <h1 className="text-4xl font-bold dark:text-white">
              {store?.store_name}
            </h1>

            <p className="text-gray-500 mt-3">
              {store?.description || "No description available"}
            </p>

            <div className="flex flex-wrap gap-6 mt-5">
              <div className="flex items-center gap-2">
                <Star size={18} className="text-yellow-500 fill-yellow-500" />

                <span>4.8</span>
              </div>

              <div className="flex items-center gap-2">
                <MapPin size={18} />

                <span>{store?.address || "Location not available"}</span>
              </div>

              <div className="flex items-center gap-2">
                <Package size={18} />

                <span>{products.length} Products</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sub Categories */}

      <div className="flex flex-wrap gap-3 mb-10">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`px-5 py-2 rounded-full transition ${
            selectedCategory === "all"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 dark:bg-gray-700 dark:text-white"
          }`}
        >
          All
        </button>

        {subCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-5 py-2 rounded-full transition ${
              Number(selectedCategory) === Number(category.id)
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 dark:text-white"
            }`}
          >
            {category.category_name}
          </button>
        ))}
      </div>

      {/* Products */}

      {filteredProducts.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg py-20 text-center">
          <Package size={60} className="mx-auto text-gray-400" />

          <h2 className="mt-6 text-2xl font-bold dark:text-white">
            No Products Found
          </h2>

          <p className="text-gray-500 mt-2">
            No products available in this sub-category.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg overflow-hidden hover:-translate-y-2 hover:shadow-xl transition"
            >
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
                  {subCategories.find((item) => item.id === product.category_id)
                    ?.category_name || "Category"}
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
          ))}
        </div>
      )}
    </section>
  );
}
