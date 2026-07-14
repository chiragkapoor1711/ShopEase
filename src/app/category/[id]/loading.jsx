export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12 animate-pulse">

      <div className="h-10 w-60 bg-gray-300 dark:bg-gray-700 rounded mb-10" />

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

        {[1,2,3,4,5,6].map((item) => (
          <div
            key={item}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg overflow-hidden"
          >

            <div className="h-44 bg-gray-300 dark:bg-gray-700" />

            <div className="p-6">

              <div className="h-6 w-40 bg-gray-300 dark:bg-gray-700 rounded mb-4" />

              <div className="h-4 w-full bg-gray-300 dark:bg-gray-700 rounded mb-2" />

              <div className="h-4 w-32 bg-gray-300 dark:bg-gray-700 rounded mb-6" />

              <div className="h-4 w-24 bg-gray-300 dark:bg-gray-700 rounded mb-3" />

              <div className="h-4 w-28 bg-gray-300 dark:bg-gray-700 rounded mb-6" />

              <div className="h-12 bg-blue-200 dark:bg-blue-900 rounded-xl" />

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}