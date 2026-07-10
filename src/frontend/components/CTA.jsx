import Link from "next/link";

export default function CTA() {
  return (
    <section className="py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="bg-[var(--color-primary)] rounded-[var(--radius-xl)] overflow-hidden shadow-xl">
          <div className="px-6 py-12 md:px-10 md:py-16 lg:px-16 text-center">
            
            {/* 1. FIXED BADGE: Added strong contrast background with white text */}
            <span className="inline-block bg-white/10 text-white backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold tracking-wider uppercase">
              Let's Work Together
            </span>

            {/* Title */}
            <h2 className="mt-6 text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight">
              Ready To Grow Your Business?
            </h2>

            {/* Paragraph Text */}
            <p className="mt-5 text-base md:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
              Contact our team today and discover how our products can help your business achieve better results.
            </p>

            <div className="mt-8">
              <Link
                href="/contact-us"
                className="inline-block bg-white text-[var(--color-primary)] hover:bg-white/90 active:scale-95 px-8 py-3.5 rounded-[var(--radius-md)] font-bold shadow-md hover:shadow-lg transition-all duration-200"
              >
                Get In Touch
              </Link>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}