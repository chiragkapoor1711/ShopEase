"use client";

import { useState } from "react";
import {
  Store,
  User,
  Mail,
  Phone,
  MapPin,
  Upload,
  Save,
  RotateCcw,
} from "lucide-react";

export default function SettingsPage() {
  const [storeLogo, setStoreLogo] = useState(null);

  return (
    <div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold dark:text-white">
          Store Settings
        </h1>

        <p className="text-gray-500 mt-2">
          Manage your store information and business details.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">

        {/* Store Profile Card */}

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 h-fit">

          <div className="flex flex-col items-center">

            <div className="w-32 h-32 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden border-4 border-blue-100">

              {storeLogo ? (
                <img
                  src={URL.createObjectURL(storeLogo)}
                  alt="Store Logo"
                  className="w-full h-full object-cover"
                />
              ) : (
                <Store size={60} className="text-blue-600" />
              )}

            </div>

            <label className="mt-6 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl transition flex items-center gap-2">

              <Upload size={18} />

              Upload Logo

              <input
                type="file"
                hidden
                onChange={(e) =>
                  setStoreLogo(e.target.files[0])
                }
              />

            </label>

            <h2 className="text-xl font-bold mt-6 dark:text-white">
              ShopEase Store
            </h2>

            <p className="text-gray-500 mt-2 text-center">
              Seller Profile
            </p>

          </div>

        </div>

        {/* Form */}

        <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8">

          <h2 className="text-2xl font-bold dark:text-white mb-8">
            Store Information
          </h2>

          <div className="grid md:grid-cols-2 gap-6">

            {/* Store Name */}

            <div>

              <label className="font-medium dark:text-white flex items-center gap-2">
                <Store size={18} />
                Store Name
              </label>

              <input
                type="text"
                defaultValue="ShopEase Electronics"
                className="w-full mt-2 border rounded-xl p-3 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />

            </div>

            {/* Owner */}

            <div>

              <label className="font-medium dark:text-white flex items-center gap-2">
                <User size={18} />
                Owner Name
              </label>

              <input
                type="text"
                defaultValue="Chirag Kapoor"
                className="w-full mt-2 border rounded-xl p-3 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />

            </div>

            {/* Email */}

            <div>

              <label className="font-medium dark:text-white flex items-center gap-2">
                <Mail size={18} />
                Email
              </label>

              <input
                type="email"
                defaultValue="chirag@gmail.com"
                className="w-full mt-2 border rounded-xl p-3 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />

            </div>

            {/* Mobile */}

            <div>

              <label className="font-medium dark:text-white flex items-center gap-2">
                <Phone size={18} />
                Mobile Number
              </label>

              <input
                type="text"
                defaultValue="9876543210"
                className="w-full mt-2 border rounded-xl p-3 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />

            </div>

            {/* Address */}

            <div className="md:col-span-2">

              <label className="font-medium dark:text-white flex items-center gap-2">
                <MapPin size={18} />
                Store Address
              </label>

              <textarea
                rows="4"
                defaultValue="Ambala, Haryana, India"
                className="w-full mt-2 border rounded-xl p-3 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />

            </div>

            {/* Description */}

            <div className="md:col-span-2">

              <label className="font-medium dark:text-white">
                Business Description
              </label>

              <textarea
                rows="5"
                placeholder="Write about your store..."
                className="w-full mt-2 border rounded-xl p-3 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />

            </div>

          </div>

          {/* Buttons */}

          <div className="flex gap-4 mt-8">

            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition">

              <Save size={18} />

              Save Changes

            </button>

            <button className="flex items-center gap-2 bg-gray-300 dark:bg-gray-700 dark:text-white hover:bg-gray-400 px-6 py-3 rounded-xl transition">

              <RotateCcw size={18} />

              Reset

            </button>

          </div>

        </div>

      </div>

    </div>
  );
}