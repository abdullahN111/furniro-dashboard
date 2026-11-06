"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import LocalSearchBar from "@/app/dashboard/search/LocalSearchBar";
import Image from "next/image";
import { fetchProducts, Product } from "./ProductData";
import Link from "next/link";
import AddProduct from "./AddProduct";
import PaginationControls from "@/app/components/admin/pagination/PaginationControls";
import ProductActions from "./ProductActions";

interface ProductsProps {
  showAll?: boolean;
  heading?: string;
}

const Products = ({ showAll = false, heading = "Products Catalog" }: ProductsProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProducts = async () => {
      try {
        setLoading(true);
        const fetchedProducts = await fetchProducts();
        setProducts(fetchedProducts);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
    getProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;
    const q = searchQuery.toLowerCase();
    return products.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p._id.toLowerCase().includes(q) ||
        (p.tags || "").toLowerCase().includes(q)
    );
  }, [searchQuery, products]);

  const displayedProducts = useMemo(
    () => (showAll ? filteredProducts : filteredProducts.slice(0, 5)),
    [filteredProducts, showAll]
  );

  const columns = useMemo(
    () => [
      {
        accessorKey: "index",
        header: "#",
        cell: ({ row }: { row: { index: number } }) => (
          <span className="text-xs font-mono text-slate-400">
            {row.index + 1}
          </span>
        ),
      },
      {
        accessorKey: "image",
        header: "Product",
        cell: ({ row }: { row: { original: Product } }) => (
          <Link
            href={`/dashboard/products/product/${row.original.slug.current}`}
            className="flex items-center gap-3 group"
          >
            <Image
              src={row.original.image || "/images/noproduct.jpg"}
              alt={row.original.title}
              width={44}
              height={44}
              className="rounded-xl object-cover w-11 h-11 border border-slate-700 shrink-0"
            />
            <div className="min-w-0">
              <div className="font-semibold text-slate-100 group-hover:text-indigo-400 transition-colors truncate">
                {row.original.title}
              </div>
              {row.original.tags && (
                <div className="text-xs text-slate-400 truncate max-w-[220px]">
                  {row.original.tags}
                </div>
              )}
            </div>
          </Link>
        ),
      },
      {
        accessorKey: "price",
        header: "Price",
        cell: ({ row }: { row: { original: Product } }) => (
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-100">
              ${row.original.price}
            </span>
            {row.original.dicountPercentage && (
              <span className="px-1.5 py-0.5 text-[10px] font-semibold rounded bg-rose-500/15 text-rose-300 border border-rose-500/30">
                {row.original.dicountPercentage.text}
              </span>
            )}
          </div>
        ),
      },
      {
        accessorKey: "stock",
        header: "Inventory",
        cell: ({ row }: { row: { original: Product } }) => {
          const stock = row.original.inventoryInStock;
          return (
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                stock > 10
                  ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                  : stock > 0
                    ? "bg-amber-500/15 text-amber-300 border-amber-500/30"
                    : "bg-rose-500/15 text-rose-300 border-rose-500/30"
              }`}
            >
              {stock > 0 ? `${stock} in stock` : "Out of stock"}
            </span>
          );
        },
      },
      {
        accessorKey: "action",
        header: "Actions",
        cell: ({ row }: { row: { original: Product } }) => (
          <ProductActions
            action={row.original._id}
            onDelete={(id) =>
              setProducts((prev) => prev.filter((p) => p._id !== id))
            }
            link={`/dashboard/products/product/${row.original.slug.current}`}
          />
        ),
      },
    ],
    []
  );

  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  const table = useReactTable({
    data: displayedProducts,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: { pagination },
    onPaginationChange: setPagination,
  });

  if (loading) {
    return (
      <div className="w-full bg-[#111827] border border-slate-800 rounded-2xl p-6 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-indigo-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="w-full bg-[#111827] p-5 sm:p-6 rounded-2xl shadow-lg border border-slate-800/90">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h2 className="text-white text-base sm:text-lg font-bold capitalize">
            {heading}
          </h2>
          <p className="text-xs text-slate-400">
            Showing {displayedProducts.length} of {filteredProducts.length} products
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <LocalSearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search products or tags..."
          />
          <AddProduct onProductAdded={() => fetchProducts().then(setProducts)} />
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block w-full overflow-hidden rounded-xl border border-slate-800/80">
        <Table className="w-full">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center py-10 text-slate-400"
                >
                  No products match your search.
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden flex flex-col gap-3">
        {table.getRowModel().rows.length === 0 ? (
          <div className="text-center py-10 text-slate-400 text-sm border border-slate-800 rounded-xl">
            No products match your search.
          </div>
        ) : (
          table.getRowModel().rows.map(({ original: product }) => (
            <div
              key={product._id}
              className="p-4 border border-slate-800 rounded-xl bg-slate-900/50 space-y-3"
            >
              <div className="flex items-center gap-3">
                <Image
                  src={product.image || "/images/noproduct.jpg"}
                  alt={product.title}
                  width={48}
                  height={48}
                  className="rounded-xl object-cover w-12 h-12 border border-slate-700 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/dashboard/products/product/${product.slug.current}`}
                    className="font-semibold text-sm text-white hover:text-indigo-400 truncate block"
                  >
                    {product.title}
                  </Link>
                  <span className="text-xs text-slate-400">
                    ${product.price} • {product.inventoryInStock} in stock
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex justify-end">
                <ProductActions
                  action={product._id}
                  onDelete={(id) =>
                    setProducts((prev) => prev.filter((p) => p._id !== id))
                  }
                  link={`/dashboard/products/product/${product.slug.current}`}
                />
              </div>
            </div>
          ))
        )}
      </div>

      <PaginationControls
        showAll={showAll}
        url="/dashboard/products"
        pagination={pagination}
        table={table}
        view={"Products"}
      />
    </div>
  );
};

export default Products;
