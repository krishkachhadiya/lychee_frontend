import HomeView from "@/frontend/views/Home";
import { getSettings, absoluteImageUrl } from "@/lib/server-data";
import {
  organizationSchema,
  localBusinessSchema,
} from "@/frontend/utils/schemaHelpers";

export async function generateMetadata() {
  const settings = await getSettings();

  const title =
    settings?.metaTitle ||
    settings?.websiteTitle ||
    settings?.companyName ||
    "Home";
  const description = settings?.metaDescription || "";
  const image = absoluteImageUrl(settings?.logo);

  return {
    title,
    description,
    alternates: { canonical: "/" },
    openGraph: { title, description, images: image ? [image] : [], type: "website" },
    twitter: { card: "summary_large_image", title, description, images: image ? [image] : [] },
  };
}

export default async function HomePage() {
  const settings = await getSettings();

  const title =
    settings?.metaTitle ||
    settings?.websiteTitle ||
    settings?.companyName ||
    "Home";
  const description = settings?.metaDescription || "";

  const schema = [
    organizationSchema(settings || {}),
    localBusinessSchema(settings || {}),
  ];

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <HomeView />
    </>
  );
}
