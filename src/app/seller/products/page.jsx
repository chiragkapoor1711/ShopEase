import ProductForm from "@/components/seller/ProductForm";
import ProductTable from "@/components/seller/ProductTable";
import SearchFilter from "@/components/seller/SearchFilter";
import Pagination from "@/components/seller/Pagination";

export default function ProductsPage() {
  return (
    <>
      <h1 className="text-3xl font-bold dark:text-white mb-8">
        Products
      </h1>

      <ProductForm />
      <SearchFilter />
      <ProductTable />
      <Pagination />
    </>
  );
}