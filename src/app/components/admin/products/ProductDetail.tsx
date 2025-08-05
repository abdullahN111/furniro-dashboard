"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { fetchProducts, Product } from "./ProductData";
import { useState, useEffect } from "react";
import ProductActions from "./ProductActions";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [products, setProducts] = useState<Product[]>([]);

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
    <div className="w-full mx-auto py-6 sm:py-8 lg:py-10 mb-8 sm:mb-12 px-3 sm:px-5 lg:px-14 font-poppins flex flex-col gap-6 sm:gap-8 lg:gap-10">
      <div className="basis-[50%] flex flex-col gap-4 sm:gap-6 lg:gap-4">
        <div className="flex gap-2 sm:gap-3 lg:gap-5 overflow-x-auto pb-2">
          {product.sideImages?.map((img, idx) => (
            <Image
              key={idx}
              src={img}
              alt={`Product side image ${idx + 1}`}
              width={60}
              height={60}
              className="bg-[#F9F1E7] rounded-md object-cover w-[60px] h-[60px] sm:w-[80px] sm:h-[80px] flex-shrink-0"
            />
          ))}
        </div>

        <div className="relative flex justify-center items-center bg-[--bgSoft] rounded-md w-full h-[250px] sm:h-[300px] lg:h-[500px] overflow-hidden">
          <Image
            src={product.image}
            alt={`${product.title} main image`}
            width={550}
            height={550}
            className="object-contain max-w-full h-auto"
          />
        </div>
      </div>

      <div className="basis-[50%] flex flex-col gap-4 sm:gap-6">
        <h1 className="text-2xl sm:text-3xl lg:text-[40px] font-semibold">
          {product.title}
        </h1>
        <p className="text-lg sm:text-xl lg:text-2xl text-[#9F9F9F]">
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
        <p className="text-sm sm:text-[15px] leading-relaxed">
          {product.description}
        </p>

        {/* Tags */}
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

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 lg:gap-2 mt-4 sm:mt-6 items-start sm:items-center text-sm sm:text-base">
          <button className="bg-blue-700 text-white px-2 sm:px-3 py-1 sm:py-2 rounded-md text-xs sm:text-[13px] shadow">
            Stock: {product.inventoryInStock}
          </button>
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
