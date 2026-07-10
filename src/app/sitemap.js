const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

async function getProductSlugs() {
  try {
    const res = await fetch(`${API_URL}/products`);
    const json = await res.json();
    const products = Array.isArray(json) ? json : json?.data || [];
    return products.map((p) => p.slug).filter(Boolean);
  } catch {
    return [];
  }
}

export default async function sitemap() {
  const staticRoutes = ["", "/about-us", "/products", "/contact-us"].map(
    (path) => ({
      url: `${SITE_URL}${path}`,
      lastModified: new Date(),
    })
  );

  const productSlugs = await getProductSlugs();
  const productRoutes = productSlugs.map((slug) => ({
    url: `${SITE_URL}/products/${slug}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...productRoutes];
}
