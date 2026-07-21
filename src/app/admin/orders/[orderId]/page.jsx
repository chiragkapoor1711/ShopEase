"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import clsx from "clsx";
import {
  ArrowLeft,
  User,
  Store,
  MapPin,
  Mail,
  Phone,
  CreditCard,
  Package,
  ChevronDown,
  Loader2,
  RefreshCcw,
  Clock,
  CheckCircle2,
  PackageCheck,
  Truck,
  Home,
  XCircle,
  AlertTriangle,
} from "lucide-react";

const cardShell =
  "bg-white dark:bg-gray-900 rounded-2xl shadow-sm ring-1 ring-black/5 dark:ring-white/10";

function badgeColor(status) {
  switch (status) {
    case "Pending":
      return "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400";
    case "Confirmed":
      return "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400";
    case "Packed":
      return "bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400";
    case "Shipped":
      return "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400";
    case "Delivered":
      return "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400";
    case "Cancelled":
      return "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400";
    default:
      return "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400";
  }
}

const STATUS_FLOW = [
  { key: "Pending", label: "Order placed", icon: Clock },
  { key: "Confirmed", label: "Confirmed", icon: CheckCircle2 },
  { key: "Packed", label: "Packed", icon: PackageCheck },
  { key: "Shipped", label: "Shipped", icon: Truck },
  { key: "Delivered", label: "Delivered", icon: Home },
];

/* ---------- small building blocks ---------- */

function CardHeader({ icon: Icon, title, meta }) {
  return (
    <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-gray-100 dark:border-gray-800">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center shrink-0">
          <Icon size={16} className="text-blue-600 dark:text-blue-400" />
        </div>
        <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
          {title}
        </h2>
      </div>
      {meta && <span className="text-sm text-gray-400">{meta}</span>}
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-2.5">
      {Icon && (
        <Icon size={15} className="text-gray-300 dark:text-gray-600 mt-0.5 shrink-0" />
      )}
      <div className="min-w-0">
        <p className="text-xs text-gray-400 mb-0.5">{label}</p>
        <p className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white break-words">
          {value || "—"}
        </p>
      </div>
    </div>
  );
}

