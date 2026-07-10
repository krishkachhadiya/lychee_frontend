"use client";

import { useEffect, useState } from "react";

import ContactForm from "../components/contact-us/ContactForm";
import ContactMap from "../components/contact-us/ContactMap";

// NOTE: SEO tags + JSON-LD schema for "/contact-us" are produced server-side
// by generateMetadata() in src/app/(site)/contact-us/page.jsx.

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api";

export default function ContactPage() {
  const [cmsData, setCmsData] = useState(null);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [cmsRes, settingsRes] = await Promise.all([
          fetch(`${API_URL}/cms`),
          fetch(`${API_URL}/settings`),
        ]);

        const cmsResponse = await cmsRes.json();
        const settingsResponse = await settingsRes.json();

        const cmsList = Array.isArray(cmsResponse)
          ? cmsResponse
          : cmsResponse.data || [];

        const matchedCms = cmsList.find(
          (item) => item.slug === "contact-us"
        );

        const settingsData = settingsResponse?.data || {};

        setCmsData(matchedCms || null);
        setSettings(settingsData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-xl font-semibold">
        Loading Contact Details...
      </div>
    );
  }

  if (!cmsData || !settings) {
    return (
      <div className="flex items-center justify-center min-h-screen text-xl font-semibold">
        Failed to load details.
      </div>
    );
  }

  return (
    <>
      <ContactForm />
      <ContactMap />
    </>
  );
}
