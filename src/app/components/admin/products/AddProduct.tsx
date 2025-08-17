"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

interface AddProductModalProps {
  onProductAdded: () => void;
}

const AddProduct: React.FC<AddProductModalProps> = ({ onProductAdded }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [newProduct, setNewProduct] = useState({
    title: "",
    description: "",
    price: "",
    tags: "",
    dicountPercentage: "",
    isNew: false,
    inventoryInStock: 0,
    featured: "",
    slug: "",
    productImage: null as File | null,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setNewProduct((prev) => ({
      ...prev,
      [name]: value,
      slug:
        name === "title" ? value.toLowerCase().replace(/ /g, "-") : prev.slug,
    }));

    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewProduct((prev) => ({ ...prev, productImage: e.target.files![0] }));
      setErrors((prevErrors) => ({ ...prevErrors, productImage: "" }));
    }
  };

  const addProduct = async () => {
    const newErrors: { [key: string]: string } = {};

    if (!newProduct.title.trim()) newErrors.title = "Title is required";
    if (!newProduct.description.trim())
      newErrors.description = "Description is required";
    if (!newProduct.price.trim()) newErrors.price = "Price is required";
    if (!newProduct.tags.trim()) newErrors.tags = "Tags are required";
    if (!newProduct.dicountPercentage.trim())
      newErrors.dicountPercentage = "Discount is required";
    if (!newProduct.featured.trim())
      newErrors.featured = "Featured field is required";
    if (newProduct.inventoryInStock <= 0)
      newErrors.inventoryInStock = "Stock must be greater than 0";
    if (!newProduct.productImage)
      newErrors.productImage = "Product image is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", newProduct.title);
      formData.append("description", newProduct.description);
      formData.append("price", newProduct.price);
      formData.append("tags", newProduct.tags);
      formData.append("dicountPercentage", newProduct.dicountPercentage);
      formData.append("isNew", String(newProduct.isNew));
      formData.append(
        "inventoryInStock",
        newProduct.inventoryInStock.toString()
      );
      formData.append("featured", newProduct.featured);
      formData.append("slug", newProduct.slug);

      if (newProduct.productImage) {
        formData.append("productImage", newProduct.productImage);
      }

      const response = await fetch("/api/product", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        onProductAdded();
        setIsOpen(false);
      } else {
        console.error("Failed to add product:", result.message);
      }
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#3f3fad] hover:bg-[#313195] text-white px-4 py-2 rounded-lg text-[15px] sm:text-base font-medium shadow-md transition-all">
          + Add Product
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-white text-gray-900 w-full max-h-[85vh] overflow-y-auto rounded-xl p-6 shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-[22px] font-bold text-gray-800">
            Add New Product
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div>
            <label className="block text-[15px] sm:text-base font-semibold text-gray-700 mb-1">
              Title
            </label>
            <Input
              name="title"
              onChange={handleInputChange}
              placeholder="Enter product title"
              className="w-full"
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">{errors.title}</p>
            )}
          </div>

          <div>
            <label className="block text-[15px] sm:text-base font-semibold text-gray-700 mb-1">
              Description
            </label>
            <Textarea
              name="description"
              onChange={handleInputChange}
              placeholder="Write a short description"
              className="w-full min-h-28 resize-none"
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">{errors.description}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[15px] sm:text-base font-semibold text-gray-700 mb-1">
                Price ($)
              </label>
              <Input
                name="price"
                type="number"
                onChange={handleInputChange}
                placeholder="0.00"
              />
              {errors.price && (
                <p className="text-red-500 text-xs mt-1">{errors.price}</p>
              )}
            </div>
            <div>
              <label className="block text-[15px] sm:text-base font-semibold text-gray-700 mb-1">
                Discount (%)
              </label>
              <Input
                name="dicountPercentage"
                type="number"
                onChange={handleInputChange}
                placeholder="e.g. 15"
              />
              {errors.dicountPercentage && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.dicountPercentage}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-[15px] sm:text-base font-semibold text-gray-700 mb-1">
              Tags (comma-separated)
            </label>
            <Input
              name="tags"
              onChange={handleInputChange}
              placeholder="e.g. electronics, phone, sale"
            />
            {errors.tags && (
              <p className="text-red-500 text-xs mt-1">{errors.tags}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[15px] sm:text-base font-semibold text-gray-700 mb-1">
                Stock Quantity
              </label>
              <Input
                name="inventoryInStock"
                type="number"
                onChange={handleInputChange}
                placeholder="e.g. 100"
              />
              {errors.inventoryInStock && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.inventoryInStock}
                </p>
              )}
            </div>
            <div>
              <label className="block text-[15px] sm:text-base font-semibold text-gray-700 mb-1">
                Featured Label
              </label>
              <Input
                name="featured"
                onChange={handleInputChange}
                placeholder="e.g. Best Seller"
              />
              {errors.featured && (
                <p className="text-red-500 text-xs mt-1">{errors.featured}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-[15px] sm:text-base font-semibold text-gray-700 mb-1">
              Slug
            </label>
            <Input
              name="slug"
              value={newProduct.slug}
              disabled
              className="bg-gray-100"
            />
          </div>

          <div className="flex items-center gap-3">
            <Switch
              checked={newProduct.isNew}
              onCheckedChange={(checked) =>
                setNewProduct((prev) => ({ ...prev, isNew: checked }))
              }
            />
            <span className="text-[15px] sm:text-base font-semibold text-gray-700">
              Mark as New Product
            </span>
          </div>

          <div>
            <label className="block text-[15px] sm:text-base font-semibold text-gray-700 mb-2">
              Product Image
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-gray-500 hover:border-gray-400 transition cursor-pointer"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                const file = e.dataTransfer.files[0];
                setNewProduct((prev) => ({ ...prev, productImage: file }));
                setErrors((prevErrors) => ({ ...prevErrors, productImage: "" }));
              }
            }}
            >
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="fileInput"
              />
              <label htmlFor="fileInput" className="cursor-pointer text-center">
                {newProduct.productImage ? (
                  <span className="text-[15px] sm:text-base font-semibold text-gray-800">
                    {newProduct.productImage.name}
                  </span>
                ) : (
                  <span className="text-[15px] sm:text-base">
                    Click to upload or drag & drop
                  </span>
                )}
              </label>
            </div>
            {errors.productImage && (
              <p className="text-red-500 text-xs mt-1">{errors.productImage}</p>
            )}
          </div>
        </div>

        <Button
          onClick={addProduct}
          className="bg-[#3f3fad] hover:bg-[#313195] text-white w-full mt-6 py-2 rounded-lg text-[15px] sm:text-base font-medium shadow-md transition"
        >
          Submit Product
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default AddProduct;
