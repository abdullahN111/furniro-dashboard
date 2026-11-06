"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetchProducts, Product } from "./ProductData";
import ProductActions from "./ProductActions";
import { toast } from "sonner";
import { MdArrowBack, MdInventory2 } from "react-icons/md";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [stockAdjustment, setStockAdjustment] = useState(0);
  const [updatingStock, setUpdatingStock] = useState(false);

  useEffect(() => {
    async function loadProducts() {
      try {
        setInitialLoading(true);
        const fetchedProducts = await fetchProducts();
        setProducts(fetchedProducts);
      } catch (err) {
        console.error("Failed to load product details:", err);
      } finally {
        setInitialLoading(false);
      }
    }
    loadProducts();
  }, []);

  const handleStockUpdate = async (productId: string) => {
    if (stockAdjustment === 0) return;

    setUpdatingStock(true);
    try {
      const response = await fetch("/api/products/update-stock", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: productId, newStock: stockAdjustment }),
      });

      const data = await response.json();

      if (response.ok) {
        setProducts((prevProducts) =>
          prevProducts.map((p) =>
            p._id === productId
              ? { ...p, inventoryInStock: p.inventoryInStock + stockAdjustment }
              : p
          )
        );
        setIsStockModalOpen(false);
        setStockAdjustment(0);
        toast.success("Inventory stock updated.");
      } else {
        toast.error(data.message || "Failed to update stock");
      }
    } catch (error) {
      console.error("Network error:", error);
      toast.error("Failed to update stock");
    } finally {
      setUpdatingStock(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="w-full bg-[#111827] border border-slate-800 rounded-2xl p-6 flex justify-center items-center h-80">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-indigo-500 border-t-transparent" />
      </div>
    );
  }

  const product = products.find(
    (item) => item.slug?.current === id || item._id === id
  );

  if (!product) {
    return (
      <div className="bg-[#111827] border border-slate-800 rounded-2xl p-12 text-center">
        <h2 className="text-xl font-bold text-white mb-2">Product Not Found</h2>
        <p className="text-slate-400 text-sm mb-6">
          This catalog item may have been removed or its URL slug changed.
        </p>
        <Link
          href="/dashboard/products"
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
        >
          <MdArrowBack size={16} />
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/products"
          className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors"
        >
          <MdArrowBack size={16} />
          Back to Catalog
        </Link>
      </div>

      <div className="bg-[#111827] border border-slate-800/90 rounded-2xl p-5 sm:p-8 shadow-lg grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Image Gallery Column */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="relative flex justify-center items-center bg-slate-900/90 border border-slate-800 rounded-2xl h-[320px] sm:h-[400px] overflow-hidden p-4">
            <Image
              src={product.image || "/images/noproduct.jpg"}
              alt={product.title}
              width={500}
              height={500}
              className="object-contain max-h-full w-auto rounded-xl"
            />
          </div>
        </div>

        {/* Product Specifications Column */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              {product.isNew && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                  New Arrival
                </span>
              )}
              {product.featured && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  {product.featured}
                </span>
              )}
              {product.dicountPercentage && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-300 border border-rose-500/30">
                  {product.dicountPercentage.text} Discount
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              {product.title}
            </h1>

            <div className="flex items-baseline gap-3">
              <span className="text-2xl sm:text-3xl font-bold text-emerald-400">
                ${product.price}
              </span>
              {product.oldPrice && (
                <span className="text-sm text-slate-500 line-through">
                  ${product.oldPrice}
                </span>
              )}
            </div>

            <p className="text-sm text-slate-300 leading-relaxed pt-2 border-t border-slate-800/80">
              {product.description}
            </p>

            {product.tags && (
              <div className="pt-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Catalog Tags
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.tags
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean)
                    .map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 text-xs font-medium text-slate-200 bg-slate-900 border border-slate-800 rounded-lg"
                      >
                        #{tag}
                      </span>
                    ))}
                </div>
              </div>
            )}
          </div>

          <div className="pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Dialog
                open={isStockModalOpen}
                onOpenChange={setIsStockModalOpen}
              >
                <DialogTrigger asChild>
                  <button className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold shadow-lg shadow-indigo-600/20 transition-all">
                    <MdInventory2 size={17} />
                    <span>Adjust Stock ({product.inventoryInStock} units)</span>
                  </button>
                </DialogTrigger>
                <DialogContent className="bg-[#111827] text-slate-100 p-6 rounded-2xl max-w-md border border-slate-800 shadow-2xl">
                  <DialogHeader className="pb-2">
                    <DialogTitle className="text-lg font-bold text-white">
                      Adjust Inventory Stock Level
                    </DialogTitle>
                  </DialogHeader>

                  <div className="mt-3 space-y-4">
                    <div>
                      <label className="block mb-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Stock Delta (+ to add, - to deduct)
                      </label>
                      <Input
                        type="number"
                        value={stockAdjustment}
                        onChange={(e) =>
                          setStockAdjustment(Number(e.target.value))
                        }
                        min={-product.inventoryInStock}
                        max="9999"
                        disabled={updatingStock}
                        className="w-full bg-slate-900 text-slate-100 border border-slate-800 rounded-xl"
                      />
                    </div>

                    <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-slate-400">Current Stock</p>
                        <p className="text-xl font-bold text-slate-200 mt-0.5">
                          {product.inventoryInStock}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">Projected Stock</p>
                        <p
                          className={`text-xl font-bold mt-0.5 ${
                            product.inventoryInStock + stockAdjustment < 0
                              ? "text-rose-400"
                              : "text-emerald-400"
                          }`}
                        >
                          {product.inventoryInStock + stockAdjustment}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end gap-2.5">
                    <Button
                      variant="outline"
                      onClick={() => setIsStockModalOpen(false)}
                      disabled={updatingStock}
                      className="border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800 rounded-xl text-xs font-semibold"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => handleStockUpdate(product._id)}
                      disabled={
                        updatingStock ||
                        stockAdjustment === 0 ||
                        product.inventoryInStock + stockAdjustment < 0
                      }
                      className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold px-4"
                    >
                      {updatingStock ? "Updating..." : "Save Stock"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <ProductActions
              action={product._id}
              onDelete={() => router.push("/dashboard/products")}
              link={`/dashboard/products/product/${product.slug.current}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
