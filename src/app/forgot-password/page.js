"use client";

import Link from "next/link";

export default function ForgotPassword() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-6">

      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">

        <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white">
          Forgot Password
        </h1>

        <p className="mt-3 text-center text-gray-600 dark:text-gray-300">
          Enter your email address and we'll send you a password reset link.
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
          <Link
            href="/login"
            className="text-blue-600 hover:underline"
          >
            ← Back to Login
          </Link>
        </p>

      </div>

    </section>
  );
}