"use client";

import { CheckCircle2 } from "lucide-react";

export default function OrderSuccessModal({
  open,
  orderNumber,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">

      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 text-center animate-in fade-in zoom-in duration-300">

        <CheckCircle2
          size={70}
          className="mx-auto text-green-500 mb-5"
        />

        <h2 className="text-3xl font-bold mb-3">
          Order Placed!
        </h2>

        <p className="text-gray-600">
          Thank you for shopping with ShopEase.
        </p>

        <p className="text-gray-600 mt-2">
          Your order has been placed successfully.
        </p>

        {orderNumber && (
          <div className="mt-5 bg-gray-100 rounded-lg py-3 font-semibold">
            Order No. {orderNumber}
          </div>
        )}

      </div>

    </div>
  );
}