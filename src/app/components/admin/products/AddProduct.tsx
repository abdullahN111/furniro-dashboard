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
import { toast } from "sonner";
import { MdAdd } from "react-icons/md";

interface AddProductModalProps {
  onProductAdded: () => void;
}

const AddProduct: React.FC<AddProductModalProps> = ({ onProductAdded }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

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
      [name]: name === "inventoryInStock" ? Number(value) : value,
      slug:
        name === "title"
          ? value
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/^-|-$/g, "")
          : prev.slug,
    }));

    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewProduct((prev) => ({ ...prev, productImage: e.target.files![0] }));
      setErrors((prevErrors) => ({ ...prevErrors, productImage: "" }));
    }
  };

  const addProduct = async () => {
    const newErrors: { [key: string]: string } = {};

    if (!newProduct.title.trim()) newErrors.title = "Title is required";
    if (!newProduct.description.trim())
      newErrors.description = "Description is required";
    if (!newProduct.price.trim() || Number(newProduct.price) < 0)
      newErrors.price = "Valid price is required";
    if (!newProduct.tags.trim()) newErrors.tags = "Tags are required";
    if (!newProduct.dicountPercentage.trim())
      newErrors.dicountPercentage = "Discount percentage is required (use 0 for none)";
    if (!newProduct.featured.trim())
      newErrors.featured = "Featured label is required";
    if (Number(newProduct.inventoryInStock) <= 0)
      newErrors.inventoryInStock = "Stock must be greater than 0";
    if (!newProduct.productImage)
      newErrors.productImage = "Product image is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

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

      const response = await fetch("/api/products", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        onProductAdded();
        setIsOpen(false);
        setNewProduct({
          title: "",
          description: "",
          price: "",
          tags: "",
          dicountPercentage: "",
          isNew: false,
          inventoryInStock: 0,
          featured: "",
          slug: "",
          productImage: null,
        });
        toast.success("Product added to catalog.");
      } else {
        toast.error(result.message || "Failed to add product");
      }
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("An error occurred while adding the product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold shadow-lg shadow-indigo-600/20 transition-all inline-flex items-center gap-1.5">
          <MdAdd size={18} />
          <span>Add Product</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-[#111827] text-slate-100 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl p-6 shadow-2xl border border-slate-800">
        <DialogHeader className="border-b border-slate-800 pb-4">
          <DialogTitle className="text-xl font-bold text-white">
            Add New Catalog Product
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Product Title *
            </label>
            <Input
              name="title"
              value={newProduct.title}
              onChange={handleInputChange}
              placeholder="e.g. Nordic Oak Lounge Chair"
              className="w-full bg-slate-900 text-slate-100 border border-slate-800 rounded-xl placeholder:text-slate-500 focus:border-indigo-500"
            />
            {errors.title && (
              <p className="text-rose-400 text-xs mt-1">{errors.title}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Description *
            </label>
            <Textarea
              name="description"
              value={newProduct.description}
              onChange={handleInputChange}
              placeholder="Write a detailed product description..."
              className="w-full bg-slate-900 text-slate-100 border border-slate-800 rounded-xl placeholder:text-slate-500 focus:border-indigo-500"
            />
            {errors.description && (
              <p className="text-rose-400 text-xs mt-1">{errors.description}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Price ($) *
              </label>
              <Input
                name="price"
                type="number"
                step="0.01"
                value={newProduct.price}
                onChange={handleInputChange}
                placeholder="0.00"
                className="w-full bg-slate-900 text-slate-100 border border-slate-800 rounded-xl placeholder:text-slate-500 focus:border-indigo-500"
              />
              {errors.price && (
                <p className="text-rose-400 text-xs mt-1">{errors.price}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Discount (%) *
              </label>
              <Input
                name="dicountPercentage"
                type="number"
                value={newProduct.dicountPercentage}
                onChange={handleInputChange}
                placeholder="e.g. 15"
                className="w-full bg-slate-900 text-slate-100 border border-slate-800 rounded-xl placeholder:text-slate-500 focus:border-indigo-500"
              />
              {errors.dicountPercentage && (
                <p className="text-rose-400 text-xs mt-1">
                  {errors.dicountPercentage}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Tags (comma-separated) *
            </label>
            <Input
              name="tags"
              value={newProduct.tags}
              onChange={handleInputChange}
              placeholder="e.g. chair, living room, minimal"
              className="w-full bg-slate-900 text-slate-100 border border-slate-800 rounded-xl placeholder:text-slate-500 focus:border-indigo-500"
            />
            {errors.tags && (
              <p className="text-rose-400 text-xs mt-1">{errors.tags}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Stock Quantity *
              </label>
              <Input
                name="inventoryInStock"
                type="number"
                onChange={handleInputChange}
                placeholder="e.g. 50"
                className="w-full bg-slate-900 text-slate-100 border border-slate-800 rounded-xl placeholder:text-slate-500 focus:border-indigo-500"
              />
              {errors.inventoryInStock && (
                <p className="text-rose-400 text-xs mt-1">
                  {errors.inventoryInStock}
                </p>
              )}
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Featured Category *
              </label>
              <Input
                name="featured"
                value={newProduct.featured}
                onChange={handleInputChange}
                placeholder="e.g. Best Seller"
                className="w-full bg-slate-900 text-slate-100 border border-slate-800 rounded-xl placeholder:text-slate-500 focus:border-indigo-500"
              />
              {errors.featured && (
                <p className="text-rose-400 text-xs mt-1">{errors.featured}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                URL Slug (Auto-generated)
              </label>
              <Input
                name="slug"
                value={newProduct.slug}
                disabled
                className="w-full bg-slate-950 text-slate-400 border border-slate-800 rounded-xl font-mono text-xs"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-900 border border-slate-800 rounded-xl mt-5">
              <span className="text-xs font-semibold text-slate-300">
                Display &ldquo;New Arrival&rdquo; Badge
              </span>
              <Switch
                checked={newProduct.isNew}
                onCheckedChange={(checked) =>
                  setNewProduct((prev) => ({ ...prev, isNew: checked }))
                }
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Product Image *
            </label>
            <div
              className="border-2 border-dashed bg-slate-900/60 border-slate-800 rounded-xl p-5 flex flex-col items-center justify-center text-center cursor-pointer transition-colors hover:border-indigo-500/50"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  const file = e.dataTransfer.files[0];
                  setNewProduct((prev) => ({ ...prev, productImage: file }));
                  setErrors((prevErrors) => ({
                    ...prevErrors,
                    productImage: "",
                  }));
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
              <label htmlFor="fileInput" className="cursor-pointer w-full">
                {newProduct.productImage ? (
                  <div className="flex flex-col items-center">
                    <span className="text-sm font-semibold text-indigo-300 mb-0.5">
                      {newProduct.productImage.name}
                    </span>
                    <span className="text-xs text-slate-400">
                      Click to replace file
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <span className="text-sm font-medium text-slate-300">
                      Drag &amp; drop or click to upload image
                    </span>
                    <span className="text-xs text-slate-500 mt-1">
                      JPG, PNG, WEBP, or GIF up to 10MB
                    </span>
                  </div>
                )}
              </label>
            </div>
            {errors.productImage && (
              <p className="text-rose-400 text-xs mt-1">
                {errors.productImage}
              </p>
            )}
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={loading}
            className="border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800 rounded-xl"
          >
            Cancel
          </Button>
          <Button
            onClick={addProduct}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 rounded-xl font-semibold shadow-lg shadow-indigo-600/20"
            disabled={loading}
          >
            {loading ? "Uploading..." : "Create Product"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddProduct;
