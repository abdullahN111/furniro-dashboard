import { NextResponse } from "next/server";
import { createClient } from "next-sanity";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  apiVersion: "2025-03-13",
  token: process.env.SANITY_API_TOKEN, 
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const price = Number(formData.get("price"));
    const tags = (formData.get("tags") as string)
      ?.split(",")
      .map((tag) => tag.trim()) || [];
    const dicountPercentage = Number(formData.get("dicountPercentage")) || 0;
    const isNew = formData.get("isNew") === "true";
    const inventoryInStock = Number(formData.get("inventoryInStock"));
    const featured = formData.get("featured") as string;
    const slug = { _type: "slug", current: formData.get("slug") as string };

    let imageRef = null;
    const productImage = formData.get("productImage") as File;

    if (productImage) {
      const arrayBuffer = await productImage.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const uploadedImage = await client.assets.upload("image", buffer, {
        filename: productImage.name,
      });

      imageRef = {
        _type: "image",
        asset: { _type: "reference", _ref: uploadedImage._id },
      };
    }

    const newProduct = {
      _type: "product",
      title,
      description,
      price,
      tags,
      dicountPercentage,
      isNew,
      inventoryInStock,
      featured,
      slug,
      productImage: imageRef,
    };

    const createdProduct = await client.create(newProduct);

    return NextResponse.json(
      { success: true, productId: createdProduct._id },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error adding product:", error);
    return NextResponse.json(
      { success: false, message: "Failed to add product" },
      { status: 500 }
    );
  }
}
