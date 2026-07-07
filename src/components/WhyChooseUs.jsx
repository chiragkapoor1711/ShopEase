import {
  Truck,
  ShieldCheck,
  RefreshCcw,
  Headphones,
} from "lucide-react";

const features = [
  {
    id: 1,
    icon: Truck,
    title: "Fast Delivery",
    description:
      "Get your orders delivered quickly and safely to your doorstep.",
  },
  {
    id: 2,
    icon: ShieldCheck,
    title: "Secure Payment",
    description:
      "Multiple secure payment options with complete data protection.",
  },
  {
    id: 3,
    icon: RefreshCcw,
    title: "Easy Returns",
    description:
      "Hassle-free returns and exchanges within our return policy.",
  },
  {
    id: 4,
    icon: Headphones,
    title: "24/7 Support",
    description:
      "Our customer support team is available anytime you need help.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}
        <div className="text-center mb-14">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
            Why Choose ShopEase?
          </h2>

          <p className="mt-3 text-lg text-gray-600 dark:text-gray-300">
            We make your shopping experience simple, secure, and enjoyable.
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">

          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-md dark:shadow-gray-900/40 p-8 text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                {/* Icon */}
                <div className="w-16 h-16 mx-auto rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <Icon
                    size={32}
                    className="text-blue-600 dark:text-blue-400"
                  />
                </div>

                {/* Title */}
                <h3 className="mt-6 text-xl font-semibold text-gray-800 dark:text-white">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="mt-3 text-gray-600 dark:text-gray-300 leading-7">
                  {feature.description}
                </p>
              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
}