"use client";

import { useState } from "react";
import ReviewCard from "./ReviewCard";

export default function ProductTabs({ product }) {
  const [activeTab, setActiveTab] = useState("description");

  return (
    <div className="mt-16">
      {/* Tabs */}
      <div className="border-b flex gap-8 overflow-x-auto">
        <button
          onClick={() => setActiveTab("description")}
          className={`pb-3 font-semibold whitespace-nowrap transition ${
            activeTab === "description"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500"
          }`}
        >
          Description
        </button>

        <button
          onClick={() => setActiveTab("specifications")}
          className={`pb-3 font-semibold whitespace-nowrap transition ${
            activeTab === "specifications"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500"
          }`}
        >
          Specifications
        </button>

        <button
          onClick={() => setActiveTab("reviews")}
          className={`pb-3 font-semibold whitespace-nowrap transition ${
            activeTab === "reviews"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500"
          }`}
        >
          Reviews
        </button>
      </div>

      {/* Description */}
      {activeTab === "description" && (
        <div className="mt-8 bg-white border rounded-xl p-6">
          <h2 className="text-2xl font-semibold mb-4">
            Product Description
          </h2>

          <p className="text-gray-600 leading-8">
            {product.description}
          </p>
        </div>
      )}

      {/* Specifications */}
      {activeTab === "specifications" && (
        <div className="mt-8 bg-white border rounded-xl p-6">
          <h2 className="text-2xl font-semibold mb-6">
            Specifications
          </h2>

          <div className="grid grid-cols-2 gap-4">

            <div className="font-semibold">Brand</div>
            <div>{product.brand}</div>

            <div className="font-semibold">Main Category</div>
            <div>{product.main_category}</div>

            <div className="font-semibold">Sub Category</div>
            <div>{product.sub_category}</div>

            <div className="font-semibold">Stock</div>
            <div>{product.stock}</div>

            <div className="font-semibold">SKU</div>
            <div>{product.sku}</div>

          </div>
        </div>
      )}

      {/* Reviews */}
      {activeTab === "reviews" && (
        <div className="mt-8 space-y-6">

          <ReviewCard
            name="Rahul Sharma"
            rating={5}
            date="12 July 2026"
            comment="Excellent quality product. Fast delivery and premium build quality."
          />

          <ReviewCard
            name="Aman Verma"
            rating={4}
            date="05 July 2026"
            comment="Good value for money. Packaging was also good."
          />

          <ReviewCard
            name="Priya Kapoor"
            rating={5}
            date="28 June 2026"
            comment="Highly recommended. Will purchase again."
          />

          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition"
          >
            Write a Review
          </button>

        </div>
      )}
    </div>
  );
}