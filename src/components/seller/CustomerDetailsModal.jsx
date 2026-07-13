"use client";

import { X, Mail, Phone, ShoppingCart, IndianRupee, Calendar } from "lucide-react";

export default function CustomerDetailsModal({
  isOpen,
  customer,
  orders,
  onClose,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-4">

      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">

        {/* Header */}

        <div className="flex items-center justify-between border-b dark:border-gray-700 p-6">

          <h2 className="text-2xl font-bold dark:text-white">
            Customer Details
          </h2>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500"
          >
            <X size={24} />
          </button>

        </div>

        <div className="p-6 space-y-8">

          {/* Customer Info */}

          <div>

            <h3 className="text-lg font-semibold mb-5 dark:text-white">
              Customer Information
            </h3>

            <div className="grid md:grid-cols-2 gap-6">

              <div className="flex items-center gap-3">

                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                  {customer?.full_name?.charAt(0)}
                </div>

                <div>

                  <p className="text-gray-500 text-sm">
                    Customer Name
                  </p>

                  <p className="font-semibold dark:text-white">
                    {customer?.full_name}
                  </p>

                </div>

              </div>

              <div className="flex items-center gap-3">

                <Mail className="text-blue-600" />

                <div>

                  <p className="text-gray-500 text-sm">
                    Email
                  </p>

                  <p className="dark:text-white">
                    {customer?.email}
                  </p>

                </div>

              </div>

              <div className="flex items-center gap-3">

                <Phone className="text-green-600" />

                <div>

                  <p className="text-gray-500 text-sm">
                    Mobile
                  </p>

                  <p className="dark:text-white">
                    {customer?.mobile}
                  </p>

                </div>

              </div>

              <div className="flex items-center gap-3">

                <ShoppingCart className="text-orange-500" />

                <div>

                  <p className="text-gray-500 text-sm">
                    Total Orders
                  </p>

                  <p className="font-semibold dark:text-white">
                    {customer?.total_orders}
                  </p>

                </div>

              </div>

              <div className="flex items-center gap-3">

                <IndianRupee className="text-purple-600" />

                <div>

                  <p className="text-gray-500 text-sm">
                    Total Spent
                  </p>

                  <p className="font-semibold text-green-600">
                    ₹
                    {Number(
                      customer?.total_spent || 0
                    ).toLocaleString("en-IN")}
                  </p>

                </div>

              </div>

              <div className="flex items-center gap-3">

                <Calendar className="text-red-500" />

                <div>

                  <p className="text-gray-500 text-sm">
                    Last Order
                  </p>

                  <p className="dark:text-white">
                    {customer?.last_order
                      ? new Date(
                          customer.last_order
                        ).toLocaleDateString("en-IN")
                      : "-"}
                  </p>

                </div>

              </div>

            </div>

          </div>

          {/* Recent Orders */}

          <div>

            <h3 className="text-lg font-semibold mb-4 dark:text-white">
              Recent Orders
            </h3>

            <div className="overflow-x-auto rounded-xl border dark:border-gray-700">

              <table className="w-full">

                <thead className="bg-gray-100 dark:bg-gray-800">

                  <tr>

                    <th className="text-left p-4">
                      Order No.
                    </th>

                    <th className="text-left p-4">
                      Amount
                    </th>

                    <th className="text-left p-4">
                      Payment
                    </th>

                    <th className="text-left p-4">
                      Status
                    </th>

                    <th className="text-left p-4">
                      Date
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {orders?.length === 0 ? (

                    <tr>

                      <td
                        colSpan="5"
                        className="text-center py-8 text-gray-500"
                      >
                        No Orders Found
                      </td>

                    </tr>

                  ) : (

                    orders?.map((order) => (

                      <tr
                        key={order.id}
                        className="border-t dark:border-gray-700"
                      >

                        <td className="p-4">
                          {order.order_number}
                        </td>

                        <td className="p-4">
                          ₹
                          {Number(
                            order.total_amount
                          ).toLocaleString("en-IN")}
                        </td>

                        <td className="p-4">
                          {order.payment_status}
                        </td>

                        <td className="p-4">
                          {order.order_status}
                        </td>

                        <td className="p-4">
                          {new Date(
                            order.created_at
                          ).toLocaleDateString("en-IN")}
                        </td>

                      </tr>

                    ))

                  )}

                </tbody>

              </table>

            </div>

          </div>

          {/* Footer */}

          <div className="flex justify-end">

            <button
              onClick={onClose}
              className="px-6 py-3 rounded-xl bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:text-white"
            >
              Close
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}