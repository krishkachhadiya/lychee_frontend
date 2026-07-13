"use client";
import { useEffect, useRef } from "react";
/**
 * Adds the `.is-visible` class (see `.reveal-on-scroll` in base.css) the
 * first time the element scrolls into view. Pairs with:
 *   <div ref={ref} className="reveal-on-scroll">...</div>
 *
 * Lightweight alternative to an animation library — a single
 * IntersectionObserver per element, disconnects after firing once.
 */
export function useScrollReveal(options = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Respect prefers-reduced-motion: reveal immediately, skip the observer.
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      node.classList.add("is-visible");
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          node.classList.add("is-visible");
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px", ...options }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [options]);

  return ref;
}
