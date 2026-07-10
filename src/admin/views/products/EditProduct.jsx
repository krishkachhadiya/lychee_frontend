"use client";

import { apiFetch } from "../../../lib/api";
import TextEditor from "../../../components/editor/TextEditor";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { generateSlug } from "../../../lib/slug";
import CategoryPicker from "../../../components/CategoryPicker";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_BASE_URL ||
  "http://localhost:5000";

function getImageUrl(imagePath) {
  if (!imagePath) return "/no-image.png";

  if (
    imagePath.startsWith("http://") ||
    imagePath.startsWith("https://")
  ) {
    return imagePath;
  }

  return `${BACKEND_URL}${imagePath}`;
}

export default function EditProductPage() {
  const router = useRouter();
  const { id } = useParams();

  // ======================
  // STATES
  // ======================
  const [categories, setCategories] = useState([]);
  const [productCodeExists, setProductCodeExists] = useState(false); // Changed from productIdExists
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [isSlugEdited, setIsSlugEdited] = useState(false);
  const [existingProducts, setExistingProducts] = useState([]);
  const [productExists, setProductExists] = useState(false);
  const [slugExists, setSlugExists] = useState(false);

  const [formData, setFormData] = useState({
    _id: "",
    productCode: "", // Tracks productCode natively now
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
  // INITIAL DATA LOAD
  // ======================
  useEffect(() => {
    async function loadInitialData() {
      try {
        setLoading(true);

        // 1. Fetch categories
        const catResponse = await apiFetch("/categories");
        const categoriesData = await catResponse.json();
        setCategories(categoriesData);

        // 2. Fetch all products (needed for your unique title/slug validation lists)
        const productsResponse = await apiFetch("/products");
        const allProducts = await productsResponse.json();
        setExistingProducts(allProducts);

        // 3. Find target product cleanly using item._id or item.id safely
        const product = allProducts.find(
          (item) => (item._id || item.id) === id
        );

        if (product) {
          setFormData({
            _id: product._id || product.id || "",
            productCode: product.productCode || "", // Updated to productCode
            title: product.title || "",
            slug: product.slug || "",
            description: product.description || "",
            metaTitle: product.metaTitle || "",
            metaDescription: product.metaDescription || "",
            category: product.category?._id || product.category || null,
            status: product.status || "active",
            images: Array.isArray(product.images) ? product.images : [],
            specifications: Array.isArray(product.specifications) ? product.specifications : [],
          });

          setIsSlugEdited(
            product.slug && product.slug !== generateSlug(product.title)
          );
        } else {
          alert("Product not found");
        }
      } catch (error) {
        console.error("Error loading edit page data:", error);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadInitialData();
    }
  }, [id]);

  // ======================
  // AUTO GENERATE SLUG
  // ======================
  useEffect(() => {
    if (!isSlugEdited && formData.title) {
      setFormData((prev) => ({
        ...prev,
        slug: generateSlug(prev.title),
      }));
    }
  }, [formData.title, isSlugEdited]);

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
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
  }

  // ======================
  // UPDATE PRODUCT
  // ======================
  async function handleUpdate(e) {
    e.preventDefault();

    if (!formData.category) {
      alert("Please select product category");
      return;
    }

    if (productExists || slugExists || productCodeExists) {
      alert("Please resolve duplicate validation issues before saving.");
      return;
    }

    try {
      const response = await apiFetch(`/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        alert("Product Updated Successfully");
        router.push("/admin/products");
      } else {
        alert(data.message || "Failed to update product");
      }
    } catch (error) {
      console.log(error);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-xl md:text-2xl font-semibold">
        Loading Product...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-section)] p-4 md:p-10 w-full">
      <div className="max-w-5xl mx-auto bg-[var(--color-card)] rounded-[var(--radius-lg)] md:rounded-[var(--radius-xl)] shadow-[var(--shadow-lg)] p-5 md:p-10">

        {/* Header */}
        <div className="mb-6 md:mb-10">
          <h1 className="text-3xl md:text-5xl font-bold text-[var(--color-primary)]">
            Edit Product
          </h1>
          <p className="text-[var(--color-text-muted)] mt-2 md:mt-3 text-base md:text-lg">
            Update product details
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleUpdate} className="space-y-6 md:space-y-8">

          {/* Product Code */}
          <div>
            <label className="block text-base md:text-lg font-semibold text-[var(--color-text)] mb-2 md:mb-3">
              Product Code *
            </label>

            {productCodeExists && (
              <p className="text-[var(--danger)] text-sm mt-2 mb-2">
                Product Code already exists
              </p>
            )}

            <input
              required
              type="text"
              value={formData.productCode} // Checked against productCode track
              onChange={(e) => {
                const value = e.target.value;

                const exists = existingProducts.some(
                  (item) =>
                    (item._id || item.id) !== id &&
                    item.productCode?.trim().toLowerCase() ===
                    value.trim().toLowerCase()
                );

                setProductCodeExists(exists);

                setFormData({
                  ...formData,
                  productCode: value,
                });
              }}
              className="w-full border border-[var(--color-border-strong)] bg-[var(--color-card)] text-[var(--color-text)] p-3.5 md:p-4 rounded-[var(--radius-md)] outline-none focus:ring-2 focus:ring-[var(--color-accent)] text-sm md:text-base"
            />
          </div>

          {/* Product Title */}
          <div>
            <label className="block text-base md:text-lg font-semibold text-[var(--color-text)] mb-2 md:mb-3">
              Product Title *
            </label>
            {productExists && (
              <p className="text-[var(--danger)] text-sm mt-2 mb-2">
                Product name already exists
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
                    (item._id || item.id) !== id &&
                    item.title?.trim().toLowerCase() === value.trim().toLowerCase()
                );

                setProductExists(exists);
                setFormData({ ...formData, title: value });
              }}
              className="w-full border border-[var(--color-border-strong)] bg-[var(--color-card)] text-[var(--color-text)] p-3.5 md:p-4 rounded-[var(--radius-md)] outline-none focus:ring-2 focus:ring-[var(--color-accent)] text-sm md:text-base"
            />
          </div>

          {/* Product Slug */}
          <div>
            <label className="block text-base md:text-lg font-semibold text-[var(--color-text)] mb-2 md:mb-3">
              Product Slug *
            </label>
            {slugExists && (
              <p className="text-[var(--danger)] text-sm mt-2 mb-2">
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
                  (item) =>
                    (item._id || item.id) !== id &&
                    item.slug === slugValue
                );

                setSlugExists(exists);
                setFormData({ ...formData, slug: slugValue });
                setIsSlugEdited(slugValue !== "");
              }}
              className="w-full border border-[var(--color-border-strong)] bg-[var(--color-card)] text-[var(--color-text)] p-3.5 md:p-4 rounded-[var(--radius-md)] outline-none focus:ring-2 focus:ring-[var(--color-accent)] text-sm md:text-base"
            />
          </div>

          {/* Description */}
          <div className="text-[var(--color-text)]">
            <label className="block text-base md:text-lg font-semibold text-[var(--color-text)] mb-2 md:mb-3">
              Description
            </label>
            <div className="w-full overflow-x-auto">
              <TextEditor
                value={formData.description}
                onChange={(content) =>
                  setFormData({ ...formData, description: content })
                }
                height={400}
              />
            </div>
          </div>

          {/* Category */}
          <div className="text-[var(--color-text)]">
            <label className="block text-base md:text-lg font-semibold text-[var(--color-text)] mb-2 md:mb-3">
              Product Category
            </label>
            <CategoryPicker
              categories={categories}
              value={formData.category}
              onChange={(id) => setFormData({ ...formData, category: id })}
              label="Select Product Category"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-base md:text-lg font-semibold text-[var(--color-text)] mb-2 md:mb-3">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              className="w-full border border-[var(--color-border-strong)] bg-[var(--color-card)] text-[var(--color-text)] p-3.5 md:p-4 rounded-[var(--radius-md)] outline-none focus:ring-2 focus:ring-[var(--color-accent)] text-sm md:text-base"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Meta Title */}
          <div>
            <label className="block text-base md:text-lg font-semibold text-[var(--color-text)] mb-2 md:mb-3">
              Meta Title
            </label>
            <input
              type="text"
              value={formData.metaTitle}
              onChange={(e) =>
                setFormData({ ...formData, metaTitle: e.target.value })
              }
              className="w-full border border-[var(--color-border-strong)] bg-[var(--color-card)] text-[var(--color-text)] p-3.5 md:p-4 rounded-[var(--radius-md)] outline-none focus:ring-2 focus:ring-[var(--color-accent)] text-sm md:text-base"
            />
          </div>

          {/* Meta Description */}
          <div>
            <label className="block text-base md:text-lg font-semibold text-[var(--color-text)] mb-2 md:mb-3">
              Meta Description
            </label>
            <textarea
              value={formData.metaDescription}
              onChange={(e) =>
                setFormData({ ...formData, metaDescription: e.target.value })
              }
              className="w-full border border-[var(--color-border-strong)] bg-[var(--color-card)] text-[var(--color-text)] p-3.5 md:p-4 rounded-[var(--radius-md)] outline-none focus:ring-2 focus:ring-[var(--color-accent)] resize-none h-28 text-sm md:text-base"
            />
          </div>

          {/* Upload Images */}
          <div>
            <label className="block text-base md:text-lg font-semibold text-[var(--color-text)] mb-3 md:mb-4">
              Upload Images
            </label>
            <label className="border-2 border-dashed border-[var(--color-border-strong)] hover:border-[var(--color-primary)] transition rounded-[var(--radius-lg)] md:rounded-[var(--radius-xl)] bg-[var(--color-section)] p-6 md:p-10 flex flex-col items-center justify-center cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <div className="w-14 h-14 md:w-20 md:h-20 rounded-full bg-[var(--color-primary)] text-[var(--color-white)] flex items-center justify-center text-2xl md:text-4xl mb-3 md:mb-5">
                +
              </div>
              <h2 className="text-lg md:text-2xl font-bold text-[var(--color-text)] text-center">
                Upload Product Image
              </h2>
              <p className="text-[var(--color-text-muted)] mt-1 text-sm md:text-base text-center">
                Click to select image
              </p>
            </label>

            {uploading && (
              <div className="mt-4 bg-[var(--info-soft)] text-[var(--info)] px-4 py-3 rounded-[var(--radius-md)] font-medium text-sm">
                Uploading image...
              </div>
            )}

            {formData.images.length > 0 && (
              <div className="mt-6 md:mt-8">
                <h3 className="text-lg md:text-xl font-bold text-[var(--color-text)] mb-4 md:mb-5">
                  Product Images
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-5">
                  {formData.images.map((img, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={getImageUrl(img)}
                        alt="product"
                        className="w-full h-32 md:h-40 object-cover rounded-[var(--radius-md)] md:rounded-[var(--radius-lg)] border shadow-md"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-[var(--danger)] hover:bg-[var(--danger)] text-[var(--color-white)] w-7 h-7 rounded-full flex items-center justify-center md:opacity-0 group-hover:opacity-100 transition shadow"
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
            <label className="block text-base md:text-lg font-semibold text-[var(--color-text)] mb-2 md:mb-3">
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
              className="w-full border border-[var(--color-border-strong)] bg-[var(--color-card)] text-[var(--color-text)] p-3.5 md:p-4 rounded-[var(--radius-md)] outline-none focus:ring-2 focus:ring-[var(--color-accent)] resize-none h-32 md:h-40 text-sm md:text-base"
            />
          </div>

          {/* Submit */}
          <button
            disabled={productCodeExists || productExists || slugExists}
            className="w-full sm:w-auto bg-[var(--color-primary)] hover:bg-[var(--color-dark-2)] text-[var(--color-white)] px-8 md:px-10 py-3.5 md:py-4 rounded-[var(--radius-md)] text-base md:text-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Update Product
          </button>

        </form>
      </div>
    </div>
  );
}




