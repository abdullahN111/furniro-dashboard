"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
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

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [stockAdjustment, setStockAdjustment] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleStockUpdate = async (productId: string) => {
    if (stockAdjustment === 0) return;

    setLoading(true);
    try {
      const response = await fetch("/api/updateStock", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: productId, newStock: stockAdjustment }),
      });

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
      } else {
        const errorData = await response.json();
        console.error("Failed to update stock:", errorData.message);
      }
    } catch (error) {
      console.error("Network error:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    async function loadProducts() {
      const fetchedProducts = await fetchProducts();
      setProducts(fetchedProducts);
    }
    loadProducts();
  }, []);

  if (!products) {
    return <p className="text-center my-16">Loading product details...</p>;
  }

  const product = products.find((item) => item.slug?.current === id);

  if (!product) {
    return (
      <div className="text-center my-16">
        <p>Product not found. Please check the URL.</p>
        <a href="/" className="text-blue-500 underline">
          Go back to products
        </a>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto py-5 sm:py-7 lg+:py-9 mb-6 sm:mb-10 px-3 sm:px-5 font-poppins flex flex-col lg+:flex-row gap-6">
      <div className="flex flex-col lg+:flex-row gap-3 lg+:gap-4 w-full lg+:w-1/2">
        <div className="flex lg+:flex-col gap-2 sm:gap-3 overflow-x-auto lg+:overflow-visible lg+:w-[80px]">
          {product.sideImages?.map((img, idx) => (
            <Image
              key={idx}
              src={img}
              alt={`Product side image ${idx + 1}`}
              width={80}
              height={80}
              className="bg-[#F9F1E7] rounded-md object-cover w-[60px] h-[60px] sm:w-[80px] sm:h-[80px] flex-shrink-0"
            />
          ))}
        </div>

        <div className="relative flex justify-center items-center bg-[--bgSoft] rounded-md flex-1 h-[300px] sm:h-[400px] lg+:h-[500px] overflow-hidden">
          <Image
            src={product.image}
            alt={`${product.title} main image`}
            width={600}
            height={600}
            className="object-contain max-w-full h-full"
          />
        </div>
      </div>

      <div className="flex flex-col gap-3 lg+:w-1/2">
        <h1 className="text-2xl sm:text-3xl lg+:text-4xl font-semibold">
          {product.title}
        </h1>
        <p className="text-lg+ sm:text-xl lg+:text-[21px] text-[#9F9F9F]">
          $ {product.price}.00
        </p>
        <div className="flex items-center gap-3 sm:gap-5 my-1">
          <p className="text-base sm:text-lg text-[#FFC700]">
            {product.stars.join(" ")}
          </p>
          <div className="h-[20px] sm:h-[30px] w-px bg-[#9F9F9F]"></div>
          <p className="text-xs sm:text-[13px] text-[#9F9F9F]">
            {product.reviews}
          </p>
        </div>
        <p className="text-sm">{product.description}</p>

        <div className="flex flex-col gap-2 sm:gap-3">
          <p className="text-[#9F9F9F] text-sm">Tags</p>
          <div className="flex flex-wrap gap-2">
            {product.tags.split(", ").map((tag, index) => (
              <div
                key={index}
                className="px-2 sm:px-3 py-1 text-xs sm:text-[13px] text-black bg-[#F9F1E7] rounded-md"
              >
                {tag}
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 lg+:gap-2 mt-4 sm:mt-6 items-start sm:items-center text-sm sm:text-base">
          <Dialog open={isStockModalOpen} onOpenChange={setIsStockModalOpen}>
            <DialogTrigger asChild>
              <button className="bg-blue-700 text-white px-2 sm:px-3 py-1 sm:py-2 rounded-md text-xs sm:text-[13px] shadow">
                Stock: {product.inventoryInStock}
              </button>
            </DialogTrigger>
            <DialogContent className="bg-white p-6 rounded-xl max-w-md border-0 shadow-xl">
              <DialogHeader className="pb-2">
                <DialogTitle className="text-xl font-semibold text-gray-800 text-center">
                  Adjust Stock Level
                </DialogTitle>
              </DialogHeader>

              <div className="mt-4 space-y-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Adjustment Amount
                  </label>
                  <Input
                    type="number"
                    value={stockAdjustment}
                    onChange={(e) => setStockAdjustment(Number(e.target.value))}
                    min="-9999"
                    max="9999"
                    disabled={loading}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-600"
                  />
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Current Stock
                      </p>
                      <p className="text-lg font-semibold text-gray-800">
                        {product.inventoryInStock}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        New Stock
                      </p>
                      <p
                        className={`text-lg font-semibold ${
                          product.inventoryInStock + stockAdjustment < 0
                            ? "text-red-600"
                            : "text-green-600"
                        }`}
                      >
                        {product.inventoryInStock + stockAdjustment}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setIsStockModalOpen(false)}
                  disabled={loading}
                  className="px-4 py-2 border-gray-300 text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handleStockUpdate(product._id)}
                  disabled={loading || stockAdjustment === 0}
                  className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Updating...
                    </span>
                  ) : (
                    "Update Stock"
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <ProductActions
            action={product._id}
            onDelete={(id) =>
              setProducts((prev) => prev.filter((p) => p._id !== id))
            }
            link={`/dashboard/products/product/${product.slug.current}`}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
