"use client";

import Link from "next/link";
import { KeyRound } from "lucide-react";
export default function ForgotPassword() {
  return (
    <section
      className="relative min-h-screen flex items-center justify-center px-6 bg-cover bg-center"
      style={{
        backgroundImage: "url('/hero-banner.avif')",
      }}
    >
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-blue-900/50 to-black/70"></div>

      {/* Forgot Password Card */}
      <div className="relative z-10 w-full max-w-md bg-white/90 dark:bg-gray-900/90 backdrop-blur-2xl rounded-2xl shadow-2xl p-8 animate-fade-in">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
            <KeyRound className="text-blue-600 dark:text-blue-400" size={34} />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-bold text-center mt-6 text-gray-900 dark:text-white">
          Forgot Password
        </h1>

        <p className="mt-3 text-center text-gray-600 dark:text-gray-300">
          Enter your email address and we all send you a password reset link.
        </p>

        <form className="mt-8 space-y-5">
          <div>
            <label className="block mb-2 font-medium text-gray-700 dark:text-gray-200">
              Email Address
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition">
            Send Reset Link
          </button>
        </form>

        <p className="text-center mt-6">
          <Link href="/login" className="text-blue-600 hover:underline">
            ← Back to Login
          </Link>
        </p>
      </div>
    </section>
  );
}
