"use client";

export default function ContactMap() {
  return (
    <section className="pb-16 bg-[var(--color-card)]">
      <h2 className="sr-only">
        Our Location
      </h2>

      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="overflow-hidden rounded-[var(--radius-xl)] border">

          <iframe
            title="Company Location"
            src="https://maps.google.com/maps?q=Rajkot&t=&z=13&ie=UTF8&iwloc=&output=embed"
            className="w-full"
            height="450"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
          />

        </div>
      </div>
    </section>
  );
}