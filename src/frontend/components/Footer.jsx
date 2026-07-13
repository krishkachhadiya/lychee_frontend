"use client";

import { useEffect, useState } from "react";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import Link from "next/link";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api";

// ADDED: Bring in your base URL environment variable for asset mapping
const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_BASE_URL ||
  "http://localhost:5000";

export default function Footer() {
  const [categories, setCategories] = useState([]);
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [catRes, settingsRes] = await Promise.all([
          fetch(`${API_URL}/categories`),
          fetch(`${API_URL}/settings`),
        ]);

        const catData = await catRes.json();
        const settingsData = await settingsRes.json();

        setCategories(
          Array.isArray(catData)
            ? catData
            : catData.data || []
        );

        setSettings(settingsData?.data || null);
      } catch (error) {
        console.log(error);
      }
    }

    loadData();
  }, []);

  const activeCategories = categories
    .filter(
      (item) =>
        item.status === "active" &&
        item.parent === null
    )
    .slice(0, 5);

  // ADDED: Safe formatting helper function for the logo image path
  const getLogoUrl = () => {
    if (!settings?.logo) return "/logo.png"; // Fallback to local image if empty
    if (settings.logo.startsWith("http")) return settings.logo; // Return if already an absolute link
    return `${BACKEND_URL}${settings.logo.startsWith("/") ? "" : "/"}${settings.logo}`;
  };

  /* =========================================================
     UPDATED TO EXCLUSIVELY USE FOOTER AND PRIMARY RED TOKENS
     ========================================================= */
  const linkStyle = {
    color: "var(--color-footer-text)",
    transition: "var(--transition)",
    fontSize: "14px",
  };

  return (
    <footer
      style={{
        background: "var(--color-footer)",
        color: "var(--color-footer-text)",
        borderTop: "1px solid var(--color-border)",
      }}
    >
      <div className="container-luxury py-16">

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Company Info */}
          <div className="text-center lg:text-left">
            {/* CHANGED: Passing path through the getLogoUrl custom formatter */}
            <img
              src={getLogoUrl()}
              alt={settings?.companyName || "Logo"}
              className="h-14 w-auto object-contain mx-auto lg:mx-0"
            />

            <p className="mt-6 leading-relaxed" style={{ color: "var(--color-footer-text)", fontSize: "14px" }}>
              Delivering premium products and innovative
              solutions for modern businesses worldwide.
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-center lg:text-left">
            <h3 className="font-display mb-5" style={{ fontSize: "20px", fontWeight: 600, color: "var(--color-text)" }}>
              Quick Links
            </h3>

            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  style={linkStyle}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-primary)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-footer-text)")}
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  href="/about-us"
                  style={linkStyle}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-primary)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-footer-text)")}
                >
                  About Us
                </Link>
              </li>

              <li>
                <Link
                  href="/products"
                  style={linkStyle}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-primary)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-footer-text)")}
                >
                  Products
                </Link>
              </li>

              <li>
                <Link
                  href="/contact-us"
                  style={linkStyle}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-primary)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-footer-text)")}
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="text-center lg:text-left">
            <h3 className="font-display mb-5" style={{ fontSize: "20px", fontWeight: 600, color: "var(--color-text)" }}>
              Categories
            </h3>

            <ul className="space-y-3">
              {activeCategories.map((category) => (
                <li key={category._id || category.id}>
                  <Link
                    href={`/products?category=${category.slug}`}
                    style={linkStyle}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-primary)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-footer-text)")}
                  >
                    {category.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="text-center lg:text-left">
            <h3 className="font-display mb-5" style={{ fontSize: "20px", fontWeight: 600, color: "var(--color-text)" }}>
              Contact
            </h3>
            <ul>
              <li>
                <a
                  href="https://maps.app.goo.gl/XWgJTghvD135CPP86"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={linkStyle}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-primary)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-footer-text)")}
                >
                  📍 {settings?.address}
                </a>
              </li>

              <li>
                <a
                  href={`tel:${settings?.phone}`}
                  style={linkStyle}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-primary)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-footer-text)")}
                >
                  📞 {settings?.phone}
                </a>
              </li>

              <li>
                <a
                  href={`mailto:${settings?.email}`}
                  style={linkStyle}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-primary)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-footer-text)")}
                >
                  ✉️{settings?.email}
                </a>
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-12 pt-8" style={{ borderTop: "1px solid var(--color-border)" }}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">

            <p style={{ color: "var(--color-text-muted)", fontSize: "13px" }}>
              {settings?.copyright ||
                "© 2026 All Rights Reserved."}
            </p>

            <div className="flex gap-6">

                {settings?.facebook && (
                  <a
                    href={settings.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    title="Facebook"
                    className="w-10 h-10 flex items-center justify-center rounded-full border border-[var(--color-border)] text-[var(--color-footer-text)] hover:bg-[var(--color-primary)] hover:text-white hover:border-[var(--color-primary)] transition-all duration-300"
                  >
                    <FaFacebookF size={17} />
                  </a>
                )}

                {settings?.instagram && (
                  <a
                    href={settings.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    title="Instagram"
                    className="w-10 h-10 flex items-center justify-center rounded-full border border-[var(--color-border)] text-[var(--color-footer-text)] hover:bg-[var(--color-primary)] hover:text-white hover:border-[var(--color-primary)] transition-all duration-300"
                  >
                    <FaInstagram size={18} />
                  </a>
                )}

                {settings?.linkedin && (
                  <a
                    href={settings.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                    title="LinkedIn"
                    className="w-10 h-10 flex items-center justify-center rounded-full border border-[var(--color-border)] text-[var(--color-footer-text)] hover:bg-[var(--color-primary)] hover:text-white hover:border-[var(--color-primary)] transition-all duration-300"
                  >
                    <FaLinkedinIn size={17} />
                  </a>
                )}
            </div>

          </div>
        </div>

      </div>
    </footer >
  );
}