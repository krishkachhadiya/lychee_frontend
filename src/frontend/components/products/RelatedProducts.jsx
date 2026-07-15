"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getRootCategoryId } from "../../../lib/category-tree";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_BASE_URL ||
  "http://localhost:5000";

export default function RelatedProducts({ product }) {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  function getProductImageUrl(imagePath) {
    if (!imagePath || typeof imagePath !== "string") {
      return "/no-image.png";
    }

    if (
      imagePath.startsWith("http://") ||
      imagePath.startsWith("https://")
    ) {
      return imagePath;
    }

    const cleanPath = imagePath
      .replace(/^\/+/, "")
      .replace(/^uploads\/+/i, "");

    return `${BACKEND_URL}/uploads/${cleanPath}`;
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          fetch(`${API_URL}/products`),
          fetch(`${API_URL}/categories`),
        ]);

        const productsResult = await productsRes.json();
        const categoriesResult = await categoriesRes.json();

        const products = Array.isArray(productsResult)
          ? productsResult
          : productsResult.data || [];

        const allCategories = Array.isArray(categoriesResult)
          ? categoriesResult
          : categoriesResult.data || [];

        setCategories(allCategories);

        // Current Product Category
        const currentCategoryId =
          product.subcategory?._id ||
          product.subcategory ||
          product.category?._id ||
          product.category;

        const currentRootId = getRootCategoryId(
          allCategories,
          currentCategoryId
        );

        const related = products.filter((item) => {
          if (
            String(item._id || item.id) ===
            String(product._id || product.id)
          ) {
            return false;
          }

          if (item.status !== "active") {
            return false;
          }

          const itemCategoryId =
            item.subcategory?._id ||
            item.subcategory ||
            item.category?._id ||
            item.category;

          const itemRootId = getRootCategoryId(
            allCategories,
            itemCategoryId
          );

          return String(itemRootId) === String(currentRootId);
        });

        setRelatedProducts(related.slice(0, 4));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    if (product) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [product]);

  if (!loading && relatedProducts.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-[var(--color-card)]">
      <div className="container-luxury">

        <div className="mb-8">
          <span className="inline-block bg-[var(--color-accent-soft)] text-[var(--color-accent)] px-4 py-2 rounded-full text-sm font-semibold">
            YOU MAY ALSO LIKE
          </span>

          <h2 className="mt-4 text-4xl font-bold text-[var(--color-primary)]">
            Related Products
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-[var(--radius-xl)] overflow-hidden">
                <div className="skeleton h-56" />
                <div className="p-5 space-y-3">
                  <div className="skeleton h-4 w-3/4 rounded-[var(--radius-md)]" />
                  <div className="skeleton h-3 w-full rounded-[var(--radius-md)]" />
                </div>
              </div>
            ))
            : relatedProducts.map((item, index) => (
              <Link
                key={item._id || item.id}
                href={`/products/${item.slug}`}
                className="group block bg-[var(--color-card)] border border-[var(--color-border)] rounded-[var(--radius-xl)] overflow-hidden shadow-sm hover:shadow-[var(--shadow-lg)] hover:-translate-y-1.5 transition-all duration-300 animate-fade-up cursor-pointer"
                style={{ animationDelay: `${index * 60}ms` }}
              >
                {/* Product Image */}
                <div className="h-56 overflow-hidden">
                  <img
                    src={getProductImageUrl(item.images?.[0])}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                </div>

                {/* Product Content */}
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-[var(--color-primary)] line-clamp-2">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm text-[var(--color-secondary)] line-clamp-2">
                    {item.metaDescription || "Premium quality product"}
                  </p>
                </div>
              </Link>
            ))}
        </div>

      </div>
    </section>
  );
}