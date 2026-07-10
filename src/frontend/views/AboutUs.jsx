"use client";

import { useEffect, useState } from "react";

import Aboutpre from "../components/Aboutpre";
import CompanyStory from "../components/aboutus/CompanyStory";
import MissionVision from "../components/aboutus/MissionVision";
import WhyChooseUs from "../components/WhyChooseUs";
import CTA from "../components/CTA";

// NOTE: SEO tags + JSON-LD schema for "/about-us" are produced server-side
// by generateMetadata() in src/app/(site)/about-us/page.jsx.

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function AboutUs() {
  const [settings, setSettings] = useState(null);
  const [cms, setCms] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [cmsRes, settingsRes] = await Promise.all([
          fetch(`${API_URL}/cms`),
          fetch(`${API_URL}/settings`),
        ]);

        const cmsData = await cmsRes.json();
        const settingsData = await settingsRes.json();

        const aboutPage = cmsData.find(
          (item) => item.slug === "about-us"
        );

        const settings = settingsData?.data || null;

        setCms(aboutPage);
        setSettings(settings);
      } catch (error) {
        console.error("Failed to load About page:", error);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="bg-[var(--color-card)]">
      <Aboutpre settings={settings} />
      <CompanyStory />
      <MissionVision />
      <WhyChooseUs settings={settings} />
      <CTA />
    </div>
  );
}
