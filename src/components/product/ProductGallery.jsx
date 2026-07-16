"use client";

import { useState } from "react";
import Image from "next/image";

export default function ProductGallery({ product }) {
  const [selectedImage, setSelectedImage] = useState(
    product?.product_image || ""
  );

  const images = [
    product.product_image,
    product.product_image,
    product.product_image,
    product.product_image,
  ];

  return (
    <div className="space-y-4">
      {/* Large Image */}
      <div className="border rounded-xl bg-white overflow-hidden flex items-center justify-center h-[500px]">
        <Image
          src={selectedImage}
          alt={product.product_name}
          width={500}
          height={500}
          className="object-contain transition duration-300 hover:scale-105"
        />
      </div>

      {/* Thumbnail Gallery */}
      <div className="flex gap-3">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(image)}
            className={`border rounded-lg p-1 ${
              selectedImage === image
                ? "border-blue-600"
                : "border-gray-300"
            }`}
          >
            <Image
              src={image}
              alt={`Thumbnail ${index + 1}`}
              width={80}
              height={80}
              className="w-20 h-20 object-cover rounded"
            />
          </button>
        ))}
      </div>
    </div>
  );
}