"use client";

import QuantitySelector from "./QuantitySelector";

export default function ProductInfo({
  product,
  quantity,
  setQuantity,
  onAddToCart,
}) {
  return (
    <div className="space-y-6 lg:sticky lg:top-24">
      {/* Product Name */}
      <h1 className="text-3xl font-bold text-gray-900">
        {product.product_name}
      </h1>

      {/* Brand */}
      <p className="text-gray-600">
        Brand :<span className="font-semibold ml-2">{product.brand}</span>
      </p>

      {/* Categories */}
      <div className="space-y-2">
        <p className="text-gray-600">
          Main Category :
          <span className="font-medium ml-2">{product.main_category}</span>
        </p>

        <p className="text-gray-600">
          Sub Category :
          <span className="font-medium ml-2">{product.sub_category}</span>
        </p>
      </div>

      {/* Vendor */}
      <p className="text-gray-600">
        Sold By :
        <span className="text-blue-600 font-semibold ml-2 hover:underline cursor-pointer">
          {product.store_name}
        </span>
      </p>

      {/* Rating */}
      <div className="flex items-center gap-3">
        <span className="text-yellow-500 text-xl">★★★★★</span>

        <span className="text-gray-500">(4.8)</span>

        <span className="text-gray-400">256 Reviews</span>
      </div>

      {/* Price */}
      <div className="flex items-center gap-4 flex-wrap">
        {product.has_offer ? (
          <>
            <span className="text-4xl font-bold text-green-600">
              ₹{Number(product.final_price).toLocaleString("en-IN")}
            </span>

            <span className="text-xl text-gray-400 line-through">
              ₹{Number(product.price).toLocaleString("en-IN")}
            </span>

            <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-semibold">
              {product.discount_percentage}% OFF
            </span>
          </>
        ) : (
          <span className="text-4xl font-bold text-green-600">
            ₹{Number(product.price).toLocaleString("en-IN")}
          </span>
        )}
      </div>
      {/* Stock */}
      <div>
        {product.stock > 0 ? (
          <p className="text-green-600 font-semibold">
            In Stock ({product.stock})
          </p>
        ) : (
          <p className="text-red-600 font-semibold">Out of Stock</p>
        )}
      </div>

      {/* Delivery */}
      <div className="text-gray-600">🚚 Delivery within 2–3 Business Days</div>

      {/* Quantity */}
      <QuantitySelector
        quantity={quantity}
        setQuantity={setQuantity}
        maxStock={product.stock}
      />

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={onAddToCart}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition"
        >
          Add to Cart
        </button>

        <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition">
          Buy Now
        </button>
      </div>
    </div>
  );
}
