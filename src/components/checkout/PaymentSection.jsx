"use client";

import { CreditCard, Truck, Wallet, Check } from "lucide-react";

export default function PaymentSection({ paymentMethod, setPaymentMethod }) {
  return (
    <section className="bg-white rounded-2xl border-2 border-gray-200 shadow-sm p-5 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-5 sm:mb-6">
        Payment Method
      </h2>

      <div className="space-y-3.5">
        {/* Cash On Delivery */}
        <label
          className={`relative flex items-center justify-between border-2 rounded-xl p-4 sm:p-5 cursor-pointer transition-all duration-200 ${
            paymentMethod === "COD"
              ? "border-blue-600 bg-blue-50 shadow-sm"
              : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <div className="flex items-center gap-4">
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                paymentMethod === "COD" ? "bg-blue-600" : "bg-blue-50"
              }`}
            >
              <Truck className={paymentMethod === "COD" ? "text-white" : "text-blue-600"} size={22} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Cash On Delivery</h3>
              <p className="text-sm text-gray-500">Pay when your order arrives.</p>
            </div>
          </div>

          <div
            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
              paymentMethod === "COD" ? "border-blue-600 bg-blue-600" : "border-gray-300"
            }`}
          >
            {paymentMethod === "COD" && <Check size={12} className="text-white" strokeWidth={3} />}
          </div>

          <input
            type="radio"
            value="COD"
            checked={paymentMethod === "COD"}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="sr-only"
          />
        </label>

        {/* Online Payment */}
        <label className="flex items-center justify-between border-2 border-gray-200 rounded-xl p-4 sm:p-5 opacity-60 cursor-not-allowed bg-gray-50">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-gray-200 flex items-center justify-center shrink-0">
              <CreditCard className="text-gray-500" size={22} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-700">Online Payment</h3>
              <p className="text-sm text-gray-500">Razorpay / UPI / Cards</p>
            </div>
          </div>
          <span className="text-[11px] font-medium text-gray-400 bg-gray-200 px-2 py-1 rounded-full">
            Soon
          </span>
          <input type="radio" disabled className="sr-only" />
        </label>

        {/* Wallet */}
        <label className="flex items-center justify-between border-2 border-gray-200 rounded-xl p-4 sm:p-5 opacity-60 cursor-not-allowed bg-gray-50">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-gray-200 flex items-center justify-center shrink-0">
              <Wallet className="text-gray-500" size={22} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-700">Wallet</h3>
              <p className="text-sm text-gray-500">Coming Soon</p>
            </div>
          </div>
          <span className="text-[11px] font-medium text-gray-400 bg-gray-200 px-2 py-1 rounded-full">
            Soon
          </span>
          <input type="radio" disabled className="sr-only" />
        </label>
      </div>
    </section>
  );
}