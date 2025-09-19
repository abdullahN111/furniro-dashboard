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
import { useSearch } from "@/app/dashboard/search/SearchContext";
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

const Products = ({ showAll = false, heading }: ProductsProps) => {
  const { pageSearchQuery } = useSearch();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProducts = async () => {
      const fetchedProducts = await fetchProducts();
      setProducts(fetchedProducts);
      setLoading(false);
    };
    getProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    if (!pageSearchQuery) return products;
    return products.filter(
      (p) =>
        p.title.toLowerCase().includes(pageSearchQuery.toLowerCase()) ||
        p._id.toLowerCase().includes(pageSearchQuery.toLowerCase())
    );
  }, [pageSearchQuery, products]);

  const displayedProducts = useMemo(
    () => (showAll ? filteredProducts : filteredProducts.slice(0, 5)),
    [filteredProducts, showAll]
  );

  const columns = [
    {
      accessorKey: "index",
      header: "#",
      cell: ({ row }: { row: { index: number } }) => row.index + 1,
    },
    {
      accessorKey: "image",
      header: "Image",
      cell: ({ row }: { row: { original: Product } }) => (
        <Link href={`/dashboard/products/product/${row.original.slug.current}`}>
          <Image
            src={row.original.image}
            alt={row.original.title}
            width={50}
            height={50}
            className="rounded-md object-cover w-[50px] h-[50px] cursor-pointer"
          />
        </Link>
      ),
    },
    {
      accessorKey: "name",
      header: "Product Name",
      cell: ({ row }: { row: { original: Product } }) => (
        <Link
          href={`/dashboard/products/product/${row.original.slug.current}`}
          className="cursor-pointer"
        >
          {row.original.title}
        </Link>
      ),
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }: { row: { original: Product } }) =>
        `$${row.original.price}`,
    },
    {
      accessorKey: "stock",
      header: "Stock Quantity",
      cell: ({ row }: { row: { original: Product } }) =>
        `${row.original.inventoryInStock}`,
    },
    {
      accessorKey: "action",
      header: "Action",
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
  ];

  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  const table = useReactTable({
    data: displayedProducts,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: { pagination },
    onPaginationChange: setPagination,
  });

  return (
    <div className="container bg-[--bgSoft] p-4 lg:p-2 xl:p-4 rounded-[10px] mb-8 mt-4 shadow-lg border border-[#2e374a]">
      <div className="text-[--textSoft] text-lg font-bold capitalize py-2">
        {heading}
      </div>
      <div className="mt-2 mb-3 flex justify-between">
        <LocalSearchBar scope="page" />
        <AddProduct onProductAdded={() => fetchProducts().then(setProducts)} />
      </div>
      <div className="hidden lg:block w-full overflow-auto rounded-lg shadow">
        <Table className="w-full xl:min-w-[600px]">
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
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center py-32 text-lg font-semibold text-[--textSoft]"
                >
                  Loading products...
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

      <div className="lg:hidden flex flex-col gap-4">
        {loading ? (
          <div className="text-center py-32 text-lg font-semibold text-[--textSoft]">
            Loading products...
          </div>
        ) : (
          displayedProducts
            .slice(
              pagination.pageIndex * pagination.pageSize,
              (pagination.pageIndex + 1) * pagination.pageSize
            )
            .map((product, index) => (
              <div
                key={product._id}
                className="p-3 sm:p-4 border border-[#2e374a] rounded-lg shadow-md bg-[--bgSoft]"
              >
                <p className="text-sm text-white mb-1 cursor-pointer">
                  #: {pagination.pageIndex * pagination.pageSize + index + 1}
                </p>
                <Link
                  href={`/dashboard/products/product/${product.slug.current}`}
                >
                  <Image
                    src={product.image}
                    alt={product.title}
                    width={50}
                    height={50}
                    className="rounded-md object-cover w-[50px] h-[50px] my-3"
                  />
                </Link>

                <p className="text-sm text-white mb-1 cursor-pointer">
                  <Link
                    href={`/dashboard/products/product/${product.slug.current}`}
                  >
                    Product: {product.title}
                  </Link>
                </p>

                <p className="text-sm text-white mb-1">
                  Price: {product.price}
                </p>
                <p className="text-sm text-white mb-1">
                  Stock Quantity: {product.inventoryInStock}
                </p>

                <ProductActions
                  action={product._id}
                  onDelete={(id) =>
                    setProducts((prev) => prev.filter((p) => p._id !== id))
                  }
                  link={`/dashboard/products/product/${product.slug.current}`}
                />
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
