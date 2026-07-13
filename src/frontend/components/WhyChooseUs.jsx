"use client";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "http://localhost:5000";

export default function WhyChooseUs({ settings }) {
  const imageUrl = settings?.whyChooseUsImage
    ? settings.whyChooseUsImage.startsWith("http")
      ? settings.whyChooseUsImage
      : `${BACKEND_URL}${settings.whyChooseUsImage.startsWith("/") ? "" : "/"}${settings.whyChooseUsImage}`
    : "/why-us.png";
  return (
    <section className="py-10 bg-[var(--color-card)]">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">

        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left Content */}
          <div>

            <span className="inline-block bg-[var(--color-accent-soft)] text-[var(--color-accent)] px-4 py-2 rounded-full text-sm font-semibold">
              WHY CHOOSE US
            </span>

            <h2 className="mt-6 text-4xl lg:text-5xl font-bold leading-tight text-[var(--color-text)]">
              Most Lychee Experts
            </h2>

            <p className="mt-6 text-lg leading-8 text-[var(--color-text-light)]">
              We view the label "Made in India" as commitment to the kind of
              company management aimed at securing long-term quality,
              innovation and customer satisfaction.
            </p>

            <div className="grid sm:grid-cols-2 gap-10 mt-12">

              {/* Factory */}

              <div className="flex gap-5">

                <div className="w-16 h-16 rounded-full bg-[var(--color-primary-soft)] flex items-center justify-center text-3xl text-[var(--color-primary)] shrink-0">
                  🏭
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-[var(--color-text)]">
                    Factory
                  </h3>

                  <p className="mt-2 text-[var(--color-text-light)] leading-7">
                    Factory in 7,200 sqft area to large.
                  </p>
                </div>

              </div>

              {/* Production */}

              <div className="flex gap-5">

                <div className="w-16 h-16 rounded-full bg-[var(--color-primary-soft)] flex items-center justify-center text-3xl text-[var(--color-primary)] shrink-0">
                  📦
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-[var(--color-text)]">
                    Production Capacity
                  </h3>

                  <p className="mt-2 text-[var(--color-text-light)] leading-7">
                    1000 Pcs. Daily Production Capacity.
                  </p>
                </div>

              </div>

              {/* Experience */}

              <div className="flex gap-5">

                <div className="w-16 h-16 rounded-full bg-[var(--color-primary-soft)] flex items-center justify-center text-3xl text-[var(--color-primary)] shrink-0">
                  ✔
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-[var(--color-text)]">
                    Experience
                  </h3>

                  <p className="mt-2 text-[var(--color-text-light)] leading-7">
                    10+ Years Of Expertise In Manufacturing Industry.
                  </p>
                </div>

              </div>

              {/* Staff */}

              <div className="flex gap-5">

                <div className="w-16 h-16 rounded-full bg-[var(--color-primary-soft)] flex items-center justify-center text-3xl text-[var(--color-primary)] shrink-0">
                  👥
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-[var(--color-text)]">
                    Skilled Staff
                  </h3>

                  <p className="mt-2 text-[var(--color-text-light)] leading-7">
                    Well Trained Skilled Staff.
                  </p>
                </div>

              </div>

            </div>

          </div>

          {/* Right Image */}

          <div className="flex justify-end">

            <img
              src={imageUrl}
              alt="Why Choose Us"
              className="w-full max-w-xl h-[560px] object-cover rounded-[var(--radius-xl)] shadow-[var(--shadow-lg)]"
            />

          </div>

        </div>
      </div>
    </section>
  );
}