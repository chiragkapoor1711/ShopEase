"use client";

import Link from "next/link";
import { BadgePercent, Plus, Search, Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";

export default function SellerOffersPage() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOffers();
  }, []);

  async function deleteOffer(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this offer?",
    );

    if (!confirmed) return;

    try {
      const res = await fetch(`/api/seller/offers/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!data.success) {
        toast.error(data.message);
        return;
      }

      toast.success(data.message);

      fetchOffers(); // Refresh the offers list
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete offer.");
    }
  }

  async function fetchOffers() {
    try {
      const res = await fetch("/api/seller/offers");
      const data = await res.json();

      if (data.success) {
        setOffers(data.offers);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to load offers.");
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Offers
          </h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Manage promotional offers for your products.
          </p>
        </div>

        <Link
          href="/seller/offers/add"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-white font-medium hover:bg-blue-700 transition"
        >
          <Plus size={18} />
          Add Offer
        </Link>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          placeholder="Search offers..."
          className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 py-2.5 pl-10 pr-4 text-gray-900 dark:text-white outline-none focus:border-blue-500"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
        <table className="min-w-full">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                Product
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                Offer
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                Discount
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                Status
              </th>

              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 dark:text-gray-200">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {offers.length > 0 ? (
              offers.map((offer) => (
                <tr
                  key={offer.id}
                  className="border-t border-gray-200 dark:border-gray-700"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Image
                        src={offer.product_image || "/uploads/no-image.png"}
                        alt={offer.product_name}
                        width={60}
                        height={60}
                        className="rounded-lg object-cover"
                      />

                      <span className="font-medium">{offer.product_name}</span>
                    </div>
                  </td>

                  <td className="px-6 py-4">{offer.offer_title}</td>

                  <td className="px-6 py-4">{offer.discount_percentage}%</td>

                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        offer.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {offer.status}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-3">
                      <Link
                        href={`/seller/offers/edit/${offer.id}`}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Pencil size={18} />
                      </Link>

                      <button
                        onClick={() => deleteOffer(offer.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5}>
                  <div className="py-16 text-center">
                    <BadgePercent size={50} className="mx-auto text-blue-500" />

                    <h2 className="mt-5 text-xl font-semibold">
                      No Offers Found
                    </h2>

                    <p className="text-gray-500 mt-2">
                      Create your first promotional offer.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
