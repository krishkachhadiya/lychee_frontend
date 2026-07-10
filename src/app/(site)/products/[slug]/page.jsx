import { notFound } from "next/navigation";
import ProductDetailsView from "@/frontend/views/ProductDetails";
import { getSettings, getProductBySlug, absoluteImageUrl } from "@/lib/server-data";
import {
  localBusinessSchema,
  organizationSchema,
  productSchema,
  breadcrumbSchema,
} from "@/frontend/utils/schemaHelpers";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Pre-render every known product slug at build time (SSG). Any slug added
// to the backend later is still served correctly — Next falls back to
// rendering it on first request, then caches it (see `revalidate` below).
export async function generateStaticParams() {
  try {
    const res = await fetch(`${API_URL}/products`);
    const json = await res.json();
    const products = Array.isArray(json) ? json : json?.data || [];
    return products.map((p) => ({ slug: p.slug }));
  } catch {
    // Backend unreachable at build time (e.g. this sandbox) — fall back to
    // rendering every product on-demand instead of failing the build.
    return [];
  }
}

export const revalidate = 60;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: "Product Not Found" };
  }

  const title = product.metaTitle || product.title || "Product";
  const description =
    product.metaDescription ||
    product.description?.replace(/<[^>]*>/g, "").slice(0, 160) ||
    "";
  const image = absoluteImageUrl(product.images?.[0]);

  return {
    title,
    description,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: { title, description, images: image ? [image] : [], type: "website" },
    twitter: { card: "summary_large_image", title, description, images: image ? [image] : [] },
  };
}

export default async function ProductDetailsPage({ params }) {
  const { slug } = await params;
  const [settings, product] = await Promise.all([
    getSettings(),
    getProductBySlug(slug),
  ]);

  if (!product) {
    notFound(); // renders src/app/(site)/not-found.jsx (or Next's default) with a real 404 status
  }

  const title = product.metaTitle || product.title || "Product";
  const description =
    product.metaDescription ||
    product.description?.replace(/<[^>]*>/g, "").slice(0, 160) ||
    "";

  const schema = [
    localBusinessSchema(settings ||{}),
    organizationSchema(settings || {}),
    productSchema(product, settings || {}),
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Products", path: "/products" },
      { name: product.title, path: `/products/${product.slug}` },
    ]),
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <ProductDetailsView />
    </>
  );
}
