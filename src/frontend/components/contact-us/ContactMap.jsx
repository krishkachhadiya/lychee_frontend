"use client";

export default function ContactMap() {
  return (
    <section className="pb-16 bg-[var(--color-card)]">
      <h2 className="sr-only">
        Our Location
      </h2>

      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)]">

          <iframe
            title="Lychee Bath Accessories Location"
            src="https://www.google.com/maps?q=Lychee%20Bath%20Accessories&output=embed"
            className="w-full h-[300px] md:h-[400px] lg:h-[450px]"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            style={{ border: 0 }}
          />

        </div>
      </div>
    </section>
  );
}