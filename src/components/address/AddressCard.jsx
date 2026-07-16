"use client";

import {
  Home,
  MapPin,
  Phone,
  User,
  Pencil,
  Trash2,
  CheckCircle,
} from "lucide-react";

export default function AddressCard({
  address,
  onEdit,
  onDelete,
  onSetDefault,
}) {
  return (
    <div className="bg-white rounded-2xl border shadow-sm p-6 hover:shadow-md transition">

      {/* Header */}
      <div className="flex justify-between items-start">

        <div className="flex items-center gap-3">

          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
            <Home className="text-blue-600" size={22} />
          </div>

          <div>
            <h3 className="font-bold text-lg">
              {address.full_name}
            </h3>

            <div className="flex items-center gap-2 mt-1 text-gray-500">
              <Phone size={16} />
              {address.phone}
            </div>
          </div>

        </div>

        {address.is_default === 1 && (
          <span className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
            <CheckCircle size={16} />
            Default
          </span>
        )}

      </div>

      {/* Address */}
      <div className="flex gap-3 mt-6">

        <MapPin className="text-gray-400 mt-1" size={18} />

        <div className="text-gray-600 leading-7">

          <p>{address.address_line1}</p>

          {address.address_line2 && (
            <p>{address.address_line2}</p>
          )}

          <p>
            {address.city}, {address.state}
          </p>

          <p>{address.pincode}</p>

          {address.landmark && (
            <p>{address.landmark}</p>
          )}

        </div>

      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 mt-8">

        <button
          onClick={() => onEdit(address)}
          className="px-4 py-2 rounded-lg border hover:bg-gray-100 transition flex items-center gap-2"
        >
          <Pencil size={18} />
          Edit
        </button>

        <button
          onClick={() => onDelete(address)}
          className="px-4 py-2 rounded-lg border text-red-600 hover:bg-red-50 transition flex items-center gap-2"
        >
          <Trash2 size={18} />
          Delete
        </button>

        {!address.is_default && (
          <button
            onClick={() => onSetDefault(address)}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Set Default
          </button>
        )}

      </div>

    </div>
  );
}