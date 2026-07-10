"use client";

import { apiFetch } from "../../../lib/api";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCategoryPath } from "../../../lib/category-tree";
import TableHeader from "../../../components/TableHeader";
import { sortData } from "../../../lib/sortdata";

export default function ProductsPage() {
const router = useRouter();

  // Define your backend domain base URL
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

  // Helper function to safely format your image links 
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "/no-image.png";
    // If it's already an absolute URL (starts with http), return it directly
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      return imagePath;
    }
    // If it's a relative path starting with /uploads or uploads, attach the backend server host
    if (imagePath.startsWith("/uploads")) {
      return `${BACKEND_URL}${imagePath}`;
    }
    if (imagePath.startsWith("uploads/")) {
      return `${BACKEND_URL}/${imagePath}`;
    }
    // Otherwise append the direct fallback path
    return `${BACKEND_URL}/uploads/${imagePath}`;
  };

  // ======================
  // STATES
  // ======================
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]); 
  const [selectedCategory, setSelectedCategory] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [admin, setAdmin] = useState(null);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryImages, setGalleryImages] = useState([]);
  const [currentImage, setCurrentImage] = useState(0);
  const [sortField, setSortField] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  // ======================
  // PAGINATION
  // ======================
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // ======================
  // FETCH PRODUCTS
  // ======================
  async function fetchProducts() {
    try {
      const response = await apiFetch("/products");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

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

  // ======================
  // FETCH PAGINATION
  // ======================
  async function fetchPagination() {
    try {
      const response = await apiFetch("/settings");
      const result = await response.json();
      setLimit(result.data.pagination || 10);
    } catch (error) {
      console.log(error);
    }
  }

  // Image Gallery handlers
  const openGallery = (images) => {
    if (!images?.length) return;
    setGalleryImages(images);
    setCurrentImage(0);
    setGalleryOpen(true);
  };

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % galleryImages.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) =>
      prev === 0 ? galleryImages.length - 1 : prev - 1
    );
  };

  // ======================
  // LOAD DATA
  // ======================
  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchPagination();

    const storedAdmin = sessionStorage.getItem("admin");
    if (storedAdmin) {
      setAdmin(JSON.parse(storedAdmin));
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!galleryOpen) return;
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "Escape") setGalleryOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [galleryOpen, currentImage, galleryImages]);

  useEffect(() => {
    if (galleryOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [galleryOpen]);

  // ======================
  // DELETE PRODUCT
  // ======================
  async function handleDelete(id) {
    const confirmDelete = confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) return;

    try {
      const response = await apiFetch(`/products/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (data.success) {
        fetchProducts();
      }
    } catch (error) {
      console.log(error);
    }
  }

  // Sorting function
  const handleSort = (field) => {
    setPage(1);
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  // ======================
  // TOGGLE STATUS
  // ======================
  async function toggleStatus(product) {
    try {
      const response = await apiFetch(`/products/${product._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: product.status === "active" ? "inactive" : "active",
        }),
      });
      const data = await response.json();
      if (data.success) {
        fetchProducts();
      }
    } catch (error) {
      console.log(error);
    }
  }

  // ======================
  // FILTER PRODUCTS
  // ======================
  const filteredProducts = products.filter((product) => {
    const searchMatch =
      !search ||
      product.title?.toLowerCase().includes(search.toLowerCase());

    const statusMatch = !statusFilter || product.status === statusFilter;

    let categoryMatch = true;
    if (selectedCategory) {
      categoryMatch = false;
      
      const productCategoryId = product.category && typeof product.category === 'object'
        ? String(product.category._id || product.category.id)
        : String(product.category || "");

      let current = categories.find(
        (item) => String(item._id || item.id) === productCategoryId
      );

      while (current) {
        const currentId = String(current._id || current.id);
        if (currentId === String(selectedCategory)) {
          categoryMatch = true;
          break;
        }
        
        if (!current.parent) break;

        const parentId = typeof current.parent === 'object'
          ? String(current.parent._id || current.parent.id)
          : String(current.parent);

        current = categories.find(
          (item) => String(item._id || item.id) === parentId
        );
      }
    }

    return searchMatch && statusMatch && categoryMatch;
  });

  const sortedProducts = sortData(filteredProducts, sortField, sortOrder);

  // ======================
  // PAGINATION LOGIC
  // ======================
  const start = (page - 1) * limit;
  const end = page * limit;
  const paginatedProducts = sortedProducts.slice(start, end);
  const totalPages = Math.ceil(sortedProducts.length / limit);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-xl font-semibold text-[var(--color-text)]">
        Loading Products...
      </div>
    );
  }

  return (
    <div className="w-full text-[var(--color-text)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[var(--color-primary)]">Products</h1>
          <p className="text-[var(--color-text-muted)] mt-1 text-sm sm:text-base">Manage all products</p>
        </div>

        {(admin?.role === "admin" || admin?.permissions?.products?.create) && (
          <button
            onClick={() => router.push("/admin/products/add")}
            className="w-full sm:w-auto bg-[var(--color-primary)] text-[var(--color-white)] px-5 py-3 rounded-[var(--radius-sm)] hover:bg-[var(--color-dark-2)] transition text-center text-sm font-medium"
          >
            Add Product
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[var(--color-card)] rounded-[var(--radius-lg)] shadow-md p-6">
          <label className="block text-lg font-semibold text-[var(--color-text)] mb-4">
            Search Product
          </label>
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search product..."
            className="w-full border border-[var(--color-border-strong)] p-4 rounded-[var(--radius-md)] text-[var(--color-text)] outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
          />
        </div>

        <div className="bg-[var(--color-card)] rounded-[var(--radius-lg)] shadow-md p-6">
          <label className="block text-lg font-semibold text-[var(--color-text)] mb-4">
            Filter By Category
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setPage(1);
            }}
            className="w-full border border-[var(--color-border-strong)] bg-[var(--color-card)] text-[var(--color-text)] p-4 rounded-[var(--radius-md)] outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
          >
            <option value="">All Categories</option>
            {categories
              .filter((item) => item.parent === null || !item.parent)
              .map((category) => (
                <option key={category._id || category.id} value={category._id || category.id}>
                  {getCategoryPath(categories, category._id || category.id)}
                </option>
              ))}
          </select>
        </div>

        <div className="bg-[var(--color-card)] rounded-[var(--radius-lg)] shadow-md p-6">
          <label className="block text-lg font-semibold text-[var(--color-text)] mb-4">
            Status
          </label>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="w-full border border-[var(--color-border-strong)] bg-[var(--color-card)] text-[var(--color-text)] p-4 rounded-[var(--radius-md)] outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Table Frame Container */}
      <div className="bg-[var(--color-card)] rounded-[var(--radius-lg)] shadow-md overflow-hidden w-full">
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[800px] border-collapse text-left">
            <thead className="bg-[var(--color-primary)] text-[var(--color-white)]">
              <tr>
                <TableHeader label="Product" field="title" sortField={sortField} sortOrder={sortOrder} onSort={handleSort} />
                <TableHeader label="Category" field="category" sortField={sortField} sortOrder={sortOrder} onSort={handleSort} />
                <TableHeader label="Status" field="status" sortField={sortField} sortOrder={sortOrder} onSort={handleSort} />
                <TableHeader label="Created" field="createdAt" sortField={sortField} sortOrder={sortOrder} onSort={handleSort} />
                <TableHeader label="Updated" field="updatedAt" sortField={sortField} sortOrder={sortOrder} onSort={handleSort} />
                <th className="p-4 font-medium text-sm">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[var(--color-border)]">
              {paginatedProducts.length > 0 ? (
                paginatedProducts.map((product, pIdx) => (
                  <tr key={`${product._id || product.id}-${pIdx}`} className="hover:bg-[var(--color-section)]/60 transition">
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        {/* CHANGED: Passing formatted image array keys into openGallery handler */}
                        <div className="relative cursor-pointer shrink-0" onClick={() => openGallery(product.images || [])}>
                          <img
                            src={getImageUrl(product.images?.[0])}
                            alt={product.title}
                            className="w-16 h-16 object-cover rounded-[var(--radius-md)] border hover:scale-105 transition"
                          />
                          {product.images?.length > 1 && (
                            <span className="absolute -top-2 -right-2 bg-[var(--color-primary)] text-[var(--color-white)] text-xs px-2 py-1 rounded-full font-bold">
                              +{product.images.length - 1}
                            </span>
                          )}
                        </div>
                        <div>
                          <h2 className="font-semibold text-base text-[var(--color-primary)] line-clamp-1">{product.title}</h2>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 text-[var(--color-text)] font-medium text-sm">
                      {getCategoryPath(categories, product.category?._id || product.category) || "Uncategorized"}
                    </td>

                    <td className="p-4">
                      {(admin?.role === "admin" || admin?.permissions?.products?.edit) ? (
                        <button
                          onClick={() => toggleStatus(product)}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                            product.status === "active" ? "bg-[var(--success-soft)] text-[var(--success)] hover:bg-[var(--success-soft)]" : "bg-[var(--danger-soft)] text-[var(--danger)] hover:bg-[var(--danger-soft)]"
                          }`}
                        >
                          {product.status}
                        </button>
                      ) : (
                        <span
                          className={`px-4 py-2 rounded-full text-sm font-medium ${
                            product.status === "active" ? "bg-[var(--success-soft)] text-[var(--success)]" : "bg-[var(--danger-soft)] text-[var(--danger)]"
                          }`}
                        >
                          {product.status}
                        </span>
                      )}
                    </td>

                    <td className="p-4 text-[var(--color-secondary)] text-sm">
                      {new Date(product.createdAt).toLocaleString("en-IN")}
                    </td>

                    <td className="p-4 text-[var(--color-secondary)] text-sm">
                      {product.updatedAt ? new Date(product.updatedAt).toLocaleString("en-IN") : "-"}
                    </td>

                    <td className="p-4">
                      <div className="flex gap-3">
                        {(admin?.role === "admin" || admin?.permissions?.products?.edit) && (
                          <button
                            onClick={() => router.push(`/admin/products/edit/${product._id}`)}
                            className="bg-[var(--color-accent)] hover:bg-[var(--color-accent)] text-[var(--color-white)] px-4 py-2 rounded-[var(--radius-sm)] text-sm transition"
                          >
                            Edit
                          </button>
                        )}
                        {(admin?.role === "admin" || admin?.permissions?.products?.delete) && (
                          <button
                            onClick={() => handleDelete(product._id)}
                            className="bg-[var(--danger)] hover:bg-[var(--danger)] text-[var(--color-white)] px-4 py-2 rounded-[var(--radius-sm)] text-sm transition"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center p-6 text-[var(--color-text-muted)] font-medium">
                    No Products Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* SMART PAGINATION CONTROLS */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8 text-[var(--color-text)] select-none flex-wrap">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className={`px-4 py-2 rounded-[var(--radius-sm)] border font-medium text-sm transition-all duration-200 ${
              page === 1
                ? "bg-[var(--color-section)] text-[var(--color-text-muted)] border-[var(--color-border)] cursor-not-allowed"
                : "bg-[var(--color-card)] text-[var(--color-text)] border-[var(--color-border-strong)] hover:bg-[var(--color-section)] active:scale-95"
            }`}
          >
            Prev
          </button>

          {(() => {
            const pageNumbers = [];
            const maxVisiblePages = 5;

            if (totalPages <= maxVisiblePages) {
              for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
            } else {
              pageNumbers.push(1);
              let startRange = Math.max(2, page - 1);
              let endRange = Math.min(totalPages - 1, page + 1);

              if (page <= 2) {
                endRange = 4;
              } else if (page >= totalPages - 1) {
                startRange = totalPages - 3;
              }

              if (startRange > 2) {
                pageNumbers.push("ellipsis-left");
              }

              for (let i = startRange; i <= endRange; i++) {
                pageNumbers.push(i);
              }

              if (endRange < totalPages - 1) {
                pageNumbers.push("ellipsis-right");
              }

              pageNumbers.push(totalPages);
            }

            return pageNumbers.map((item, index) => {
              if (item === "ellipsis-left" || item === "ellipsis-right") {
                return (
                  <span key={`ellipse-${index}`} className="px-2 text-[var(--color-text-muted)] font-medium">
                    ...
                  </span>
                );
              }

              const isActive = page === item;
              return (
                <button
                  key={`page-${item}`}
                  onClick={() => setPage(item)}
                  className={`w-10 h-10 rounded-[var(--radius-sm)] border text-sm font-semibold transition-all duration-200 active:scale-95 ${
                    isActive
                      ? "bg-[var(--color-primary)] text-[var(--color-white)] border-[var(--color-primary)] shadow-md"
                      : "bg-[var(--color-card)] text-[var(--color-text)] border-[var(--color-border-strong)] hover:bg-[var(--color-section)]"
                  }`}
                >
                  {item}
                </button>
              );
            });
          })()}

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className={`px-4 py-2 rounded-[var(--radius-sm)] border font-medium text-sm transition-all duration-200 ${
              page === totalPages
                ? "bg-[var(--color-section)] text-[var(--color-text-muted)] border-[var(--color-border)] cursor-not-allowed"
                : "bg-[var(--color-card)] text-[var(--color-text)] border-[var(--color-border-strong)] hover:bg-[var(--color-section)] active:scale-95"
            }`}
          >
            Next
          </button>
        </div>
      )}

      {/* Image Gallery Modal */}
      {galleryOpen && (
        <div className="fixed inset-0 bg-[var(--color-overlay)] z-50 flex items-center justify-center p-4">
          <button onClick={() => setGalleryOpen(false)} className="absolute top-5 right-5 text-[var(--color-white)] text-4xl focus:outline-none">
            &times;
          </button>

          {galleryImages.length > 1 && (
            <button onClick={prevImage} className="absolute left-5 text-[var(--color-white)] text-4xl sm:text-5xl select-none focus:outline-none">
              &#10094;
            </button>
          )}

          {/* CHANGED: Wrapped in getImageUrl utility parser */}
          <img src={getImageUrl(galleryImages[currentImage])} alt="" className="max-h-[80vh] max-w-[85vw] object-contain rounded-[var(--radius-md)]" />

          {galleryImages.length > 1 && (
            <button onClick={nextImage} className="absolute right-5 text-[var(--color-white)] text-4xl sm:text-5xl select-none focus:outline-none">
              &#10095;
            </button>
          )}

          <div className="absolute bottom-6 text-[var(--color-white)] text-sm font-medium">
            {currentImage + 1} / {galleryImages.length}
          </div>

          <div className="absolute bottom-16 flex gap-2 overflow-auto max-w-[90vw] py-1">
            {galleryImages.map((img, idx) => (
              <img
                key={idx}
                src={getImageUrl(img)} // CHANGED: Added parsing for thumbnail track items
                alt=""
                onClick={() => setCurrentImage(idx)}
                className={`w-14 h-14 sm:w-16 sm:h-16 object-cover rounded cursor-pointer border-2 shrink-0 transition ${
                  currentImage === idx ? "border-[var(--color-white)] scale-105" : "border-transparent opacity-70"
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}