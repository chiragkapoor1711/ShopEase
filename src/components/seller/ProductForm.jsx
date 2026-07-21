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
} from "lucide-react";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE_BYTES = 2 * 1024 * 1024; // 2MB

const initialForm = {
  main_category_id: "",
  category_id: "",
  product_name: "",
  product_image: "",
  description: "",
  price: "",
  stock: "",
  sku: "",
  brand: "",
  status: "Active",
};

function Field({ label, required, error, children }) {
  return (
    <div>
      <label className="block font-semibold text-sm text-gray-900 dark:text-gray-100 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

// BUG FIX: "border-#0c0c0c-300" / "text-#0a0a0a-900" / "text-#000000-900" are
// not valid Tailwind classes (you can't mix a raw hex with a -300/-900 scale
// suffix) — Tailwind silently drops unrecognized classes, so none of these
// borders/text colors were actually applied. Using real named shades below.
const inputClass =
  "w-full rounded-lg border-2 border-gray-400 dark:border-gray-600 px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 outline-none transition focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-500/30 focus:border-blue-500";
const inputErrorClass =
  "w-full rounded-lg border-2 border-red-500 px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 outline-none transition focus:ring-2 focus:ring-red-200 dark:focus:ring-red-500/30";

export default function ProductForm({ editingProduct, onCancelEdit, onSaved }) {
  const [formData, setFormData] = useState(initialForm);
  const [mainCategories, setMainCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [loadingMainCategories, setLoadingMainCategories] = useState(false);
  const [loadingSubCategories, setLoadingSubCategories] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [touched, setTouched] = useState({});

  const fileInputRef = useRef(null);
  const isEditing = Boolean(editingProduct);

  useEffect(() => {
    fetchMainCategories();
  }, []);

  async function fetchMainCategories() {
    try {
      setLoadingMainCategories(true);
      const res = await fetch("/api/main-categories");
      const data = await res.json();
      if (data.success) {
        setMainCategories(data.categories || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingMainCategories(false);
    }
  }

 async function fetchSubCategories(mainCategoryId) {
  if (!mainCategoryId) {
    setSubCategories([]);
    return;
  }

  try {
    setLoadingSubCategories(true);

    const res = await fetch(
      `/api/seller/sub-categories?mainCategory=${mainCategoryId}`,
      { credentials: "include" }
    );

    const data = await res.json();

    if (data.success) {
      const categories = data.categories || [];

      setSubCategories(categories);

      // Show toast if no subcategories exist
      if (categories.length === 0) {
        toast.error("Please create a sub category first.");
      }
    } else {
      setSubCategories([]);
      toast.error(data.message || "Failed to load sub categories.");
    }
  } catch (error) {
    console.error(error);
    setSubCategories([]);
    toast.error("Failed to load sub categories.");
  } finally {
    setLoadingSubCategories(false);
  }
}
  useEffect(() => {
    if (editingProduct) {
      setFormData({
        main_category_id: editingProduct.main_category_id || "",
        category_id: editingProduct.category_id || "",
        product_name: editingProduct.product_name,
        product_image: editingProduct.product_image || "",
        description: editingProduct.description || "",
        price: editingProduct.price,
        stock: editingProduct.stock,
        sku: editingProduct.sku || "",
        brand: editingProduct.brand || "",
        status: editingProduct.status,
      });
      setImagePreview(editingProduct.product_image || "");
      // Load the sub category list for the product's existing main category
      // so its current sub category shows up as selected, not blank.
      if (editingProduct.main_category_id) {
        fetchSubCategories(editingProduct.main_category_id);
      }
    } else {
      setFormData(initialForm);
      setImagePreview("");
      setSubCategories([]);
    }
    setTouched({});
  }, [editingProduct]);

  function handleChange(e) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleMainCategoryChange(e) {
    const value = e.target.value;
    // Changing the main category invalidates whatever sub category was
    // picked, since sub categories belong to exactly one main category.
    setFormData((prev) => ({ ...prev, main_category_id: value, category_id: "" }));
    fetchSubCategories(value);
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
    setSubCategories([]);
    setTouched({});
    onCancelEdit?.();
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setTouched({
      product_name: true,
      main_category_id: true,
      category_id: true,
      price: true,
    });

    if (!formData.product_name.trim()) {
      toast.error("Product name is required.");
      return;
    }
    if (!formData.main_category_id) {
      toast.error("Select Main Category");
      return;
    }
    if (!formData.category_id) {
      toast.error("Select Sub Category");
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
      setSubCategories([]);
      setTouched({});
      onSaved?.();
    } catch (err) {
      toast.error(err.message || "Something went wrong while saving.");
    } finally {
      setLoading(false);
    }
  }



  return (
    <form
      onSubmit={handleSubmit}
      className="w-full bg-white dark:bg-gray-900 rounded-2xl shadow-lg ring-1 ring-black/5 dark:ring-white/10 p-4 sm:p-5 lg:p-6"
    >
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
          {isEditing ? "Edit product" : "Add new product"}
        </h2>
        {isEditing && (
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
            Editing "{editingProduct.product_name}"
          </span>
        )}
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
        Fill in the details buyers will see on the product page.
      </p>

      {/* Single unified 2-column layout: left = all fields stacked, right = image matching that height */}
      <div className="flex flex-col md:flex-row gap-5 items-stretch">
        {/* Left: every field stacked, compact */}
        <div className="flex-1 flex flex-col gap-3.5 min-w-0">
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

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Field
              label="Main Category"
              required
              error={
                touched.main_category_id && !formData.main_category_id
                  ? "Select Main Category"
                  : null
              }
            >
              <select
                name="main_category_id"
                value={formData.main_category_id}
                onChange={handleMainCategoryChange}
                onBlur={() => markTouched("main_category_id")}
                className={
                  touched.main_category_id && !formData.main_category_id
                    ? inputErrorClass
                    : inputClass
                }
              >
                <option value="">
                  {loadingMainCategories ? "Loading..." : "Select Main Category"}
                </option>
                {mainCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.category_name}
                  </option>
                ))}
              </select>
            </Field>

            <Field
              label="Sub Category"
              required
              error={
                touched.category_id && !formData.category_id
                  ? "Select Sub Category"
                  : null
              }
            >
              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                onBlur={() => markTouched("category_id")}
                disabled={!formData.main_category_id || loadingSubCategories}
                className={`${
                  touched.category_id && !formData.category_id
                    ? inputErrorClass
                    : inputClass
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <option value="">
                  {!formData.main_category_id
                    ? "Select Main Category first"
                    : loadingSubCategories
                      ? "Loading..."
                      : "Select Sub Category"}
                </option>
                {subCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.category_name}
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

          <div className="grid grid-cols-2 gap-3">
            <Field
              label="Price"
              required
              error={touched.price && !formData.price ? "Price is required." : null}
            >
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
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

            
          </div>

          <div className="grid grid-cols-2 gap-3">
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

          <Field label="Description">
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="What makes this product worth buying?"
              className={`${inputClass} resize-none flex-1 min-h-[72px]`}
            />
          </Field>

          <div>
            <label className="block font-semibold text-sm text-gray-900 dark:text-gray-100 mb-1.5">
              Status
            </label>
            <div className="inline-flex rounded-lg border-2 border-gray-300 dark:border-gray-600 p-1 bg-gray-50 dark:bg-gray-800">
              {["Active", "Inactive"].map((option) => {
                const selected = formData.status === option;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, status: option }))}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-sm font-medium transition ${
                      selected
                        ? option === "Active"
                          ? "bg-white dark:bg-gray-700 text-emerald-700 dark:text-emerald-400 shadow-sm"
                          : "bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 shadow-sm"
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

        {/* Right: image box stretches to match the full height of the left column */}
        <div className="w-full md:w-64 lg:w-80 shrink-0 flex flex-col">
          <label className="block font-semibold text-sm text-gray-900 dark:text-gray-100 mb-1.5">
            Image
          </label>

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
            className={`relative w-full flex-1 min-h-[220px] rounded-lg border-2 border-dashed transition flex flex-col items-center justify-center overflow-hidden ${
              isDragging
                ? "border-blue-500 bg-blue-50 dark:bg-blue-500/10"
                : "border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 bg-gray-50 dark:bg-gray-800"
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

      <div className="flex flex-col-reverse sm:flex-row gap-3 mt-5 pt-4 border-t-2 border-gray-100 dark:border-gray-800">
        <button
          type="button"
          onClick={handleReset}
          disabled={loading}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 transition"
        >
          <RotateCcw size={16} />
          {isEditing ? "Cancel" : "Reset"}
        </button>

        <button
          type="submit"
          disabled={loading || uploading}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white px-5 py-2 rounded-lg transition text-sm font-medium shadow-sm sm:ml-auto"
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