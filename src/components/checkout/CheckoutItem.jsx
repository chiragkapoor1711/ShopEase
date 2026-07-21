"use client";

import Image from "next/image";

export default function CheckoutItem({ item }) {
  const sellingPrice = item.has_offer
    ? Number(item.final_price)
    : Number(item.price);

  const subtotal = sellingPrice * Number(item.quantity);
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5 border-2 border-gray-200 hover:border-blue-300 rounded-xl p-4 sm:p-5 bg-white shadow-sm hover:shadow-md transition-all duration-300 animate-item-in">
      {/* Product Image */}
      <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0">
        <Image
          src={item.product_image || "/uploads/no-image.png"}
          alt={item.product_name}
          fill
          className="object-cover"
          sizes="96px"
        />
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
          {item.product_name}
        </h3>

        <p className="text-sm text-gray-500 mt-0.5">
          Brand: {item.brand || "No Brand"}
        </p>

        <div className="flex items-center gap-2.5 mt-2.5 flex-wrap">
          <span className="text-lg sm:text-xl font-bold text-blue-600">
            ₹{sellingPrice.toLocaleString("en-IN")}
          </span>

          {item.has_offer && (
            <>
              <span className="text-sm text-gray-400 line-through">
                ₹{Number(item.price).toLocaleString("en-IN")}
              </span>

              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {item.discount_percentage}% OFF
              </span>
            </>
          )}
        </div>
      </div>

      {/* Quantity & Subtotal */}
      <div className="flex sm:flex-col sm:text-right justify-between sm:justify-start gap-1 sm:gap-0 sm:min-w-[120px] pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
        <div>
          <p className="text-gray-500 text-xs sm:text-sm">Qty</p>
          <p className="font-semibold text-base sm:text-lg text-gray-900">
            {item.quantity}
          </p>
        </div>

        <div className="sm:mt-3">
          <p className="text-gray-500 text-xs sm:text-sm">Subtotal</p>
          <p className="text-lg sm:text-xl font-bold text-emerald-600">
            ₹{subtotal.toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes item-in {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-item-in {
          animation: item-in 0.35s ease-out;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-item-in {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
