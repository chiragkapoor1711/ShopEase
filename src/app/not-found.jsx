import Link from "next/link";
import { TriangleAlert } from "lucide-react";

export default function NotFound() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-6 transition-colors duration-300">
      <div className="text-center max-w-lg">

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
            <TriangleAlert
              size={55}
              className="text-red-600 dark:text-red-400"
            />
          </div>
        </div>

        {/* 404 */}
        <h1 className="text-7xl font-extrabold text-gray-900 dark:text-white">
          404
        </h1>

        {/* Message */}
        <h2 className="mt-4 text-3xl font-bold text-gray-800 dark:text-white">
          Page Not Found
        </h2>

        <p className="mt-4 text-gray-600 dark:text-gray-300 leading-7">
          Sorry, the page you are looking for doesn't exist or may have been
          moved.
        </p>

        {/* Button */}
        <Link
          href="/"
          className="inline-block mt-8 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg transition"
        >
          Back to Home
        </Link>

      </div>
    </section>
  );
}