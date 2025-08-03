import { StaticImageData } from "next/image";
import { client } from "@/sanity/lib/client";

export interface Product {
  _id: string;
  image: StaticImageData;
  sideImages?: StaticImageData[];
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
  productImage: StaticImageData;
  price: string;
  tags: string[];
  featured: string;
  dicountPercentage?: string;
  isNew: boolean;
  inventoryInStock: number;
  slug: { current: string };
}

export async function fetchProducts(): Promise<Product[]> {
  const query = `*[_type == "product"]{
    _id,
    title,
    description,
    "productImage": productImage.asset->url,
    price,
    tags,
    featured,
    dicountPercentage,
    isNew,
    inventoryInStock,
    slug
  }`;

  const products: FetchedProduct[] = await client.fetch(query);

  return products.map((product: FetchedProduct) => {
    // console.log("Fetched Product:", product);
    return {
      _id: product._id,
      image: product.productImage,
      sideImages: [
        product.productImage,
        product.productImage,
        product.productImage,
        product.productImage,
      ],
      dicountPercentage: product.dicountPercentage
        ? { text: `-${product.dicountPercentage}%`, color: "#E97171" }
        : undefined,
      title: product.title,
      tags: product.tags.join(", "),
      price: product.price.toString(),
      oldPrice: product.dicountPercentage
        ? (
            parseFloat(product.price) *
            (1 + parseFloat(product.dicountPercentage) / 100)
          ).toFixed(2)
        : undefined,
      stars: ["★", "★", "★", "★"],
      reviews: "0 Customer Review",
      description: product.description,
      featured: product.featured,
      isNew: product.isNew,
      inventoryInStock: product.inventoryInStock,
      slug: product.slug,
    };
  });
}


