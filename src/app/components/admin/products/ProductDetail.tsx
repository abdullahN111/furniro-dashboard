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
            <DialogContent className="bg-white p-6 rounded-lg max-w-sm">
              <DialogHeader>
                <DialogTitle>Adjust Stock</DialogTitle>
              </DialogHeader>
              <div className="mt-4">
                <label className="block mb-2">Adjustment Amount</label>
                <Input
                  type="number"
                  value={stockAdjustment}
                  onChange={(e) => setStockAdjustment(Number(e.target.value))}
                  min="-9999"
                  max="9999"
                  disabled={loading}
                />
                <p className="text-sm text-gray-600 mt-2">
                  Current Stock: {product.inventoryInStock}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  New Stock: {product.inventoryInStock + stockAdjustment}
                </p>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setIsStockModalOpen(false)}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handleStockUpdate(product._id)}
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={loading || stockAdjustment === 0}
                >
                  {loading ? "Updating..." : "Update Stock"}
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
