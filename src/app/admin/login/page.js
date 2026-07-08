"use client";

import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export default function AdminLogin() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900 px-6">

      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">

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

        <form className="mt-8 space-y-5">

          <div>
            <label className="block mb-2 font-medium text-gray-700 dark:text-gray-200">
              Admin Email
            </label>

            <input
              type="email"
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
              placeholder="Enter password"
              className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <button className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-lg transition">
            Admin Login
          </button>

        </form>

        <p className="text-center mt-6">
          <Link
            href="/login"
            className="text-blue-600 hover:underline"
          >
            Back to User Login
          </Link>
        </p>

      </div>

    </section>
  );
}