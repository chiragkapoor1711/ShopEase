"use client";

import Image from "next/image";
import { Eye, Pencil, Trash2, Inbox, PlusCircle } from "lucide-react";

function StatusBadge({ status, stock }) {
  let label = status;
  let dotColor = "bg-emerald-500";
  let classes =
    "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400";

  if (stock <= 0) {
    label = "Out of stock";
    dotColor = "bg-red-500";
    classes = "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400";
  } else if (status !== "Active") {
    dotColor = "bg-gray-400";
    classes = "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400";
  }

  return (
    <span
      className={`${classes} inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      {label}
    </span>
  );
}

// BUG FIX: the products GET query now returns `main_category_name` and
// `sub_category_name` (renamed from `category_name` to avoid colliding with
// the new main-category join). This falls back to the old `category_name`
// field too, in case an older API response shape is ever in play.
function CategoryCell({ mainCategoryName, subCategoryName }) {
  if (!mainCategoryName && !subCategoryName) {
    return (
      <span className="italic text-gray-300 dark:text-gray-600">
        Unassigned
      </span>
    );
  }

  return (
    <div className="flex flex-col leading-tight">
      <span className="text-gray-700 dark:text-gray-300">
        {subCategoryName || (
          <span className="italic text-gray-300 dark:text-gray-600">
            No sub category
          </span>
        )}
      </span>
      <span className="text-xs text-gray-400">
        {mainCategoryName || "Unassigned"}
      </span>
    </div>
  );
}

function PriceCell({ price, finalPrice, hasOffer, discountPercentage }) {
  if (!hasOffer) {
    return (
      <span className="font-medium text-gray-900 dark:text-gray-100">
        ₹{Number(price).toLocaleString("en-IN")}
      </span>
    );
  }

  return (
    <div className="flex flex-col leading-tight">
      <span className="font-medium text-green-600">
        ₹{Number(finalPrice).toLocaleString("en-IN")}
      </span>

      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-400 line-through">
          ₹{Number(price).toLocaleString("en-IN")}
        </span>

        <span className="text-xs font-semibold text-red-600">
          {discountPercentage}% OFF
        </span>
      </div>
    </div>
  );
}

function ActionButtons({ product, onEdit, onDelete }) {
  return (
    <div className="flex items-center gap-1">
      <button
        disabled
        title="Product preview coming soon"
        className="p-2 rounded-lg text-gray-300 dark:text-gray-600 cursor-not-allowed"
      >
        <Eye size={16} />
      </button>
      <button
        onClick={() => onEdit(product)}
        aria-label={`Edit ${product.product_name}`}
        className="p-2 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-500/10 dark:hover:text-amber-400 transition-colors"
      >
        <Pencil size={16} />
      </button>
      <button
        onClick={() => onDelete(product)}
        aria-label={`Delete ${product.product_name}`}
        className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 dark:hover:text-red-400 transition-colors"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 px-6 text-center">
      <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
        <Inbox size={20} className="text-gray-400" />
      </div>
      <p className="text-sm font-medium text-gray-900 dark:text-white">
        No products yet
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">
        Products you add will show up here. Click "Add Product" to create your
        first one.
      </p>
    </div>
  );
}

export default function ProductTable({ products, onEdit, onDelete }) {
  const isEmpty = !products || products.length === 0;

  return (
    <>
      {/* Desktop table */}
      <div className="hidden md:block bg-white dark:bg-gray-900 rounded-2xl shadow-lg ring-1 ring-black/5 dark:ring-white/10 overflow-hidden">
        {isEmpty ? (
          <EmptyState />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800/60">
                  <th className="text-left py-3 pl-5 pr-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Image
                  </th>
                  <th className="text-left py-3 px-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Product
                  </th>
                  <th className="text-left py-3 px-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Category
                  </th>
                  <th className="text-left py-3 px-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Brand
                  </th>
                  <th className="text-left py-3 px-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Price
                  </th>
                  <th className="text-left py-3 px-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Stock
                  </th>
                  <th className="text-left py-3 px-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Status
                  </th>
                  <th className="text-right py-3 pl-3 pr-5 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr
                    key={product.id}
                    className="border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors"
                  >
                    <td className="py-3 pl-5 pr-3">
                      <Image
                        src={product.product_image || "/uploads/no-image.png"}
                        alt={product.product_name}
                        width={48}
                        height={48}
                        className="w-12 h-12 rounded-lg object-cover ring-1 ring-black/5 dark:ring-white/10"
                      />
                    </td>
                    <td className="py-3 px-3 font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">
                      {product.product_name}
                    </td>
                    <td className="py-3 px-3 text-sm whitespace-nowrap">
                      <CategoryCell
                        mainCategoryName={product.main_category_name}
                        subCategoryName={
                          product.sub_category_name || product.category_name
                        }
                      />
                    </td>
                    <td className="py-3 px-3 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      {product.brand || (
                        <span className="italic text-gray-300 dark:text-gray-600">
                          N/A
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <PriceCell
                        price={product.price}
                        finalPrice={product.final_price}
                        hasOffer={product.has_offer}
                        discountPercentage={product.discount_percentage}
                      />
                    </td>
                    <td className="py-3 px-3 text-sm text-gray-700 dark:text-gray-300">
                      {product.stock}
                    </td>
                    <td className="py-3 px-3">
                      <StatusBadge
                        status={product.status}
                        stock={product.stock}
                      />
                    </td>
                    <td className="py-3 pl-3 pr-5">
                      <div className="flex justify-end">
                        <ActionButtons
                          product={product}
                          onEdit={onEdit}
                          onDelete={onDelete}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Mobile cards */}
      <div className="space-y-3 md:hidden">
        {isEmpty ? (
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg ring-1 ring-black/5 dark:ring-white/10">
            <EmptyState />
          </div>
        ) : (
          products.map((product) => {
            const subCategoryName =
              product.sub_category_name || product.category_name;
            const categoryLine = [product.main_category_name, subCategoryName]
              .filter(Boolean)
              .join(" › ");

            return (
              <div
                key={product.id}
                className="bg-white dark:bg-gray-900 rounded-xl ring-1 ring-black/5 dark:ring-white/10 shadow-sm p-3.5 flex gap-3"
              >
                <Image
                  src={product.product_image || "/uploads/no-image.png"}
                  alt={product.product_name}
                  width={72}
                  height={72}
                  className="w-[72px] h-[72px] rounded-lg object-cover shrink-0 ring-1 ring-black/5 dark:ring-white/10"
                />

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="font-medium text-gray-900 dark:text-white truncate">
                        {product.product_name}
                      </h3>
                      <p className="text-xs text-gray-400 truncate">
                        {categoryLine || "Unassigned"}
                        {product.brand ? ` · ${product.brand}` : ""}
                      </p>
                    </div>
                    <StatusBadge
                      status={product.status}
                      stock={product.stock}
                    />
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <PriceCell
                      price={product.price}
                      finalPrice={product.final_price}
                      hasOffer={product.has_offer}
                      discountPercentage={product.discount_percentage}
                    />
                    <p className="text-xs text-gray-400">
                      Stock: {product.stock}
                    </p>
                  </div>

                  <div className="flex items-center justify-end gap-1 mt-2.5 pt-2.5 border-t border-gray-100 dark:border-gray-800">
                    <ActionButtons
                      product={product}
                      onEdit={onEdit}
                      onDelete={onDelete}
                    />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </>
  );
}
