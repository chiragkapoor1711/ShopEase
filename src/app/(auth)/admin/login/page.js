"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

export default function AdminLogin() {
  const router = useRouter();
  const { refreshUser } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

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
      const response = await fetch("/api/auth/login", {
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

      // Allow only admins
      if (data.user.role !== "admin") {
        setMessage("Access denied. Admin account required.");
        return;
      }

      // Sync shared AuthContext so the Navbar updates immediately
      await refreshUser();
      toast.success(`Welcome, ${data.user.full_name}!`);


      router.push("/admin/dashboard");
    } catch (error) {
      console.log(error);
      setMessage("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className="relative min-h-screen flex items-center justify-center px-6 bg-cover bg-center"
      style={{
        backgroundImage: "url('/hero-banner.avif')",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-blue-900/50 to-black/70"></div>
      <div className="relative z-10 w-full max-w-md bg-white/90 dark:bg-gray-900/90 backdrop-blur-2xl rounded-2xl shadow-2xl p-8 animate-fade-in">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
            <ShieldCheck className="text-blue-600" size={34} />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-center mt-6 text-gray-900 dark:text-white">
          Admin Portal
        </h1>

        <p className="text-center text-gray-500 dark:text-gray-300 mt-2">
          Login to access the administrator dashboard.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="block mb-2 font-medium text-gray-700 dark:text-gray-200">
              Admin Email
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="admin@example.com"
              className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700 dark:text-gray-200">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {message && <p className="text-center text-red-500">{message}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-lg transition"
          >
            {loading ? "Logging in..." : "Admin Login"}
          </button>
        </form>

        <p className="text-center mt-6">
          <Link href="/login" className="text-blue-600 hover:underline">
            Back to User Login
          </Link>
        </p>
      </div>
    </section>
  );
}
