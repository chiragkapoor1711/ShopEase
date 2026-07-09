import { ShoppingBag, Heart, Package, User } from "lucide-react";

export default function UserDashboard() {
  const cards = [
    {
      title: "My Orders",
      icon: Package,
      value: "12 Orders",
      color: "bg-blue-100 dark:bg-blue-900",
      text: "text-blue-600 dark:text-blue-400",
    },
    {
      title: "Wishlist",
      icon: Heart,
      value: "8 Items",
      color: "bg-pink-100 dark:bg-pink-900",
      text: "text-pink-600 dark:text-pink-400",
    },
    {
      title: "My Account",
      icon: User,
      value: "Profile",
      color: "bg-green-100 dark:bg-green-900",
      text: "text-green-600 dark:text-green-400",
    },
    {
      title: "Shopping",
      icon: ShoppingBag,
      value: "Continue",
      color: "bg-yellow-100 dark:bg-yellow-900",
      text: "text-yellow-600 dark:text-yellow-400",
    },
  ];

  return (
    <section className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">

        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          Welcome 👋
        </h1>

        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Welcome to your ShopEase Dashboard.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-10">

          {cards.map((card, index) => {
            const Icon = card.icon;

            return (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:-translate-y-2 hover:shadow-xl transition-all"
              >
                <div className={`w-14 h-14 rounded-full flex items-center justify-center ${card.color}`}>
                  <Icon className={card.text} />
                </div>

                <h3 className="mt-5 text-xl font-semibold dark:text-white">
                  {card.title}
                </h3>

                <p className="text-gray-500 dark:text-gray-300 mt-2">
                  {card.value}
                </p>
              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
}