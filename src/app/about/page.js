import Image from "next/image";
import {
  ShoppingBag,
  Target,
  Eye,
  Truck,
  ShieldCheck,
 BadgeCheck,
  Headphones,
  RefreshCcw,
  CreditCard,
  Tags,
} from "lucide-react";

export default function AboutPage() {
  const whyChoose = [
    {
      icon: Truck,
      title: "Fast Delivery",
      description: "Get your order delivered within 24–48 hours.",
    },
    {
      icon: ShieldCheck,
      title: "Secure Payments",
      description: "Multiple trusted payment methods for safe shopping.",
    },
    {
      icon: BadgeCheck,
      title: "Premium Products",
      description: "Carefully selected quality products from trusted brands.",
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      description: "We're here whenever you need help or assistance.",
    },
  ];

  const services = [
    {
      icon: Truck,
      title: "Free Shipping",
      description: "Free shipping on eligible orders across India.",
    },
    {
      icon: RefreshCcw,
      title: "Easy Returns",
      description: "Simple and hassle-free return policy.",
    },
    {
      icon: CreditCard,
      title: "Secure Checkout",
      description: "100% secure payment gateway for every purchase.",
    },
    {
      icon: Tags,
      title: "Best Price Guarantee",
      description: "Competitive prices with amazing deals every day.",
    },
  ];

  return (
    <main className="bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 py-16 text-center">
        <div className="flex justify-center mb-5">
          <div className="w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
            <ShoppingBag className="text-blue-600 dark:text-blue-400" size={40} />
          </div>
        </div>

        <h1 className="text-5xl font-bold text-gray-900 dark:text-white">
          About <span className="text-blue-600">ShopEase</span>
        </h1>

        <p className="mt-5 max-w-3xl mx-auto text-lg text-gray-600 dark:text-gray-300 leading-8">
          ShopEase is a modern online shopping platform that offers high-quality
          products, secure payments, and fast delivery to provide customers with
          an enjoyable shopping experience.
        </p>
      </section>

      {/* Company Introduction */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="overflow-hidden rounded-3xl shadow-xl">
            <Image
              src="/about/about.png"
              alt="ShopEase"
              width={600}
              height={500}
              className="w-full hover:scale-105 transition-all duration-500"
            />
          </div>

          <div>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
              Company Introduction
            </h2>

            <p className="mt-6 text-gray-600 dark:text-gray-300 leading-8">
              ShopEase was built to make online shopping simple, affordable,
              and reliable. We bring together thousands of quality products
              across electronics, fashion, footwear, beauty, accessories, and
              home essentials.
            </p>

            <p className="mt-4 text-gray-600 dark:text-gray-300 leading-8">
              Our mission is to deliver excellent customer experiences through
              premium products, secure payments, and fast shipping while
              continuously improving our services.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-10 shadow-lg hover:-translate-y-2 hover:shadow-xl transition-all duration-300">
            <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              <Target className="text-blue-600 dark:text-blue-400" size={30} />
            </div>

            <h3 className="mt-6 text-2xl font-bold text-gray-900 dark:text-white">
              Our Mission
            </h3>

            <p className="mt-4 text-gray-600 dark:text-gray-300 leading-8">
              To provide customers with an affordable, secure, and convenient
              online shopping experience while delivering premium-quality
              products and outstanding customer service.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-10 shadow-lg hover:-translate-y-2 hover:shadow-xl transition-all duration-300">
            <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              <Eye className="text-blue-600 dark:text-blue-400" size={30} />
            </div>

            <h3 className="mt-6 text-2xl font-bold text-gray-900 dark:text-white">
              Our Vision
            </h3>

            <p className="mt-4 text-gray-600 dark:text-gray-300 leading-8">
              To become one of the most trusted e-commerce platforms by
              delivering innovation, customer satisfaction, and seamless online
              shopping experiences.
            </p>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="max-w-7xl mx-auto px-6 py-14">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
            Why Choose ShopEase?
          </h2>

          <p className="mt-3 text-gray-600 dark:text-gray-300">
            Everything you need for a smooth and secure shopping experience.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 mt-12">
          {whyChoose.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:-translate-y-2 hover:shadow-xl transition-all duration-300 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mx-auto">
                  <Icon
                    className="text-blue-600 dark:text-blue-400"
                    size={30}
                  />
                </div>

                <h3 className="mt-6 text-xl font-semibold text-gray-900 dark:text-white">
                  {item.title}
                </h3>

                <p className="mt-3 text-gray-600 dark:text-gray-300 leading-7">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Our Services */}
      <section className="max-w-7xl mx-auto px-6 py-14">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
            Our Services
          </h2>

          <p className="mt-3 text-gray-600 dark:text-gray-300">
            We provide reliable services to make your shopping easier.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 mt-12">
          {services.map((service, index) => {
            const Icon = service.icon;

            return (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:-translate-y-2 hover:shadow-xl transition-all duration-300 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mx-auto">
                  <Icon
                    className="text-blue-600 dark:text-blue-400"
                    size={30}
                  />
                </div>

                <h3 className="mt-6 text-xl font-semibold text-gray-900 dark:text-white">
                  {service.title}
                </h3>

                <p className="mt-3 text-gray-600 dark:text-gray-300 leading-7">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}