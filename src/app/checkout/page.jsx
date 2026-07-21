"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Loader2, ShoppingCart, ArrowRight } from "lucide-react";

import VendorOrderGroup from "@/components/checkout/VendorOrderGroup";
import PaymentSection from "@/components/checkout/PaymentSection";
import OrderSummary from "@/components/checkout/OrderSummary";
import { ArrowLeft } from "lucide-react";
import OrderSuccessModal from "@/components/orders/OrderSuccessModal";
import { useCart } from "@/context/CartContext";

export default function CheckoutPage() {
  const router = useRouter();

  const [cart, setCart] = useState([]);
  const [addresses, setAddresses] = useState([]);

  const [selectedAddress, setSelectedAddress] = useState(null);

  const [paymentMethod, setPaymentMethod] = useState("COD");

  const [loading, setLoading] = useState(true);

  const [placingOrder, setPlacingOrder] = useState(false);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [placedOrderNumber, setPlacedOrderNumber] = useState("");

  const { fetchCartCount } = useCart();

  useEffect(() => {
    fetchCheckoutData();
  }, []);

  async function fetchCheckoutData() {
    try {
      setLoading(true);

      const [cartRes, addressRes] = await Promise.all([
        fetch("/api/cart"),
        fetch("/api/address"),
      ]);

      const cartData = await cartRes.json();
      const addressData = await addressRes.json();

      if (cartData.success) {
        setCart(cartData.cart);
      }

      if (addressData.success) {
        setAddresses(addressData.addresses);

        const defaultAddress = addressData.addresses.find(
          (address) => address.is_default === 1,
        );

        if (defaultAddress) {
          setSelectedAddress(defaultAddress.id);
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load checkout.");
    } finally {
      setLoading(false);
    }
  }

  // Group products by Store
  const groupedVendors = useMemo(() => {
    return cart.reduce((groups, item) => {
      if (!groups[item.store_id]) {
        groups[item.store_id] = {
          storeId: item.store_id,
          storeName: item.store_name,
          storeLogo: item.store_logo,
          items: [],
        };
      }

      groups[item.store_id].items.push(item);

      return groups;
    }, {});
  }, [cart]);

  // Total Items
  const totalItems = cart.reduce((sum, item) => sum + Number(item.quantity), 0);

  // Subtotal
  const subtotal = cart.reduce((sum, item) => {
    const price = item.has_offer
      ? Number(item.final_price)
      : Number(item.price);

    return sum + price * Number(item.quantity);
  }, 0);

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.error("Please select a delivery address.");
      return;
    }

    try {
      setPlacingOrder(true);

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address_id: selectedAddress,
          payment_method: paymentMethod,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to place order.");
      }
      await fetchCartCount();

      setPlacedOrderNumber(data.orders[0]?.order_number || "");
      setShowSuccessModal(true);

      setTimeout(() => {
        router.push("/");
      }, 2500);
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Something went wrong.");
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-28 sm:py-36 gap-3 text-gray-500">
        <Loader2 size={28} className="animate-spin text-blue-600" />
        <p className="text-sm font-medium">Loading checkout...</p>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-24 sm:py-32 px-4 animate-fade-up">
        <div className="w-20 h-20 rounded-2xl bg-blue-50 flex items-center justify-center mb-5">
          <ShoppingCart size={34} className="text-blue-600" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Your cart is empty
        </h2>
        <p className="text-gray-500 mt-2 max-w-sm">
          Add something to your cart before heading to checkout.
        </p>
        <button
          onClick={() => router.push("/")}
          className="group mt-7 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-blue-600/25 active:scale-[0.98]"
        >
          Start Shopping
          <ArrowRight
            size={18}
            className="transition-transform duration-200 group-hover:translate-x-1"
          />
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
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
          Checkout
        </h1>
        <p className="text-gray-500 mt-1.5 text-sm sm:text-base">
          {totalItems} {totalItems === 1 ? "item" : "items"} · review and place
          your order
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 lg:gap-10">
        <div className="lg:col-span-2 space-y-6 sm:space-y-8">
          {/* Vendor Groups */}
          {Object.values(groupedVendors).map((vendor) => (
            <VendorOrderGroup key={vendor.storeId} vendor={vendor} />
          ))}

          {/* Payment */}
          <PaymentSection
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
          />
        </div>

        {/* Right */}
        <OrderSummary
          totalItems={totalItems}
          subtotal={subtotal}
          deliveryCharge={0}
          discount={0}
          paymentMethod={paymentMethod}
          loading={placingOrder}
          onPlaceOrder={handlePlaceOrder}
          addresses={addresses}
          selectedAddress={selectedAddress}
          setSelectedAddress={setSelectedAddress}
        />

        <OrderSuccessModal
          open={showSuccessModal}
          orderNumber={placedOrderNumber}
        />
      </div>
    </section>
  );
}
