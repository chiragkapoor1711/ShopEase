"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { PlusCircle, RotateCcw, Loader2 } from "lucide-react";

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

  const isEditing = Boolean(editingCategory);

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
  }, [editingCategory]);

  function handleFieldChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function resetForm() {
    setForm(EMPTY_FORM);
    setImagePreview("");
    onCancelEdit?.();
  }

  async function handleImageChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error("Only JPG, PNG, or WEBP images are allowed.");
      e.target.value = "";
      return;
    }

    if (file.size > MAX_SIZE_BYTES) {
      toast.error("Image must be smaller than 2MB.");
      e.target.value = "";
      return;
    }

    // Local preview while it uploads
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

  async function handleSave() {
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

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8">
      <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold dark:text-white mb-4 sm:mb-6">
        {isEditing ? "Edit Category" : "Add Category"}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <label className="font-medium dark:text-white text-sm sm:text-base">
            Category Name
          </label>
          <input
            type="text"
            placeholder="Enter category name"
            value={form.category_name}
            onChange={(e) => handleFieldChange("category_name", e.target.value)}
            className="w-full mt-2 border rounded-xl p-2.5 sm:p-3 text-sm sm:text-base dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label className="font-medium dark:text-white text-sm sm:text-base">
            Category Image
          </label>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleImageChange}
            className="w-full mt-2 border rounded-xl p-2.5 sm:p-3 text-sm sm:text-base dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />
          <div className="flex items-center gap-2 mt-2">
            {imagePreview && (
              <Image
                src={imagePreview}
                alt="Preview"
                width={64}
                height={64}
                unoptimized={imagePreview.startsWith("blob:")}
                className="w-16 h-16 rounded-lg object-cover border dark:border-gray-700"
              />
            )}
            {uploading && (
              <span className="flex items-center gap-1 text-xs text-gray-500">
                <Loader2 size={14} className="animate-spin" />
                Uploading...
              </span>
            )}
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="font-medium dark:text-white text-sm sm:text-base">
            Description
          </label>
          <textarea
            rows={4}
            placeholder="Category description..."
            value={form.description}
            maxLength={MAX_DESCRIPTION_LENGTH}
            onChange={(e) => handleFieldChange("description", e.target.value)}
            className="w-full mt-2 border rounded-xl p-2.5 sm:p-3 text-sm sm:text-base dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          ></textarea>
          <p className="text-xs text-gray-400 mt-1 text-right">
            {descriptionCount}/{MAX_DESCRIPTION_LENGTH}
          </p>
        </div>

        <div>
          <label className="font-medium dark:text-white text-sm sm:text-base">
            Status
          </label>
          <select
            value={form.status}
            onChange={(e) => handleFieldChange("status", e.target.value)}
            className="w-full mt-2 border rounded-xl p-2.5 sm:p-3 text-sm sm:text-base dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          >
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8">
        <button
          onClick={handleSave}
          disabled={saving || uploading}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl transition text-sm sm:text-base"
        >
          {saving ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <PlusCircle size={18} />
          )}
          {saving ? "Saving..." : isEditing ? "Update" : "Save"}
        </button>

        <button
          onClick={resetForm}
          disabled={saving}
          className="flex items-center justify-center gap-2 bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white px-6 py-3 rounded-xl transition text-sm sm:text-base"
        >
          <RotateCcw size={18} />
          Reset
        </button>
      </div>
    </div>
  );
}