import ContactUsView from "@/frontend/views/ContactUs";
import { getSettings, getCmsBySlug, absoluteImageUrl } from "@/lib/server-data";
import {
  organizationSchema,
  websiteSchema,
  contactPageSchema,
  localBusinessSchema,
  breadcrumbSchema,
} from "@/frontend/utils/schemaHelpers";

export async function generateMetadata() {
  const [settings, cmsPage] = await Promise.all([
    getSettings(),
    getCmsBySlug("contact-us"),
  ]);

  const title = cmsPage?.metaTitle || cmsPage?.title || "Contact Us";
  const description = cmsPage?.metaDescription || "";
  const image = absoluteImageUrl(settings?.logo);

  return {
    title,
    description,
    alternates: { canonical: "/contact-us" },
    openGraph: { title, description, images: image ? [image] : [], type: "website" },
    twitter: { card: "summary_large_image", title, description, images: image ? [image] : [] },
  };
}

export default async function ContactUsPage() {
  const [settings, cmsPage] = await Promise.all([
    getSettings(),
    getCmsBySlug("contact-us"), 
  ]);

  let schema = null;
  if (cmsPage) {
    const title = cmsPage?.metaTitle || cmsPage?.title || "Contact Us";
    const description = cmsPage?.metaDescription || "";

    schema = [
      organizationSchema(settings || {}),
      websiteSchema(settings || {}),
      contactPageSchema({ title, description, path: "/contact-us", image: settings?.logo }),
      localBusinessSchema(settings || {}),
      breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Contact Us", path: "/contact-us" },
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
      <ContactUsView />
    </>
  );
}
