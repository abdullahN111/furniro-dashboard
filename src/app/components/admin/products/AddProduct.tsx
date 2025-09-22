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
import { DialogClose } from "@radix-ui/react-dialog";

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

     <DialogContent className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl p-6 shadow-xl border-0">
  <DialogHeader className="border-b border-gray-100 pb-4">
    <DialogTitle className="text-2xl font-bold text-gray-800 text-center">
      Add New Product
    </DialogTitle>
    <DialogClose asChild>
  <button className="absolute right-0 top-0 p-2 rounded-full hover:bg-gray-100 transition-colors">
    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
    </svg>
  </button>
</DialogClose>

  </DialogHeader>

  <div className="space-y-5 mt-5">

    <div>
      <label className="block text-sm font-medium text-gray-600 mb-2">
        Product Title *
      </label>
      <Input
        name="title"
        onChange={handleInputChange}
        placeholder="Enter product title"
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
      {errors.title && (
        <p className="text-red-500 text-xs mt-1">{errors.title}</p>
      )}
    </div>


    <div>
      <label className="block text-sm font-medium text-gray-600 mb-2">
        Description *
      </label>
      <Textarea
        name="description"
        onChange={handleInputChange}
        placeholder="Write a detailed product description"
        className="w-full min-h-32 resize-none px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
      {errors.description && (
        <p className="text-red-500 text-xs mt-1">{errors.description}</p>
      )}
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">
          Price ($) *
        </label>
        <Input
          name="price"
          type="number"
          step="0.01"
          onChange={handleInputChange}
          placeholder="0.00"
          className="w-full"
        />
        {errors.price && (
          <p className="text-red-500 text-xs mt-1">{errors.price}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">
          Discount (%)
        </label>
        <Input
          name="dicountPercentage"
          type="number"
          onChange={handleInputChange}
          placeholder="e.g. 15"
          className="w-full"
        />
        {errors.dicountPercentage && (
          <p className="text-red-500 text-xs mt-1">{errors.dicountPercentage}</p>
        )}
      </div>
    </div>

    {/* Tags Field */}
    <div>
      <label className="block text-sm font-medium text-gray-600 mb-2">
        Tags (comma-separated)
      </label>
      <Input
        name="tags"
        onChange={handleInputChange}
        placeholder="e.g. electronics, phone, sale"
        className="w-full"
      />
      {errors.tags && (
        <p className="text-red-500 text-xs mt-1">{errors.tags}</p>
      )}
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">
          Stock Quantity *
        </label>
        <Input
          name="inventoryInStock"
          type="number"
          onChange={handleInputChange}
          placeholder="e.g. 100"
          className="w-full"
        />
        {errors.inventoryInStock && (
          <p className="text-red-500 text-xs mt-1">{errors.inventoryInStock}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">
          Featured Label
        </label>
        <Input
          name="featured"
          onChange={handleInputChange}
          placeholder="e.g. Best Seller"
          className="w-full"
        />
        {errors.featured && (
          <p className="text-red-500 text-xs mt-1">{errors.featured}</p>
        )}
      </div>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-600 mb-2">
        Slug (Auto-generated)
      </label>
      <Input
        name="slug"
        value={newProduct.slug}
        disabled
        className="w-full bg-gray-50 text-gray-600"
      />
    </div>


    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
      <Switch
        checked={newProduct.isNew}
        onCheckedChange={(checked) =>
          setNewProduct((prev) => ({ ...prev, isNew: checked }))
        }
      />
      <span className="text-sm font-medium text-gray-600">
        Mark as New Product
      </span>
    </div>


    <div>
      <label className="block text-sm font-medium text-gray-600 mb-2">
        Product Image *
      </label>
      <div 
        className="border-2 border-dashed border-gray-300 rounded-lg p-5 flex flex-col items-center justify-center text-center cursor-pointer transition-colors hover:border-blue-400 bg-gray-50"
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
        <label htmlFor="fileInput" className="cursor-pointer">
          {newProduct.productImage ? (
            <div className="flex flex-col items-center">
              <span className="text-sm font-medium text-gray-800 mb-1">
                {newProduct.productImage.name}
              </span>
              <span className="text-xs text-gray-600">Click to change</span>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm text-gray-600">
                Drag & drop or click to upload
              </span>
              <span className="text-xs text-gray-400 mt-1">
                PNG, JPG, GIF up to 10MB
              </span>
            </div>
          )}
        </label>
      </div>
      {errors.productImage && (
        <p className="text-red-500 text-xs mt-1">{errors.productImage}</p>
      )}
    </div>
  </div>

  <div className="mt-6 pt-4 border-t border-gray-100">
    <Button
      onClick={addProduct}
      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors shadow-md"
    >
      Submit Product
    </Button>
  </div>
</DialogContent>
    </Dialog>
  );
};

export default AddProduct;
