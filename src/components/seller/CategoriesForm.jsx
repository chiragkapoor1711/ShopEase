"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import {
  PlusCircle,
  RotateCcw,
  Loader2,
  ImageUp,
  X,
  Check,
} from "lucide-react";

const EMPTY_FORM = {
  category_name: "",
  description: "",
  status: "Active",
  category_image: "", // relative path returned by the upload endpoint
};

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE_BYTES = 2 * 1024 * 1024; // 2MB
const MAX_DESCRIPTION_LENGTH = 300;

export default function CategoriesForm({ editingCategory, onCancelEdit, onSaved }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [imagePreview, setImagePreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [nameTouched, setNameTouched] = useState(false);

  const fileInputRef = useRef(null);
  const isEditing = Boolean(editingCategory);
  const nameInvalid = nameTouched && !form.category_name.trim();

  useEffect(() => {
    if (editingCategory) {
      setForm({
        category_name: editingCategory.category_name || "",
        description: editingCategory.description || "",
        status: editingCategory.status || "Active",
        category_image: editingCategory.category_image || "",
      });
      setImagePreview(editingCategory.category_image || "");
    } else {
      setForm(EMPTY_FORM);
      setImagePreview("");
    }
    setNameTouched(false);
  }, [editingCategory]);

  function handleFieldChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function resetForm() {
    setForm(EMPTY_FORM);
    setImagePreview("");
    setNameTouched(false);
    onCancelEdit?.();
  }

  function validateAndPreview(file) {
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
    if (!validateAndPreview(file)) return;

    const localPreview = URL.createObjectURL(file);
    setImagePreview(localPreview);

    const body = new FormData();
    body.append("image", file);

    setUploading(true);
    try {
      const res = await fetch("/api/seller/categories/upload", {
        method: "POST",
        credentials: "include",
        body,
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to upload image.");
      }

      setForm((prev) => ({ ...prev, category_image: data.url }));
      setImagePreview(data.url);
    } catch (err) {
      toast.error(err.message || "Image upload failed.");
      setImagePreview(form.category_image || "");
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
    setForm((prev) => ({ ...prev, category_image: "" }));
  }

  async function handleSave() {
    setNameTouched(true);

    if (!form.category_name.trim()) {
      toast.error("Category name is required.");
      return;
    }
    if (form.description.length > MAX_DESCRIPTION_LENGTH) {
      toast.error(`Description must be under ${MAX_DESCRIPTION_LENGTH} characters.`);
      return;
    }
    if (uploading) {
      toast.error("Please wait for the image to finish uploading.");
      return;
    }

    setSaving(true);
    try {
      const url = isEditing
        ? `/api/seller/categories/${editingCategory.id}`
        : "/api/seller/categories";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to save category.");
      }

      toast.success(isEditing ? "Category updated." : "Category created.");
      resetForm();
      onSaved?.();
    } catch (err) {
      toast.error(err.message || "Something went wrong while saving.");
    } finally {
      setSaving(false);
    }
  }

  const descriptionCount = form.description.length;
  const descriptionNearLimit = descriptionCount > MAX_DESCRIPTION_LENGTH * 0.9;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg ring-1 ring-black/5 dark:ring-white/10 p-5 sm:p-7 lg:p-8">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 dark:text-white">
          {isEditing ? "Edit category" : "Add category"}
        </h2>
        {isEditing && (
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
            Editing “{editingCategory.category_name}”
          </span>
        )}
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 sm:mb-8">
        Categories help shoppers browse your catalog. Give this one a clear name and image.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_220px] gap-6 sm:gap-8">
        {/* Left column: name + description + status */}
        <div className="flex flex-col gap-5 sm:gap-6 order-2 md:order-1">
          <div>
            <label className="block font-medium text-sm text-gray-900 dark:text-white mb-2">
              Category name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Men's Footwear"
              value={form.category_name}
              onBlur={() => setNameTouched(true)}
              onChange={(e) => handleFieldChange("category_name", e.target.value)}
              className={`w-full rounded-xl border p-3 text-sm sm:text-base bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 outline-none transition focus:ring-2 focus:ring-offset-0 ${
                nameInvalid
                  ? "border-red-400 focus:ring-red-200 dark:focus:ring-red-500/30"
                  : "border-gray-200 dark:border-gray-700 focus:ring-blue-200 dark:focus:ring-blue-500/30 focus:border-blue-400"
              }`}
            />
            {nameInvalid && (
              <p className="text-xs text-red-500 mt-1.5">Category name is required.</p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="font-medium text-sm text-gray-900 dark:text-white">
                Description
              </label>
              <span
                className={`text-xs tabular-nums ${
                  descriptionNearLimit
                    ? "text-amber-600 dark:text-amber-400"
                    : "text-gray-400"
                }`}
              >
                {descriptionCount}/{MAX_DESCRIPTION_LENGTH}
              </span>
            </div>
            <textarea
              rows={5}
              placeholder="What kind of products live in this category?"
              value={form.description}
              maxLength={MAX_DESCRIPTION_LENGTH}
              onChange={(e) => handleFieldChange("description", e.target.value)}
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 p-3 text-sm sm:text-base bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 outline-none transition focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-500/30 focus:border-blue-400 resize-none"
            />
          </div>

          <div>
            <label className="block font-medium text-sm text-gray-900 dark:text-white mb-2">
              Status
            </label>
            <div className="inline-flex rounded-xl border border-gray-200 dark:border-gray-700 p-1 bg-gray-50 dark:bg-gray-800">
              {["Active", "Inactive"].map((option) => {
                const selected = form.status === option;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handleFieldChange("status", option)}
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

        {/* Right column: image uploader */}
        <div className="order-1 md:order-2">
          <label className="block font-medium text-sm text-gray-900 dark:text-white mb-2">
            Category image
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
                  alt="Category preview"
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

      <div className="flex flex-col-reverse sm:flex-row gap-3 mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
        <button
          onClick={resetForm}
          disabled={saving}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 transition"
        >
          <RotateCcw size={16} />
          Reset
        </button>

        <button
          onClick={handleSave}
          disabled={saving || uploading}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-xl transition text-sm font-medium shadow-sm sm:ml-auto"
        >
          {saving ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <PlusCircle size={16} />
          )}
          {saving ? "Saving..." : isEditing ? "Update category" : "Save category"}
        </button>
      </div>
    </div>
  );
}