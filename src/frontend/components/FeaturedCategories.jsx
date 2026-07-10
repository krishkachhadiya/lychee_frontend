"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

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

export default function FeaturedCategories() {
  const [categories, setCategories] = useState([]);

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

        const activeCategories = updatedCategories
          .filter(
            (item) =>
              item.status === "active" &&
              item.parent === null
          )
          .slice(0, 4);

        setCategories(updatedCategories);
      } catch (error) {
        console.error(error);
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
    <section className="py-20 bg-[var(--color-card)]">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">

        <div className="text-center mb-12">
          <span className="inline-block bg-[var(--color-accent-soft)] text-[var(--color-accent)] px-4 py-2 rounded-full text-sm font-semibold">
            CATEGORIES
          </span>

          <h2 className="mt-4 text-3xl md:text-4xl font-bold text-[var(--color-primary)]">
            Browse Categories
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {activeCategories.map((category) => {

            return (
              <Link
                key={category._id}
                href={`/products?category=${category.slug}`}
                className="group bg-[var(--color-card)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-4 md:p-6 hover:border-[var(--color-accent)] hover:shadow-[var(--shadow-md)] transition-all duration-300"
              >
                <div className="w-full h-40 rounded-[var(--radius-md)] overflow-hidden bg-[var(--color-section)]">
                  <img
                    src={getCategoryImageUrl(category.image)}
                    alt={category.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                </div>

                <h3 className="mt-4 text-sm md:text-lg font-semibold text-[var(--color-primary)] group-hover:text-[var(--color-accent)] transition">
                  {category.title}
                </h3>

                <p className="mt-2 text-xs md:text-sm text-[var(--color-secondary)]">
                  Explore products
                </p>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
}