function OrderTimeline({ currentStatus }) {
  if (currentStatus === "Cancelled") {
    return (
      <div className="flex items-start gap-3 rounded-xl bg-red-50 dark:bg-red-500/10 p-4">
        <XCircle className="text-red-500 shrink-0 mt-0.5" size={19} />
        <div>
          <p className="font-semibold text-red-700 dark:text-red-400 text-sm">
            Order cancelled
          </p>
          <p className="text-red-600/80 dark:text-red-400/70 text-xs mt-0.5">
            This order won&apos;t proceed further.
          </p>
        </div>
      </div>
    );
  }

  const currentIndex = STATUS_FLOW.findIndex((s) => s.key === currentStatus);

  return (
    <div>
      {STATUS_FLOW.map((step, i) => {
        const Icon = step.icon;
        const done = i < currentIndex;
        const active = i === currentIndex;
        const upcoming = i > currentIndex;
        const isLast = i === STATUS_FLOW.length - 1;

        return (
          <div key={step.key} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div
                className={clsx(
                  "w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors",
                  (done || active) && "bg-blue-600 text-white",
                  upcoming && "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600"
                )}
              >
                <Icon size={14} />
              </div>
              {!isLast && (
                <div
                  className={clsx(
                    "w-0.5 flex-1 min-h-[26px]",
                    done ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-800"
                  )}
                />
              )}
            </div>
            <div className={clsx("pb-6", isLast && "pb-0")}>
              <p
                className={clsx(
                  "text-sm font-semibold leading-8",
                  active || done
                    ? "text-gray-900 dark:text-white"
                    : "text-gray-400 dark:text-gray-600"
                )}
              >
                {step.label}
              </p>
              {active && (
                <p className="text-xs text-blue-600 dark:text-blue-400 -mt-1">
                  Current status
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ---------- page ---------- */

export default function AdminOrderDetailsPage() {
  const { orderId } = useParams();

  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchOrder = async () => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`);
      const data = await res.json();

      if (data.success) {
        setOrder(data.order);
        setItems(data.items);
        setStatus(data.order.order_status);
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_status: status }),
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

  if (loading) {
    return (
      <div
        className={`${cardShell} flex items-center justify-center gap-2 py-20 text-gray-500 dark:text-gray-400`}
      >
        <Loader2 size={18} className="animate-spin" />
        <span className="text-sm">Loading order...</span>
      </div>
    );
  }

  if (!order) {
    return (
      <div className={`${cardShell} flex flex-col items-center justify-center gap-2 py-20 text-center`}>
        <AlertTriangle className="text-gray-300 dark:text-gray-700 mb-1" size={28} />
        <p className="text-gray-900 dark:text-white font-semibold">Order not found</p>
        <p className="text-sm text-gray-400">
          It may have been deleted, or the link is incorrect.
        </p>
        <Link
          href="/admin/orders"
          className="mt-3 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline"
        >
          Back to orders
        </Link>
      </div>
    );
  }

  const subtotal = Number(order.total_amount) - Number(order.delivery_charge);
  const statusChanged = status !== order.order_status;

  return (
    <div className="space-y-5">
      {/* Back link */}
      <Link
        href="/admin/orders"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
      >
        <ArrowLeft size={15} />
        Back to orders
      </Link>

      {/* Header */}
      <div className={`${cardShell} p-5 sm:p-6`}>
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white tabular-nums">
              Order #{order.order_number}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Placed on {new Date(order.created_at).toLocaleString()}
            </p>
          </div>
          <div className="flex gap-2 flex-wrap sm:justify-end">
            <span className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold ${badgeColor(order.order_status)}`}>
              {order.order_status}
            </span>
            <span className="px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
              {order.payment_method}
            </span>
            <span className="px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
              {order.payment_status}
            </span>
          </div>
        </div>
      </div>

      {/* Main grid: details left, status/payment sidebar right */}
      <div className="grid lg:grid-cols-3 gap-5 items-start">
        {/* Left: details (shows second on mobile) */}
        <div className="lg:col-span-2 order-2 lg:order-1 space-y-5">
          {/* Customer + Store, single card, split */}
          <div className={`${cardShell} grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-gray-100 dark:divide-gray-800 overflow-hidden`}>
            <div className="p-5 sm:p-6">
              <div className="flex items-center gap-2 mb-4">
                <User size={15} className="text-blue-600 dark:text-blue-400" />
                <h3 className="text-sm font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Customer
                </h3>
              </div>
              <div className="space-y-3.5">
                <InfoRow label="Name" value={order.customer_name} />
                <InfoRow icon={Mail} label="Email" value={order.customer_email} />
                <InfoRow icon={Phone} label="Phone" value={order.customer_mobile} />
              </div>
            </div>
            <div className="p-5 sm:p-6">
              <div className="flex items-center gap-2 mb-4">
                <Store size={15} className="text-blue-600 dark:text-blue-400" />
                <h3 className="text-sm font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Store
                </h3>
              </div>
              <div className="space-y-3.5">
                <InfoRow label="Store name" value={order.store_name} />
                <InfoRow icon={Mail} label="Email" value={order.store_email} />
                <InfoRow icon={Phone} label="Phone" value={order.store_phone} />
              </div>
            </div>
          </div>

          {/* Delivery address */}
          <div className={cardShell}>
            <CardHeader icon={MapPin} title="Delivery address" />
            <div className="p-5 sm:p-6 grid sm:grid-cols-2 gap-4 sm:gap-5">
              <InfoRow label="Receiver name" value={order.receiver_name} />
              <InfoRow icon={Phone} label="Phone" value={order.receiver_phone} />
              <div className="sm:col-span-2">
                <p className="text-xs text-gray-400 mb-0.5">Address</p>
                <p className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white leading-relaxed">
                  {order.address_line1}
                  {order.address_line2 && <>, {order.address_line2}</>}
                  {", "}
                  {order.city}, {order.state} – {order.pincode}
                  {order.landmark && (
                    <span className="block text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                      Landmark: {order.landmark}
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Ordered products */}
          <div className={`${cardShell} overflow-hidden`}>
            <CardHeader icon={Package} title="Ordered products" meta={`${items.length} item${items.length === 1 ? "" : "s"}`} />

            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800/60">
                    <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Product
                    </th>
                    <th className="text-left px-3 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Brand
                    </th>
                    <th className="text-center px-3 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Price
                    </th>
                    <th className="text-center px-3 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Qty
                    </th>
                    <th className="text-right px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr
                      key={item.id}
                      className="border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors"
                    >
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-3.5">
                          <Image
                            src={item.product_image}
                            alt={item.product_name}
                            width={48}
                            height={48}
                            className="w-12 h-12 rounded-lg object-cover ring-1 ring-black/5 dark:ring-white/10 shrink-0"
                          />
                          <h3 className="font-semibold text-sm text-gray-900 dark:text-white">
                            {item.product_name}
                          </h3>
                        </div>
                      </td>
                      <td className="px-3 py-3.5 text-sm text-gray-500 dark:text-gray-400">
                        {item.brand || "—"}
                      </td>
                      <td className="px-3 py-3.5 text-center text-sm text-gray-700 dark:text-gray-300">
                        ₹{Number(item.price).toLocaleString("en-IN")}
                      </td>
                      <td className="px-3 py-3.5 text-center text-sm text-gray-700 dark:text-gray-300">
                        {item.quantity}
                      </td>
                      <td className="px-6 py-3.5 text-right font-bold text-sm text-gray-900 dark:text-white">
                        ₹{Number(item.subtotal).toLocaleString("en-IN")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile list */}
            <div className="md:hidden divide-y divide-gray-100 dark:divide-gray-800">
              {items.map((item) => (
                <div key={item.id} className="p-4 flex gap-3.5">
                  <Image
                    src={item.product_image}
                    alt={item.product_name}
                    width={56}
                    height={56}
                    className="w-14 h-14 rounded-lg object-cover ring-1 ring-black/5 dark:ring-white/10 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-sm text-gray-900 dark:text-white truncate">
                      {item.product_name}
                    </h3>
                    <p className="text-xs text-gray-400">{item.brand || "—"}</p>
                    <div className="flex items-center justify-between mt-2 text-sm">
                      <span className="text-gray-500 dark:text-gray-400">
                        ₹{Number(item.price).toLocaleString("en-IN")} × {item.quantity}
                      </span>
                      <span className="font-bold text-gray-900 dark:text-white">
                        ₹{Number(item.subtotal).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: status + payment, sticky sidebar (shows first on mobile) */}
        <div className="order-1 lg:order-2 space-y-5 lg:sticky lg:top-6">
          {/* Status + timeline + update control, one card */}
          <div className={cardShell}>
            <CardHeader icon={RefreshCcw} title="Order status" />
            <div className="p-5 sm:p-6">
              <OrderTimeline currentStatus={order.order_status} />

              <div className="mt-1 pt-5 border-t border-gray-100 dark:border-gray-800 space-y-3">
                <div className="relative flex items-center rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus-within:ring-2 focus-within:ring-blue-200 dark:focus-within:ring-blue-500/30 focus-within:border-blue-400 transition">
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full appearance-none bg-transparent px-4 py-3 text-sm font-medium text-gray-900 dark:text-white outline-none"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Packed">Packed</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-4 text-gray-400 pointer-events-none" />
                </div>

                <button
                  onClick={updateStatus}
                  disabled={updating || !statusChanged}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl transition text-sm font-semibold shadow-sm"
                >
                  {updating ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update status"
                  )}
                </button>

                {!statusChanged && (
                  <p className="text-xs text-gray-400 text-center">
                    Select a different status to enable updating.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Payment summary */}
          <div className={cardShell}>
            <CardHeader icon={CreditCard} title="Payment summary" />
            <div className="p-5 sm:p-6 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Subtotal</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  ₹{subtotal.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Delivery charge</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  ₹{Number(order.delivery_charge).toLocaleString("en-IN")}
                </span>
              </div>
              <div className="border-t border-gray-100 dark:border-gray-800 pt-3 flex justify-between items-center">
                <span className="text-base font-bold text-gray-900 dark:text-white">
                  Grand total
                </span>
                <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                  ₹{Number(order.total_amount).toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}