"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [roleOpen, setRoleOpen] = useState(false);

  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50 transition-colors duration-300 animate-navbar-in">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            href="/"
            className="text-2xl font-bold text-blue-600 dark:text-blue-400 transition-transform duration-300 hover:scale-105 inline-block"
          >
            ShopEase
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="relative text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-blue-400 transition-colors duration-300 after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-blue-600 dark:after:bg-blue-400 after:transition-all after:duration-300 hover:after:w-full"
            >
              Home
            </Link>

            <Link
              href="/about"
              className="relative text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-blue-400 transition-colors duration-300 after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-blue-600 dark:after:bg-blue-400 after:transition-all after:duration-300 hover:after:w-full"
            >
              About
            </Link>

            <Link
              href="/login"
              className="relative text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-blue-600 dark:after:bg-blue-400 after:transition-all after:duration-300 hover:after:w-full"
            >
              Login
            </Link>

            <Link
              href="/signup"
              className="relative text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-blue-600 dark:after:bg-blue-400 after:transition-all after:duration-300 hover:after:w-full"
            >
              Sign Up
            </Link>

            {/* Dropdown */}
            <div className="relative">
              <button
                onClick={() => setRoleOpen(!roleOpen)}
                className="flex items-center gap-1 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300"
              >
                Role
                <ChevronDown
                  size={18}
                  className={`transition-transform duration-300 ${
                    roleOpen ? "rotate-180" : "rotate-0"
                  }`}
                />
              </button>

              <div
                className={`absolute mt-2 w-40 bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-200 origin-top ${
                  roleOpen
                    ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
                    : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                }`}
              >
                <Link
                  href="/admin/login"
                  onClick={() => setRoleOpen(false)}
                  className="block px-4 py-2 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  Admin
                </Link>

                <Link
                  href="/seller"
                  onClick={() => setRoleOpen(false)}
                  className="block px-4 py-2 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  Seller
                </Link>
              </div>
            </div>

            {/* Theme Toggle */}
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:scale-110 active:scale-95 transition-transform duration-300"
              >
                <span className="inline-block transition-transform duration-500 ease-in-out">
                  {theme === "dark" ? (
                    <Sun
                      size={20}
                      className="text-yellow-400 animate-spin-in"
                    />
                  ) : (
                    <Moon size={20} className="text-blue-500 animate-spin-in" />
                  )}
                </span>
              </button>
            )}
          </div>

          {/* Mobile Buttons */}
          <div className="flex items-center gap-3 md:hidden">
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 transition-colors duration-300 hover:scale-110 active:scale-95"
              >
                {theme === "dark" ? (
                  <Sun size={20} className="text-yellow-400 animate-spin-in" />
                ) : (
                  <Moon size={20} className="text-blue-500 animate-spin-in" />
                )}
              </button>
            )}

            <button
              className="text-gray-900 dark:text-white transition-transform duration-300 active:scale-90"
              onClick={() => setIsOpen(!isOpen)}
            >
              <span
                className={`inline-block transition-transform duration-300 ${
                  isOpen ? "rotate-90" : "rotate-0"
                }`}
              >
                {isOpen ? <X size={28} /> : <Menu size={28} />}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 ${
            isOpen
              ? "max-h-96 opacity-100 py-4 border-t"
              : "max-h-0 opacity-0 py-0 border-t-0"
          }`}
        >
          <div className="space-y-3">
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="block text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 hover:translate-x-1"
            >
              Home
            </Link>

            <Link
              href="/about"
              onClick={() => setIsOpen(false)}
              className="block text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 hover:translate-x-1"
            >
              About
            </Link>
            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className="block text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 hover:translate-x-1"
            >
              Login
            </Link>

            <Link
              href="/signup"
              onClick={() => setIsOpen(false)}
              className="block text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 hover:translate-x-1"
            >
              Sign Up
            </Link>

            <details>
              <summary className="cursor-pointer text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">
                Role
              </summary>

              <div className="pl-4 mt-2 space-y-2 animate-fade-in-down">
                <Link
                  href="/admin/login"
                  onClick={() => {
                    setRoleOpen(false);
                    setIsOpen(false);
                  }}
                  className="block text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 hover:translate-x-1"
                >
                  Admin
                </Link>

                <Link
                  href="/seller"
                  onClick={() => setRoleOpen(false)}
                  className="block text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 hover:translate-x-1"
                >
                  Seller
                </Link>
              </div>
            </details>
          </div>
        </div>
      </div>
    </nav>
  );
}