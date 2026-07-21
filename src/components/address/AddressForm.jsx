"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const initialForm = {
  full_name: "",
  phone: "",
  address_line1: "",
  address_line2: "",
  city: "",
  state: "",
  country: "",
  pincode: "",
  landmark: "",
  is_default: false,
};

export default function AddressForm({ initialData = null, onSubmit, loading }) {
  const [form, setForm] = useState(initialForm);
  const [loadingLocation, setLoadingLocation] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm({
        full_name: initialData.full_name || "",
        phone: initialData.phone || "",
        address_line1: initialData.address_line1 || "",
        address_line2: initialData.address_line2 || "",
        city: initialData.city || "",
        state: initialData.state || "",
        country: initialData.country || "",
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

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported.");
      return;
    }

    setLoadingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        await reverseGeocode(latitude, longitude);
      },

      (error) => {
        setLoadingLocation(false);

        switch (error.code) {
          case error.PERMISSION_DENIED:
            toast.error("Location permission denied.");
            break;

          case error.POSITION_UNAVAILABLE:
            toast.error("Location unavailable.");
            break;

          case error.TIMEOUT:
            toast.error("Location request timed out.");
            break;

          default:
            toast.error("Unable to fetch location.");
        }
      },

      {
        enableHighAccuracy: true,
        timeout: 10000,
      },
    );
  };

  const reverseGeocode = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
      );

      const data = await response.json();

      if (!data.address) {
        toast.error("Address not found.");
        return;
      }

      const address = data.address;

      setForm((prev) => ({
        ...prev,

        address_line1:
          [address.house_number, address.road, address.neighbourhood]
            .filter(Boolean)
            .join(" ") || "",

        address_line2: address.suburb || address.city_district || "",

        city: address.city || address.town || address.village || "",

        state: address.state || "",

        country: address.country || "",

        pincode: address.postcode || "",
      }));

      toast.success("Location fetched successfully.");
    } catch (error) {
      console.error(error);
      toast.error("Unable to fetch address.");
    } finally {
      setLoadingLocation(false);
    }
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

      <button
        type="button"
        onClick={getCurrentLocation}
        disabled={loadingLocation}
        className="mb-5 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-5 py-3 rounded-lg transition"
      >
        {loadingLocation ? (
          "Fetching Location..."
        ) : (
          <>📍 Use Current Location</>
        )}
      </button>

      <div>
        <label className="font-medium">Address Line 1</label>

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
        <label className="font-medium">Address Line 2</label>

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
        <div>
          <label className="font-medium">Country</label>

          <input
            type="text"
            name="country"
            value={form.country}
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
