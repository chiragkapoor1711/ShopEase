"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { Store, Upload, Save, Loader2 } from "lucide-react";

export default function StorePage() {
  const router = useRouter();

  const initialForm = {
    store_name: "",
    description: "",
    address: "",
    phone: "",
    email: "",
    gst_number: "",
    store_logo: "",
  };

  const [formData, setFormData] = useState(initialForm);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleImageChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    setImagePreview(URL.createObjectURL(file));

    const body = new FormData();
    body.append("file", file);

    try {
      const res = await fetch("/api/seller/upload", {
        method: "POST",
        body,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message);
      }

      setFormData((prev) => ({
        ...prev,
        store_logo: data.imageUrl,
      }));

      toast.success("Logo uploaded successfully.");
    } catch (error) {
      toast.error(error.message);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await fetch("/api/seller/store", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message);
      }

      toast.success(data.message);
      router.push("/seller/dashboard");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 py-10 px-4">
      <div className="max-w-5xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 md:p-10">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold dark:text-white">
            Create Your Store
          </h1>
          <p className="mt-2 text-gray-500">
            Complete your store profile before selling products.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Store Logo */}
          <div className="flex flex-col items-center">
            <div className="w-36 h-36 rounded-full border-4 border-blue-100 overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Store Logo"
                  className="w-full h-full object-cover"
                />
              ) : (
                <Store size={60} className="text-blue-600" />
              )}
            </div>

            <label className="mt-5 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl flex items-center gap-2 transition">
              <Upload size={18} />
              Upload Store Logo
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageChange}
              />
            </label>
          </div>

          {/* Store Details */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Store Name */}
            <div>
              <label className="font-medium dark:text-white">
                Store Name *
              </label>
              <input
                type="text"
                name="store_name"
                value={formData.store_name}
                onChange={handleChange}
                placeholder="Kapoor Electronics"
                required
                className="w-full mt-2 border rounded-xl p-3 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />
            </div>

            {/* Email */}
            <div>
              <label className="font-medium dark:text-white">
                Store Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="store@gmail.com"
                required
                className="w-full mt-2 border rounded-xl p-3 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="font-medium dark:text-white">
                Store Phone *
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="9876543210"
                required
                className="w-full mt-2 border rounded-xl p-3 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />
            </div>

            {/* GST */}
            <div>
              <label className="font-medium dark:text-white">
                GST Number
              </label>
              <input
                type="text"
                name="gst_number"
                value={formData.gst_number}
                onChange={handleChange}
                placeholder="22AAAAA0000A1Z5"
                className="w-full mt-2 border rounded-xl p-3 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />
            </div>

            {/* Store Address */}
            <div className="md:col-span-2">
              <label className="font-medium dark:text-white">
                Store Address *
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows="4"
                required
                placeholder="Enter your complete store address..."
                className="w-full mt-2 border rounded-xl p-3 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="font-medium dark:text-white">
                Store Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="5"
                placeholder="Tell customers about your store..."
                className="w-full mt-2 border rounded-xl p-3 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl flex items-center gap-2 transition"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Creating Store...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Create Store
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}