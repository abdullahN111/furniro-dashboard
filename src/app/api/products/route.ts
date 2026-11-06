import { NextResponse } from "next/server";
import { serverClient } from "@/sanity/lib/serverClient";
import { requireAuth } from "@/app/lib/auth";

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(req: Request) {
  try {
    await requireAuth();

    const formData = await req.formData();

    const title = String(formData.get("title") || "").trim();
    const description = String(formData.get("description") || "").trim();
    const price = Number(formData.get("price"));
    const tags = String(formData.get("tags") || "")
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
    const dicountPercentage = Number(formData.get("dicountPercentage")) || 0;
    const isNew = formData.get("isNew") === "true";
    const inventoryInStock = Number(formData.get("inventoryInStock"));
    const featured = String(formData.get("featured") || "").trim();
    const slugCurrent = String(formData.get("slug") || "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, "-")
      .replace(/^-|-$/g, "");

    if (!title || !description || !Number.isFinite(price) || price < 0) {
      return NextResponse.json(
        { success: false, message: "Title, description, and valid price are required" },
        { status: 400 }
      );
    }

    if (!Number.isInteger(inventoryInStock) || inventoryInStock < 0) {
      return NextResponse.json(
        { success: false, message: "Valid non-negative integer stock quantity is required" },
        { status: 400 }
      );
    }

    if (dicountPercentage < 0 || dicountPercentage > 100) {
      return NextResponse.json(
        { success: false, message: "Discount percentage must be between 0 and 100" },
        { status: 400 }
      );
    }

    let imageRef = null;
    const productImage = formData.get("productImage");

    if (productImage instanceof File && productImage.size > 0) {
      if (!ALLOWED_IMAGE_TYPES.includes(productImage.type)) {
        return NextResponse.json(
          { success: false, message: "Invalid image format. Allowed: JPG, PNG, WEBP, GIF" },
          { status: 400 }
        );
      }
      if (productImage.size > MAX_IMAGE_SIZE) {
        return NextResponse.json(
          { success: false, message: "Image file size must be under 10MB" },
          { status: 400 }
        );
      }

      const arrayBuffer = await productImage.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const uploadedImage = await serverClient.assets.upload("image", buffer, {
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
      slug: { _type: "slug", current: slugCurrent || title.toLowerCase().replace(/\s+/g, "-") },
      productImage: imageRef,
    };

    const createdProduct = await serverClient.create(newProduct);

    return NextResponse.json(
      { success: true, productId: createdProduct._id },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }
    console.error("Error adding product:", error);
    return NextResponse.json(
      { success: false, message: "Failed to add product" },
      { status: 500 }
    );
  }
}
