"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

import ProductForm from "@/components/seller/ProductForm";
import ProductTable from "@/components/seller/ProductTable";
import SearchFilter from "@/components/seller/SearchFilter";
import Pagination from "@/components/seller/Pagination";
import DeleteModal from "@/components/seller/DeleteModal";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loadingList, setLoadingList] = useState(true);

  const [editingProduct, setEditingProduct] = useState(null);

  const [productToDelete, setProductToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("newest");

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;

  // ===========================
  // Fetch Products
  // ===========================
  const fetchProducts = useCallback(async () => {
    try {
      setLoadingList(true);

      const res = await fetch("/api/seller/products", {
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message);
      }

      setProducts(data.products || []);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoadingList(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // ===========================
  // Edit
  // ===========================
  function handleEdit(product) {
    setEditingProduct(product);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // ===========================
  // Delete
  // ===========================
  async function handleConfirmDelete() {
    if (!productToDelete) return;

    try {
      setDeleting(true);

      const res = await fetch(
        `/api/seller/products/${productToDelete.id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message);
      }

      toast.success(data.message);

      fetchProducts();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeleting(false);
      setProductToDelete(null);
    }
  }

  // ===========================
  // Search + Filter + Sort
  // ===========================
  const filteredProducts = useMemo(() => {
    let data = [...products];

    if (search) {
      data = data.filter((item) =>
        item.product_name
          .toLowerCase()
          .includes(search.toLowerCase())
      );
    }

    if (category) {
      data = data.filter(
        (item) => item.category_id === Number(category)
      );
    }

    switch (sort) {
      case "price_low":
        data.sort((a, b) => a.price - b.price);
        break;

      case "price_high":
        data.sort((a, b) => b.price - a.price);
        break;

      case "name":
        data.sort((a, b) =>
          a.product_name.localeCompare(b.product_name)
        );
        break;

      case "oldest":
        data.reverse();
        break;

      default:
        break;
    }

    return data;
  }, [products, search, category, sort]);

  // ===========================
  // Pagination
  // ===========================
  const totalPages = Math.ceil(
    filteredProducts.length / productsPerPage
  );

  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  return (
    <div>

      <div className="mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold dark:text-white">
            Products
          </h1>
          <p className="text-gray-500 mt-1 sm:mt-2 text-sm sm:text-base">
            Create and manage products.
          </p>
        </div>

      <ProductForm
        editingProduct={editingProduct}
        onCancelEdit={() => setEditingProduct(null)}
        onSaved={fetchProducts}
      />

      <div className="mt-8">

        <SearchFilter
          search={search}
          setSearch={setSearch}
          category={category}
          setCategory={setCategory}
          sort={sort}
          setSort={setSort}
        />

        {loadingList ? (

          <div className="flex items-center gap-2 py-10">

            <Loader2
              size={18}
              className="animate-spin"
            />

            Loading Products...

          </div>

        ) : (

          <>
            <ProductTable
              products={currentProducts}
              onEdit={handleEdit}
              onDelete={setProductToDelete}
            />

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>

        )}

      </div>

      <DeleteModal
        isOpen={Boolean(productToDelete)}
        itemName={productToDelete?.product_name}
        loading={deleting}
        onCancel={() => setProductToDelete(null)}
        onConfirm={handleConfirmDelete}
      />

    </div>
  );
}