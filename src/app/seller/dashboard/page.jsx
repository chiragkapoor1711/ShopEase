import {
  Package,
  ShoppingBag,
  IndianRupee,
  Plus,
} from "lucide-react";

export default function SellerDashboard() {
  const stats = [
    {
      title: "Products",
      value: "45",
      icon: Package,
    },
    {
      title: "Orders",
      value: "120",
      icon: ShoppingBag,
    },
    {
      title: "Revenue",
      value: "₹65K",
      icon: IndianRupee,
    },
    {
      title: "Add Product",
      value: "New",
      icon: Plus,
    },
  ];

  return (
    <section className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">

      <div className="max-w-7xl mx-auto">

        <h1 className="text-4xl font-bold dark:text-white">
          Seller Dashboard
        </h1>

        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Manage your products and orders.
        </p>

        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8 mt-10">

          {stats.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 hover:-translate-y-2 transition"
              >
                <Icon
                  className="text-blue-600 dark:text-blue-400"
                  size={35}
                />

                <h2 className="mt-6 text-3xl font-bold dark:text-white">
                  {item.value}
                </h2>

                <p className="text-gray-500 dark:text-gray-300">
                  {item.title}
                </p>
              </div>
            );
          })}

        </div>

      </div>

    </section>
  );
}