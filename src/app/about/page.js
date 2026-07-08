import Image from "next/image";
import Link from "next/link";
import { Truck, ShieldCheck, Gem, Headset } from "lucide-react";

export default function About() {
  return (
    <main className="bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white">
          About <span className="text-blue-600">ShopEase</span>
        </h1>

        <p className="mt-6 max-w-3xl mx-auto text-lg text-gray-600 dark:text-gray-300">
          ShopEase is a modern e-commerce platform designed to provide customers
          with a seamless online shopping experience. Our goal is to make
          shopping simple, secure, and enjoyable by offering quality products,
          competitive prices, and fast delivery.
        </p>
      </section>

      {/* Company Introduction */}
      <section className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-12 items-center">
        <Image
          src="/hero-banner.avif"
          alt="About ShopEase"
          width={500}
          height={400}
          className="rounded-2xl shadow-lg"
        />

        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Company Introduction
          </h2>

          <p className="mt-4 text-gray-600 dark:text-gray-300 leading-8">
            ShopEase was created with a vision of providing a convenient,
            reliable, and affordable online shopping experience. We connect
            customers with high-quality products across multiple categories,
            ensuring satisfaction with every purchase.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-blue-600">Our Mission</h3>

          <p className="mt-4 text-gray-600 dark:text-gray-300">
            To make online shopping easy, affordable, and accessible for
            everyone by delivering quality products with exceptional customer
            service.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-blue-600">Our Vision</h3>

          <p className="mt-4 text-gray-600 dark:text-gray-300">
            To become one of the most trusted e-commerce platforms by offering
            innovative shopping experiences and building lasting customer
            relationships.
          </p>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white">
          Why Choose ShopEase?
        </h2>

        <div className="grid md:grid-cols-4 gap-6 mt-12">
          {[
            { title: "Fast Delivery", icon: Truck },
            { title: "Secure Payments", icon: ShieldCheck },
            { title: "Premium Products", icon: Gem },
            { title: "24/7 Customer Support", icon: Headset },
          ].map(({ title, icon: Icon }) => (
            <div
              key={title}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center flex flex-col items-center"
            >
              <Icon className="w-10 h-10 text-blue-600 mb-4" />
              <h3 className="font-semibold text-xl text-blue-600">{title}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white">
          Our Team
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {[1, 2, 3].map((member) => (
            <div
              key={member}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 text-center"
            >
              <Image
                src={`/team/member${member}.jpg`}
                alt="Team Member"
                width={120}
                height={120}
                className="rounded-full mx-auto"
              />

              <h3 className="mt-5 text-xl font-semibold text-gray-900 dark:text-white">
                Team Member {member}
              </h3>

              <p className="text-gray-600 dark:text-gray-300">
                Frontend Developer
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="bg-[lab(45_11.18_-55.31)] py-20 mt-10">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-4xl font-bold text-white">
            Ready to Start Shopping?
          </h2>

          <p className="mt-5 text-blue-100">
            Discover thousands of amazing products at unbeatable prices.
          </p>

          <Link
            href="/contact"
            className="inline-block mt-8 bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </main>
  );
}
