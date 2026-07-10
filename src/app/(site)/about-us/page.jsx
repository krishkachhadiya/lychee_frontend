import AboutUsView from "@/frontend/views/AboutUs";
import { getSettings, getCmsBySlug, absoluteImageUrl } from "@/lib/server-data";
import {
  localBusinessSchema,
  organizationSchema,
  aboutPageSchema,
  breadcrumbSchema,
} from "@/frontend/utils/schemaHelpers";

export async function generateMetadata() {
  const [settings, aboutPage] = await Promise.all([
    getSettings(),
    getCmsBySlug("about-us"),
  ]);

  const title = aboutPage?.metaTitle || aboutPage?.title || "About Us";
  const description = aboutPage?.metaDescription || "";
  const image = absoluteImageUrl(settings?.logo);

  return {
    title,
    description,
    alternates: { canonical: "/about-us" },
    openGraph: { title, description, images: image ? [image] : [], type: "website" },
    twitter: { card: "summary_large_image", title, description, images: image ? [image] : [] },
  };
}

export default async function AboutUsPage() {
  const [settings, aboutPage] = await Promise.all([
    getSettings(),
    getCmsBySlug("about-us"),
  ]);

  const title = aboutPage?.metaTitle || aboutPage?.title || "About Us";
  const description = aboutPage?.metaDescription || "";

  const schema = [
    localBusinessSchema(settings || {}),
    organizationSchema(settings || {}),
    aboutPageSchema({ title, description, path: "/about-us", image: settings?.logo }),
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "About Us", path: "/about-us" },
    ]),
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <AboutUsView />
    </>
  );
}
