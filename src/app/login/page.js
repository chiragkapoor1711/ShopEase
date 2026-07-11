"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { User } from "lucide-react";
import toast from "react-hot-toast";

export default function Login() {
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

    setMessage("");
    setLoading(true);

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
        toast.error(data.message || "Login failed.");
        return;
      }

      // Pull the fresh user into shared AuthContext so the Navbar
      // (and any other component using useAuth()) updates immediately —
      // no manual page refresh needed.
      await refreshUser();

      toast.success(`Welcome back, ${data.user.full_name}!`);

      if (data.user.role === "admin") {
        router.push("/admin/dashboard");
      } else if (data.user.role === "seller") {
        const res = await fetch("/api/seller/store");
        const storeData = await res.json();

        if (res.ok && storeData.storeExists) {
          router.push("/seller/dashboard");
        } else {
          router.push("/seller/store");
        }
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong.");
      toast.error("Something went wrong.");
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
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-blue-900/50 to-black/70"></div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md bg-white/90 dark:bg-gray-900/90 backdrop-blur-2xl rounded-2xl shadow-2xl p-8 animate-fade-in">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
            <User className="text-blue-600 dark:text-blue-400" size={34} />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-center mt-6 text-gray-900 dark:text-white">
          User Login
        </h1>

        <p className="text-center text-gray-600 dark:text-gray-300 mt-2">
          Welcome back! Login to continue shopping.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="block mb-2 font-medium text-gray-700 dark:text-gray-200">
              Email Address
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
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
              placeholder="Enter your password"
              className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-between items-center text-sm">
            <label className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <input type="checkbox" />
              Remember Me
            </label>

            <Link
              href="/forgot-password"
              className="text-blue-600 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
          {message && <p className="text-center text-red-500">{message}</p>}
        </form>

        <p className="text-center mt-6 text-gray-600 dark:text-gray-300">
          Don't have an account?{" "}
          <Link
            href="/signup"
            className="text-blue-600 font-semibold hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </section>
  );
}
