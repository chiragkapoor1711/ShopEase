"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import VendorCartGroup from "@/components/cart/VendorCartGroup";
import CartSummary from "@/components/cart/CartSummary";
import toast from "react-hot-toast";
import { useCart } from "@/context/CartContext";
import { Loader2, ShoppingCart, ArrowRight } from "lucide-react";
import { ArrowLeft } from "lucide-react";

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const { fetchCartCount } = useCart();
  const router = useRouter();
  

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await fetch("/api/cart");
      const data = await res.json();

      if (data.success) {
        setCart(data.cart);

        // Update Navbar Badge
        await fetchCartCount();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Group products by vendor
  const groupedCart = useMemo(() => {
    return cart.reduce((groups, item) => {
      if (!groups[item.store_name]) {
        groups[item.store_name] = [];
      }

      groups[item.store_name].push(item);

      return groups;
    }, {});
  }, [cart]);

  // Total Items
  const totalItems = cart.reduce((sum, item) => sum + Number(item.quantity), 0);

  // Grand Total
  const grandTotal = cart.reduce((sum, item) => {
    const price =
      Number(item.discount_price) > 0
        ? Number(item.discount_price)
        : Number(item.price);

    return sum + price * Number(item.quantity);
  }, 0);

  // Placeholder functions
  const handleIncrease = async (item) => {
    try {
      const newQuantity = item.quantity + 1;

      const res = await fetch(`/api/cart/${item.cart_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quantity: newQuantity,
        }),
      });

      const data = await res.json();

      if (data.success) {
        await fetchCart();
        await fetchCartCount();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    }
  };
  const handleDecrease = async (item) => {
    if (item.quantity === 1) {
      return handleRemove(item);
    }

    try {
      const res = await fetch(`/api/cart/${item.cart_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quantity: item.quantity - 1,
        }),
      });

      const data = await res.json();

      if (data.success) {
        await fetchCart();
        await fetchCartCount();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    }
  };

  const handleRemove = async (item) => {
    const confirmed = window.confirm("Remove this product from cart?");

    if (!confirmed) return;

    try {
      const res = await fetch(`/api/cart/${item.cart_id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success) {
        toast.success(data.message);

        await fetchCart();
        await fetchCartCount();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-28 sm:py-36 gap-3 text-gray-500">
        <Loader2 size={28} className="animate-spin text-blue-600" />
        <p className="text-sm font-medium">Loading your cart...</p>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-24 sm:py-32 px-4 animate-fade-up">
        <div className="w-20 h-20 rounded-2xl bg-blue-50 flex items-center justify-center mb-5">
          <ShoppingCart size={34} className="text-blue-600" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Your cart is empty</h2>
        <p className="text-gray-500 mt-2 max-w-sm">
          Looks like you haven&apos;t added anything yet. Start browsing to find something you&apos;ll love.
        </p>
        <button
          onClick={() => router.push("/")}
          className="group mt-7 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-blue-600/25 active:scale-[0.98]"
        >
          Start Shopping
          <ArrowRight size={18} className="transition-transform duration-200 group-hover:translate-x-1" />
        </button>

        <style jsx>{`
          @keyframes fade-up {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fade-up {
            animation: fade-up 0.4s ease-out;
          }
        `}</style>
      </div>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 py-8 sm:py-10">
      <div className="mb-8 sm:mb-10">
        <button
      onClick={() => router.back()}
      className="inline-flex items-center mb-5 justify-center w-10 h-10 rounded-lg border-2 border-gray-200 text-gray-600 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 active:scale-90 transition-all duration-150"
      aria-label="Go back"
    >
      <ArrowLeft size={18} />
    </button>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Shopping Cart</h1>
        <p className="text-gray-500 mt-1.5 text-sm sm:text-base">
          {totalItems} {totalItems === 1 ? "item" : "items"} ready for checkout
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 lg:gap-10">
        {/* Left */}
        <div className="lg:col-span-2">
          {Object.entries(groupedCart).map(([vendor, items]) => (
            <VendorCartGroup
              key={vendor}
              vendor={vendor}
              items={items}
              onIncrease={handleIncrease}
              onDecrease={handleDecrease}
              onRemove={handleRemove}
            />
          ))}
        </div>

        {/* Right */}
        <CartSummary totalItems={totalItems} grandTotal={grandTotal} />
      </div>
    </section>
  );
}