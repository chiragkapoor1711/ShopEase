import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-gray-950">

      <Loader2
        size={60}
        className="animate-spin text-blue-600"
      />

      <h2 className="mt-6 text-2xl font-bold dark:text-white">
        ShopEase
      </h2>

      <p className="mt-2 text-gray-500">
        Loading...
      </p>

    </div>
  );
}