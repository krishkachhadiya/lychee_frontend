const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/$/, "");
const BACKEND_URL = (process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "").replace(/\/$/, "");

// ===============================
// Image URL Helper
// ===============================
const getImageUrl = (url = "") => {
  if (!url) return "";

  // Already absolute (Cloudinary, CDN, etc.)
  if (/^https?:\/\//i.test(url)) {
    return url;
  }
  const cleanPath = url.startsWith("/") ? url : `/${url}`;
  if (!cleanPath.startsWith("/uploads")) {
    return `${BACKEND_URL}/uploads${cleanPath}`;
  }
  return `${BACKEND_URL}${cleanPath}`;
};

// ===============================
// Page URL Helper
// ===============================
const getPageUrl = (path = "/") => {
  if (!path.startsWith("/")) path = `/${path}`;
  return `${SITE_URL}${path}`;
};

// ===============================
// Organization
// ===============================
export const organizationSchema = (settings = {}) => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: settings.companyName || "",
  url: SITE_URL,
  logo: getImageUrl(settings.logo),
  image: getImageUrl(settings.logo),
  email: settings.email || "",
  telephone: settings.phone || "",
  address: {
    "@type": "PostalAddress",
    streetAddress: settings.address || "",
  },
  sameAs: [
    settings.facebook,
    settings.instagram,
    settings.linkedin,
    settings.youtube,
    settings.twitter,
  ].filter(Boolean),
});

// ===============================
// Website
// ===============================
export const websiteSchema = (settings = {}) => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: settings.websiteTitle || settings.companyName || "",
  publisher: {
    "@id": `${SITE_URL}/#organization`,
  },
});

// ===============================
// LocalBusiness
// ===============================
export const localBusinessSchema = (settings = {}) => ({
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${SITE_URL}/#localbusiness`,
  name: settings.companyName || "",
  url: SITE_URL,
  image: getImageUrl(settings.logo),
  logo: getImageUrl(settings.logo),
  telephone: settings.phone || "",
  email: settings.email || "",
  address: {
    "@type": "PostalAddress",
    streetAddress: settings.address || "",
  },
  parentOrganization: {
    "@id": `${SITE_URL}/#organization`,
  },
});

// ===============================
// Breadcrumb
// ===============================
export const breadcrumbSchema = (items = []) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: getPageUrl(item.path),
  })),
});

// ===============================
// About Page
// ===============================
export const aboutPageSchema = ({
  title = "About Us",
  description = "",
  path = "/about-us",
  image = "",
} = {}) => ({
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "@id": `${getPageUrl(path)}/#aboutpage`,
  url: getPageUrl(path),
  name: title,
  description,
  isPartOf: {
    "@id": `${SITE_URL}/#website`,
  },
  about: {
    "@id": `${SITE_URL}/#organization`,
  },
  primaryImageOfPage: image
    ? {
      "@type": "ImageObject",
      url: getImageUrl(image),
    }
    : undefined,
});

// ===============================
// Collection Page (Products Grid)
// ===============================
export const collectionPageSchema = ({
  title = "",
  description = "",
  path = "/products",
  image = "",
} = {}) => ({
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": `${getPageUrl(path)}/#collectionpage`,
  url: getPageUrl(path),
  name: title,
  description,
  inLanguage: "en",
  isPartOf: {
    "@id": `${SITE_URL}/#website`,
  },
  about: {
    "@id": `${SITE_URL}/#organization`,
  },
  primaryImageOfPage: image
    ? {
      "@type": "ImageObject",
      url: getImageUrl(image),
    }
    : undefined,
});

// ===============================
// Product Details
// ===============================
export const productSchema = (product = {}, settings = {}) => ({
  "@context": "https://schema.org",
  "@type": "Product",
  "@id": `${getPageUrl(`/products/${product.slug}`)}/#product`,
  name: product.title || "",
  description:
    product.metaDescription ||
    product.description?.replace(/<[^>]*>/g, "") ||
    "",
  image: (product.images || [])
    .filter(Boolean)
    .map((img) => getImageUrl(img)),
  sku: product.productCode || product._id,
  category: product.category?.title || "",
  url: getPageUrl(`/products/${product.slug}`),
  brand: {
    "@type": "Brand",
    name: settings.companyName || "",
  },
  manufacturer: {
    "@id": `${SITE_URL}/#organization`,
  },
  offers: {
    "@type": "Offer",
    url: getPageUrl(`/products/${product.slug}`),
    availability: "https://schema.org/InStock",
    itemCondition: "https://schema.org/NewCondition",
  },
});

// ===============================
// Contact Page
// ===============================
export const contactPageSchema = ({
  title = "Contact Us",
  description = "",
  path = "/contact-us",
  image = "",
} = {}) => ({
  "@context": "https://schema.org",
  "@type": "ContactPage",
  "@id": `${getPageUrl(path)}/#contactpage`,
  url: getPageUrl(path),
  name: title,
  description,
  inLanguage: "en",
  isPartOf: {
    "@id": `${SITE_URL}/#website`,
  },
  about: {
    "@id": `${SITE_URL}/#organization`,
  },
  primaryImageOfPage: image
    ? {
        "@type": "ImageObject",
        url: getImageUrl(image),
      }
    : undefined,
});