"use client";

export default function QuantitySelector({
  quantity,
  setQuantity,
  maxStock,
}) {
  const decreaseQuantity = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const increaseQuantity = () => {
    if (quantity < maxStock) {
      setQuantity((prev) => prev + 1);
    }
  };

  return (
    <div className="space-y-2">
      <h3 className="font-semibold text-gray-800">
        Quantity
      </h3>

      <div className="flex items-center w-fit border rounded-lg overflow-hidden">

        <button
          onClick={decreaseQuantity}
          className="w-12 h-12 flex items-center justify-center text-xl hover:bg-gray-100 transition"
        >
          -
        </button>

        <div className="w-14 h-12 flex items-center justify-center border-x font-semibold">
          {quantity}
        </div>

        <button
          onClick={increaseQuantity}
          className="w-12 h-12 flex items-center justify-center text-xl hover:bg-gray-100 transition"
        >
          +
        </button>

      </div>

      <p className="text-sm text-gray-500">
        Available Stock : {maxStock}
      </p>
    </div>
  );
}