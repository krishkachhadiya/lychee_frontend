"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useScrollReveal } from "@/lib/useScrollReveal";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_BASE_URL ||
  "http://localhost:5000";

const getCategoryImageUrl = (image = "") => {
  if (!image) {
    return "/no-image.png";
  }

  if (image.startsWith("http")) {
    return image;
  }

  const cleanPath = image
    .replace(/^\/+/, "")
    .replace(/^uploads\/+/i, "");

  return `${BACKEND_URL}/uploads/${cleanPath}`;
};

function CategoryCardSkeleton() {
  return (
    <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-[var(--radius-xl)] p-4 md:p-6">
      <div className="skeleton w-full h-40 rounded-[var(--radius-md)]" />
      <div className="skeleton mt-4 h-4 w-2/3 rounded-[var(--radius-md)]" />
      <div className="skeleton mt-2 h-3 w-1/2 rounded-[var(--radius-md)]" />
    </div>
  );
}

export default function FeaturedCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const revealRef = useScrollReveal();

  useEffect(() => {
    async function fetchData() {
      try {
        const [categoryRes, productRes] = await Promise.all([
          fetch(`${API_URL}/categories`),
          fetch(`${API_URL}/products`),
        ]);

        const categoryJson = await categoryRes.json();
        const productJson = await productRes.json();

        const categoryList = Array.isArray(categoryJson)
          ? categoryJson
          : categoryJson.data || categoryJson.categories || [];

        const productList = Array.isArray(productJson)
          ? productJson
          : productJson.data || productJson.products || [];

        const updatedCategories = categoryList.map((category) => {
          const product = productList.find((item) => {
            const categoryId =
              typeof item.category === "object"
                ? item.category?._id
                : item.category;

            return (
              item.status === "active" &&
              categoryId === category._id &&
              item.images &&
              item.images.length > 0
            );
          });

          return {
            ...category,
            image: product?.images?.[0] || "",
          };
        });

        setCategories(updatedCategories);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const activeCategories = categories
    .filter(
      (item) =>
        item.status === "active" &&
        item.parent === null
    )
    .slice(0, 4);

  return (
    <section ref={revealRef} className="reveal-on-scroll py-10 bg-[var(--color-card)]">
      <div className="container-luxury">

        <div className="text-center mb-12">
          <h2 className="mt-4 text-3xl md:text-4xl font-bold text-[var(--color-primary)]">
            Browse Categories
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <CategoryCardSkeleton key={i} />
              ))
            : activeCategories.map((category, index) => (
                <Link
                  key={category._id}
                  href={`/products?category=${category.slug}`}
                  className="group bg-[var(--color-card)] border border-[var(--color-border)] rounded-[var(--radius-xl)] p-4 md:p-6 hover:border-[var(--color-accent)] hover:shadow-[var(--shadow-md)] hover:-translate-y-1.5 transition-all duration-300 animate-fade-up"
                  style={{ animationDelay: `${index * 60}ms` }}
                >
                  <div className="w-full h-40 rounded-[var(--radius-md)] overflow-hidden bg-[var(--color-section)]">
                    <img
                      src={getCategoryImageUrl(category.image)}
                      alt={category.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                  </div>

                  <h3 className="mt-4 text-sm md:text-lg font-semibold text-[var(--color-primary)] group-hover:text-[var(--color-accent)] transition">
                    {category.title}
                  </h3>

                  <p className="mt-2 text-xs md:text-sm text-[var(--color-secondary)]">
                    Explore products
                  </p>
                </Link>
              ))}
        </div>

      </div>
    </section>
  );
}
