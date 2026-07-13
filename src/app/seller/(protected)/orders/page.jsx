"use client";

import { useEffect, useState } from "react";
import {
  Eye,
  Search,
  Filter,
  ShoppingCart,
  PackageCheck,
  Clock3,
  IndianRupee,
} from "lucide-react";
import OrderDetailsModal from "@/components/seller/OrderDetailsModal";

function formatCurrency(amount) {
  const num = Number(amount) || 0;
  return `₹${num.toLocaleString("en-IN")}`;
}

function PaymentBadge({ payment }) {
  let classes = "";

  switch (payment) {
    case "Paid":
      classes = "bg-green-100 text-green-700";
      break;

    case "Pending":
      classes = "bg-yellow-100 text-yellow-700";
      break;

    case "Failed":
      classes = "bg-red-100 text-red-700";
      break;

    default:
      classes = "bg-gray-100 text-gray-700";
  }

  return (
    <span className={`${classes} px-3 py-1 rounded-full text-xs`}>
      {payment}
    </span>
  );
}

function StatusBadge({ status }) {
  let classes = "";

  switch (status) {
    case "Pending":
      classes = "bg-yellow-100 text-yellow-700";
      break;

    case "Confirmed":
      classes = "bg-blue-100 text-blue-700";
      break;

    case "Packed":
      classes = "bg-indigo-100 text-indigo-700";
      break;

    case "Shipped":
      classes = "bg-purple-100 text-purple-700";
      break;

    case "Delivered":
      classes = "bg-green-100 text-green-700";
      break;

    case "Cancelled":
      classes = "bg-red-100 text-red-700";
      break;

    default:
      classes = "bg-gray-100 text-gray-700";
  }

  return (
    <span className={`${classes} px-3 py-1 rounded-full text-xs`}>
      {status}
    </span>
  );
}

