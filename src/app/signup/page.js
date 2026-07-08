"use client";

import Link from "next/link";

export default function Signup() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <div className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">

        <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white">
          Create Account
        </h1>

        <p className="text-center text-gray-500 dark:text-gray-300 mt-2">
          Join ShopEase and start shopping today.
        </p>

        <form className="mt-8 space-y-5">

          <div>
            <label className="block mb-2 font-medium text-gray-700 dark:text-gray-200">
              Full Name
            </label>

            <input
              type="text"
              placeholder="Enter your full name"
              className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700 dark:text-gray-200">
              Email Address
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700 dark:text-gray-200">
              Mobile Number
            </label>

            <input
              type="tel"
              placeholder="Enter your mobile number"
              className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700 dark:text-gray-200">
              Password
            </label>

            <input
              type="password"
              placeholder="Create a password"
              className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700 dark:text-gray-200">
              Confirm Password
            </label>

            <input
              type="password"
              placeholder="Confirm your password"
              className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition">
            Create Account
          </button>

        </form>

        <p className="text-center mt-6 text-gray-600 dark:text-gray-300">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-blue-600 font-semibold hover:underline"
          >
            Login
          </Link>
        </p>

      </div>
    </section>
  );
}