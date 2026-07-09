"use client";

import { useState } from "react";
import { LockKeyhole } from "lucide-react";
import toast from "react-hot-toast";

export default function ChangePassword() {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage("New passwords do not match.");
      toast.error("New passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      setMessage(data.message);

      if (data.success) {
        toast.success(data.message || "Password updated.");

        setFormData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        toast.error(data.message || "Could not update password.");
      }
    } catch (error) {
      setMessage("Something went wrong.");
      toast.error("Something went wrong.");
    }

    setLoading(false);
  };

  return (
    <section className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center px-6">

      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">

        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
            <LockKeyhole className="text-blue-600 dark:text-blue-400" size={34} />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-center mt-6 dark:text-white">
          Change Password
        </h1>

        <p className="text-center text-gray-500 mt-2">
          Update your account password.
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 mt-8"
        >

          <input
            type="password"
            name="currentPassword"
            placeholder="Current Password"
            value={formData.currentPassword}
            onChange={handleChange}
            className="w-full border rounded-lg p-3 dark:bg-gray-900 dark:text-white"
          />

          <input
            type="password"
            name="newPassword"
            placeholder="New Password"
            value={formData.newPassword}
            onChange={handleChange}
            className="w-full border rounded-lg p-3 dark:bg-gray-900 dark:text-white"
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full border rounded-lg p-3 dark:bg-gray-900 dark:text-white"
          />

          {message && (
            <p className="text-center text-red-500">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>

        </form>

      </div>

    </section>
  );
}