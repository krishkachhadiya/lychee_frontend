"use client";

import { useEffect, useState } from "react";

import Hero from "../components/Hero";
import Aboutpre from "../components/Aboutpre";
import FeaturedCategories from "../components/FeaturedCategories";
import FeaturedProducts from "../components/FeaturedProducts";
import WhyChooseUs from "../components/WhyChooseUs";
import CTA from "../components/CTA";

// NOTE: SEO tags + JSON-LD schema for "/" are produced server-side by
// generateMetadata() in src/app/(site)/page.jsx. This component only
// fetches `settings` for content it renders (logo/about copy/etc.).

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function Home() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const response = await fetch(`${API_URL}/settings`);
        const data = await response.json();
        setSettings(data?.data || null);
      } catch (error) {
        console.error("Failed to fetch settings:", error);
      }
    }

    fetchSettings();
  }, []);

  return (
    <div className="bg-[var(--color-card)]">
      <Hero />
      <Aboutpre settings={settings} />
      <FeaturedCategories />
      <FeaturedProducts />
      <WhyChooseUs settings={settings} />
      <CTA />
    </div>
  );
}
