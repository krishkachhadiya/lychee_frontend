"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

const SLIDES = [
  {
    image: "/slide_1.png",
    category: "hawk-pvd-rose-gold-collection",
  },
  {
    image: "/slide_2.png",
    category: "electronics",
  },
  {
    image: "/dc-1206.jpg",
    category: "diamond-collection",
  },
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [fade, setFade] = useState(true);

  // Track touch positions for swipe logic
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Helper function to handle sliding transitions safely
  const changeSlide = (nextIndex) => {
    setFade(false);
    setTimeout(() => {
      setCurrentSlide(nextIndex);
      setFade(true);
    }, 400);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const nextSlide = (currentSlide + 1) % SLIDES.length;
      changeSlide(nextSlide);
    }, 4000);

    return () => clearInterval(interval);
  }, [currentSlide]);

  // Touch Swipe Handlers
  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
    touchEndX.current = e.targetTouches[0].clientX; // Initialize to prevent accidental jumps
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;

    const diffX = touchStartX.current - touchEndX.current;
    const swipeThreshold = 50; // Minimum pixel swipe distance to trigger action

    if (diffX > swipeThreshold) {
      // Swiped Left -> Next Slide
      const nextSlide = (currentSlide + 1) % SLIDES.length;
      changeSlide(nextSlide);
    } else if (diffX < -swipeThreshold) {
      // Swiped Right -> Previous Slide
      const prevSlide = (currentSlide - 1 + SLIDES.length) % SLIDES.length;
      changeSlide(prevSlide);
    }

    // Reset touch variables
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  return (
    <section className="bg-[var(--color-background)] overflow-hidden">
      <div className="container-luxury py-12 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* Slider Container with Touch Listeners */}
          <div
            className="order-1 lg:order-2 touch-pan-y"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <Link
              href={`/products?category=${SLIDES[currentSlide].category}`}
            >
              <div className="overflow-hidden rounded-[var(--radius-xl)] shadow-[var(--shadow-lg)] cursor-pointer border border-[var(--color-border)] select-none">

                <img
                  src={SLIDES[currentSlide].image}
                  alt="Banner"
                  className={`w-full h-auto object-cover hover:scale-105 transition-all duration-700 ease-in-out pointer-events-none ${fade
                      ? "opacity-100"
                      : "opacity-0"
                    }`}
                />

              </div>
            </Link>

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-5">
              {SLIDES.map((_, index) => (
                <button
                  key={index}
                  onClick={() => changeSlide(index)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${currentSlide === index
                      ? "w-8 bg-[var(--color-accent)]"
                      : "w-2.5 bg-[var(--color-border-strong)]"
                    }`}
                />
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="order-2 lg:order-1 text-center lg:text-left">
            <span className="eyebrow">
              Welcome To Our Company
            </span>

            <h1 className="font-display mt-4 text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-semibold text-[var(--color-primary)] leading-[1.12] tracking-[-0.02em]">
              Premium Products{" "}
              <br className="hidden lg:block" />
              For Modern Business
            </h1>

            <p className="mt-6 text-base md:text-lg text-[var(--color-secondary)] max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Delivering high quality products and innovative
              solutions for customers around the world.
            </p>

            <div className="flex flex-wrap justify-center lg:justify-start gap-4 mt-9">

              <Link
                href="/products"
                className="btn btn-primary"
              >
                Explore Products
              </Link>

              <Link
                href="/contact-us"
                className="btn btn-secondary"
              >
                Contact Us
              </Link>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}