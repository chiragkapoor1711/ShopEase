"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function AddOfferPage() {
  const [form, setForm] = useState({
    product_id: "",
    offer_title: "",
    offer_description: "",
    discount_percentage: "",
    start_date: "",
    end_date: "",
    status: "active",
  });

  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const res = await fetch("/api/seller/products/dropdown");
      const data = await res.json();

      if (data.success) {
        setProducts(data.products);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  async function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);

    try {
      const res = await fetch("/api/seller/offers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!data.success) {
        toast.error(data.message);
        return;
      }

      toast.success(data.message);

      router.push("/seller/offers");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20";

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/seller/offers"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-3"
          >
            <ArrowLeft size={18} />
            Back to Offers
          </Link>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Create New Offer
          </h1>

          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Create promotional offers for your products.
          </p>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 space-y-6"
      >
        {/* Product */}
        <div>
          <label className="block mb-2 font-semibold text-gray-800 dark:text-gray-200">
            Product <span className="text-red-500">*</span>
          </label>

          <select
            disabled={loading}
            value={form.product_id}
            onChange={(e) => handleChange("product_id", e.target.value)}
            className={inputClass}
          >
            <option value="">Select Product</option>

            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.product_name}
              </option>
            ))}
          </select>
        </div>

        {/* Offer Title */}
        <div>
          <label className="block mb-2 font-semibold text-gray-800 dark:text-gray-200">
            Offer Title <span className="text-red-500">*</span>
          </label>

          <input
            type="text"
            placeholder="Mega Summer Sale"
            value={form.offer_title}
            onChange={(e) => handleChange("offer_title", e.target.value)}
            className={inputClass}
          />
        </div>

        {/* Description */}
        <div>
          <label className="block mb-2 font-semibold text-gray-800 dark:text-gray-200">
            Offer Description
          </label>

          <textarea
            rows={4}
            placeholder="Write a short description..."
            value={form.offer_description}
            onChange={(e) => handleChange("offer_description", e.target.value)}
            className={inputClass}
          />
        </div>

        {/* Discount */}
        <div>
          <label className="block mb-2 font-semibold text-gray-800 dark:text-gray-200">
            Discount Percentage
            <span className="text-red-500"> *</span>
          </label>

          <div className="relative">
            <input
              type="number"
              min="1"
              max="90"
              placeholder="20"
              value={form.discount_percentage}
              onChange={(e) =>
                handleChange("discount_percentage", e.target.value)
              }
              className={`${inputClass} pr-12`}
            />

            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
              %
            </span>
          </div>
        </div>

        {/* Dates */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2 font-semibold text-gray-800 dark:text-gray-200">
              Start Date
              <span className="text-red-500"> *</span>
            </label>

            <input
              type="date"
              value={form.start_date}
              onChange={(e) => handleChange("start_date", e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold text-gray-800 dark:text-gray-200">
              End Date
              <span className="text-red-500"> *</span>
            </label>

            <input
              type="date"
              value={form.end_date}
              onChange={(e) => handleChange("end_date", e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="block mb-3 font-semibold text-gray-800 dark:text-gray-200">
            Status
          </label>

          <div className="flex gap-8">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="status"
                value="active"
                checked={form.status === "active"}
                onChange={(e) => handleChange("status", e.target.value)}
              />
              Active
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="status"
                value="inactive"
                checked={form.status === "inactive"}
                onChange={(e) => handleChange("status", e.target.value)}
              />
              Inactive
            </label>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 pt-4">
          <Link
            href="/seller/offers"
            className="px-6 py-3 rounded-xl border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <Save size={18} />
            {loading ? "Saving..." : "Save Offer"}
          </button>
        </div>
      </form>
    </div>
  );
}
