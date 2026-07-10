"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api"; 

export default function RecentEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getPublicEvents() {
      try {
        const response = await apiFetch("/events");
        const result = await response.json();
        const allEvents = Array.isArray(result) ? result : result.data || result.events || [];
        
        const activeEvents = allEvents.filter(event => event.status === "active");
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
      <div className="w-full py-16 text-center">
        <p className="text-gray-400 text-sm animate-pulse">Loading exhibition schedules...</p>
      </div>
    );
  }

  if (events.length === 0) return null;

  return (
    <section id="recent-events" className="w-full bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 scroll-mt-20">
      <div className="max-w-5xl mx-auto">
        
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-10 tracking-tight">
          Recent Events
        </h2>

        <div className="space-y-6">
          {events.map((event) => {
           
            const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "http://localhost:5000";
            
            let imageSrc = "/fallback-placeholder.jpg"; // Default fallback
            
            if (event.image) {
              if (event.image.startsWith("http")) {
                imageSrc = event.image; // Already a full URL
              } else {
                // Remove leading slash if present to avoid double slashes like //Events/image.jpg
                const cleanPath = event.image.startsWith("/") ? event.image.slice(1) : event.image;
                imageSrc = `${baseUrl}/uploads/${cleanPath}`; 
              }
            }
            return (
              <div 
                key={event._id || event.id}
                className="bg-white rounded-xl border border-gray-100 p-5 flex flex-col md:flex-row gap-6 md:gap-8 items-stretch shadow-sm hover:shadow-md transition-all duration-300"
              >
                {/* Image Banner */}
                <div className="w-full md:w-60 h-60 sm:h-64 md:h-60 rounded-lg overflow-hidden flex-shrink-0 bg-gray-50 border border-gray-100">
                  <img 
                    src={imageSrc} 
                    alt={event.title} 
                    className="w-full h-full object-cover" 
                    loading="lazy" 
                  />
                </div>

                {/* Details Panel */}
                <div className="w-full flex-1 flex flex-col justify-between py-0.5">
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 tracking-tight leading-tight capitalize">
                      {event.title}
                    </h3>
                    
                    <div className="space-y-2.5 text-gray-500 text-sm md:text-base font-normal">
                      {event.address && (
                        <div className="flex items-start gap-3">
                          <span className="text-gray-400 flex-shrink-0">📍</span>
                          <span className="text-gray-600 line-clamp-1">{event.address}</span>
                        </div>
                      )}
                      {event.dates && (
                        <div className="flex items-center gap-3">
                          <span className="text-gray-400 flex-shrink-0">📅</span>
                          <span className="text-gray-600">{event.dates}</span>
                        </div>
                      )}
                      {event.timeWindow && (
                        <div className="flex items-center gap-3">
                          <span className="text-gray-400 flex-shrink-0">🕒</span>
                          <span className="text-gray-600">{event.timeWindow}</span>
                        </div>
                      )}
                      {event.eventType && (
                        <div className="flex items-center gap-3">
                          <span className="text-gray-400 flex-shrink-0">🏢</span>
                          <span className="text-gray-600">
                            Event Type : <span className="font-normal text-gray-700">{event.eventType}</span>
                          </span>
                        </div>
                      )}
                      {event.expectedVisitors && (
                        <div className="flex items-center gap-3">
                          <span className="text-gray-400 flex-shrink-0">👥</span>
                          <span className="text-gray-600">
                            Expected Visitors : <span className="font-normal text-gray-700">{event.expectedVisitors}</span>
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {event.description && (
                    <div 
                      className="text-gray-400 text-xs md:text-sm leading-relaxed uppercase border-t border-gray-100 pt-3.5 mt-4 line-clamp-3 max-w-none"
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