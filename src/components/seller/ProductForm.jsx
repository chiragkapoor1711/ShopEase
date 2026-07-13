"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import {
  Save,
  RotateCcw,
  ImageUp,
  X,
  Check,
  Loader2,
  Tag,
  Package,
} from "lucide-react";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE_BYTES = 2 * 1024 * 1024; // 2MB

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

function SectionHeading({ icon: Icon, title, subtitle }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center shrink-0">
        <Icon size={14} className="text-blue-600 dark:text-blue-400" />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">
          {title}
        </h3>
        {subtitle && (
          <p className="text-xs text-gray-400 leading-tight">{subtitle}</p>
        )}
      </div>
    </div>
  );
}

function Field({ label, required, error, children }) {
  return (
    <div>
      <label className="block font-medium text-sm text-gray-900 dark:text-white mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1.5">{error}</p>}
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-gray-200 dark:border-gray-700 p-3 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 outline-none transition focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-500/30 focus:border-blue-400";
const inputErrorClass =
  "w-full rounded-xl border border-red-400 p-3 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 outline-none transition focus:ring-2 focus:ring-red-200 dark:focus:ring-red-500/30";

export default function ProductForm({ editingProduct, onCancelEdit, onSaved }) {
  const [formData, setFormData] = useState(initialForm);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [touched, setTouched] = useState({});

  const fileInputRef = useRef(null);
  const isEditing = Boolean(editingProduct);

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
      if (!data.success) throw new Error(data.message);
      setCategories(data.categories || []);
    } catch (err) {
      toast.error(err.message || "Failed to load categories.");
    } finally {
      setLoadingCategories(false);
    }
  }

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
    setTouched({});
  }, [editingProduct]);

  function handleChange(e) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function markTouched(field) {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }

  function validateFile(file) {
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error("Only JPG, PNG, or WEBP images are allowed.");
      return false;
    }
    if (file.size > MAX_SIZE_BYTES) {
      toast.error("Image must be smaller than 2MB.");
      return false;
    }
    return true;
  }

  async function uploadFile(file) {
    if (!validateFile(file)) return;

    const localPreview = URL.createObjectURL(file);
    setImagePreview(localPreview);

    const uploadData = new FormData();
    uploadData.append("file", file);

    setUploading(true);
    try {
      const res = await fetch("/api/seller/products/upload", {
        method: "POST",
        credentials: "include",
        body: uploadData,
      });
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to upload image.");
      }

      setFormData((prev) => ({ ...prev, product_image: data.imageUrl }));
      setImagePreview(data.imageUrl);
      toast.success("Image uploaded.");
    } catch (err) {
      toast.error(err.message || "Image upload failed.");
      setImagePreview(formData.product_image || "");
    } finally {
      setUploading(false);
    }
  }

  function handleImageChange(e) {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
    e.target.value = "";
  }

  function handleDrop(e) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  }

  function removeImage(e) {
    e.stopPropagation();
    setImagePreview("");
    setFormData((prev) => ({ ...prev, product_image: "" }));
  }

  function handleReset() {
    setFormData(initialForm);
    setImagePreview("");
    setTouched({});
    onCancelEdit?.();
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setTouched({
      product_name: true,
      category_id: true,
      price: true,
    });

    if (!formData.product_name.trim()) {
      toast.error("Product name is required.");
      return;
    }
    if (!formData.category_id) {
      toast.error("Please select a category.");
      return;
    }
    if (!formData.price) {
      toast.error("Price is required.");
      return;
    }
    if (uploading) {
      toast.error("Please wait for the image to finish uploading.");
      return;
    }

    try {
      setLoading(true);

      const url = editingProduct
        ? `/api/seller/products/${editingProduct.id}`
        : "/api/seller/products";
      const method = editingProduct ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      toast.success(data.message || (editingProduct ? "Product updated." : "Product created."));
      setFormData(initialForm);
      setImagePreview("");
      setTouched({});
      onSaved?.();
    } catch (err) {
      toast.error(err.message || "Something went wrong while saving.");
    } finally {
      setLoading(false);
    }
  }

  const price = parseFloat(formData.price);
  const discountPrice = parseFloat(formData.discount_price);
  const hasValidDiscount =
    !isNaN(price) && !isNaN(discountPrice) && discountPrice > 0 && discountPrice < price;
  const discountPercent = hasValidDiscount
    ? Math.round(((price - discountPrice) / price) * 100)
    : null;
  const discountInvalid =
    !isNaN(price) && !isNaN(discountPrice) && discountPrice > 0 && discountPrice >= price;

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg ring-1 ring-black/5 dark:ring-white/10 p-5 sm:p-7 lg:p-8 max-w-full overflow-x-hidden"
    >
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 dark:text-white">
          {isEditing ? "Edit product" : "Add new product"}
        </h2>
        {isEditing && (
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
            Editing “{editingProduct.product_name}”
          </span>
        )}
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 sm:mb-8">
        Fill in the details buyers will see on the product page.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_220px] gap-6 sm:gap-8">
        {/* Left: identity + description */}
        <div className="flex flex-col gap-6">
          <div>
            <SectionHeading
              icon={Tag}
              title="Product details"
              subtitle="Name, category, and brand"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <Field
                  label="Product name"
                  required
                  error={touched.product_name && !formData.product_name.trim() ? "Product name is required." : null}
                >
                  <input
                    type="text"
                    name="product_name"
                    value={formData.product_name}
                    onChange={handleChange}
                    onBlur={() => markTouched("product_name")}
                    placeholder="e.g. Wireless Headphones"
                    className={
                      touched.product_name && !formData.product_name.trim()
                        ? inputErrorClass
                        : inputClass
                    }
                  />
                </Field>
              </div>

              <Field
                label="Category"
                required
                error={touched.category_id && !formData.category_id ? "Please select a category." : null}
              >
                <select
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleChange}
                  onBlur={() => markTouched("category_id")}
                  className={
                    touched.category_id && !formData.category_id
                      ? inputErrorClass
                      : inputClass
                  }
                >
                  <option value="">
                    {loadingCategories ? "Loading categories..." : "Select category"}
                  </option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.category_name}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Brand">
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  placeholder="Apple"
                  className={inputClass}
                />
              </Field>
            </div>
          </div>

          <div>
            <Field label="Description">
              <textarea
                rows={5}
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="What makes this product worth buying?"
                className={`${inputClass} resize-none`}
              />
            </Field>
          </div>
        </div>

        {/* Right: image uploader */}
        <div>
          <SectionHeading icon={ImageUp} title="Image" />

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleImageChange}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`relative w-full aspect-square rounded-xl border-2 border-dashed transition flex flex-col items-center justify-center overflow-hidden ${
              isDragging
                ? "border-blue-400 bg-blue-50 dark:bg-blue-500/10"
                : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-gray-50 dark:bg-gray-800"
            }`}
          >
            {imagePreview ? (
              <>
                <Image
                  src={imagePreview}
                  alt="Product preview"
                  fill
                  unoptimized={imagePreview.startsWith("blob:")}
                  className="object-cover"
                />
                {uploading && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Loader2 size={22} className="animate-spin text-white" />
                  </div>
                )}
                {!uploading && (
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-black/60 hover:bg-black/75 text-white rounded-full p-1.5 transition"
                    aria-label="Remove image"
                  >
                    <X size={14} />
                  </span>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center gap-2 px-4 text-center">
                <ImageUp size={26} className="text-gray-400" />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  <span className="text-blue-600 dark:text-blue-400 font-medium">
                    Click to upload
                  </span>{" "}
                  or drag and drop
                </p>
                <p className="text-[11px] text-gray-400">JPG, PNG, WEBP · up to 2MB</p>
              </div>
            )}
          </button>
        </div>
      </div>

      <div className="mt-6 sm:mt-8">
        <SectionHeading
          icon={Package}
          title="Pricing & inventory"
          subtitle="Price, stock, and identifiers"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Field
            label="Price"
            required
            error={touched.price && !formData.price ? "Price is required." : null}
          >
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                ₹
              </span>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                onBlur={() => markTouched("price")}
                placeholder="999"
                className={`${
                  touched.price && !formData.price ? inputErrorClass : inputClass
                } pl-7`}
              />
            </div>
          </Field>

          <Field
            label="Discount price"
            error={discountInvalid ? "Must be lower than the price." : null}
          >
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                ₹
              </span>
              <input
                type="number"
                name="discount_price"
                value={formData.discount_price}
                onChange={handleChange}
                placeholder="799"
                className={`${discountInvalid ? inputErrorClass : inputClass} pl-7`}
              />
              {discountPercent !== null && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  −{discountPercent}%
                </span>
              )}
            </div>
          </Field>

          <Field label="Stock quantity">
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              placeholder="50"
              className={inputClass}
            />
          </Field>

          <Field label="SKU">
            <input
              type="text"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              placeholder="SKU001"
              className={inputClass}
            />
          </Field>
        </div>

        <div className="mt-4">
          <label className="block font-medium text-sm text-gray-900 dark:text-white mb-2">
            Status
          </label>
          <div className="inline-flex rounded-xl border border-gray-200 dark:border-gray-700 p-1 bg-gray-50 dark:bg-gray-800">
            {["Active", "Inactive"].map((option) => {
              const selected = formData.status === option;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, status: option }))}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition ${
                    selected
                      ? option === "Active"
                        ? "bg-white dark:bg-gray-700 text-emerald-700 dark:text-emerald-400 shadow-sm"
                        : "bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-300 shadow-sm"
                      : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                  }`}
                >
                  {selected && <Check size={14} />}
                  {option}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex flex-col-reverse sm:flex-row gap-3 mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
        <button
          type="button"
          onClick={handleReset}
          disabled={loading}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 transition"
        >
          <RotateCcw size={16} />
          {isEditing ? "Cancel" : "Reset"}
        </button>

        <button
          type="submit"
          disabled={loading || uploading}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-xl transition text-sm font-medium shadow-sm sm:ml-auto"
        >
          {loading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Save size={16} />
          )}
          {loading
            ? isEditing
              ? "Updating..."
              : "Saving..."
            : isEditing
            ? "Update product"
            : "Save product"}
        </button>
      </div>
    </form>
  );
}