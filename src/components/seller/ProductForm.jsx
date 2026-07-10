"use client";

import { useState } from "react";
import {
  Save,
  RotateCcw,
  Upload,
} from "lucide-react";

export default function ProductForm() {
  const [formData, setFormData] = useState({
    productName: "",
    category: "",
    description: "",
    price: "",
    discountPrice: "",
    stock: "",
    sku: "",
    brand: "",
    status: "Active",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleReset = () => {
    setFormData({
      productName: "",
      category: "",
      description: "",
      price: "",
      discountPrice: "",
      stock: "",
      sku: "",
      brand: "",
      status: "Active",
    });
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 max-w-full overflow-x-hidden">

      <h2 className="text-lg sm:text-xl lg:text-2xl font-bold mb-5 sm:mb-6 lg:mb-8 dark:text-white">
        Add New Product
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">

        {/* Product Name */}
        <div>
          <label className="font-medium dark:text-white text-sm sm:text-base">
            Product Name
          </label>

          <input
            type="text"
            name="productName"
            value={formData.productName}
            onChange={handleChange}
            placeholder="Enter product name"
            className="w-full mt-2 border rounded-xl p-2.5 sm:p-3 text-sm sm:text-base dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />
        </div>

        {/* Category */}
        <div>
          <label className="font-medium dark:text-white text-sm sm:text-base">
            Category
          </label>

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full mt-2 border rounded-xl p-2.5 sm:p-3 text-sm sm:text-base dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          >
            <option value="">Select Category</option>
            <option>Electronics</option>
            <option>Fashion</option>
            <option>Home</option>
            <option>Beauty</option>
          </select>
        </div>

        {/* Product Image */}
        <div>
          <label className="font-medium dark:text-white text-sm sm:text-base">
            Product Image
          </label>

          <label className="mt-2 border-2 border-dashed rounded-xl p-4 sm:p-6 flex flex-col items-center cursor-pointer hover:border-blue-500 transition">

            <Upload className="text-blue-600" size={20} />

            <span className="mt-2 text-gray-500 text-sm sm:text-base text-center">
              Upload Product Image
            </span>

            <input
              type="file"
              className="hidden"
            />

          </label>
        </div>

        {/* Brand */}
        <div>
          <label className="font-medium dark:text-white text-sm sm:text-base">
            Brand
          </label>

          <input
            type="text"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            placeholder="Apple"
            className="w-full mt-2 border rounded-xl p-2.5 sm:p-3 text-sm sm:text-base dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />
        </div>

        {/* Description */}
        <div className="md:col-span-2">

          <label className="font-medium dark:text-white text-sm sm:text-base">
            Description
          </label>

          <textarea
            rows="5"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Product description..."
            className="w-full mt-2 border rounded-xl p-2.5 sm:p-3 text-sm sm:text-base dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          ></textarea>

        </div>

        {/* Price */}
        <div>
          <label className="font-medium dark:text-white text-sm sm:text-base">
            Price
          </label>

          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="999"
            className="w-full mt-2 border rounded-xl p-2.5 sm:p-3 text-sm sm:text-base dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />
        </div>

        {/* Discount Price */}
        <div>
          <label className="font-medium dark:text-white text-sm sm:text-base">
            Discount Price
          </label>

          <input
            type="number"
            name="discountPrice"
            value={formData.discountPrice}
            onChange={handleChange}
            placeholder="799"
            className="w-full mt-2 border rounded-xl p-2.5 sm:p-3 text-sm sm:text-base dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />
        </div>

        {/* Stock */}
        <div>
          <label className="font-medium dark:text-white text-sm sm:text-base">
            Stock Quantity
          </label>

          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            placeholder="50"
            className="w-full mt-2 border rounded-xl p-2.5 sm:p-3 text-sm sm:text-base dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />
        </div>

        {/* SKU */}
        <div>
          <label className="font-medium dark:text-white text-sm sm:text-base">
            SKU
          </label>

          <input
            type="text"
            name="sku"
            value={formData.sku}
            onChange={handleChange}
            placeholder="SKU001"
            className="w-full mt-2 border rounded-xl p-2.5 sm:p-3 text-sm sm:text-base dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />
        </div>

        {/* Status */}
        <div>
          <label className="font-medium dark:text-white text-sm sm:text-base">
            Status
          </label>

          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full mt-2 border rounded-xl p-2.5 sm:p-3 text-sm sm:text-base dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          >
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>

      </div>

      {/* Buttons */}

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-8 sm:mt-10">

        <button
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition text-sm sm:text-base"
        >
          <Save size={18} />

          Save Product
        </button>

        <button
          onClick={handleReset}
          className="flex items-center justify-center gap-2 bg-gray-300 dark:bg-gray-700 dark:text-white px-6 py-3 rounded-xl hover:bg-gray-400 transition text-sm sm:text-base"
        >
          <RotateCcw size={18} />

          Reset
        </button>

      </div>

    </div>
  );
}