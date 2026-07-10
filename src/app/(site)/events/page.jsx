import RecentEvents from "@/frontend/components/events/RecentEvents";
import { getSettings, getCmsBySlug, absoluteImageUrl } from "@/lib/server-data";
import {
  organizationSchema,
  websiteSchema,
  breadcrumbSchema,
} from "@/frontend/utils/schemaHelpers";

export async function generateMetadata() {
  const [settings, cmsPage] = await Promise.all([
    getSettings(),
    getCmsBySlug("events"),
  ]);

  const title = cmsPage?.metaTitle || cmsPage?.title || "Recent Events";
  const description = cmsPage?.metaDescription || "Explore our latest upcoming exhibitions and events.";
  const image = absoluteImageUrl(settings?.logo);

  return {
    title,
    description,
    alternates: { canonical: "/events" },
    openGraph: { title, description, images: image ? [image] : [], type: "website" },
    twitter: { card: "summary_large_image", title, description, images: image ? [image] : [] },
  };
}

export default async function EventsPage() {
  const [settings, cmsPage] = await Promise.all([
    getSettings(),
    getCmsBySlug("events"),
  ]);

  let schema = null;
  if (cmsPage) {
    schema = [
      organizationSchema(settings || {}),
      websiteSchema(settings || {}),
      breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Events", path: "/events" },
      ]),
    ];
  }

  return (
    <>
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}

      <div className="w-full min-h-screen bg-white">
        <RecentEvents />
      </div>
    </>
  );
}