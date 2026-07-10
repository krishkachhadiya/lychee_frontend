"use client";

import Link from "next/link";
const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "http://localhost:5000";

export default function Aboutpre({ settings }) {
  const imageUrl = settings?.aboutImage
    ? settings.aboutImage.startsWith("http")
      ? settings.aboutImage
      : `${BACKEND_URL}${settings.aboutImage.startsWith("/") ? "" : "/"
      }${settings.aboutImage}`
    : "/about-us.jpg";
  return (
    <section className="container-luxury py-15 bg-[var(--color-section)]">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
        {/* Image */}
        <div className="relative">
          <div className="overflow-hidden rounded-[32px] shadow-2xl border border-[var(--color-border)] bg-[var(--color-card)]">
            <img
              src={imageUrl}
              alt="About Lychee"
              className="w-full h-[350px] sm:h-[450px] lg:h-[600px] object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
        </div>

        {/* Content */}
        <div>

          <span className="inline-block bg-[var(--color-accent-soft)] text-[var(--color-accent)] px-4 py-2 rounded-full text-sm font-semibold">
            About Us
          </span>

          <h2 className="mt-6 text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-[var(--color-text)]">
            Lychee Company Since
            <br />
            2006
          </h2>

          <p className="mt-6 text-base lg:text-lg leading-8 text-[var(--color-text-light)]">
            At LYCHEE, we believe a bathroom is more than just a space—
            it's a sanctuary of luxury, style, and comfort. Since our
            inception in 2006, we have been committed to creating premium
            bathroom accessories that combine elegant design with lasting
            quality.
          </p>
          <p className="mt-6 text-base lg:text-lg leading-8 text-[var(--color-text-light)]">
            A LYCHEE bathroom evokes emotions. It is an intimate space of well-being that embodies sophistication, innovation, and modern aesthetics. Our family-run company has transformed from a quality accessory manufacturer into a complete bathroom solutions brand, providing concepts that blend style and practicality seamlessly.
          </p>
          <p className="mt-6 text-base lg:text-lg leading-8 text-[var(--color-text-light)]">
            With a deep commitment to quality, durability, and Indian craftsmanship, LYCHEE proudly sets the benchmark for bathroom fittings. We aim to inspire every customer to create their dream bath space with our thoughtfully designed collections that balance beauty with performance.
          </p>

          <Link
            href="/about-us"
            className="btn btn-primary mt-8 inline-flex"
          >
            Learn More
          </Link>
        </div>

      </div>
    </section>
  );
}