import { Users, ShoppingCart, Package, IndianRupee } from "lucide-react";

import Link from "next/link";

export default function AdminDashboard() {
  const stats = [
    {
      title: "Users",
      value: "150",
      icon: Users,
    },
    {
      title: "Products",
      value: "320",
      icon: Package,
    },
    {
      title: "Orders",
      value: "540",
      icon: ShoppingCart,
    },
    {
      title: "Revenue",
      value: "₹2.5L",
      icon: IndianRupee,
    },
  ];

  return (
    <section className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold dark:text-white">Admin Dashboard</h1>

        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Manage your ShopEase store.
        </p>
        <div className="flex justify-end mb-8">
          <Link
            href="/admin/create-seller"
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg transition"
          >
            + Create Seller
          </Link>
        </div>
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8 mt-10">
          {stats.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 hover:-translate-y-2 transition"
              >
                <Icon className="text-blue-600 dark:text-blue-400" size={35} />

                <h2 className="mt-6 text-3xl font-bold dark:text-white">
                  {item.value}
                </h2>

                <p className="text-gray-500 dark:text-gray-300">{item.title}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
