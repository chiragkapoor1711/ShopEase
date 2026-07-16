"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import ProductGallery from "@/components/product/ProductGallery";
import ProductInfo from "@/components/product/ProductInfo";
import ProductTabs from "@/components/product/ProductTabs";
import VendorCard from "@/components/product/VendorCard";
import RelatedProducts from "@/components/product/RelatedProducts";
import toast from "react-hot-toast";
import { useCart } from "@/context/CartContext";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProductDetailsPage() {
  const { productId } = useParams();
  const router = useRouter();

  const { fetchCartCount } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleAddToCart = async () => {
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product_id: product.id,
          quantity,
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success(data.message);

        // Refresh Navbar Cart Badge
        await fetchCartCount();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      const res = await fetch(`/api/product/${productId}`);
      const data = await res.json();

      if (data.success) {
        setProduct(data.product);
      } else {
        setProduct(null);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };
  if (loading) return <p>Loading...</p>;

  if (!product) return <p>Product not found.</p>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <button
      onClick={() => router.back()}
      className="inline-flex items-center mb-5 justify-center w-10 h-10 rounded-lg border-2 border-gray-200 text-gray-600 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 active:scale-90 transition-all duration-150"
      aria-label="Go back"
    >
      <ArrowLeft size={18} />
    </button>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <ProductGallery product={product} />

        <ProductInfo
          product={product}
          quantity={quantity}
          setQuantity={setQuantity}
          onAddToCart={handleAddToCart}
        />
      </div>

      <ProductTabs product={product} />

      <VendorCard product={product} />
      <RelatedProducts productId={product.id} />
    </div>
  );
}