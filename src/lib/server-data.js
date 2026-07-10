// Server-only fetch helpers for the Express backend. These are called from
// generateMetadata() (and page server components) so metadata + JSON-LD are
// rendered on the server for SEO instead of being injected into
// document.head after the client mounts, like the old react-router app did.
//
// Note: these hit the same public REST endpoints the client already uses
// (VITE_API_URL / NEXT_PUBLIC_API_URL), so no backend changes are required.

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Revalidate every 60s (ISR-style) so metadata stays fresh without hitting
// the backend on every single request. Tune/remove as you see fit.
const REVALIDATE_SECONDS = 60;

export async function getSettings() {
  try {
    const res = await fetch(`${API_URL}/settings`, {
      next: { revalidate: REVALIDATE_SECONDS },
    });
    const json = await res.json();
    return json?.data || null;
  } catch (error) {
    console.error("getSettings failed:", error);
    return null;
  }
}

export async function getCmsBySlug(slug) {
  try {
    const res = await fetch(`${API_URL}/cms`, {
      next: { revalidate: REVALIDATE_SECONDS },
    });
    const json = await res.json();
    const list = Array.isArray(json) ? json : json?.data || [];
    return list.find((item) => item.slug === slug) || null;
  } catch (error) {
    console.error("getCmsBySlug failed:", error);
    return null;
  }
}

export async function getProductBySlug(slug) {
  try {
    const res = await fetch(`${API_URL}/products`, {
      next: { revalidate: REVALIDATE_SECONDS },
    });
    const json = await res.json();
    const list = Array.isArray(json) ? json : json?.data || [];
    return list.find((item) => item.slug === slug) || null;
  } catch (error) {
    console.error("getProductBySlug failed:", error);
    return null;
  }
}

export function absoluteImageUrl(url = "") {
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url;

  const backendUrl = (
    process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "http://localhost:5000"
  ).replace(/\/$/, "");

  // Backend stores product images as bare filenames (e.g. "product-1.jpg"),
  // but settings/logo paths often already include "/uploads/...". Match the
  // same smart-prefix logic already used in ProductGallery.jsx /
  // RelatedProducts.jsx / FeaturedProducts.jsx so metadata images resolve
  // to the same URL the visible <img> tags use.
  const cleanPath = url.startsWith("/") ? url : `/${url}`;
  if (!cleanPath.startsWith("/uploads")) {
    return `${backendUrl}/uploads${cleanPath}`;
  }
  return `${backendUrl}${cleanPath}`;
}
