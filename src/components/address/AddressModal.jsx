"use client";

import { useState } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";

import AddressForm from "./AddressForm";

export default function AddressModal({
  open,
  onClose,
  onSuccess,
  address = null,
}) {
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);

      const url = address
        ? `/api/address/${address.id}`
        : "/api/address";

      const method = address ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        toast.success(data.message);

        onSuccess();

        onClose();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">

      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex justify-between items-center border-b p-6">

          <h2 className="text-2xl font-bold">
            {address ? "Edit Address" : "Add New Address"}
          </h2>

          <button
            onClick={onClose}
            className="hover:text-red-500"
          >
            <X size={24} />
          </button>

        </div>

        {/* Form */}
        <div className="p-6">

          <AddressForm
            initialData={address}
            loading={loading}
            onSubmit={handleSubmit}
          />

        </div>

      </div>

    </div>
  );
}