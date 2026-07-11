"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import SellerSidebar from "@/components/seller/SellerSidebar";

export default function SellerLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-950">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-72 border-r bg-white dark:bg-gray-900 dark:border-gray-800">
        <SellerSidebar />
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-72 bg-white dark:bg-gray-900 shadow-xl transform transition-transform duration-300 lg:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-end p-4">
          <button onClick={() => setSidebarOpen(false)}>
            <X className="dark:text-white" />
          </button>
        </div>

        <SellerSidebar closeSidebar={() => setSidebarOpen(false)} />
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center gap-4 p-4 bg-white dark:bg-gray-900 border-b dark:border-gray-800">
          <button onClick={() => setSidebarOpen(true)}>
            <Menu className="dark:text-white" />
          </button>

          <h2 className="text-xl font-bold dark:text-white">
            Seller Dashboard
          </h2>
        </div>

        {/* THIS WAS MISSING */}
        <div className="p-4 md:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}