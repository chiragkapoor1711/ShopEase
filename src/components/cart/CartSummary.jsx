"use client";

import { useRouter } from "next/navigation";
import { ShoppingBag, Truck, ShieldCheck, BadgePercent, Package, ArrowRight } from "lucide-react";

export default function CartSummary({ totalItems, grandTotal }) {
  const router = useRouter();

  const deliveryCharge = 0;
  const discount = 0;

  return (
    <div className="sticky top-24 bg-white rounded-2xl border-2 border-gray-200 shadow-lg p-6 animate-summary-in">
      {/* Heading */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
          <ShoppingBag className="text-blue-600" size={22} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Order Summary</h2>
          <p className="text-gray-500 text-sm">Review your order before checkout</p>
        </div>
      </div>

      {/* Summary */}
      <div className="space-y-3.5">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Total Items</span>
          <span className="font-semibold text-gray-900">{totalItems}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Subtotal</span>
          <span className="font-semibold text-gray-900">
            ₹{grandTotal.toLocaleString("en-IN")}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="flex items-center gap-2 text-gray-500">
            <Truck size={16} />
            Delivery
          </span>
          <span className="font-semibold text-emerald-600">FREE</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="flex items-center gap-2 text-gray-500">
            <BadgePercent size={16} />
            Discount
          </span>
          <span className="font-semibold text-gray-400">−₹{discount}</span>
        </div>
      </div>

      <hr className="my-5 border-gray-200" />

      {/* Total */}
      <div className="flex justify-between items-end">
        <p className="text-gray-500 text-sm">Grand Total</p>
        <h3 className="text-2xl sm:text-3xl font-bold text-blue-600 tabular-nums">
          ₹{grandTotal.toLocaleString("en-IN")}
        </h3>
      </div>

      {/* Features */}
      <div className="bg-blue-50 rounded-xl p-4 mt-5 space-y-3">
        <div className="flex items-center gap-3 text-sm text-gray-700">
          <ShieldCheck className="text-emerald-600 shrink-0" size={18} />
          <span>100% Secure Checkout</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-700">
          <Truck className="text-blue-600 shrink-0" size={18} />
          <span>Free Delivery on this Order</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-700">
          <Package className="text-blue-600 shrink-0" size={18} />
          <span>Estimated Delivery: 2–5 Business Days</span>
        </div>
      </div>

      {/* Button */}
      <button
        onClick={() => router.push("/checkout")}
        className="group w-full mt-6 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-blue-600/25 active:scale-[0.98] flex items-center justify-center gap-2"
      >
        Proceed to Checkout
        <ArrowRight size={18} className="transition-transform duration-200 group-hover:translate-x-1" />
      </button>

      {/* Footer */}
      <p className="text-center text-xs text-gray-400 mt-4">
        Taxes included where applicable.
      </p>

      <style jsx>{`
        @keyframes summary-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-summary-in {
          animation: summary-in 0.4s ease-out;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-summary-in {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}