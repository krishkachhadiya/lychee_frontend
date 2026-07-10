"use client";

export default function ProductDescription({ product }) {
  if (!product.description) {
    return null;
  }

  return (
    <section className="py-12 bg-[var(--color-section)]">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">

        <div className="mb-8">
          <span className="inline-block bg-[var(--color-accent-soft)] text-[var(--color-accent)] px-4 py-2 rounded-full text-sm font-semibold">
            PRODUCT OVERVIEW
          </span>

          <h2 className="mt-4 text-4xl font-bold text-[var(--color-primary)]">
            Description
          </h2>
        </div>

        <div className="bg-[var(--color-card)] rounded-[var(--radius-xl)] border border-[var(--color-border)] shadow-sm p-8">

          <div
            className="prose max-w-none text-[var(--color-text)]"
            dangerouslySetInnerHTML={{
              __html: product.description,
            }}
          />

        </div>

      </div>
    </section>
  );
}