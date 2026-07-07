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
    <nav className="bg-card shadow-soft sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-primary">
            ShopEase
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">

            <Link
              href="/"
              className="text-text-secondary hover:text-primary transition-colors"
            >
              Home
            </Link>

            <Link
              href="/about"
              className="text-text-secondary hover:text-primary transition-colors"
            >
              About
            </Link>

            {/* Dropdown */}
            <div className="relative">
              <button
                onClick={() => setRoleOpen(!roleOpen)}
                className="flex items-center gap-1 text-text-secondary hover:text-primary transition-colors"
              >
                Role
                <ChevronDown size={18} />
              </button>

              {roleOpen && (
                <div className="absolute mt-2 w-40 bg-card shadow-soft rounded-xl border border-gray-200 overflow-hidden">
                  <Link
                    href="/admin"
                    className="block px-4 py-2 text-text-primary hover:bg-background"
                  >
                    Admin
                  </Link>

                  <Link
                    href="/seller"
                    className="block px-4 py-2 text-text-primary hover:bg-background"
                  >
                    Seller
                  </Link>
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            {mounted && (
              <button
                onClick={() =>
                  setTheme(theme === "dark" ? "light" : "dark")
                }
                className="p-2 rounded-lg bg-background hover:scale-110 transition"
              >
                {theme === "dark" ? (
                  <Sun size={20} />
                ) : (
                  <Moon size={20} />
                )}
              </button>
            )}
          </div>

          {/* Mobile Buttons */}
          <div className="flex items-center gap-3 md:hidden">

            {mounted && (
              <button
                onClick={() =>
                  setTheme(theme === "dark" ? "light" : "dark")
                }
                className="p-2 rounded-lg bg-background"
              >
                {theme === "dark" ? (
                  <Sun size={20} />
                ) : (
                  <Moon size={20} />
                )}
              </button>
            )}

            <button
              className="text-text-primary"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>

          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-3 border-t border-gray-200">

            <Link
              href="/"
              className="block text-text-secondary"
            >
              Home
            </Link>

            <Link
              href="/about"
              className="block text-text-secondary"
            >
              About
            </Link>

            <details>
              <summary className="cursor-pointer text-text-secondary">
                Role
              </summary>

              <div className="pl-4 mt-2 space-y-2">
                <Link href="/admin" className="block">
                  Admin
                </Link>

                <Link href="/seller" className="block">
                  Seller
                </Link>
              </div>
            </details>
          </div>
        )}
      </div>
    </nav>
  );
}