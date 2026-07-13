"use client";

import {
  Users,
  UserPlus,
  ShoppingBag,
  Search,
  Filter,
  Eye,
  Mail,
  Phone,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import CustomerDetailsModal from "@/components/seller/CustomerDetailsModal";

function StatusBadge({ status }) {
  const styles =
    status === "Active"
      ? "bg-green-100 text-green-700"
      : "bg-red-100 text-red-700";
  return (
    <span
      className={`${styles} px-3 py-1 rounded-full text-xs sm:text-sm whitespace-nowrap`}
    >
      {status}
    </span>
  );
}

export default function CustomersPage() {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerOrders, setCustomerOrders] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [loadingCustomer, setLoadingCustomer] = useState(false);

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All Customers");

  async function handleViewCustomer(id) {
    try {
      setLoadingCustomer(true);

      const res = await fetch(`/api/seller/customers/${id}`, {
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message);
      }

      setSelectedCustomer(data.customer);
      setCustomerOrders(data.orders);
      setOpenModal(true);
    } catch (error) {
      toast.error(error.message || "Failed to load customer.");
    } finally {
      setLoadingCustomer(false);
    }
  }

  async function fetchCustomers() {
    try {
      setLoading(true);
      const res = await fetch("/api/seller/customers", {
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message);
      }
      setCustomers(data.customers);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const matchesSearch =
        customer.full_name.toLowerCase().includes(search.toLowerCase()) ||
        customer.email.toLowerCase().includes(search.toLowerCase());
      const status = Number(customer.total_orders) > 0 ? "Active" : "Inactive";
      const matchesFilter = filter === "All Customers" || filter === status;
      return matchesSearch && matchesFilter;
    });
  }, [customers, search, filter]);

  return (
    <div className="max-w-full overflow-x-hidden">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold dark:text-white">
          Customers
        </h1>

        <p className="text-gray-500 mt-1 sm:mt-2 text-sm sm:text-base">
          View and manage your customer information.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
        <div className="bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl shadow-lg p-3 sm:p-5 lg:p-6">
          <div className="flex justify-between items-start sm:items-center gap-2">
            <div className="min-w-0">
              <p className="text-gray-500 text-xs sm:text-sm truncate">
                Total Customers
              </p>
              <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold mt-1 sm:mt-2 dark:text-white">
                {customers.length}
              </h2>
            </div>

            <div className="w-9 h-9 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-blue-500 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0">
              <Users className="text-white" size={18} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl shadow-lg p-3 sm:p-5 lg:p-6">
          <div className="flex justify-between items-start sm:items-center gap-2">
            <div className="min-w-0">
              <p className="text-gray-500 text-xs sm:text-sm truncate">
                Active Customers
              </p>
              <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold mt-1 sm:mt-2 dark:text-white">
                {customers.filter((c) => Number(c.total_orders) > 0).length}
              </h2>
            </div>

            <div className="w-9 h-9 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-purple-500 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0">
              <ShoppingBag className="text-white" size={18} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl shadow-lg p-3 sm:p-5 lg:p-6">
          <div className="flex justify-between items-start sm:items-center gap-2">
            <div className="min-w-0">
              <p className="text-gray-500 text-xs sm:text-sm truncate">
                Inactive
              </p>
              <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold mt-1 sm:mt-2 dark:text-white">
                {customers.filter((c) => Number(c.total_orders) === 0).length}
              </h2>
            </div>

            <div className="w-9 h-9 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-red-500 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0">
              <Users className="text-white" size={18} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl shadow-lg p-3 sm:p-5 lg:p-6">
          <div className="flex justify-between items-start sm:items-center gap-2">
            <div className="min-w-0">
              <p className="text-gray-500 text-xs sm:text-sm truncate">
                New Customers
              </p>
              <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold mt-1 sm:mt-2 dark:text-white">
                {
                  customers.filter((c) => {
                    if (!c.last_order) return false;
                    const days =
                      (Date.now() - new Date(c.last_order).getTime()) /
                      (1000 * 60 * 60 * 24);
                    return days <= 30;
                  }).length
                }
              </h2>
            </div>

            <div className="w-9 h-9 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-green-500 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0">
              <UserPlus className="text-white" size={18} />
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          <div className="relative">
            <Search
              className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />

            <input
              type="text"
              placeholder="Search Customer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border rounded-xl pl-10 sm:pl-11 py-2.5 sm:py-3 text-sm sm:text-base dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
          </div>

          <div className="relative">
            <Filter
              className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full border rounded-xl pl-10 sm:pl-11 py-2.5 sm:py-3 text-sm sm:text-base dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            >
              <option>All Customers</option>

              <option>Active</option>

              <option>Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Customer List */}
      <div className="bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0 mb-5 sm:mb-6">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold dark:text-white">
            Customer List
          </h2>

          <span className="text-gray-500 text-xs sm:text-sm">
            {filteredCustomers.length} Customers
          </span>
        </div>

        {loading ? (
          <p className="text-center text-gray-500 py-10">
            Loading customers...
          </p>
        ) : filteredCustomers.length === 0 ? (
          <p className="text-center text-gray-500 py-10">No customers found.</p>
        ) : (
          <>
            {/* Mobile/tablet: stacked cards (no horizontal scroll) */}
            <div className="md:hidden space-y-3">
              {filteredCustomers.map((customer) => {
                const status =
                  Number(customer.total_orders) > 0 ? "Active" : "Inactive";
                return (
                  <div
                    key={customer.id}
                    className="border dark:border-gray-800 rounded-xl p-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-semibold dark:text-white truncate">
                          {customer.full_name}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {customer.total_orders} orders •{" "}
                          {customer.last_order
                            ? new Date(customer.last_order).toLocaleDateString(
                                "en-IN",
                              )
                            : "-"}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <StatusBadge status={status} />
                        <button
                          onClick={() => handleViewCustomer(customer.id)}
                          className="text-blue-600 hover:scale-110 transition"
                        >
                          <Eye size={18} />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-2 text-sm text-gray-500 min-w-0">
                      <Mail size={14} className="shrink-0" />
                      <span className="truncate">{customer.email}</span>
                    </div>

                    <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                      <Phone size={14} className="shrink-0" />
                      {customer.mobile}
                    </div>

                    <div className="flex items-center justify-between mt-2 text-sm text-gray-500">
                      <span>Total Spent</span>
                      <span className="font-semibold dark:text-white">
                        ₹{Number(customer.total_spent).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop/tablet-landscape: table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b dark:border-gray-700">
                    <th className="text-left py-4">Customer</th>
                    <th className="text-left py-4">Email</th>
                    <th className="text-left py-4">Mobile</th>
                    <th className="text-left py-4">Orders</th>
                    <th className="text-left py-4">Total Spent</th>
                    <th className="text-left py-4">Last Order</th>
                    <th className="text-left py-4">Status</th>
                    <th className="text-center py-4">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredCustomers.map((customer) => {
                    const status =
                      Number(customer.total_orders) > 0 ? "Active" : "Inactive";
                    return (
                      <tr
                        key={customer.id}
                        className="border-b dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                      >
                        <td className="py-4 font-semibold dark:text-white">
                          {customer.full_name}
                        </td>

                        <td className="dark:text-gray-200">
                          <div className="flex items-center gap-2">
                            <Mail size={16} />
                            {customer.email}
                          </div>
                        </td>

                        <td className="dark:text-gray-200">
                          <div className="flex items-center gap-2">
                            <Phone size={16} />
                            {customer.mobile}
                          </div>
                        </td>

                        <td className="dark:text-gray-200">
                          {customer.total_orders}
                        </td>

                        <td className="dark:text-gray-200">
                          ₹
                          {Number(customer.total_spent).toLocaleString("en-IN")}
                        </td>

                        <td className="dark:text-gray-200">
                          {customer.last_order
                            ? new Date(customer.last_order).toLocaleDateString(
                                "en-IN",
                              )
                            : "-"}
                        </td>

                        <td>
                          <StatusBadge status={status} />
                        </td>

                        <td>
                          <div className="flex justify-center">
                            <button
                              onClick={() => handleViewCustomer(customer.id)}
                              className="text-blue-600 hover:scale-110 transition"
                            >
                              <Eye size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      <CustomerDetailsModal
        isOpen={openModal}
        customer={selectedCustomer}
        orders={customerOrders}
        onClose={() => {
          setOpenModal(false);
          setSelectedCustomer(null);
          setCustomerOrders([]);
        }}
      />
    </div>
  );
}
