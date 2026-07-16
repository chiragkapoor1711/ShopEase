"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  Menu,
  X,
  ChevronDown,
  Moon,
  Sun,
  UserCircle,
  LayoutDashboard,
  LogOut,
  User,
  KeyRound,
} from "lucide-react";
import { ShoppingCart } from "lucide-react";

import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [roleOpen, setRoleOpen] = useState(false);
  const [profileDrawer, setProfileDrawer] = useState(false);

  // user now comes from shared AuthContext instead of a local fetch,
  // so it updates everywhere the moment login/logout happens — no
  // manual page refresh required.
  const { user, setUser } = useAuth();

  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const { cartCount } = useCart();


  const roleRef = useRef(null);
  const profileRef = useRef(null);
  const drawerRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Only fetch the cart count for logged-in customers, and reset it
  // to 0 immediately on logout so the badge doesn't linger.
  
  

  // Close the Role / Profile dropdowns when clicking outside of them
  useEffect(() => {
    function handleClickOutside(event) {
      if (roleRef.current && !roleRef.current.contains(event.target)) {
        setRoleOpen(false);
      }
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target) &&
        drawerRef.current &&
        !drawerRef.current.contains(event.target)
      ) {
        setProfileDrawer(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
    });

    setUser(null); // instantly clears user everywhere via context
    setCartCount(0);
    setProfileDrawer(false);
    toast.success("Logged out successfully.");
    router.push("/");
  };

  return (
    <>
      <nav className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50 transition-colors duration-300 animate-navbar-in">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link
              href="/"
              className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400 transition-transform duration-300 hover:scale-105 inline-block"
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

              {/* Dropdown */}
              <div className="relative" ref={roleRef}>
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
                    href="/sellerlogin"
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

              {/* Cart */}
              <Link
                href="/cart"
                className="relative flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                <ShoppingCart
                  size={24}
                  className="text-gray-700 dark:text-gray-200"
                />

                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Auth section — desktop only */}
              {user ? (
                <div className="relative" ref={profileRef}>
                  <button onClick={() => setProfileDrawer(true)} className="ml-2">
                    <UserCircle
                      size={34}
                      className="text-blue-600 dark:text-blue-400 hover:scale-110 transition"
                    />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <Link
                    href="/login"
                    className="text-gray-700 dark:text-gray-200 hover:text-blue-600"
                  >
                    Login
                  </Link>

                  <Link
                    href="/signup"
                    className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Sign Up
                  </Link>
                  
                  
                </div>
              )}
            </div>
            

            {/* Mobile Buttons */}
            <div className="flex items-center gap-2 sm:gap-3 md:hidden">
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

              {/* Cart */}
              <Link
                href="/cart"
                className="relative flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                <ShoppingCart
                  size={22}
                  className="text-gray-700 dark:text-gray-200"
                />

                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Profile icon — mobile/tablet only, opens the same drawer as desktop */}
              {user && (
                <button
                  onClick={() => setProfileDrawer(true)}
                  className="hover:scale-110 active:scale-95 transition-transform"
                >
                  <UserCircle
                    size={28}
                    className="text-blue-600 dark:text-blue-400"
                  />
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
                    href="/sellerlogin"
                    onClick={() => {
                      setRoleOpen(false);
                      setIsOpen(false);
                    }}
                    className="block text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 hover:translate-x-1"
                  >
                    Seller
                  </Link>

                  
                </div>
              </details>

              {user ? (
                <>
                  <Link
                    href={
                      user.role === "admin"
                        ? "/admin/dashboard"
                        : user.role === "seller"
                          ? "/seller/dashboard"
                          : "/dashboard"
                    }
                    onClick={() => setIsOpen(false)}
                    className="block text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 hover:translate-x-1"
                  >
                    Dashboard
                  </Link>

                  <button
                    onClick={() => {
                      setIsOpen(false);
                      handleLogout();
                    }}
                    className="block text-red-600"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
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
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Background Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${
          profileDrawer ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setProfileDrawer(false)}
      />

      {/* Profile Drawer */}
      {user && (
        <div
          ref={drawerRef}
          className={`fixed top-0 right-0 h-screen w-full max-w-xs sm:w-80 sm:max-w-none bg-white dark:bg-gray-900 shadow-2xl z-50 transition-transform duration-300 ${
            profileDrawer ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-5 border-b dark:border-gray-700">
            <h2 className="text-lg sm:text-xl font-bold dark:text-white">My Account</h2>

            <button
              onClick={() => setProfileDrawer(false)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <X className="dark:text-white" />
            </button>
          </div>

          {/* User Info */}
          <div className="p-4 sm:p-6 border-b dark:border-gray-700">
            <div className="flex items-center gap-3 sm:gap-4">
              <UserCircle size={48} className="text-blue-600 dark:text-blue-400 shrink-0 sm:hidden" />
              <UserCircle size={55} className="text-blue-600 dark:text-blue-400 shrink-0 hidden sm:block" />

              <div className="min-w-0">
                <h3 className="font-semibold dark:text-white truncate">{user.full_name}</h3>
                <p className="text-sm text-gray-500 truncate">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Menu */}
          <div className="py-4">
            <Link
              href="/profile"
              onClick={() => setProfileDrawer(false)}
              className="flex items-center gap-3 px-4 sm:px-6 py-3 sm:py-4 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <User size={20} />
              My Profile
            </Link>

            <Link
              href={
                user.role === "admin"
                  ? "/admin/dashboard"
                  : user.role === "seller"
                    ? "/seller/dashboard"
                    : "/dashboard"
              }
              onClick={() => setProfileDrawer(false)}
              className="flex items-center gap-3 px-4 sm:px-6 py-3 sm:py-4 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <LayoutDashboard size={20} />
              Dashboard
            </Link>

            <Link
              href="/change-password"
              onClick={() => setProfileDrawer(false)}
              className="flex items-center gap-3 px-4 sm:px-6 py-3 sm:py-4 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <KeyRound size={20} />
              Change Password
            </Link>

            <button
              onClick={() => {
                setProfileDrawer(false);
                handleLogout();
              }}
              className="w-full flex items-center gap-3 px-4 sm:px-6 py-3 sm:py-4 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>
      )}
    </>
  );
}