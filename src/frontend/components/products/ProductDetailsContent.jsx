"use client";

import { useEffect, useState } from "react";

import ProductBreadcrumb from "./ProductBreadcrumb";
import ProductInfo from "./ProductInfo";
import ProductGallery from "./ProductGallery";
import ProductDescription from "./ProductDescription";
import RelatedProducts from "./RelatedProducts";

// NOTE: SEO tags and JSON-LD schema are now produced server-side by
// generateMetadata() and a server-rendered <script> in
// app/products/[slug]/page.jsx (see src/frontend/utils/schemaHelpers.js).
// This component only needs the product data to render the UI.

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api";

export default function ProductDetailsContent({ slug }) {
  const [product, setProduct] = useState(null);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const [productRes, settingsRes] = await Promise.all([
          fetch(`${API_URL}/products`),
          fetch(`${API_URL}/settings`),
        ]);

        const data = await productRes.json();
        const settingsData = await settingsRes.json();

        const settings = settingsData?.data || null;

        setSettings(settings);

        const products = Array.isArray(data)
          ? data
          : data.data || [];

        const found = products.find(
          (item) => item.slug === slug
        );

        setProduct(found || null);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <section className="py-12 bg-[var(--color-section)]">
        <div className="container-luxury">
          <div className="skeleton h-4 w-56 rounded-[var(--radius-md)] mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mt-8">
            <div className="lg:col-span-7 w-full space-y-4">
              <div className="skeleton w-full aspect-square rounded-[var(--radius-xl)]" />
              <div className="flex gap-3">
                <div className="skeleton w-20 h-20 rounded-[var(--radius-md)]" />
                <div className="skeleton w-20 h-20 rounded-[var(--radius-md)]" />
                <div className="skeleton w-20 h-20 rounded-[var(--radius-md)]" />
              </div>
            </div>
            <div className="lg:col-span-5 w-full space-y-4">
              <div className="skeleton h-8 w-3/4 rounded-[var(--radius-md)]" />
              <div className="skeleton h-4 w-full rounded-[var(--radius-md)]" />
              <div className="skeleton h-4 w-5/6 rounded-[var(--radius-md)]" />
              <div className="skeleton h-4 w-2/3 rounded-[var(--radius-md)]" />
              <div className="skeleton h-12 w-40 rounded-[var(--radius-md)] mt-6" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!product) {
    return (
      <section className="py-20 text-center">
        Product Not Found
      </section>
    );
  }
  return (
    <>
      <section className="py-12 bg-[var(--color-section)]">
        <div className="container-luxury">

          <ProductBreadcrumb product={product} />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mt-8 overflow-visible">
            <div className="lg:col-span-7 w-full">
              <ProductGallery product={product} />
            </div>

            <div className="lg:col-span-5 lg:sticky lg:top-6 h-fit w-full overflow-visible z-10">
              <ProductInfo product={product} />
            </div>
          </div>
        </div>
      </section>

      <ProductDescription product={product} />
      <RelatedProducts product={product} />
    </>
  );
}