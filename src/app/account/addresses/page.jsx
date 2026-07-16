"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import AddressCard from "@/components/address/AddressCard";
import AddressModal from "@/components/address/AddressModal";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function AddressesPage() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);

  useEffect(() => {
    fetchAddresses();
  }, []);

  async function fetchAddresses() {
    try {
      setLoading(true);

      const res = await fetch("/api/address");
      const data = await res.json();

      if (data.success) {
        setAddresses(data.addresses);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load addresses.");
    } finally {
      setLoading(false);
    }
  }

  function handleAdd() {
    setSelectedAddress(null);
    setModalOpen(true);
  }

  function handleEdit(address) {
    setSelectedAddress(address);
    setModalOpen(true);
  }

  async function handleDelete(address) {
    const confirmed = window.confirm("Delete this address?");

    if (!confirmed) return;

    try {
      const res = await fetch(`/api/address/${address.id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success) {
        toast.success(data.message);
        fetchAddresses();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    }
  }

  async function handleSetDefault(address) {
    try {
      const res = await fetch(`/api/address/default/${address.id}`, {
        method: "PUT",
      });

      const data = await res.json();

      if (data.success) {
        toast.success(data.message);
        fetchAddresses();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    }
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-20 text-center">
        Loading Addresses...
      </div>
    );
  }

  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center justify-center w-10 h-10 rounded-lg border-2 border-gray-200 text-gray-600 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 active:scale-90 transition-all duration-150"
          aria-label="Go back"
        >
          <ArrowLeft size={18} />
        </button>

        <h1 className="text-4xl font-bold">My Addresses</h1>

        <button
          onClick={handleAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl"
        >
          + Add Address
        </button>
      </div>

      {addresses.length === 0 ? (
        <div className="border rounded-xl py-16 text-center">
          <h2 className="text-2xl font-semibold">No Addresses Found</h2>

          <p className="text-gray-500 mt-3">Add your first delivery address.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {addresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onSetDefault={handleSetDefault}
            />
          ))}
        </div>
      )}

      <AddressModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        address={selectedAddress}
        onSuccess={fetchAddresses}
      />
    </section>
  );
}
