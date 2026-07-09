"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

export default function CreateSeller() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/admin/create-seller", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message);
        return;
      }


      toast.success("Seller created successfully.");

      setFormData({
        fullName: "",
        email: "",
        mobile: "",
        password: "",
      });
    } catch (error) {
      setMessage("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-6">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-lg">
        <div className="mb-6">
          <Link
            href="/admin/dashboard"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition"
          >
            <ArrowLeft size={20} />
            <span>Back to Dashboard</span>
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-center dark:text-white">
          Create Seller
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5 mt-8">
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full border rounded-lg p-3 dark:bg-gray-900 dark:text-white"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border rounded-lg p-3 dark:bg-gray-900 dark:text-white"
          />

          <input
            type="text"
            name="mobile"
            placeholder="Mobile Number"
            value={formData.mobile}
            onChange={handleChange}
            className="w-full border rounded-lg p-3 dark:bg-gray-900 dark:text-white"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border rounded-lg p-3 dark:bg-gray-900 dark:text-white"
          />

          {message && <p className="text-center text-red-500">{message}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg"
          >
            {loading ? "Creating..." : "Create Seller"}
          </button>
        </form>
      </div>
    </section>
  );
}
