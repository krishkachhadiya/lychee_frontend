"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { buildMailtoHref } from "@/lib/mailto";
import { FiPhone, FiMail, FiMapPin, FiMenu, FiX } from "react-icons/fi";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "http://localhost:5000";

const MENU_ITEMS = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about-us" },
  { label: "Events", href: "/events" },
  { label: "Products", href: "/products", hasDropdown: true },
];

export default function Header() {
  const pathname = usePathname();

  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const [settings, setSettings] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function fetchSettingsAndCategories() {
      try {
        const settingsRes = await fetch(`${API_URL}/settings`);
        const settingsResult = await settingsRes.json();
        if (settingsResult.success) setSettings(settingsResult.data);

        const categoriesRes = await fetch(`${API_URL}/categories`);
        const categoriesResult = await categoriesRes.json();

        if (Array.isArray(categoriesResult)) {
          setCategories(categoriesResult);
        } else if (categoriesResult && categoriesResult.success) {
          setCategories(categoriesResult.data);
        }
      } catch (error) {
        console.error("Failed fetching data:", error);
      }
    }

    fetchSettingsAndCategories();
  }, []);

  function isActiveRoute(href) {
    return pathname === href || pathname.startsWith(href + "/");
  }

  const getLogoUrl = () => {
    if (!settings?.logo) return "/logo.png";
    if (settings.logo.startsWith("http")) return settings.logo;
    return `${BACKEND_URL}${settings.logo.startsWith("/") ? "" : "/"}${settings.logo}`;
  };

  return (
    <>
      {/* 🔴 PART 1: RED TOP BAR (Completely outside the sticky container, hidden on mobile) */}
      <div
        className="hidden md:flex w-full text-white text-[13px] font-normal py-2 px-12 flex-row items-center justify-between gap-2 z-40 relative"
        style={{ background: "#b31919", fontFamily: "var(--font-body, sans-serif)" }}
      >
        <div className="flex items-center gap-2 text-left">
          <span>🏷️</span>
          <span>
            {settings?.companyName || "LYCHEE"} has evolved into the brand for the{" "}
            <span className="underline font-medium cursor-pointer">"bathroom"</span>.
          </span>
        </div>
        <div className="flex items-center gap-6 text-sm flex-wrap justify-center">
          <a
            href={`tel:+917016834146`}
            className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
          >
            <FiPhone className="text-lg" />
            +91 70168 34146
          </a>
          <a
            href={buildMailtoHref("lycheebathaccessories@gmail.com")}
            className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
          >
            <FiMail className="text-lg" />
            lycheebathaccessories@gmail.com
          </a>
        </div>
      </div>

      {/* ⚪ PART 2: STICKY WHITE HEADER (sticky landmark; the actual link list below is the <nav>) */}
      <header
        className="sticky top-0 left-0 w-full z-50 bg-[var(--color-background)]"
        style={{
          background: "var(--color-background)",
          borderBottom: "1px solid var(--color-border)",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <div className="container-luxury">
          <div className="flex items-center justify-between" style={{ height: "var(--header-height)" }}>

            {/* Logo */}
            <Link href="/" className="shrink-0">
              <img
                src={getLogoUrl()}
                alt={settings?.companyName || "Logo"}
                className="h-14 w-auto object-contain"
              />
            </Link>

            {/* Desktop Menu */}
            <nav className="hidden md:flex items-center gap-5" aria-label="Primary">
              {MENU_ITEMS.map((item) => {
                const isProductMenu = item.hasDropdown;

                return (
                  <div
                    key={item.href}
                    className={`relative py-5 group ${isProductMenu ? "static md:relative" : ""}`}
                  >
                    <Link
                      href={item.href}
                      className="transition-all flex items-center gap-1"
                      aria-current={isActiveRoute(item.href) ? "page" : undefined}
                      aria-haspopup={isProductMenu ? "true" : undefined}
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "14px",
                        fontWeight: 500,
                        letterSpacing: "0.03em",
                        color: isActiveRoute(item.href) ? "var(--color-accent)" : "var(--color-text)",
                      }}
                    >
                      {item.label}
                      {isActiveRoute(item.href) && (
                        <span
                          className="absolute left-0 bottom-3 w-full h-[2px] rounded-full"
                          style={{ background: "var(--color-accent)" }}
                        ></span>
                      )}
                    </Link>

                    {isProductMenu && categories.length > 0 && (
                      <div
                        className="absolute right-0 top-full pt-1 invisible opacity-0 translate-y-2 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 z-50"
                        style={{ width: "min(550px, calc(100vw - 32px))" }}
                      >
                        <div
                          className="rounded-[var(--radius-md)] shadow-xl p-5 grid grid-cols-2 gap-x-10 gap-y-3 border"
                          style={{
                            background: "var(--color-background, #fff)",
                            borderColor: "var(--color-border, #f0f0f0)"
                          }}
                        >
                          {categories.map((cat) => (
                            <Link
                              key={cat._id}
                              href={`/products?category=${cat.slug}`}
                              className="block text-[14px] transition-colors"
                              style={{
                                color: "var(--color-text, #555)",
                                fontFamily: "var(--font-body)",
                                fontWeight: 400
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.color = "var(--color-accent)"}
                              onMouseLeave={(e) => e.currentTarget.style.color = "var(--color-text, #555)"}
                            >
                              {cat.title}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              <Link href="/contact-us" className="btn btn-primary btn-sm">
                Get In Touch
              </Link>
            </nav>

            {/* Mobile Burger Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden text-3xl"
              style={{ color: "var(--color-primary)" }}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              {menuOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>

        {/* Mobile Flyout Drawer Menu */}
        {menuOpen && (
          <nav
            id="mobile-menu"
            aria-label="Primary"
            className="lg:hidden w-full"
            style={{
              background: "var(--color-background)",
              borderTop: "1px solid var(--color-border)",
            }}
          >
            <div className="flex flex-col px-6 py-4 max-h-[80vh] overflow-y-auto">
              {MENU_ITEMS.map((item) => {
                if (item.hasDropdown) {
                  return (
                    <div key={item.href} className="flex flex-col border-b" style={{ borderColor: "var(--color-border)" }}>
                      <div className="flex justify-between items-center py-3">
                        <Link
                          href={item.href}
                          onClick={() => setMenuOpen(false)}
                          style={{
                            fontFamily: "var(--font-body)",
                            fontSize: "14px",
                            fontWeight: 500,
                            color: isActiveRoute(item.href) ? "var(--color-accent)" : "var(--color-text)",
                          }}
                        >
                          {item.label}
                        </Link>
                        <button
                          onClick={() => setMobileProductsOpen(!mobileProductsOpen)}
                          className="px-4 text-lg font-bold"
                          style={{ color: "var(--color-text)" }}
                          aria-label={mobileProductsOpen ? "Collapse product categories" : "Expand product categories"}
                          aria-expanded={mobileProductsOpen}
                          aria-controls="mobile-products-submenu"
                        >
                          {mobileProductsOpen ? "−" : "+"}
                        </button>
                      </div>

                      {mobileProductsOpen && (
                        <div id="mobile-products-submenu" className="pl-4 pb-3 flex flex-col gap-2">
                          {categories.map((cat) => (
                            <Link
                              key={cat._id}
                              href={`/products?category=${cat.slug}`}
                              onClick={() => setMenuOpen(false)}
                              className="py-1.5 text-sm"
                              style={{ color: "var(--color-text)", opacity: 0.8 }}
                            >
                              {cat.title}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="py-3"
                    style={{
                      borderBottom: "1px solid var(--color-border)",
                      fontFamily: "var(--font-body)",
                      fontSize: "14px",
                      fontWeight: 500,
                      color: isActiveRoute(item.href) ? "var(--color-accent)" : "var(--color-text)",
                    }}
                  >
                    {item.label}
                  </Link>
                );
              })}

              <Link
                href="/contact-us"
                onClick={() => setMenuOpen(false)}
                className="btn btn-primary mt-4"
              >
                Get In Touch
              </Link>
            </div>
          </nav>
        )}
      </header>
    </>
  );
}