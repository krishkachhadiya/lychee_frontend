"use client";

import Link from "next/link";

export default function ProductSidebarInfo({ product }) {
  const categoryName = product?.subcategory?.title || product?.category?.title || "";
  const specifications = product?.specifications?.filter(Boolean) || [];

  return (
    <div className="w-full flex flex-col gap-6">
      
      {/* --- PART 1: PRODUCT INFO BLOCK --- */}
      <div>
        <h1 className="mt-5 text-4xl font-bold text-[var(--color-primary)]">
          {product?.title}
        </h1>

        <p className="mt-5 text-base text-[var(--color-secondary)] leading-relaxed">
          {product?.metaDescription}
        </p>

        {/* Product ID & Category Quick Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
          {/* Product ID */}
          <div className="bg-[var(--color-section)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-5">
            <p className="text-sm text-[var(--color-text-muted)]">Product Code</p>
            <p className="mt-2 font-semibold text-[var(--color-primary)] truncate">
              {product?.productCode || product?._id}
            </p>
          </div>

          {/* Category */}
          <div className="bg-[var(--color-section)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-5">
            <p className="text-sm text-[var(--color-text-muted)]">Category</p>
            <p className="mt-2 font-semibold text-[var(--color-primary)] truncate">
              {categoryName}
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex gap-4 mt-8">
          <Link
            href="/contact-us"
            className="w-full text-center border border-[var(--color-accent)] text-[var(--color-accent)] px-6 py-3 rounded-[var(--radius-md)] hover:bg-[var(--color-accent)] hover:text-[var(--color-white)] transition font-medium"
          >
            Inquiry now
          </Link>
        </div>
      </div>

      {/* --- PART 2: PRODUCT SPECIFICATIONS BLOCK --- */}
      {specifications.length > 0 && (
        <div className="mt-4 pt-6 border-t border-[var(--color-border)]">
          <div className="mb-6">
            <span className="inline-block bg-[var(--color-accent-soft)] text-[var(--color-accent)] px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider">
              TECHNICAL DETAILS
            </span>
            <h2 className="mt-2 text-2xl font-bold text-[var(--color-primary)]">
              Specifications
            </h2>
          </div>

          {/* Clean Split Grid Specification Rows */}
          <div className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-sm bg-[var(--color-card)]">
            {specifications.map((specification, index) => {
              const [key, value] = specification.split(":");

              return (
                <div
                  key={index}
                  className="grid grid-cols-12 border-b border-[var(--color-border)] last:border-b-0 items-stretch"
                >
                  <div className="bg-[var(--color-section)]/70 col-span-5 p-4 text-xs font-semibold text-[var(--color-primary)] flex items-center border-r border-[var(--color-border)]">
                    {key?.trim()}
                  </div>

                  <div className="bg-[var(--color-card)] col-span-7 p-4 text-xs text-[var(--color-secondary)] break-words flex items-center">
                    {value?.trim()}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}