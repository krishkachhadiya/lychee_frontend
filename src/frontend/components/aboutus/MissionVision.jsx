"use client";

import { useScrollReveal } from "@/lib/useScrollReveal";

export default function MissionVision() {
  const revealRef = useScrollReveal();
  return (
    <section ref={revealRef} className="reveal-on-scroll py-20 bg-[var(--color-section)]">
      <div className="container-luxury">

        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block bg-[var(--color-accent-soft)] text-[var(--color-accent)] px-4 py-2 rounded-full text-sm font-semibold">
            OUR VALUES
          </span>

          <h2 className="mt-4 text-3xl md:text-4xl font-bold text-[var(--color-primary)]">
            Mission, Vision & Values
          </h2>
        </div>

        {/* Grid Container */}
        <div className="grid md:grid-cols-3 gap-6">

          {/* Mission */}
          <div className="bg-[var(--color-card)] p-8 rounded-[var(--radius-xl)] border border-[var(--color-border)] hover:shadow-[var(--shadow-md)] transition">
            <div className="w-14 h-14 rounded-[var(--radius-md)] bg-[var(--color-accent-soft)] flex items-center justify-center text-2xl mb-5">
              🎯
            </div>

            <h3 className="text-xl font-bold text-[var(--color-primary)]">
              Our Mission
            </h3>

            <p className="mt-4 text-[var(--color-secondary)] leading-relaxed">
              To provide premium quality products and innovative
              solutions that help customers achieve long-term success.
            </p>
          </div>

          {/* Vision */}
          <div className="bg-[var(--color-card)] p-8 rounded-[var(--radius-xl)] border border-[var(--color-border)] hover:shadow-[var(--shadow-md)] transition">
            <div className="w-14 h-14 rounded-[var(--radius-md)] bg-[var(--color-accent-soft)] flex items-center justify-center text-2xl mb-5">
              🚀
            </div>

            <h3 className="text-xl font-bold text-[var(--color-primary)]">
              Our Vision
            </h3>

            <p className="mt-4 text-[var(--color-secondary)] leading-relaxed">
              To become a trusted leader known for quality,
              innovation and customer satisfaction across industries.
            </p>
          </div>

          {/* Values */}
          <div className="bg-[var(--color-card)] p-8 rounded-[var(--radius-xl)] border border-[var(--color-border)] hover:shadow-[var(--shadow-md)] transition">
            <div className="w-14 h-14 rounded-[var(--radius-md)] bg-[var(--color-accent-soft)] flex items-center justify-center text-2xl mb-5">
              ⭐
            </div>

            <h3 className="text-xl font-bold text-[var(--color-primary)]">
              Core Values
            </h3>

            <p className="mt-4 text-[var(--color-secondary)] leading-relaxed">
              Integrity, quality, innovation, teamwork and commitment
              to delivering value to every customer.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}