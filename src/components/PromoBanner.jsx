"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Flame } from "lucide-react";

export default function PromoBanner() {
  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBestOffer();
  }, []);

  async function fetchBestOffer() {
    try {
      const res = await fetch("/api/home/best-offer");
      const data = await res.json();

      if (data.success) {
        setOffer(data.offer);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <section className="py-16 px-6 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="h-[420px] rounded-3xl bg-gray-200 dark:bg-gray-800 animate-pulse" />
        </div>
      </section>
    );
  }

  if (!offer) {
    return null;
  }

  return (
    <section className="py-16 px-6 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">

        <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-700 to-blue-500 shadow-2xl">

          <div className="grid md:grid-cols-2 gap-10 items-center p-8 md:p-14">

            {/* Left Side */}
            <div>

              <div className="inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-sm px-4 py-2 text-white">

                <Flame className="w-5 h-5 text-yellow-300" />

                <span className="font-semibold">
                  Today's Best Deal
                </span>

              </div>

              <h2 className="mt-6 text-4xl md:text-5xl font-bold leading-tight text-white">
                {offer.offer_title}
              </h2>

              <h3 className="mt-4 text-2xl font-semibold text-blue-100">
                {offer.product_name}
              </h3>

              <p className="mt-5 text-blue-100 text-lg leading-8">
                {offer.offer_description}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-5">

                <span className="rounded-full bg-yellow-400 px-5 py-2 text-2xl font-bold text-gray-900">
                  {offer.discount_percentage}% OFF
                </span>

                <div>

                  <p className="text-3xl font-bold text-white">
                    ₹{Number(offer.offer_price).toLocaleString()}
                  </p>

                  <p className="text-lg text-blue-100 line-through">
                    ₹{Number(offer.price).toLocaleString()}
                  </p>

                </div>

              </div>
                            <div className="mt-10 flex flex-wrap gap-4">

                <Link
                  href={`/product/${offer.product_id}`}
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 font-semibold text-blue-700 transition hover:bg-gray-100"
                >
                  Shop Now
                  <ArrowRight size={18} />
                </Link>

                <Link
                  href="/offers"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/40 px-8 py-4 font-semibold text-white backdrop-blur-sm transition hover:bg-white/10"
                >
                  See All Offers
                  <ArrowRight size={18} />
                </Link>

              </div>

            </div>

            {/* Right Side */}
            <div className="flex justify-center">

              <div className="relative">

                {/* Discount Badge */}
                <div className="absolute -top-5 -right-5 z-20 flex h-24 w-24 items-center justify-center rounded-full bg-yellow-400 shadow-xl">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">
                      {offer.discount_percentage}%
                    </p>
                    <p className="text-xs font-semibold text-gray-800">
                      OFF
                    </p>
                  </div>
                </div>

                {/* Product Image */}
                <div className="overflow-hidden rounded-3xl bg-white p-5 shadow-2xl">

                  <Image
                    src={offer.product_image || "/uploads/no-image.png"}
                    alt={offer.product_name}
                    width={500}
                    height={500}
                    priority
                    className="h-[380px] w-[380px] object-contain transition duration-500 hover:scale-105"
                  />

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}