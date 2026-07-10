import { Suspense } from "react";
import ProductsView from "@/frontend/views/Products";
import { getSettings, getCmsBySlug, absoluteImageUrl } from "@/lib/server-data";
import {
  localBusinessSchema,
  organizationSchema,
  collectionPageSchema,
  breadcrumbSchema,
} from "@/frontend/utils/schemaHelpers";

export async function generateMetadata() {
  const [settings, cmsPage] = await Promise.all([
    getSettings(),
    getCmsBySlug("products"),
  ]);

  const title = cmsPage?.metaTitle || cmsPage?.title || "Products";
  const description = cmsPage?.metaDescription || "";
  const image = absoluteImageUrl(settings?.logo);

  return {
    title,
    description,
    alternates: { canonical: "/products" },
    openGraph: { title, description, images: image ? [image] : [], type: "website" },
    twitter: { card: "summary_large_image", title, description, images: image ? [image] : [] },
  };
}

export default async function ProductsPage() {
  const [settings, cmsPage] = await Promise.all([
    getSettings(),
    getCmsBySlug("products"),
  ]);

  const title = cmsPage?.metaTitle || cmsPage?.title || "Products";
  const description = cmsPage?.metaDescription || "";

  const schema = [
    localBusinessSchema(settings || {}),
    organizationSchema(settings || {}),
    collectionPageSchema({ title, description, path: "/products", image: settings?.logo }),
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Products", path: "/products" },
    ]),
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      {/* ProductsContent reads ?category= via useSearchParams, which requires
          a Suspense boundary in the App Router. */}
      <Suspense fallback={null}>
        <ProductsView />
      </Suspense>
    </>
  );
}
