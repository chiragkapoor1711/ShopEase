"use client";

export default function AddressList({
  addresses,
  selectedAddress,
  setSelectedAddress,
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border p-6">

      <h2 className="text-2xl font-bold mb-6">
        Delivery Address
      </h2>

      {addresses.length === 0 ? (
        <div className="text-center py-10">

          <p className="text-gray-500">
            No address found.
          </p>

          <button
            onClick={() => window.location.href = "/account/addresses"}
            className="mt-5 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl"
          >
            Add Address
          </button>

        </div>
      ) : (
        <div className="space-y-4">

          {addresses.map((address) => (

            <label
              key={address.id}
              className={`block border rounded-xl p-5 cursor-pointer transition ${
                selectedAddress === address.id
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-200"
              }`}
            >

              <div className="flex items-start gap-4">

                <input
                  type="radio"
                  checked={selectedAddress === address.id}
                  onChange={() =>
                    setSelectedAddress(address.id)
                  }
                />

                <div>

                  <h3 className="font-semibold text-lg">
                    {address.full_name}
                  </h3>

                  <p className="text-gray-600 mt-2">
                    {address.address}
                  </p>

                  <p className="text-gray-600">
                    {address.city}, {address.state}
                  </p>

                  <p className="text-gray-600">
                    {address.country} - {address.pincode}
                  </p>

                  <p className="text-gray-600 mt-2">
                    📞 {address.phone}
                  </p>

                  {address.is_default === 1 && (
                    <span className="inline-block mt-3 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                      Default Address
                    </span>
                  )}

                </div>

              </div>

            </label>

          ))}

        </div>
      )}

    </div>
  );
}