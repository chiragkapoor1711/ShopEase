"use client";

export default function ReviewCard({
  name,
  rating,
  date,
  comment,
}) {
  return (
    <div className="bg-white border rounded-xl p-6 shadow-sm">

      <div className="flex justify-between items-start">

        <div>

          <h3 className="text-lg font-semibold text-gray-900">
            {name}
          </h3>

          <div className="flex items-center gap-1 mt-1">
            {Array.from({ length: 5 }).map((_, index) => (
              <span
                key={index}
                className={
                  index < rating
                    ? "text-yellow-500"
                    : "text-gray-300"
                }
              >
                ★
              </span>
            ))}
          </div>

        </div>

        <span className="text-sm text-gray-500">
          {date}
        </span>

      </div>

      <p className="text-gray-600 mt-4 leading-7">
        {comment}
      </p>

    </div>
  );
}