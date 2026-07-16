"use client";

import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";

export default function RelatedProducts({ productId }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchRelatedProducts();
  }, [productId]);

  const fetchRelatedProducts = async () => {
    try {
      const res = await fetch(`/api/related-products/${productId}`);
      const data = await res.json();

      if (data.success) {
        setProducts(data.products);
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (products.length === 0) {
    return (
      <section className="mt-16">
        <h2 className="text-3xl font-bold mb-8">Related Products</h2>

        <div className="text-center py-10 border rounded-xl bg-white">
          <p className="text-gray-500">No related products found.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-16">
      <h2 className="text-3xl font-bold mb-8">Related Products</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
