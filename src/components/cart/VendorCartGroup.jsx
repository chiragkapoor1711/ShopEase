"use client";

import { Store } from "lucide-react";
import CartItem from "./CartItem";

export default function VendorCartGroup({ vendor, items, onIncrease, onDecrease, onRemove }) {
  const subtotal = items.reduce((total, item) => {
    const price =
      Number(item.discount_price) > 0
        ? Number(item.discount_price)
        : Number(item.price);

    return total + price * item.quantity;
  }, 0);

  return (
    <section className="mb-8 sm:mb-10">
      <div className="flex items-center gap-2.5 mb-4 sm:mb-5">
        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
          <Store size={16} className="text-blue-600" />
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-gray-900">{vendor}</h2>
      </div>

      <div className="space-y-4">
        {items.map((item, index) => (
          <div
            key={item.cart_id}
            style={{ animationDelay: `${Math.min(index, 6) * 60}ms` }}
          >
            <CartItem
              item={item}
              onIncrease={onIncrease}
              onDecrease={onDecrease}
              onRemove={onRemove}
            />
          </div>
        ))}
      </div>

      <div className="flex justify-end mt-5 pt-4 border-t-2 border-gray-100">
        <span className="text-sm sm:text-base text-gray-500">
          Vendor Total:{" "}
          <span className="text-lg sm:text-xl font-bold text-gray-900">
            ₹{subtotal.toLocaleString("en-IN")}
          </span>
        </span>
      </div>
    </section>
  );
}