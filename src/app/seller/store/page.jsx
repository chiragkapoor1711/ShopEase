"use client";

import { useState } from "react";
import Image from "next/image";

export default function StoreForm({ initialData = null }) {
  const [formData, setFormData] = useState({
    store_name: initialData?.store_name || "",
    description: initialData?.description || "",
    address: initialData?.address || "",
    phone: initialData?.phone || "",
    email: initialData?.email || "",
    gst_number: initialData?.gst_number || "",
  });

  const [storeLogo, setStoreLogo] = useState(initialData?.store_logo || "");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  // Step 1: upload file immediately on selection, store the returned URL
  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setMessage("");

    try {
      const uploadData = new FormData();
      uploadData.append("file", file);

      const res = await fetch("/api/seller/upload", {
        method: "POST",
        body: uploadData,
      });

      const data = await res.json();

      if (data.success) {
        setStoreLogo(data.imageUrl); // <-- critical: save returned URL to state
      } else {
        setMessage(data.message || "Upload failed.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  // Step 2: submit form INCLUDING store_logo from state
  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const res = await fetch("/api/seller/store", {
        method: initialData ? "PUT" : "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          store_logo: storeLogo,
        }),
      });

      const data = await res.json();
      setMessage(data.message);

      if (!data.success) {
        console.error(data.message);
      }
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-5">
      <h2 className="text-2xl font-bold dark:text-white">
        {initialData ? "Update Store" : "Create Store"}
      </h2>

      {message && (
        <p className="text-sm text-blue-600 dark:text-blue-400">{message}</p>
      )}

      {/* Logo preview + upload */}
      <div>
        <label className="block mb-2 font-medium dark:text-white">
          Store Logo
        </label>

        <div className="h-32 w-32 relative bg-gray-100 rounded-xl overflow-hidden mb-3">
          <Image
            src={storeLogo || "/uploads/no-image.png"}
            alt="Store logo preview"
            fill
            className="object-cover"
          />
        </div>

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
        />

        {uploading && (
          <p className="text-sm text-gray-500 mt-1">Uploading...</p>
        )}
      </div>

      <div>
        <label className="block mb-1 font-medium dark:text-white">
          Store Name
        </label>
        <input
          name="store_name"
          value={formData.store_name}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2"
          required
        />
      </div>

      <div>
        <label className="block mb-1 font-medium dark:text-white">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2"
          rows={3}
        />
      </div>

      <div>
        <label className="block mb-1 font-medium dark:text-white">
          Address
        </label>
        <input
          name="address"
          value={formData.address}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium dark:text-white">Phone</label>
        <input
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium dark:text-white">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium dark:text-white">
          GST Number
        </label>
        <input
          name="gst_number"
          value={formData.gst_number}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2"
        />
      </div>

      <button
        type="submit"
        disabled={saving || uploading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 rounded-xl transition"
      >
        {saving ? "Saving..." : initialData ? "Update Store" : "Create Store"}
      </button>
    </form>
  );
}
