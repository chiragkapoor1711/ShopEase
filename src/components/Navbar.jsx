"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [roleOpen, setRoleOpen] = useState(false);

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
                <div className="absolute mt-2 w-40 bg-card shadow-soft rounded-xl border border-gray-100 overflow-hidden">
                  <Link
                    href="/admin"
                    className="block px-4 py-2 text-text-primary hover:bg-background hover:text-primary transition-colors"
                  >
                    Admin
                  </Link>

                  <Link
                    href="/seller"
                    className="block px-4 py-2 text-text-primary hover:bg-background hover:text-primary transition-colors"
                  >
                    Seller
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Button */}
          <button
            className="md:hidden text-text-primary"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-3 border-t border-gray-100">

            <Link
              href="/"
              className="block text-text-secondary hover:text-primary transition-colors"
            >
              Home
            </Link>

            <Link
              href="/about"
              className="block text-text-secondary hover:text-primary transition-colors"
            >
              About
            </Link>

            <details className="group">
              <summary className="cursor-pointer text-text-secondary hover:text-primary transition-colors">
                Role
              </summary>

              <div className="pl-4 mt-2 space-y-2">
                <Link
                  href="/admin"
                  className="block text-text-primary hover:text-primary transition-colors"
                >
                  Admin
                </Link>

                <Link
                  href="/seller"
                  className="block text-text-primary hover:text-primary transition-colors"
                >
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