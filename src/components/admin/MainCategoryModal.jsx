"use client";

import { useState, useEffect } from "react";
import { X, Upload, FolderTree, FileText, Save } from "lucide-react";
import toast from "react-hot-toast";

export default function MainCategoryModal({
  open,
  onClose,
  initialData = null,
}) {
  const [formData, setFormData] = useState({
    category_name: "",
    category_image: "",
    description: "",
    status: "Active",
  });

  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      setImagePreview(initialData.category_image || "");
    } else {
      setFormData({
        category_name: "",
        category_image: "",
        description: "",
        status: "Active",
      });
      setImagePreview("");
    }
  }, [initialData, open]);

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  function handleImage(e) {
    const file = e.target.files[0];

    if (!file) return;

    setImageFile(file);

    setImagePreview(URL.createObjectURL(file));
  }

  async function handleSubmit() {
    try {
      setSaving(true);

      let imageUrl = formData.category_image;

      if (imageFile) {
        const body = new FormData();

        body.append("file", imageFile);

        const uploadRes = await fetch("/api/admin/main-categories/upload", {
          method: "POST",
          body,
        });

        const uploadData = await uploadRes.json();

        if (!uploadData.success) {
          throw new Error(uploadData.message);
        }

        imageUrl = uploadData.imageUrl;
      }

      const endpoint = initialData
        ? `/api/admin/main-categories/${initialData.id}`
        : "/api/admin/main-categories";

      const method = initialData ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          category_image: imageUrl,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      toast.success(data.message);

      onClose();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  }
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-5">
      <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-2xl shadow-xl">
        {/* Header */}

        <div className="flex justify-between items-center p-6 border-b dark:border-gray-800">
          <h2 className="text-2xl font-bold dark:text-white">
            {initialData ? "Edit Main Category" : "Add Main Category"}
          </h2>

          <button onClick={onClose}>
            <X className="dark:text-white" />
          </button>
        </div>

        {/* Body */}

        <div className="p-6 space-y-6">
          {/* Image */}

          <div className="flex flex-col items-center">
            <div className="w-32 h-32 rounded-xl border bg-gray-100 overflow-hidden flex items-center justify-center">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <FolderTree size={50} className="text-blue-600" />
              )}
            </div>

            <label className="mt-5 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl flex items-center gap-2">
              <Upload size={18} />
              Upload Image
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImage}
              />
            </label>
          </div>

          {/* Category Name */}

          <div>
            <label className="font-medium dark:text-white flex items-center gap-2">
              <FolderTree size={18} />
              Main Category Name
            </label>

            <input
              type="text"
              name="category_name"
              value={formData.category_name}
              onChange={handleChange}
              className="w-full mt-2 border rounded-xl p-3 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
          </div>

          {/* Description */}

          <div>
            <label className="font-medium dark:text-white flex items-center gap-2">
              <FileText size={18} />
              Description
            </label>

            <textarea
              rows="4"
              name="description"
              value={formData.description}
              onChange={handleChange}
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

        {/* Footer */}

        <div className="flex justify-end gap-4 border-t dark:border-gray-800 p-6">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl bg-gray-300 dark:bg-gray-700 dark:text-white"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl"
          >
            <Save size={18} />
            {saving ? "Saving..." : initialData ? "Update" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
