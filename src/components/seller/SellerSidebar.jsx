"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderTree,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";

const menuItems = [
  { title: "Dashboard", icon: LayoutDashboard, href: "/seller/dashboard" },
  { title: "Categories", icon: FolderTree, href: "/seller/categories" },
  { title: "Products", icon: Package, href: "/seller/products" },
  { title: "Orders", icon: ShoppingCart, href: "/seller/orders" },
  { title: "Customers", icon: Users, href: "/seller/customers" },
  { title: "Reports", icon: BarChart3, href: "/seller/reports" },
  { title: "My Store", icon: Settings, href: "/seller/mystore" },
];

export default function SellerSidebar({ closeSidebar }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b dark:border-gray-800">
        <h1 className="text-2xl font-bold text-blue-600">ShopEase</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Seller Panel
        </p>
      </div>

      {/* Menu */}
      <nav className="p-4 space-y-2 overflow-y-auto flex-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={item.title}
              href={item.href}
              onClick={() => closeSidebar?.()}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                ${
                  active
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-800 hover:text-blue-600"
                }
              `}
            >
              <Icon size={20} />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}