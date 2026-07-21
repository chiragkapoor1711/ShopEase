"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgePercent } from "lucide-react";

export default function OffersPage() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOffers();
  }, []);

  async function fetchOffers() {
    try {
      const res = await fetch("/api/home/offers");
      const data = await res.json();

      if (data.success) {
        setOffers(data.offers);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-96 rounded-2xl bg-gray-200 dark:bg-gray-800 animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}
        <div className="text-center mb-14">

          <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-5 py-2 rounded-full font-semibold">
            <BadgePercent size={18} />
            Today's Deals
          </div>

          <h1 className="mt-6 text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
            Best Offers
          </h1>

          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Grab the hottest discounts before they expire.
          </p>

        </div>

        {/* Empty */}
        {offers.length === 0 && (
          <div className="text-center py-20">

            <BadgePercent
              size={70}
              className="mx-auto text-blue-500"
            />

            <h2 className="mt-6 text-2xl font-bold text-gray-800 dark:text-white">
              No Active Offers
            </h2>

            <p className="mt-3 text-gray-500">
              Please check back later.
            </p>

          </div>
        )}

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

          {offers.map((offer) => (
            <div
              key={offer.id}
              className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300"
            >
              {/* Image */}
              <div className="relative h-72">

                <Image
                  src={offer.product_image || "/uploads/no-image.png"}
                  alt={offer.product_name}
                  fill
                  className="object-cover group-hover:scale-105 transition duration-500"
                />

                <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-full font-bold">
                  {offer.discount_percentage}% OFF
                </div>

              </div>

              {/* Content */}
              <div className="p-6">

                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {offer.product_name}
                </h2>

                <p className="mt-2 text-gray-500 dark:text-gray-400 line-clamp-2">
                  {offer.offer_description}
                </p>

                <div className="mt-5 flex items-center gap-3">

                  <span className="text-3xl font-bold text-blue-600">
                    ₹{Number(offer.offer_price).toLocaleString()}
                  </span>

                  <span className="line-through text-gray-400">
                    ₹{Number(offer.price).toLocaleString()}
                  </span>

                </div>

                <Link
                  href={`/product/${offer.product_id}`}
                  className="mt-6 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl transition"
                >
                  Shop Now
                  <ArrowRight size={18} />
                </Link>

              </div>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}