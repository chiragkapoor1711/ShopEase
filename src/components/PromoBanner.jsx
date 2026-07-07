import Image from "next/image";

export default function PromoBanner() {
  return (
    <section className="py-16 px-6">
      <div className="max-w-7xl mx-auto">

        <div className="bg-linear-to-r from-blue-600 via-#461ef8-500 to-[#536cfd] rounded-3xl overflow-hidden shadow-2xl">

          <div className="grid md:grid-cols-2 items-center gap-10 p-8 md:p-14">

            {/* Left Content */}
            <div>

              <span className="inline-block bg-white text-blue-600 font-semibold px-4 py-2 rounded-full">
                Limited Time Offer
              </span>

              <h2 className="text-4xl md:text-5xl font-bold text-white mt-6 leading-tight">
                Get up to
                <span className="text-yellow-300"> 50% Off </span>
                on Selected Products
              </h2>

              <p className="mt-5 text-blue-100 text-lg leading-8">
                Upgrade your lifestyle with premium products at unbeatable
                prices. Shop today and enjoy exclusive discounts before the
                offer ends.
              </p>

              <button className="mt-8 bg-[lab(100_0_0)] hover:bg-yellow-500 text-black font-semibold px-8 py-4 rounded-xl transition duration-300">
                Shop Now
              </button>

            </div>

            {/* Right Image */}
            <div className="flex justify-center">

              <Image
                src="/hero-banner.avif"
                alt="Promotion Banner"
                width={500}
                height={450}
                className="w-full max-w-md object-contain rounded-xl"
                priority
              />

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}