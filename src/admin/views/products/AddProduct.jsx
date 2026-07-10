"use client";

import { apiFetch } from "../../../lib/api";
import TextEditor from "../../../components/editor/TextEditor";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createSlug, generateSlug, isValidSlug } from "../../../lib/slug";
import CategoryPicker from "../../../components/CategoryPicker";

export default function AddProductPage() {
  const router = useRouter();

  // ======================
  // STATES
  // ======================
  const [categories, setCategories] = useState([]);
  const [productCodeExists, setProductCodeExists] = useState(false); // Changed state name
  const [existingProducts, setExistingProducts] = useState([]);
  const [productExists, setProductExists] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isSlugEdited, setIsSlugEdited] = useState(false);
  const [slugExists, setSlugExists] = useState(false);

  const [formData, setFormData] = useState({
    productCode: "", // Perfectly aligns with your new DB schema
    title: "",
    slug: "",
    description: "",
    metaTitle: "",
    metaDescription: "",
    category: null,
    status: "active",
    images: [],
    specifications: [],
  });

  // ======================
  // FETCH CATEGORIES
  // ======================
  async function fetchCategories() {
    try {
      const response = await apiFetch("/categories");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchProducts() {
    try {
      const response = await apiFetch("/products");
      const data = await response.json();
      setExistingProducts(data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (!isSlugEdited) {
      setFormData((prev) => ({
        ...prev,
        slug: generateSlug(prev.title),
      }));
    }
  }, [formData.title, isSlugEdited]);

  // ======================
  // LOAD DATA
  // ======================
  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  // ======================
  // IMAGE UPLOAD
  // ======================
  async function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const uploadData = new FormData();
    uploadData.append("file", file);

    try {
      const response = await apiFetch("/upload", {
        method: "POST",
        body: uploadData,
      });

      const data = await response.json();

      if (!data.success) {
        alert(data.message);
        return;
      }

      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, data.imageUrl],
      }));
    } catch (error) {
      console.log(error);
    } finally {
      setUploading(false);
    }
  }

  // ======================
  // REMOVE IMAGE
  // ======================
  function removeImage(index) {
    const updatedImages = formData.images.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      images: updatedImages,
    });
  }

  // ======================
  // CREATE PRODUCT
  // ======================
  async function handleSubmit(e) {
    e.preventDefault();

    // ======================
    // VALIDATE SLUG
    // ======================
    if (!isValidSlug(formData.slug)) {
      alert("slug is not valid");
      return;
    }

    try {
      // ======================
      // FETCH PRODUCTS
      // ======================
      const productsResponse = await apiFetch("/products");
      const existingProducts = await productsResponse.json();

      // ======================
      // CREATE UNIQUE SLUG
      // ======================
      const slugExists = existingProducts.some(
        (item) => item.slug === formData.slug
      );

      if (slugExists) {
        alert("Slug already exists");
        return;
      }

      // ======================
      // UPDATED DATA
      // ======================
      const updatedFormData = {
        ...formData,
      };

      // ======================
      // CREATE PRODUCT
      // ======================
      const response = await apiFetch("/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedFormData),
      });

      const data = await response.json();

      // ======================
      // ERROR
      // ======================
      if (!data.success) {
        alert(data.message);
        return;
      }

      // ======================
      // SUCCESS
      // ======================
      alert("Product Created Successfully");
      router.push("/admin/products");
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  }

  // ======================
  // UI
  // ======================
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-10 w-full">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl md:rounded-3xl shadow-xl p-5 md:p-10">

        {/* Header */}
        <div className="mb-6 md:mb-10">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900">
            Add Product
          </h1>
          <p className="text-gray-500 mt-2 md:mt-3 text-base md:text-lg">
            Create new product
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">

          {/* Product Code */}
          <div>
            <label className="block text-base md:text-lg font-semibold text-gray-700 mb-2 md:mb-3">
              Product Code *
            </label>

            {productCodeExists && (
              <p className="text-red-500 text-sm mt-2">
                Product Code already exists
              </p>
            )}

            <input
              required
              type="text"
              value={formData.productCode} // Tracks field smoothly
              onChange={(e) => {
                const value = e.target.value;
                const exists = existingProducts.some(
                  (item) =>
                    item.productCode?.trim().toLowerCase() ===
                    value.trim().toLowerCase()
                );
                setProductCodeExists(exists);
                setFormData({ ...formData, productCode: value });
              }}
              className="w-full border border-gray-300 bg-white text-black p-3.5 md:p-4 rounded-xl outline-none focus:ring-2 focus:ring-black text-sm md:text-base"
            />
          </div>

          {/* Product Title */}
          <div>
            <label className="block text-base md:text-lg font-semibold text-gray-700 mb-2 md:mb-3">
              Product Title *
            </label>
            {productExists && (
              <p className="text-red-500 text-sm mt-2">
                Product already exists
              </p>
            )}
            <input
              required
              pattern=".*[A-Za-z].*"
              title="Title cannot contain only numbers"
              type="text"
              value={formData.title}
              onChange={(e) => {
                const value = e.target.value;
                const exists = existingProducts.some(
                  (item) =>
                    item.title?.trim().toLowerCase() ===
                    value.trim().toLowerCase()
                );
                setProductExists(exists);
                setFormData({
                  ...formData,
                  title: value,
                });
              }}
              className="w-full border border-gray-300 bg-white text-black p-3.5 md:p-4 rounded-xl outline-none focus:ring-2 focus:ring-black text-sm md:text-base"
            />
          </div>

          {/* Product Slug */}
          <div>
            <label className="block text-base md:text-lg font-semibold text-gray-700 mb-2 md:mb-3">
              Product Slug *
            </label>
            {slugExists && (
              <p className="text-red-500 text-sm mt-2">
                Slug already exists
              </p>
            )}
            <input
              required
              type="text"
              value={formData.slug}
              onChange={(e) => {
                const slugValue = generateSlug(e.target.value);
                const exists = existingProducts.some(
                  (item) => item.slug === slugValue
                );
                setSlugExists(exists);
                setFormData({
                  ...formData,
                  slug: slugValue,
                });
                setIsSlugEdited(slugValue !== "");
              }}
              className="w-full border border-gray-300 bg-white text-black p-3.5 md:p-4 rounded-xl outline-none focus:ring-2 focus:ring-black text-sm md:text-base"
            />
          </div>

          {/* Description */}
          <div className="text-black">
            <label className="block text-base md:text-lg font-semibold text-gray-700 mb-2 md:mb-3">
              Description
            </label>
            <div className="w-full overflow-x-auto">
              <TextEditor
                value={formData.description}
                onChange={(content) =>
                  setFormData({
                    ...formData,
                    description: content,
                  })
                }
                height={400}
              />
            </div>
          </div>

          {/* Meta Title */}
          <div>
            <label className="block text-base md:text-lg font-semibold text-gray-700 mb-2 md:mb-3">
              Meta Title
            </label>
            <input
              type="text"
              value={formData.metaTitle}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  metaTitle: e.target.value,
                })
              }
              className="w-full border border-gray-300 bg-white text-black p-3.5 md:p-4 rounded-xl outline-none focus:ring-2 focus:ring-black text-sm md:text-base"
            />
          </div>

          {/* Meta Description */}
          <div>
            <label className="block text-base md:text-lg font-semibold text-gray-700 mb-2 md:mb-3">
              Meta Description
            </label>
            <textarea
              value={formData.metaDescription}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  metaDescription: e.target.value,
                })
              }
              className="w-full h-32 md:h-40 border border-gray-300 bg-white text-black p-3.5 md:p-4 rounded-xl outline-none focus:ring-2 focus:ring-black resize-none text-sm md:text-base"
            />
          </div>

          {/* Product Category */}
          <div className="text-black">
            <label className="block text-base md:text-lg font-semibold text-gray-700 mb-2 md:mb-3">
              Product Category
            </label>
            <CategoryPicker
              categories={categories}
              value={formData.category}
              onChange={(id) =>
                setFormData({
                  ...formData,
                  category: id,
                })
              }
              label="Select Product Category"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-base md:text-lg font-semibold text-gray-700 mb-2 md:mb-3">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value,
                })
              }
              className="w-full border border-gray-300 bg-white text-black p-3.5 md:p-4 rounded-xl outline-none focus:ring-2 focus:ring-black text-sm md:text-base"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Upload Images */}
          <div>
            <label className="block text-base md:text-lg font-semibold text-gray-700 mb-3 md:mb-4">
              Upload Images
            </label>
            <label className="border-2 border-dashed border-gray-300 hover:border-black transition rounded-2xl md:rounded-3xl bg-gray-50 p-6 md:p-10 flex flex-col items-center justify-center cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <div className="w-14 h-14 md:w-20 md:h-20 rounded-full bg-black text-white flex items-center justify-center text-2xl md:text-4xl mb-3 md:mb-5">
                +
              </div>
              <h2 className="text-lg md:text-2xl font-bold text-black text-center">
                Upload Product Image
              </h2>
              <p className="text-gray-500 mt-1 text-sm md:text-base text-center">
                Click to select image
              </p>
            </label>

            {uploading && (
              <div className="mt-4 bg-blue-50 text-blue-700 px-4 py-3 rounded-xl font-medium text-sm">
                Uploading image...
              </div>
            )}

            <p className="text-xs md:text-sm text-gray-500 mt-3 leading-relaxed">
              Allowed formats: JPG, PNG, WEBP, GIF
              <br />
              Maximum size: 5 MB
            </p>

            {/* Preview */}
            {formData.images.length > 0 && (
              <div className="mt-6 md:mt-8">
                <h3 className="text-lg md:text-xl font-bold text-black mb-4 md:mb-5">
                  Uploaded Images
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-5">
                  {formData.images.map((img, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={img}
                        alt="product"
                        className="w-full h-32 md:h-40 object-cover rounded-xl md:rounded-2xl border shadow-md"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white w-7 h-7 rounded-full flex items-center justify-center md:opacity-0 group-hover:opacity-100 transition shadow"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Specifications */}
          <div>
            <label className="block text-base md:text-lg font-semibold text-gray-700 mb-2 md:mb-3">
              Specifications
            </label>
            <textarea
              value={
                Array.isArray(formData.specifications)
                  ? formData.specifications.join(", ")
                  : ""
              }
              onChange={(e) =>
                setFormData({
                  ...formData,
                  specifications: e.target.value
                    .split(",")
                    .map((item) => item.trim()),
                })
              }
              className="w-full border border-gray-300 bg-white text-black p-3.5 md:p-4 rounded-xl outline-none focus:ring-2 focus:ring-black resize-none h-32 md:h-40 text-sm md:text-base"
            />
          </div>

          {/* Submit */}
          <button
            disabled={productCodeExists || productExists || slugExists}
            className="w-full sm:w-auto bg-black hover:bg-gray-800 text-white px-8 md:px-10 py-3.5 md:py-4 rounded-xl text-base md:text-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create Product
          </button>

        </form>
      </div>
    </div>
  );
}