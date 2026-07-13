"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  Store,
  User,
  Mail,
  Phone,
  MapPin,
  Upload,
  Save,
  RotateCcw,
} from "lucide-react";

export default function SettingsPage() {
  const initialForm = {
    store_name: "",
    description: "",
    address: "",
    phone: "",
    email: "",
    gst_number: "",
    store_logo: "",
    owner_name: "",
  };

  const [formData, setFormData] = useState(initialForm);
  const [storeLogo, setStoreLogo] = useState(""); // holds a File if user picks a new one
  const [imagePreview, setImagePreview] = useState(""); // URL shown in the avatar
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchStore();
  }, []);

  async function fetchStore() {
    try {
      setLoading(true);

      const res = await fetch("/api/seller/store", {
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message);
      }

      setFormData({
        store_name: data.store.store_name || "",
        description: data.store.description || "",
        address: data.store.address || "",
        phone: data.store.phone || "",
        email: data.store.email || "",
        gst_number: data.store.gst_number || "",
        store_logo: data.store.store_logo || "",
        owner_name: data.store.owner_name || "",
      });

      setImagePreview(data.store.store_logo || "");
      setStoreLogo(""); // clear any pending unsaved file selection on refetch
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  function handleLogoChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    setStoreLogo(file);
    setImagePreview(URL.createObjectURL(file)); // local preview only
  }

  async function handleSubmit() {
    try {
      setSaving(true);

      // NOTE: this PUT only sends text fields. If storeLogo holds a new File,
      // you'll want to upload it first (e.g. to /api/seller/store/logo or
      // a storage bucket) and put the returned URL into formData.store_logo
      // before this call — file uploads can't go in a JSON body as-is.

      const res = await fetch("/api/seller/store", {
        method: "PUT",
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
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold dark:text-white">Store Settings</h1>
        <p className="text-gray-500 mt-2">
          Manage your store information and business details.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Store Profile Card */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 h-fit">
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden border-4 border-blue-100">
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

            <label className="mt-6 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl transition flex items-center gap-2">
              <Upload size={18} />
              Upload Logo
              <input type="file" hidden onChange={handleLogoChange} />
            </label>

            <h2 className="text-xl font-bold mt-6 dark:text-white">
              {formData.store_name || "Your Store"}
            </h2>

            <p className="text-gray-500 mt-2 text-center">
              {formData.owner_name ? `${formData.owner_name} · Seller Profile` : "Seller Profile"}
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold dark:text-white mb-8">
            Store Information
          </h2>

          {loading ? (
            <p className="text-gray-500">Loading store details...</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {/* Store Name */}
              <div>
                <label className="font-medium dark:text-white flex items-center gap-2">
                  <Store size={18} />
                  Store Name
                </label>
                <input
                  type="text"
                  name="store_name"
                  value={formData.store_name}
                  onChange={handleChange}
                  className="w-full mt-2 border rounded-xl p-3 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                />
              </div>

              {/* Owner */}
              <div>
                <label className="font-medium dark:text-white flex items-center gap-2">
                  <User size={18} />
                  Owner Name
                </label>
                <input
                  type="text"
                  name="owner_name"
                  value={formData.owner_name}
                  onChange={handleChange}
                  className="w-full mt-2 border rounded-xl p-3 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                />
              </div>

              {/* Email */}
              <div>
                <label className="font-medium dark:text-white flex items-center gap-2">
                  <Mail size={18} />
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full mt-2 border rounded-xl p-3 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                />
              </div>

              {/* Mobile */}
              <div>
                <label className="font-medium dark:text-white flex items-center gap-2">
                  <Phone size={18} />
                  Mobile Number
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full mt-2 border rounded-xl p-3 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                />
              </div>

              {/* GST Number */}
              <div className="md:col-span-2">
                <label className="font-medium dark:text-white">
                  GST Number
                </label>
                <input
                  type="text"
                  name="gst_number"
                  value={formData.gst_number}
                  onChange={handleChange}
                  className="w-full mt-2 border rounded-xl p-3 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                />
              </div>

              {/* Address */}
              <div className="md:col-span-2">
                <label className="font-medium dark:text-white flex items-center gap-2">
                  <MapPin size={18} />
                  Store Address
                </label>
                <textarea
                  rows="4"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full mt-2 border rounded-xl p-3 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="font-medium dark:text-white">
                  Business Description
                </label>
                <textarea
                  rows="5"
                  name="description"
                  placeholder="Write about your store..."
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full mt-2 border rounded-xl p-3 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                />
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-4 mt-8">
            <button
              onClick={handleSubmit}
              disabled={saving || loading}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white px-6 py-3 rounded-xl transition"
            >
              <Save size={18} />
              {saving ? "Saving..." : "Save Changes"}
            </button>

            <button
              onClick={fetchStore}
              disabled={saving || loading}
              className="flex items-center gap-2 bg-gray-300 dark:bg-gray-700 dark:text-white hover:bg-gray-400 disabled:opacity-60 px-6 py-3 rounded-xl transition"
            >
              <RotateCcw size={18} />
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}