export default function OrdersPage() {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [loadingOrder, setLoadingOrder] = useState(false);
  async function handleViewOrder(id) {
    try {
      setLoadingOrder(true);

      const res = await fetch(`/api/seller/orders/${id}`, {
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message);
      }

      setSelectedOrder(data.order);
      setOrderItems(data.items);
      setOpenModal(true);
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to load order.");
    } finally {
      setLoadingOrder(false);
    }
  }

  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    delivered: 0,
    processing: 0,
    revenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Orders");

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError("");

      try {
        const [ordersRes, statsRes] = await Promise.all([
          fetch("/api/seller/orders", { credentials: "include" }),
          fetch("/api/seller/orders/stats", { credentials: "include" }),
        ]);

        const ordersData = await ordersRes.json();
        const statsData = await statsRes.json();

        if (!ordersData.success) {
          throw new Error(ordersData.message || "Failed to load orders.");
        }
        if (!statsData.success) {
          throw new Error(statsData.message || "Failed to load stats.");
        }

        setOrders(ordersData.orders || []);
        setStats(statsData.stats || {});
      } catch (err) {
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      statusFilter === "All Orders" || order.order_status === statusFilter;

    const q = search.trim().toLowerCase();
    const matchesSearch =
      q === "" ||
      order.order_number?.toLowerCase().includes(q) ||
      order.customer_name?.toLowerCase().includes(q);

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="max-w-full overflow-x-hidden">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold dark:text-white">
          Orders
        </h1>
        <p className="text-gray-500 mt-1 sm:mt-2 text-sm sm:text-base">
          Manage customer orders and track their status.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-xl bg-red-100 text-red-700 px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
        <div className="bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl shadow-lg p-3 sm:p-5 lg:p-6">
          <div className="flex justify-between items-start sm:items-center gap-2">
            <div className="min-w-0">
              <p className="text-gray-500 text-xs sm:text-sm truncate">
                Total Orders
              </p>
              <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold mt-1 sm:mt-2 dark:text-white">
                {loading ? "—" : stats.totalOrders}
              </h2>
            </div>
            <div className="w-9 h-9 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-lg sm:rounded-xl bg-blue-500 flex items-center justify-center shrink-0">
              <ShoppingCart className="text-white" size={18} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl shadow-lg p-3 sm:p-5 lg:p-6">
          <div className="flex justify-between items-start sm:items-center gap-2">
            <div className="min-w-0">
              <p className="text-gray-500 text-xs sm:text-sm truncate">
                Delivered
              </p>
              <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold mt-1 sm:mt-2 dark:text-white">
                {loading ? "—" : stats.delivered}
              </h2>
            </div>
            <div className="w-9 h-9 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-lg sm:rounded-xl bg-green-500 flex items-center justify-center shrink-0">
              <PackageCheck className="text-white" size={18} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl shadow-lg p-3 sm:p-5 lg:p-6">
          <div className="flex justify-between items-start sm:items-center gap-2">
            <div className="min-w-0">
              <p className="text-gray-500 text-xs sm:text-sm truncate">
                Processing
              </p>
              <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold mt-1 sm:mt-2 dark:text-white">
                {loading ? "—" : stats.processing}
              </h2>
            </div>
            <div className="w-9 h-9 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-lg sm:rounded-xl bg-orange-500 flex items-center justify-center shrink-0">
              <Clock3 className="text-white" size={18} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl shadow-lg p-3 sm:p-5 lg:p-6">
          <div className="flex justify-between items-start sm:items-center gap-2">
            <div className="min-w-0">
              <p className="text-gray-500 text-xs sm:text-sm truncate">
                Revenue
              </p>
              <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold mt-1 sm:mt-2 dark:text-white truncate">
                {loading ? "—" : formatCurrency(stats.revenue)}
              </h2>
            </div>
            <div className="w-9 h-9 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-lg sm:rounded-xl bg-purple-500 flex items-center justify-center shrink-0">
              <IndianRupee className="text-white" size={18} />
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search Orders..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border rounded-xl pl-10 sm:pl-11 py-2.5 sm:py-3 text-sm sm:text-base dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
          </div>

          <div className="relative">
            <Filter
              size={18}
              className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full border rounded-xl pl-10 sm:pl-11 py-2.5 sm:py-3 text-sm sm:text-base dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            >
              <option value="All Orders">All Orders</option>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Packed">Packed</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0 mb-5 sm:mb-6">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold dark:text-white">
            Recent Orders
          </h2>
          <span className="text-gray-500 text-xs sm:text-sm">
            {loading ? "Loading..." : `${filteredOrders.length} Orders`}
          </span>
        </div>

        {loading ? (
          <p className="text-gray-500 text-sm py-6 text-center">
            Loading orders...
          </p>
        ) : filteredOrders.length === 0 ? (
          <p className="text-gray-500 text-sm py-6 text-center">
            No orders found.
          </p>
        ) : (
          <>
            {/* Mobile/tablet: stacked cards (no horizontal scroll) */}
            <div className="md:hidden space-y-3">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="border dark:border-gray-800 rounded-xl p-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-semibold dark:text-white">
                        {order.order_number}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {order.customer_name}
                      </p>
                    </div>
                    <button
                      onClick={() => handleViewOrder(order.id)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Eye size={18} />
                    </button>
                  </div>

                  <p className="text-sm text-gray-500 mt-2 truncate">
                    {formatCurrency(order.total_amount)} •{" "}
                    {order.payment_method}
                  </p>

                  <div className="flex gap-2 mt-2 flex-wrap">
                    <PaymentBadge payment={order.payment_status} />
                    <StatusBadge status={order.order_status} />
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop/tablet-landscape: table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b dark:border-gray-700">
                    <th className="text-left py-4">Order ID</th>
                    <th className="text-left py-4">Customer</th>
                    <th className="text-left py-4">Total</th>
                    <th className="text-left py-4">Payment Method</th>
                    <th className="text-left py-4">Payment</th>
                    <th className="text-left py-4">Status</th>
                    <th className="text-center py-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                    >
                      <td className="py-4 font-semibold dark:text-white">
                        {order.order_number}
                      </td>
                      <td className="dark:text-gray-200">
                        {order.customer_name}
                      </td>
                      <td className="dark:text-gray-200">
                        {formatCurrency(order.total_amount)}
                      </td>
                      <td className="dark:text-gray-200">
                        {order.payment_method}
                      </td>
                      <td>
                        <PaymentBadge payment={order.payment_status} />
                      </td>
                      <td>
                        <StatusBadge status={order.order_status} />
                      </td>
                      <td>
                        <div className="flex justify-center">
                          <button
                            onClick={() => handleViewOrder(order.id)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Eye size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      <OrderDetailsModal
        isOpen={openModal}
        order={selectedOrder}
        items={orderItems}
        onClose={() => {
          setOpenModal(false);
          setSelectedOrder(null);
          setOrderItems([]);
        }}
      />
    </div>
  );
}
