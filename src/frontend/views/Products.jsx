"use client";

import { useEffect, useState } from "react";

import ProductsContent from "../components/products/ProductsContent";

// NOTE: SEO tags + JSON-LD schema for "/products" are produced server-side
// by generateMetadata() in src/app/(site)/products/page.jsx.

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function Products() {
  const [cmsData, setCmsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [cmsRes, settingsRes] = await Promise.all([
          fetch(`${API_URL}/cms`),
          fetch(`${API_URL}/settings`),
        ]);

        const cmsJson = await cmsRes.json();
        await settingsRes.json();

        const cmsList = Array.isArray(cmsJson)
          ? cmsJson
          : cmsJson.data || [];

        const matchedCms = cmsList.find(
          (item) => item.slug === "products"
        );

        setCmsData(matchedCms);
      } catch (error) {
        console.error("Failed to load Products page:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-xl font-semibold">
        Loading Products...
      </div>
    );
  }

  return <ProductsContent cmsData={cmsData} />;
}
