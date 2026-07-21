"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { ArrowLeft, Save } from "lucide-react";

export default function EditOfferPage() {
  const { id } = useParams();
  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    product_id: "",
    offer_title: "",
    offer_description: "",
    discount_percentage: "",
    start_date: "",
    end_date: "",
    status: "active",
  });

  useEffect(() => {
    fetchProducts();
    fetchOffer();
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

  async function fetchOffer() {
    try {
      const res = await fetch(`/api/seller/offers/${id}`);
      const data = await res.json();

      if (!data.success) {
        toast.error(data.message);
        return;
      }

      setForm({
        product_id: data.offer.product_id,
        offer_title: data.offer.offer_title,
        offer_description: data.offer.offer_description || "",
        discount_percentage: data.offer.discount_percentage,
        start_date: data.offer.start_date?.split("T")[0],
        end_date: data.offer.end_date?.split("T")[0],
        status: data.offer.status,
      });
    } catch (error) {
      console.log(error);
      toast.error("Failed to load offer.");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(field, value) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setSaving(true);

    try {
      const res = await fetch(`/api/seller/offers/${id}`, {
        method: "PUT",
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
      setSaving(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-blue-500";

  if (loading) {
    return <div className="flex justify-center py-20">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <Link
          href="/seller/offers"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-3"
        >
          <ArrowLeft size={18} />
          Back to Offers
        </Link>

        <h1 className="text-3xl font-bold">Edit Offer</h1>

        <p className="text-gray-500 mt-2">Update your promotional offer.</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 space-y-6"
      >
        {/* Product */}
        <div>
          <label className="block mb-2 font-semibold">Product</label>

          <select
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
          <label className="block mb-2 font-semibold">Offer Title</label>

          <input
            type="text"
            value={form.offer_title}
            onChange={(e) => handleChange("offer_title", e.target.value)}
            className={inputClass}
          />
        </div>

        {/* Description */}
        <div>
          <label className="block mb-2 font-semibold">Offer Description</label>

          <textarea
            rows={4}
            value={form.offer_description}
            onChange={(e) => handleChange("offer_description", e.target.value)}
            className={inputClass}
          />
        </div>

        {/* Discount */}
        <div>
          <label className="block mb-2 font-semibold">Discount %</label>

          <input
            type="number"
            min="1"
            max="90"
            value={form.discount_percentage}
            onChange={(e) =>
              handleChange("discount_percentage", e.target.value)
            }
            className={inputClass}
          />
        </div>

        {/* Dates */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2 font-semibold">Start Date</label>

            <input
              type="date"
              value={form.start_date}
              onChange={(e) => handleChange("start_date", e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold">End Date</label>

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
          <label className="block mb-3 font-semibold">Status</label>

          <div className="flex gap-6">
            <label>
              <input
                type="radio"
                name="status"
                value="active"
                checked={form.status === "active"}
                onChange={(e) => handleChange("status", e.target.value)}
              />
              <span className="ml-2">Active</span>
            </label>

            <label>
              <input
                type="radio"
                name="status"
                value="inactive"
                checked={form.status === "inactive"}
                onChange={(e) => handleChange("status", e.target.value)}
              />
              <span className="ml-2">Inactive</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Link href="/seller/offers" className="px-6 py-3 rounded-xl border">
            Cancel
          </Link>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl"
          >
            <Save size={18} />
            {saving ? "Updating..." : "Update Offer"}
          </button>
        </div>
      </form>
    </div>
  );
}
