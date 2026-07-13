"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

function EventCardSkeleton() {
  return (
    <div
      className="rounded-[var(--radius-xl)] border p-5 flex flex-col md:flex-row gap-6 md:gap-8 items-stretch"
      style={{ background: "var(--color-card)", borderColor: "var(--color-border)" }}
    >
      <div className="skeleton w-full md:w-60 h-60 sm:h-64 md:h-60 rounded-[var(--radius-md)] flex-shrink-0" />
      <div className="w-full flex-1 flex flex-col justify-center gap-3">
        <div className="skeleton h-6 rounded-[var(--radius-md)] w-2/3" />
        <div className="skeleton h-4 rounded-[var(--radius-md)] w-1/2" />
        <div className="skeleton h-4 rounded-[var(--radius-md)] w-1/3" />
      </div>
    </div>
  );
}

export default function RecentEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getPublicEvents() {
      try {
        const response = await apiFetch("/events");
        const result = await response.json();
        const allEvents = Array.isArray(result) ? result : result.data || result.events || [];

        const activeEvents = allEvents.filter((event) => event.status === "active");
        setEvents(activeEvents);
      } catch (error) {
        console.error("Failed loading event listings:", error);
      } finally {
        setLoading(false);
      }
    }
    getPublicEvents();
  }, []);

  if (loading) {
    return (
      <section className="w-full py-12" style={{ background: "var(--color-section)" }}>
        <div className="container-luxury">
          <h1 className="text-3xl font-bold text-center mb-10 tracking-tight" style={{ color: "var(--color-primary)" }}>
            Recent Events
          </h1>
          <div className="space-y-6">
            <EventCardSkeleton />
            <EventCardSkeleton />
          </div>
        </div>
      </section>
    );
  }

  if (events.length === 0) {
    return (
      <section className="w-full py-20" style={{ background: "var(--color-section)" }}>
        <div className="container-luxury text-center">
          <h1 className="text-3xl font-bold tracking-tight" style={{ color: "var(--color-primary)" }}>
            Recent Events
          </h1>
          <p className="mt-4" style={{ color: "var(--color-text-muted)" }}>
            No events are scheduled right now — check back soon.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="recent-events" className="w-full py-12 scroll-mt-20" style={{ background: "var(--color-section)" }}>
      <div className="container-luxury">

        <h1
          className="text-3xl font-bold text-center mb-10 tracking-tight animate-fade-up"
          style={{ color: "var(--color-primary)" }}
        >
          Recent Events
        </h1>

        <div className="space-y-6">
          {events.map((event, index) => {
            const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "http://localhost:5000";

            let imageSrc = "/fallback-placeholder.jpg";

            if (event.image) {
              if (event.image.startsWith("http")) {
                imageSrc = event.image;
              } else {
                const cleanPath = event.image.startsWith("/") ? event.image.slice(1) : event.image;
                imageSrc = `${baseUrl}/uploads/${cleanPath}`;
              }
            }
            return (
              <div
                key={event._id || event.id}
                className="rounded-[var(--radius-xl)] border p-5 flex flex-col md:flex-row gap-6 md:gap-8 items-stretch shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] hover:-translate-y-1 transition-all duration-300 animate-fade-up"
                style={{ background: "var(--color-card)", borderColor: "var(--color-border)", animationDelay: `${Math.min(index, 6) * 60}ms` }}
              >
                {/* Image Banner */}
                <div
                  className="w-full md:w-60 h-60 sm:h-64 md:h-60 rounded-[var(--radius-md)] overflow-hidden flex-shrink-0 border"
                  style={{ background: "var(--color-section)", borderColor: "var(--color-border)" }}
                >
                  <img
                    src={imageSrc}
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    loading="lazy"
                  />
                </div>

                {/* Details Panel */}
                <div className="w-full flex-1 flex flex-col justify-between py-0.5">
                  <div>
                    <h2
                      className="text-xl md:text-2xl font-bold mb-3 tracking-tight leading-tight capitalize"
                      style={{ color: "var(--color-text)" }}
                    >
                      {event.title}
                    </h2>

                    <div className="space-y-2.5 text-sm md:text-base font-normal" style={{ color: "var(--color-text-light)" }}>
                      {event.address && (
                        <div className="flex items-start gap-3">
                          <span className="flex-shrink-0" style={{ color: "var(--color-text-muted)" }}>📍</span>
                          <span className="line-clamp-1">{event.address}</span>
                        </div>
                      )}
                      {event.dates && (
                        <div className="flex items-center gap-3">
                          <span className="flex-shrink-0" style={{ color: "var(--color-text-muted)" }}>📅</span>
                          <span>{event.dates}</span>
                        </div>
                      )}
                      {event.timeWindow && (
                        <div className="flex items-center gap-3">
                          <span className="flex-shrink-0" style={{ color: "var(--color-text-muted)" }}>🕒</span>
                          <span>{event.timeWindow}</span>
                        </div>
                      )}
                      {event.eventType && (
                        <div className="flex items-center gap-3">
                          <span className="flex-shrink-0" style={{ color: "var(--color-text-muted)" }}>🏢</span>
                          <span>
                            Event Type : <span style={{ color: "var(--color-text)" }}>{event.eventType}</span>
                          </span>
                        </div>
                      )}
                      {event.expectedVisitors && (
                        <div className="flex items-center gap-3">
                          <span className="flex-shrink-0" style={{ color: "var(--color-text-muted)" }}>👥</span>
                          <span>
                            Expected Visitors : <span style={{ color: "var(--color-text)" }}>{event.expectedVisitors}</span>
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {event.description && (
                    <div
                      className="text-xs md:text-sm leading-relaxed uppercase border-t pt-3.5 mt-4 line-clamp-3 max-w-none"
                      style={{ color: "var(--color-text-muted)", borderColor: "var(--color-border)" }}
                      dangerouslySetInnerHTML={{ __html: event.description }}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
