"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Save, RotateCcw, Upload, Loader2 } from "lucide-react";

export default function ProductForm({ editingProduct, onCancelEdit, onSaved }) {
  const initialForm = {
    category_id: "",
    product_name: "",
    product_image: "",
    description: "",
    price: "",
    discount_price: "",
    stock: "",
    sku: "",
    brand: "",
    status: "Active",
  };

  const [formData, setFormData] = useState(initialForm);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [imagePreview, setImagePreview] = useState("");

  // ===============================
  // LOAD CATEGORIES
  // ===============================
  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    try {
      setLoadingCategories(true);

      const res = await fetch("/api/seller/categories", {
        credentials: "include",
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      setCategories(data.categories || []);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoadingCategories(false);
    }
  }

  // ===============================
  // LOAD PRODUCT FOR EDIT
  // ===============================
  useEffect(() => {
    if (editingProduct) {
      setFormData({
        category_id: editingProduct.category_id,
        product_name: editingProduct.product_name,
        product_image: editingProduct.product_image || "",
        description: editingProduct.description || "",
        price: editingProduct.price,
        discount_price: editingProduct.discount_price,
        stock: editingProduct.stock,
        sku: editingProduct.sku || "",
        brand: editingProduct.brand || "",
        status: editingProduct.status,
      });

      setImagePreview(editingProduct.product_image || "");
    } else {
      setFormData(initialForm);
      setImagePreview("");
    }
  }, [editingProduct]);

  // ===============================
  // INPUT CHANGE
  // ===============================
  function handleChange(e) {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  // ===============================
  // IMAGE CHANGE
  // ===============================
  async function handleImageChange(e) {
    const file = e.target.files[0];

    if (!file) return;

    // Preview
    setImagePreview(URL.createObjectURL(file));

    try {
      const uploadData = new FormData();
      uploadData.append("file", file);

      const res = await fetch("/api/seller/products/upload", {
        method: "POST",
        body: uploadData,
      });

      const data = await res.json();

      if (!data.success) {
        toast.error(data.message);
        return;
      }

      // Save image path in formData
      setFormData((prev) => ({
        ...prev,
        product_image: data.imageUrl,
      }));

      toast.success("Image uploaded successfully.");
    } catch (error) {
      console.error(error);
      toast.error("Image upload failed.");
    }
  }
  // ===============================
  // RESET
  // ===============================
  function handleReset() {
    setFormData(initialForm);
    setImagePreview("");

    if (onCancelEdit) {
      onCancelEdit();
    }
  }

  // ===============================
  // SUBMIT
  // ===============================
  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setLoading(true);

      const url = editingProduct
        ? `/api/seller/products/${editingProduct.id}`
        : "/api/seller/products";

      const method = editingProduct ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      toast.success(data.message);

      setFormData(initialForm);
      setImagePreview("");

      if (onSaved) {
        onSaved();
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 max-w-full overflow-x-hidden"
    >
      <h2 className="text-lg sm:text-xl lg:text-2xl font-bold mb-6 dark:text-white">
        {editingProduct ? "Edit Product" : "Add New Product"}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Product Name */}
        <div>
          <label className="font-medium dark:text-white">Product Name</label>

          <input
            type="text"
            name="product_name"
            value={formData.product_name}
            onChange={handleChange}
            placeholder="Enter Product Name"
            className="w-full mt-2 border rounded-xl p-3 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            required
          />
        </div>

        {/* Category */}
        <div>
          <label className="font-medium dark:text-white">Category</label>

          <select
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
            className="w-full mt-2 border rounded-xl p-3 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            required
          >
            <option value="">
              {loadingCategories ? "Loading Categories..." : "Select Category"}
            </option>

            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.category_name}
              </option>
            ))}
          </select>
        </div>

        {/* Product Image */}
        <div>
          <label className="font-medium dark:text-white">Product Image</label>

          <label className="mt-2 border-2 border-dashed rounded-xl p-6 flex flex-col items-center cursor-pointer hover:border-blue-500 transition">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-lg mb-3"
              />
            ) : (
              <Upload size={28} className="text-blue-600" />
            )}

            <span className="mt-2 text-gray-500">Upload Product Image</span>

            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
        </div>

        {/* Brand */}
        <div>
          <label className="font-medium dark:text-white">Brand</label>

          <input
            type="text"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            placeholder="Apple"
            className="w-full mt-2 border rounded-xl p-3 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label className="font-medium dark:text-white">Description</label>

          <textarea
            rows={5}
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter Product Description..."
            className="w-full mt-2 border rounded-xl p-3 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />
        </div>

        {/* Price */}
        <div>
          <label className="font-medium dark:text-white">Price</label>

          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="999"
            className="w-full mt-2 border rounded-xl p-3 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            required
          />
        </div>

        {/* Discount Price */}
        <div>
          <label className="font-medium dark:text-white">Discount Price</label>

          <input
            type="number"
            name="discount_price"
            value={formData.discount_price}
            onChange={handleChange}
            placeholder="799"
            className="w-full mt-2 border rounded-xl p-3 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />
        </div>

        {/* Stock */}
        <div>
          <label className="font-medium dark:text-white">Stock Quantity</label>

          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            placeholder="50"
            className="w-full mt-2 border rounded-xl p-3 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />
        </div>

        {/* SKU */}
        <div>
          <label className="font-medium dark:text-white">SKU</label>

          <input
            type="text"
            name="sku"
            value={formData.sku}
            onChange={handleChange}
            placeholder="SKU001"
            className="w-full mt-2 border rounded-xl p-3 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />
        </div>

        {/* Status */}
        <div>
          <label className="font-medium dark:text-white">Status</label>

          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full mt-2 border rounded-xl p-3 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mt-8">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              {editingProduct ? "Updating..." : "Saving..."}
            </>
          ) : (
            <>
              <Save size={18} />
              {editingProduct ? "Update Product" : "Save Product"}
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleReset}
          className="flex items-center justify-center gap-2 bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white px-6 py-3 rounded-xl transition"
        >
          <RotateCcw size={18} />
          {editingProduct ? "Cancel" : "Reset"}
        </button>
      </div>
    </form>
  );
}
