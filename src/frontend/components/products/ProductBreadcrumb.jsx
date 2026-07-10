"use client";

import Link from "next/link";

export default function ProductBreadcrumb({ product }) {
  return (
    <section className="bg-[var(--color-card)] border-b border-[var(--color-border)]">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4">

        <div className="flex items-center gap-2 text-sm">

          <Link
            href="/"
            className="text-[var(--color-primary)] hover:text-[var(--color-accent)] transition"
          >
            Home
          </Link>

          <span className="text-[var(--color-accent)]">/</span>

          <Link
            href="/products"
            className="text-[var(--color-primary)] hover:text-[var(--color-accent)] transition"
          >
            Products
          </Link>

          <span className="text-[var(--color-accent)]">/</span>

          <span className="font-semibold text-[var(--color-accent)]">
            {product.title}
          </span>

        </div>

      </div>
    </section>
  );
}