import "./globals.css";
import { getSettings, absoluteImageUrl } from "@/lib/server-data";
import { Analytics } from '@vercel/analytics/next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export async function generateMetadata() {
  const settings = await getSettings();

  const title =
    settings?.metaTitle ||
    settings?.websiteTitle ||
    settings?.companyName ||
    "Home";

  const description = settings?.metaDescription || "";
  const favicon = settings?.favicon
    ? absoluteImageUrl(settings.favicon)
    : "/favicon.svg";

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: title,
      template: `%s | ${settings?.companyName || title}`,
    },
    description,
    icons: {
      icon: favicon,
    },
  };
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
