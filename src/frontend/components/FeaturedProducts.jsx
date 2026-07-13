"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useScrollReveal } from "@/lib/useScrollReveal";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api";

const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL ||  "http://localhost:5000";

function ProductCardSkeleton() {
  return (
    <div className="bg-[var(--color-card)] rounded-[var(--radius-xl)] overflow-hidden border border-[var(--color-border)]">
      <div className="skeleton h-40 md:h-56" />
      <div className="p-4 md:p-6 space-y-3">
        <div className="skeleton h-4 w-3/4 rounded-[var(--radius-md)]" />
        <div className="skeleton h-3 w-full rounded-[var(--radius-md)]" />
        <div className="skeleton h-3 w-2/3 rounded-[var(--radius-md)]" />
      </div>
    </div>
  );
}

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const revealRef = useScrollReveal();

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
      } finally {
        setLoading(false);
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
    <section ref={revealRef} className="reveal-on-scroll py-10 bg-[var(--color-section)]">
      <div className="container-luxury">

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

          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))
            : activeProducts.map((product, index) => (
                <div
                  key={product._id || product.id}
                  className="group bg-[var(--color-card)] rounded-[var(--radius-xl)] overflow-hidden border border-[var(--color-border)] hover:border-[var(--color-accent)] hover:shadow-[var(--shadow-lg)] hover:-translate-y-1.5 transition-all duration-300 animate-fade-up"
                  style={{ animationDelay: `${Math.min(index, 6) * 60}ms` }}
                >

                  {/* Image */}
                  <div className="relative h-40 md:h-56 overflow-hidden">

                    <img
                      src={getProductImageUrl(
                        product.images?.[0]
                      )}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    />

                  </div>

                  {/* Content */}
                  <div className="p-4 md:p-6">

                    <h3 className="text-sm md:text-xl font-semibold text-[var(--color-primary)] line-clamp-1">
                      {product.title}
                    </h3>

                    <p className="mt-2 text-xs md:text-sm text-[var(--color-secondary)] line-clamp-2">
                      {product.metaDescription ||
                        "Premium quality product"}
                    </p>

                    <Link
                      href={`/products/${product.slug}`}
                      className="inline-flex items-center gap-1.5 mt-4 text-[var(--color-accent)] font-semibold hover:text-[var(--color-accent-hover)] hover:gap-2.5 transition-all duration-200"
                    >
                      View Details →
                    </Link>

                  </div>

                </div>
              ))}

        </div>

      </div>
    </section>
  );
}
