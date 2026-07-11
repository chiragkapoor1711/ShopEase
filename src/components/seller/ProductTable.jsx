"use client";

import { Eye, Pencil, Trash2 } from "lucide-react";

function StatusBadge({ status, stock }) {
  let classes = "";
  if (stock <= 0) {
    status = "Out of Stock";
    classes = "bg-red-100 text-red-700";
  } else if (status === "Active") {
    classes = "bg-green-100 text-green-700";
  } else {
    classes = "bg-gray-100 text-gray-700";
  }
  return (
    <span
      className={`${classes} px-3 py-1 rounded-full text-xs font-medium`}
    >
      {status}
    </span>
  );
}

export default function ProductTable({
  products,
  onEdit,
  onDelete,
}) {
  return (
    <>
      <div className="hidden md:block overflow-x-auto rounded-xl border dark:border-gray-700">

        <table className="w-full">

          <thead className="bg-gray-100 dark:bg-gray-800">

            <tr>

              <th className="text-left p-4">Image</th>

              <th className="text-left p-4">Product</th>

              <th className="text-left p-4">Category</th>

              <th className="text-left p-4">Brand</th>

              <th className="text-left p-4">Price</th>

              <th className="text-left p-4">Stock</th>

              <th className="text-left p-4">Status</th>

              <th className="text-center p-4">Actions</th>

            </tr>

          </thead>

          <tbody>

            {products?.length === 0 ? (

              <tr>

                <td
                  colSpan="8"
                  className="text-center py-10 text-gray-500"
                >
                  No products available. Click "Add Product" to create your first product.
                </td>

              </tr>

            ) : (

              products?.map((product) => (

                <tr
                  key={product.id}
                  className="border-t dark:border-gray-700"
                >

                  <td className="p-4">

                    <img
                      src={
                        product.product_image
                          ? product.product_image
                          : "/uploads/no-image.png"
                      }
                      alt={product.product_name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />

                  </td>

                  <td className="p-4 font-medium">
                    {product.product_name}
                  </td>

                  <td className="p-4">
                    {product.category_name}
                  </td>

                  <td className="p-4">
                    {product.brand || "N/A"}
                  </td>

                  <td className="p-4">
                    ₹{Number(product.price).toLocaleString("en-IN")}
                  </td>

                  <td className="p-4">
                    {product.stock}
                  </td>

                  <td className="p-4">

                    <StatusBadge
                      status={product.status}
                      stock={product.stock}
                    />

                  </td>

                  <td className="p-4">

                    <div className="flex justify-center gap-3">

                      <button
                        disabled
                        className="text-blue-600 opacity-50 cursor-not-allowed"
                      >
                        <Eye size={18} />
                      </button>

                      <button
                        onClick={() => onEdit(product)}
                        className="text-yellow-500"
                      >
                        <Pencil size={18} />
                      </button>

                      <button
                        onClick={() => onDelete(product)}
                        className="text-red-600"
                      >
                        <Trash2 size={18} />
                      </button>

                    </div>

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

      {/* Mobile Cards */}

      <div className="space-y-4 md:hidden">

        {products?.length === 0 && (

          <div className="text-center py-8 text-gray-500">
            No products available. Click "Add Product" to create your first product.
          </div>

        )}

        {products?.map((product) => (

          <div
            key={product.id}
            className="bg-white dark:bg-gray-900 rounded-xl shadow p-4"
          >

            <div className="flex gap-4">

              <img
                src={
                  product.product_image
                    ? product.product_image
                    : "/uploads/no-image.png"
                }
                alt={product.product_name}
                className="w-20 h-20 rounded-lg object-cover"
              />

              <div className="flex-1">

                <h3 className="font-semibold">
                  {product.product_name}
                </h3>

                <p className="text-sm text-gray-500">
                  {product.category_name}
                </p>

                <p className="mt-2">
                  ₹{Number(product.price).toLocaleString("en-IN")}
                </p>

                <p className="text-sm">
                  Stock : {product.stock}
                </p>

                <div className="mt-2">

                  <StatusBadge
                    status={product.status}
                    stock={product.stock}
                  />

                </div>

                <div className="flex gap-4 mt-4">

                  <button
                    disabled
                    className="text-blue-600 opacity-50 cursor-not-allowed"
                  >
                    <Eye size={18} />
                  </button>

                  <button
                    onClick={() => onEdit(product)}
                    className="text-yellow-500"
                  >
                    <Pencil size={18} />
                  </button>

                  <button
                    onClick={() => onDelete(product)}
                    className="text-red-600"
                  >
                    <Trash2 size={18} />
                  </button>

                </div>

              </div>

            </div>

          </div>

        ))}

      </div>

    </>
  );
}