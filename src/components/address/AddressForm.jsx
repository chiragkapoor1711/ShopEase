"use client";

import { useEffect, useState } from "react";

const initialForm = {
  full_name: "",
  phone: "",
  address_line1: "",
  address_line2: "",
  city: "",
  state: "",
  pincode: "",
  landmark: "",
  is_default: false,
};

export default function AddressForm({
  initialData = null,
  onSubmit,
  loading,
}) {
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (initialData) {
      setForm({
        full_name: initialData.full_name || "",
        phone: initialData.phone || "",
        address_line1: initialData.address_line1 || "",
        address_line2: initialData.address_line2 || "",
        city: initialData.city || "",
        state: initialData.state || "",
        pincode: initialData.pincode || "",
        landmark: initialData.landmark || "",
        is_default: Boolean(initialData.is_default),
      });
    } else {
      setForm(initialForm);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  const inputClass =
    "w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      <div>
        <label className="font-medium">Full Name</label>

        <input
          type="text"
          name="full_name"
          value={form.full_name}
          onChange={handleChange}
          className={inputClass}
          required
        />
      </div>

      <div>
        <label className="font-medium">Phone Number</label>

        <input
          type="text"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          className={inputClass}
          required
        />
      </div>

      <div>
        <label className="font-medium">
          Address Line 1
        </label>

        <input
          type="text"
          name="address_line1"
          value={form.address_line1}
          onChange={handleChange}
          className={inputClass}
          required
        />
      </div>

      <div>
        <label className="font-medium">
          Address Line 2
        </label>

        <input
          type="text"
          name="address_line2"
          value={form.address_line2}
          onChange={handleChange}
          className={inputClass}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-5">

        <div>
          <label className="font-medium">City</label>

          <input
            type="text"
            name="city"
            value={form.city}
            onChange={handleChange}
            className={inputClass}
            required
          />
        </div>

        <div>
          <label className="font-medium">State</label>

          <input
            type="text"
            name="state"
            value={form.state}
            onChange={handleChange}
            className={inputClass}
            required
          />
        </div>

      </div>

      <div className="grid md:grid-cols-2 gap-5">

        <div>
          <label className="font-medium">Pincode</label>

          <input
            type="text"
            name="pincode"
            value={form.pincode}
            onChange={handleChange}
            className={inputClass}
            required
          />
        </div>

        <div>
          <label className="font-medium">Landmark</label>

          <input
            type="text"
            name="landmark"
            value={form.landmark}
            onChange={handleChange}
            className={inputClass}
          />
        </div>

      </div>

      <label className="flex items-center gap-3">

        <input
          type="checkbox"
          name="is_default"
          checked={form.is_default}
          onChange={handleChange}
        />

        Set as Default Address

      </label>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold"
      >
        {loading
          ? "Saving..."
          : initialData
          ? "Update Address"
          : "Save Address"}
      </button>

    </form>
  );
}