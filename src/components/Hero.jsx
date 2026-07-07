import Image from "next/image";

export default function Hero() {
  return (
    <section className="bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-10 items-center">

          {/* Left Content */}
          <div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
              Discover Trending Products at the{" "}
              <span className="text-blue-600 dark:text-blue-400">
                Best Prices
              </span>
            </h1>

            <p className="mt-6 text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              Shop smart, save more, and enjoy fast delivery with ShopEase.
              Explore thousands of quality products across multiple categories,
              all in one place.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
                Shop Now
              </button>

              <button className="border-2 border-blue-600 text-blue-600 dark:text-blue-400 px-6 py-3 rounded-lg hover:bg-blue-600 hover:text-white transition">
                Explore Products
              </button>
            </div>
          </div>

          {/* Right Image */}
          <div className="flex justify-center">
            <Image
              src="/hero-banner.avif"
              alt="ShopEase Hero Banner"
              width={550}
              height={450}
              className="w-full rounded-xl animate-float"
              priority
            />
          </div>

        </div>
      </div>
    </section>
  );
}