"use client";

import { X } from "lucide-react";

export default function OrderDetailsModal({
  isOpen,
  order,
  items,
  onClose,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-4">

      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">

        {/* Header */}

        <div className="flex justify-between items-center border-b p-6">

          <h2 className="text-2xl font-bold dark:text-white">
            Order Details
          </h2>

          <button onClick={onClose}>
            <X />
          </button>

        </div>

        <div className="p-6 space-y-8">

          {/* Customer */}

          <div>

            <h3 className="text-lg font-semibold mb-4 dark:text-white">
              Customer Information
            </h3>

            <div className="grid md:grid-cols-2 gap-4">

              <div>
                <p className="text-gray-500">Customer Name</p>
                <p className="font-medium dark:text-white">
                  {order?.full_name}
                </p>
              </div>

              <div>
                <p className="text-gray-500">Email</p>
                <p className="font-medium dark:text-white">
                  {order?.email}
                </p>
              </div>

              <div>
                <p className="text-gray-500">Mobile</p>
                <p className="font-medium dark:text-white">
                  {order?.mobile}
                </p>
              </div>

              <div>
                <p className="text-gray-500">Order Number</p>
                <p className="font-medium dark:text-white">
                  {order?.order_number}
                </p>
              </div>

            </div>

          </div>

          {/* Products */}

          <div>

            <h3 className="text-lg font-semibold mb-4 dark:text-white">
              Ordered Products
            </h3>

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead>

                  <tr className="border-b">

                    <th className="text-left py-3">
                      Product
                    </th>

                    <th className="text-center py-3">
                      Qty
                    </th>

                    <th className="text-right py-3">
                      Price
                    </th>

                    <th className="text-right py-3">
                      Subtotal
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {items?.map((item) => (

                    <tr
                      key={item.id}
                      className="border-b"
                    >

                      <td className="py-3">

                        <div className="flex items-center gap-3">

                          <img
                            src={
                              item.product_image ||
                              "/uploads/no-image.png"
                            }
                            className="w-14 h-14 rounded-lg object-cover"
                          />

                          <span>
                            {item.product_name}
                          </span>

                        </div>

                      </td>

                      <td className="text-center">
                        {item.quantity}
                      </td>

                      <td className="text-right">
                        ₹{item.price}
                      </td>

                      <td className="text-right">
                        ₹{item.subtotal}
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </div>

          {/* Summary */}

          <div className="border-t pt-6">

            <div className="grid md:grid-cols-2 gap-4">

              <div>

                <p className="text-gray-500">
                  Payment Status
                </p>

                <p className="font-medium">
                  {order?.payment_status}
                </p>

              </div>

              <div>

                <p className="text-gray-500">
                  Order Status
                </p>

                <p className="font-medium">
                  {order?.order_status}
                </p>

              </div>

              <div>

                <p className="text-gray-500">
                  Total Amount
                </p>

                <p className="text-xl font-bold text-green-600">
                  ₹{order?.total_amount}
                </p>

              </div>

              <div>

                <p className="text-gray-500">
                  Order Date
                </p>

                <p className="font-medium">
                  {new Date(order?.created_at).toLocaleDateString()}
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}