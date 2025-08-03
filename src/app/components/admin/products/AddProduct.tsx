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
        <Button className="bg-[#3f3fad] hover:bg-[#313195] text-white px-2 md:px-3 py-2 rounded-lg text-[13px] md:text-sm font-medium shadow-md transition-all">
          Add Product
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white text-[--textDark] max-w-lg max-h-[85vh] overflow-y-auto rounded-xl p-6 shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-800">
            Add New Product
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 font-semibold mb-1">
              Title
            </label>
            <Input
              name="title"
              onChange={handleInputChange}
              className="border-[2px] border-gray-600 rounded-md p-2 focus:border-gray-700 focus:font-medium transition-all"
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">{errors.title}</p>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-700 font-semibold mb-1">
              Description
            </label>
            <Textarea
              name="description"
              onChange={handleInputChange}
               className="border-[2px] border-gray-600 rounded-md p-2 focus:border-gray-700 focus:font-medium transition-all min-h-36 resize-y"
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">{errors.description}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 font-semibold mb-1">
                Price
              </label>
              <Input
                name="price"
                type="number"
                onChange={handleInputChange}
                className="border-[2px] border-gray-600 rounded-md p-2 focus:border-gray-700 focus:font-medium transition-all"
              />
              {errors.price && (
                <p className="text-red-500 text-xs mt-1">{errors.price}</p>
              )}
            </div>
            <div>
              <label className="block text-sm text-gray-700 font-semibold mb-1">
                Discount Percentage
              </label>
              <Input
                name="dicountPercentage"
                type="number"
                onChange={handleInputChange}
                className="border-[2px] border-gray-600 rounded-md p-2 focus:border-gray-700 focus:font-medium transition-all"
              />
              {errors.dicountPercentage && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.dicountPercentage}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-700 font-semibold mb-1">
              Tags (comma-separated)
            </label>
            <Input
              name="tags"
              onChange={handleInputChange}
              className="border-[2px] border-gray-600 rounded-md p-2 focus:border-gray-700 focus:font-medium transition-all"
            />
            {errors.tags && (
              <p className="text-red-500 text-xs mt-1">{errors.tags}</p>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-700 font-semibold mb-1">
              Stock Quantity
            </label>
            <Input
              name="inventoryInStock"
              type="number"
              onChange={handleInputChange}
              className="border-[2px] border-gray-600 rounded-md p-2 focus:border-gray-700 focus:font-medium transition-all"
            />
            {errors.inventoryInStock && (
              <p className="text-red-500 text-xs mt-1">
                {errors.inventoryInStock}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-700 font-semibold mb-1">
              Featured Name
            </label>
            <Input
              name="featured"
              onChange={handleInputChange}
              className="border-[2px] border-gray-600 rounded-md p-2 focus:border-gray-700 focus:font-medium transition-all"
            />
            {errors.featured && (
              <p className="text-red-500 text-xs mt-1">{errors.featured}</p>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-700 font-semibold mb-1">
              Slug
            </label>
            <Input
              name="slug"
              value={newProduct.slug}
              disabled
              className="border border-gray-300 rounded-md p-2 bg-gray-100"
            />
          </div>

          <div className="flex items-center gap-3">
            <Switch
              checked={newProduct.isNew}
              onCheckedChange={(checked) =>
                setNewProduct((prev) => ({ ...prev, isNew: checked }))
              }
            />
            <span className="text-sm  text-gray-700 font-semibold">
              New Product
            </span>
          </div>

          <div>
            <label className="block text-sm  text-gray-700 font-semibold mb-1">
              Product Image
            </label>
            <Input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="border-[2px] border-gray-600 rounded-md p-2 focus:border-gray-700 focus:font-medium transition-all"
            />
            {errors.productImage && (
              <p className="text-red-500 text-xs mt-1">{errors.productImage}</p>
            )}
          </div>
        </div>

        <Button
          onClick={addProduct}
          className="bg-[--bgSoft] hover:bg-[#182237e2] text-white w-full mt-4 py-2 rounded-lg text-sm font-medium shadow-md transition-all"
        >
          Submit
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default AddProduct;
