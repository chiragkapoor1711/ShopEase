"use client";

import Image from "next/image";
import CheckoutItem from "./CheckoutItem";

export default function VendorOrderGroup({ vendor }) {
  const vendorTotal = vendor.items.reduce((total, item) => {
    const sellingPrice = item.has_offer
      ? Number(item.final_price)
      : Number(item.price);

    return total + sellingPrice * Number(item.quantity);
  }, 0);
  return (
    <section className="bg-white rounded-2xl shadow-sm border-2 border-gray-200 p-5 sm:p-6">
      {/* Vendor Header */}
      <div className="flex items-center gap-3.5 sm:gap-4 pb-4 sm:pb-5 border-b-2 border-gray-100">
        <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-gray-200 flex-shrink-0">
          <Image
            src={vendor.storeLogo || "/uploads/no-image.png"}
            alt={vendor.storeName}
            fill
            sizes="64px"
            className="object-cover"
          />
        </div>

        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            {vendor.storeName}
          </h2>
          <p className="text-gray-500 text-sm sm:text-base">
            {vendor.items.length} Product{vendor.items.length > 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Products */}
      <div className="space-y-4 mt-5 sm:mt-6">
        {vendor.items.map((item, index) => (
          <div
            key={item.cart_id}
            style={{ animationDelay: `${Math.min(index, 6) * 60}ms` }}
          >
            <CheckoutItem item={item} />
          </div>
        ))}
      </div>

      {/* Vendor Total */}
      <div className="flex justify-end mt-6 sm:mt-8 pt-4 sm:pt-5 border-t-2 border-gray-100">
        <div className="text-right">
          <p className="text-gray-500 text-sm">Vendor Total</p>
          <h3 className="text-xl sm:text-2xl font-bold text-blue-600">
            ₹{vendorTotal.toLocaleString("en-IN")}
          </h3>
        </div>
      </div>
    </section>
  );
}
