"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api";

const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "http://localhost:5000";


export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch(
          `${API_URL}/products`
        );

        const result = await response.json();

        setProducts(
          Array.isArray(result)
            ? result
            : result.data || []
        );
      } catch (error) {
        console.error(error);
      }
    }

    fetchProducts();
  }, []);

  function getProductImageUrl(imagePath) {
    if (
      !imagePath ||
      typeof imagePath !== "string"
    ) {
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

    return `${BACKEND_BASE_URL}/uploads/${cleanPath}`;
  }

  const activeProducts = products
    .filter(
      (item) =>
        item.status === "active"
    )
    .slice(0, 6);

  return (
    <section className="py-10 bg-[var(--color-section)]">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">

        {/* Heading */}
        <div className="text-center mb-12">


          <h2 className="mt-4 text-3xl md:text-4xl font-bold text-[var(--color-primary)]">
            Featured Products
          </h2>

          <p className="mt-3 text-[var(--color-secondary)]">
            Explore our latest products.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8">

          {activeProducts.map((product) => (
            <Link
              key={product._id || product.id}
              href={`/products/${product.slug}`}
              className="group block bg-[var(--color-card)] rounded-[var(--radius-lg)] overflow-hidden border border-[var(--color-border)] hover:border-[var(--color-accent)] hover:shadow-[var(--shadow-lg)] transition-all duration-300"
            >

              {/* Image */}
              <div className="relative h-40 md:h-56 overflow-hidden">
                <img
                  src={getProductImageUrl(product.images?.[0])}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Content */}
              <div className="p-4 md:p-6">

                <h3 className="text-sm md:text-xl font-semibold text-[var(--color-primary)] line-clamp-1">
                  {product.title}
                </h3>

                <p className="mt-2 text-xs md:text-sm text-[var(--color-secondary)] line-clamp-2">
                  {product.metaDescription || "Premium quality product"}
                </p>

              </div>

            </Link>
          ))}

        </div>

      </div>
    </section>
  );
}