"use server";

import { StaticImageData } from "next/image";
import { serverClient } from "@/sanity/lib/serverClient";
import { requireAuth } from "@/app/lib/auth";

export interface Product {
  _id: string;
  image: StaticImageData | string;
  sideImages?: (StaticImageData | string)[];
  dicountPercentage?: {
    text: string;
    color: string;
  };
  title: string;
  tags: string;
  price: string;
  oldPrice?: string;
  featured: string;
  stars: string[];
  reviews: string;
  description: string;
  isNew: boolean;
  inventoryInStock: number;
  slug: { current: string };
}

interface FetchedProduct {
  _id: string;
  title: string;
  description: string;
  productImage: string;
  price: number | string;
  tags: string[];
  featured: string;
  dicountPercentage?: number | string;
  isNew: boolean;
  inventoryInStock: number;
  slug: { current: string };
}

export async function fetchProducts(): Promise<Product[]> {
  await requireAuth();
  const query = `*[_type == "product"] | order(_createdAt desc) {
    _id,
    title,
    description,
    "productImage": productImage.asset->url,
    price,
    "tags": coalesce(tags, []),
    featured,
    dicountPercentage,
    isNew,
    "inventoryInStock": coalesce(inventoryInStock, 0),
    slug
  }`;

  const products: FetchedProduct[] = await serverClient.fetch(
    query,
    {},
    { cache: "no-store" }
  );

  return products.map((product: FetchedProduct) => {
    const imgUrl = product.productImage || "/images/noproduct.jpg";
    const numPrice = Number(product.price) || 0;
    const numDiscount = Number(product.dicountPercentage) || 0;

    return {
      _id: product._id,
      image: imgUrl,
      sideImages: [imgUrl, imgUrl, imgUrl, imgUrl],
      dicountPercentage:
        numDiscount > 0
          ? { text: `-${numDiscount}%`, color: "#E97171" }
          : undefined,
      title: product.title || "Untitled Product",
      tags: Array.isArray(product.tags) ? product.tags.join(", ") : "",
      price: numPrice.toFixed(2),
      oldPrice:
        numDiscount > 0
          ? (numPrice * (1 + numDiscount / 100)).toFixed(2)
          : undefined,
      stars: ["★", "★", "★", "★", "★"],
      reviews: "Verified Catalog Item",
      description: product.description || "",
      featured: product.featured || "Standard",
      isNew: Boolean(product.isNew),
      inventoryInStock: Number(product.inventoryInStock) || 0,
      slug: product.slug?.current
        ? product.slug
        : { current: product._id },
    };
  });
}
