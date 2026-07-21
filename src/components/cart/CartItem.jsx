"use client";

import { useState } from "react";
import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";

export default function CartItem({ item, onIncrease, onDecrease, onRemove }) {
  const [isRemoving, setIsRemoving] = useState(false);
  const [justChanged, setJustChanged] = useState(false);

  const price = item.has_offer ? Number(item.final_price) : Number(item.price);

  const hasDiscount = item.has_offer;
  function handleRemove() {
    setIsRemoving(true);
    // let the exit animation play before actually removing from state
    setTimeout(() => onRemove(item), 220);
  }

  function bump(fn) {
    fn(item);
    setJustChanged(true);
    setTimeout(() => setJustChanged(false), 150);
  }

  return (
    <div
      className={`group flex gap-4 sm:gap-5 p-4 sm:p-5 border-2 border-gray-200 hover:border-blue-300 rounded-xl bg-white shadow-sm hover:shadow-md transition-all duration-300 ease-out animate-cart-in ${
        isRemoving
          ? "opacity-0 scale-95 -translate-x-2"
          : "opacity-100 scale-100"
      }`}
    >
      {/* Image */}
      <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 rounded-lg overflow-hidden bg-gray-50">
        <Image
          src={item.product_image || "/uploads/no-image.png"}
          alt={item.product_name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
          {item.product_name}
        </h3>

        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-gray-900 font-medium">
            ₹{price.toLocaleString("en-IN")}
          </p>

          {hasDiscount && (
            <>
              <p className="text-sm text-gray-400 line-through">
                ₹{Number(item.price).toLocaleString("en-IN")}
              </p>

              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {item.discount_percentage}% OFF
              </span>
            </>
          )}
        </div>

        <p className="text-xs sm:text-sm text-emerald-600 mt-1.5 font-medium flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          In Stock ({item.stock})
        </p>

        {/* Quantity */}
        <div className="flex items-center gap-3 mt-3 sm:mt-4">
          <button
            onClick={() => bump(onDecrease)}
            disabled={item.quantity <= 1}
            className="w-8 h-8 sm:w-9 sm:h-9 border-2 border-gray-300 rounded-lg flex items-center justify-center text-gray-600 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 active:scale-90 disabled:opacity-40 disabled:pointer-events-none transition-all duration-150"
            aria-label="Decrease quantity"
          >
            <Minus size={16} />
          </button>

          <span
            className={`font-semibold w-6 text-center transition-transform duration-150 ${
              justChanged
                ? "scale-125 text-blue-600"
                : "scale-100 text-gray-900"
            }`}
          >
            {item.quantity}
          </span>

          <button
            onClick={() => bump(onIncrease)}
            className="w-8 h-8 sm:w-9 sm:h-9 border-2 border-gray-300 rounded-lg flex items-center justify-center text-gray-600 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 active:scale-90 transition-all duration-150"
            aria-label="Increase quantity"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      {/* Remove */}
      <button
        onClick={handleRemove}
        className="self-start text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg p-2 active:scale-90 transition-all duration-150"
        aria-label="Remove item"
      >
        <Trash2 size={18} />
      </button>

      <style jsx>{`
        @keyframes cart-in {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-cart-in {
          animation: cart-in 0.35s ease-out;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-cart-in {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
