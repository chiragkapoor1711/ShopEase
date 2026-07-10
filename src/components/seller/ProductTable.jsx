"use client";

import { useState } from "react";
import DeleteModal from "./DeleteModal";
import { Eye, Pencil, Trash2 } from "lucide-react";

const products = [
  {
    id: 1,
    image: "/hero-banner.avif",
    name: "Wireless Headphones",
    category: "Electronics",
    price: "₹2,999",
    stock: 35,
    status: "Active",
  },
  {
    id: 2,
    image: "/hero-banner.avif",
    name: "Smart Watch",
    category: "Accessories",
    price: "₹4,999",
    stock: 15,
    status: "Active",
  },
  {
    id: 3,
    image: "/hero-banner.avif",
    name: "Gaming Mouse",
    category: "Electronics",
    price: "₹1,499",
    stock: 0,
    status: "Out of Stock",
  },
];

function StatusBadge({ status }) {
  const styles =
    status === "Active"
      ? "bg-green-100 text-green-700"
      : "bg-red-100 text-red-700";
  return (
    <span className={`${styles} px-3 py-1 rounded-full text-xs sm:text-sm whitespace-nowrap`}>
      {status}
    </span>
  );
}

export default function ProductTable() {
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  return (
    <>
      <div className="bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 mt-6 sm:mt-8 max-w-full overflow-x-hidden">

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0 mb-5 sm:mb-6">

          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold dark:text-white">
            Product List
          </h2>

          <span className="text-xs sm:text-sm text-gray-500">
            Total Products: {products.length}
          </span>

        </div>

        {/* Mobile/tablet: stacked cards (no horizontal scroll) */}
        <div className="md:hidden space-y-3">
          {products.map((product) => (
            <div
              key={product.id}
              className="border dark:border-gray-800 rounded-xl p-3 flex gap-3"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-16 h-16 rounded-lg object-cover shrink-0"
              />

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-medium dark:text-white truncate">{product.name}</p>
                  <StatusBadge status={product.status} />
                </div>
                <p className="text-sm text-gray-500 mt-0.5 truncate">
                  {product.category} • {product.price} • Stock: {product.stock}
                </p>

                <div className="flex justify-end gap-3 mt-2">
                  <button className="text-blue-600 hover:scale-110">
                    <Eye size={16} />
                  </button>
                  <button className="text-yellow-500 hover:scale-110">
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedProduct(product);
                      setOpen(true);
                    }}
                    className="text-red-600 hover:scale-110"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop/tablet-landscape: table */}
        <div className="hidden md:block overflow-x-auto">

          <table className="w-full">

            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-4">Image</th>
                <th className="text-left py-4">Product</th>
                <th className="text-left py-4">Category</th>
                <th className="text-left py-4">Price</th>
                <th className="text-left py-4">Stock</th>
                <th className="text-left py-4">Status</th>
                <th className="text-center py-4">Actions</th>
              </tr>
            </thead>

            <tbody>

              {products.map((product) => (

                <tr
                  key={product.id}
                  className="border-b dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >

                  <td className="py-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  </td>

                  <td className="font-medium dark:text-white">
                    {product.name}
                  </td>

                  <td className="dark:text-gray-200">{product.category}</td>

                  <td className="dark:text-gray-200">{product.price}</td>

                  <td className="dark:text-gray-200">{product.stock}</td>

                  <td>
                    <StatusBadge status={product.status} />
                  </td>

                  <td>

                    <div className="flex justify-center gap-3">

                      <button className="text-blue-600 hover:scale-110">
                        <Eye size={18} />
                      </button>

                      <button className="text-yellow-500 hover:scale-110">
                        <Pencil size={18} />
                      </button>

                      <button
                        onClick={() => {
                          setSelectedProduct(product);
                          setOpen(true);
                        }}
                        className="text-red-600 hover:scale-110"
                      >
                        <Trash2 size={18} />
                      </button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

      <DeleteModal
        isOpen={open}
        productName={selectedProduct?.name}
        onClose={() => setOpen(false)}
        onDelete={() => {
          console.log("Delete Product");
          setOpen(false);
        }}
      />
    </>
  );
}