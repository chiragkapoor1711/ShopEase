export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10 animate-pulse">

      <div className="h-10 w-72 bg-gray-300 dark:bg-gray-700 rounded mb-10" />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">

        {[1,2,3,4,5,6,7,8].map((item) => (

          <div
            key={item}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg overflow-hidden"
          >

            <div className="h-64 bg-gray-300 dark:bg-gray-700" />

            <div className="p-5">

              <div className="h-5 w-20 bg-gray-300 dark:bg-gray-700 rounded mb-4" />

              <div className="h-6 w-40 bg-gray-300 dark:bg-gray-700 rounded mb-3" />

              <div className="h-4 w-28 bg-gray-300 dark:bg-gray-700 rounded mb-5" />

              <div className="h-4 w-20 bg-gray-300 dark:bg-gray-700 rounded mb-5" />

              <div className="h-8 w-28 bg-gray-300 dark:bg-gray-700 rounded mb-6" />

              <div className="grid grid-cols-2 gap-3">

                <div className="h-11 bg-gray-300 dark:bg-gray-700 rounded-xl" />

                <div className="h-11 bg-gray-300 dark:bg-gray-700 rounded-xl" />

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}