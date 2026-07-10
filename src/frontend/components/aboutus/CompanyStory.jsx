"use client";

export default function CompanyStory() {
  return (
    <section className="py-15 bg-[var(--color-card)]">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">

        <div className="text-center mb-16">
          <span className="inline-block bg-[var(--color-accent-soft)] text-[var(--color-accent)] px-4 py-2 rounded-full text-sm font-semibold">
            OUR JOURNEY
          </span>

          <h2 className="mt-4 text-3xl md:text-5xl font-bold text-[var(--color-primary)]">
            Building Trust Through Quality
          </h2>

          <p className="mt-5 text-[var(--color-secondary)] max-w-3xl mx-auto text-lg leading-relaxed">
            Over the years, we have built a reputation for quality,
            innovation and customer satisfaction. Our journey reflects
            our commitment to continuous improvement and delivering
            value at every step.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-12">

          <div className="text-center bg-[var(--color-card)] p-8 rounded-[var(--radius-lg)] border border-[var(--color-border)] hover:shadow-[var(--shadow-lg)] hover:-translate-y-2 transition-all duration-300">
            <div className="w-16 h-16 mx-auto rounded-full bg-[var(--color-accent)] text-[var(--color-white)] flex items-center justify-center text-xl font-bold shadow-[var(--shadow-md)]">
              01
            </div>

            <h3 className="mt-5 text-xl font-semibold text-[var(--color-primary)]">
              Started
            </h3>

            <p className="mt-3 text-[var(--color-secondary)] leading-relaxed">
              Our journey began with a simple vision: to provide
              customers with reliable products, exceptional quality
              and outstanding service.
            </p>
          </div>

          <div className="text-center bg-[var(--color-card)] p-8 rounded-[var(--radius-lg)] border border-[var(--color-border)] hover:shadow-[var(--shadow-lg)] hover:-translate-y-2 transition-all duration-300">
            <div className="w-16 h-16 mx-auto rounded-full bg-[var(--color-accent)] text-[var(--color-white)] flex items-center justify-center text-xl font-bold shadow-[var(--shadow-md)]">
              02
            </div>

            <h3 className="mt-5 text-xl font-semibold text-[var(--color-primary)]">
              Expanded
            </h3>

            <p className="mt-3 text-[var(--color-secondary)] leading-relaxed">
              As customer trust grew, we expanded our product range
              and strengthened our presence across multiple industries
              and markets.
            </p>
          </div>

          <div className="text-center bg-[var(--color-card)] p-8 rounded-[var(--radius-lg)] border border-[var(--color-border)] hover:shadow-[var(--shadow-lg)] hover:-translate-y-2 transition-all duration-300">
            <div className="w-16 h-16 mx-auto rounded-full bg-[var(--color-accent)] text-[var(--color-white)] flex items-center justify-center text-xl font-bold shadow-[var(--shadow-md)]">
              03
            </div>

            <h3 className="mt-5 text-xl font-semibold text-[var(--color-primary)]">
              Today
            </h3>

            <p className="mt-3 text-[var(--color-secondary)] leading-relaxed">
              Today, we continue to deliver innovative solutions,
              premium products and long-term value to businesses
              and customers.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}