"use client";

import { ShoppingBag, MapPin, Plus, Check, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function OrderSummary({
  totalItems,
  subtotal,
  deliveryCharge = 0,
  discount = 0,
  paymentMethod,
  onPlaceOrder,
  loading,

  addresses,
  selectedAddress,
  setSelectedAddress,
}) {
  const router = useRouter();
  const grandTotal = Number(subtotal) + Number(deliveryCharge) - Number(discount);

  return (
    <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg p-5 sm:p-6 sticky top-24 animate-summary-in">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-5 sm:mb-6">Order Summary</h2>

      {/* Delivery Address */}
      <div className="mb-7 sm:mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-base sm:text-lg flex items-center gap-2 text-gray-900">
            <MapPin size={19} className="text-blue-600" />
            Delivery Address
          </h3>

          <button
            onClick={() => router.push("/account/addresses")}
            className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm font-medium transition-colors"
          >
            <Plus size={16} />
            Add
          </button>
        </div>

        {addresses.length === 0 ? (
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center text-gray-500 text-sm">
            No delivery address added yet.
          </div>
        ) : (
          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {addresses.map((address) => {
              const selected = selectedAddress === address.id;
              return (
                <label
                  key={address.id}
                  className={`relative block border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 ${
                    selected
                      ? "border-blue-600 bg-blue-50 shadow-sm"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex gap-3">
                    <div
                      className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                        selected ? "border-blue-600 bg-blue-600" : "border-gray-300"
                      }`}
                    >
                      {selected && <Check size={12} className="text-white" strokeWidth={3} />}
                    </div>

                    <div className="min-w-0">
                      <h4 className="font-semibold text-gray-900">{address.full_name}</h4>
                      <p className="text-sm text-gray-600 mt-1">{address.address}</p>
                      <p className="text-sm text-gray-600">
                        {address.city}, {address.state}
                      </p>
                      <p className="text-sm text-gray-600">
                        {address.country} - {address.pincode}
                      </p>
                      <p className="text-sm mt-1 text-gray-600">📞 {address.phone}</p>

                      {address.is_default === 1 && (
                        <span className="inline-block mt-2 bg-emerald-100 text-emerald-700 text-xs font-medium px-2 py-1 rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                  </div>

                  <input
                    type="radio"
                    checked={selected}
                    onChange={() => setSelectedAddress(address.id)}
                    className="sr-only"
                  />
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* Totals */}
      <div className="space-y-3.5 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">Total Items</span>
          <span className="font-semibold text-gray-900">{totalItems}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500">Subtotal</span>
          <span className="font-semibold text-gray-900">
            ₹{Number(subtotal).toLocaleString("en-IN")}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500">Delivery</span>
          <span className="font-semibold text-emerald-600">
            {deliveryCharge === 0 ? "FREE" : `₹${deliveryCharge}`}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500">Discount</span>
          <span className="font-semibold text-gray-400">
            − ₹{Number(discount).toLocaleString("en-IN")}
          </span>
        </div>
      </div>

      <hr className="my-5 border-gray-200" />

      {/* Grand Total */}
      <div className="flex justify-between items-end">
        <span className="text-lg font-bold text-gray-900">Grand Total</span>
        <span className="text-2xl sm:text-3xl font-bold text-blue-600 tabular-nums">
          ₹{grandTotal.toLocaleString("en-IN")}
        </span>
      </div>

      {/* Payment */}
      <div className="mt-5 bg-blue-50 rounded-xl p-4">
        <p className="text-sm text-gray-500">Payment Method</p>
        <h3 className="font-semibold mt-1 text-gray-900">
          {paymentMethod === "COD" ? "Cash On Delivery" : paymentMethod}
        </h3>
      </div>

      {/* Button */}
      <button
        disabled={loading}
        onClick={onPlaceOrder}
        className="group w-full cursor-pointer mt-6 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2.5 transition-all duration-200 hover:shadow-lg hover:shadow-blue-600/25 active:scale-[0.98]"
      >
        <ShoppingBag size={20} />
        {loading ? "Placing Order..." : "Place Order"}
        {!loading && (
          <ArrowRight size={18} className="transition-transform duration-200 group-hover:translate-x-1" />
        )}
      </button>

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