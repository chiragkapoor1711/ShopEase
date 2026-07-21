"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, MapPin, CreditCard, Package, Calendar } from "lucide-react";

import toast from "react-hot-toast";


export default function OrderDetailsPage() {
  const { orderId } = useParams();
  const router = useRouter();

  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [status, setStatus] = useState("");
  const [updating, setUpdating] = useState(false);
 

  useEffect(() => {
    fetchOrder();
  }, []);

  const fetchOrder = async () => {
    try {
      const res = await fetch(`/api/orders/${orderId}`);
      const data = await res.json();

      if (data.success) {
        setOrder(data.order);
        setItems(data.items);
        setStatus(data.order.order_status);
      } else {
        alert(data.message);
        router.push("/account/orders");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const updateStatus = async () => {
    try {
      setUpdating(true);

      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          order_status: status,
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success(data.message);
        fetchOrder();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Confirmed":
        return "bg-blue-100 text-blue-700";
      case "Packed":
        return "bg-indigo-100 text-indigo-700";
      case "Shipped":
        return "bg-purple-100 text-purple-700";
      case "Delivered":
        return "bg-green-100 text-green-700";
      case "Cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return <div className="max-w-6xl mx-auto py-10 px-4">Loading order...</div>;
  }

  if (!order) {
    return <div className="max-w-6xl mx-auto py-10 px-4">Order not found.</div>;
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      {/* Back */}

      <button
      onClick={() => router.back()}
      className="inline-flex items-center mb-2 justify-center w-10 h-10 rounded-lg border-2 border-gray-200 text-gray-600 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 active:scale-90 transition-all duration-150"
      aria-label="Go back"
    >
      <ArrowLeft size={18} />
    </button>

      {/* Header */}

      <div className="bg-white rounded-xl shadow border p-6 mb-6">
        <div className="flex justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold">Order #{order.order_number}</h1>

            <p className="text-gray-500 flex items-center gap-2 mt-2">
              <Calendar size={16} />
              {new Date(order.created_at).toLocaleString()}
            </p>
          </div>

          <span
            className={`px-4 py-2 rounded-full h-fit font-semibold ${getStatusColor(
              order.order_status,
            )}`}
          >
            {order.order_status}
          </span>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left */}

        <div className="lg:col-span-2 space-y-6">
          {/* Products */}

          <div className="bg-white rounded-xl shadow border p-6">
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-5">
              <Package size={20} />
              Ordered Products
            </h2>

            <div className="space-y-5">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-5 border-b pb-5 last:border-0"
                >
                  <Image
                    src={item.product_image}
                    alt={item.product_name}
                    width={90}
                    height={90}
                    className="rounded-lg object-cover border"
                  />

                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">
                      {item.product_name}
                    </h3>

                    <p className="text-gray-500 mt-2">₹{item.price}</p>

                    <p className="text-gray-500">Quantity : {item.quantity}</p>

                    <p className="font-bold mt-2">
                      Subtotal : ₹{item.subtotal}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Address */}

          <div className="bg-white rounded-xl shadow border p-6">
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
              <MapPin size={20} />
              Delivery Address
            </h2>

            <p className="font-semibold">{order.full_name}</p>

            <p>{order.phone}</p>

            <p className="mt-3">{order.address_line1}</p>

            {order.address_line2 && <p>{order.address_line2}</p>}

            {order.landmark && <p>{order.landmark}</p>}

            <p>
              {order.city}, {order.state} - {order.pincode}
            </p>
          </div>
        </div>

        {/* Right */}

        <div className="space-y-6">
          {/* Payment */}

          <div className="bg-white rounded-xl shadow border p-6">
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-5">
              <CreditCard size={20} />
              Payment
            </h2>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Method</span>
                <span>{order.payment_method}</span>
              </div>

              <div className="flex justify-between">
                <span>Status</span>
                <span>{order.payment_status}</span>
              </div>
            </div>
          </div>

          {/* Summary */}

          <div className="bg-white rounded-xl shadow border p-6">
            <h2 className="text-xl font-semibold mb-5">Order Summary</h2>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>
                  ₹
                  {(
                    Number(order.total_amount) - Number(order.delivery_charge)
                  ).toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Delivery</span>
                <span>₹{order.delivery_charge}</span>
              </div>

              <hr />

              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>₹{order.total_amount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
