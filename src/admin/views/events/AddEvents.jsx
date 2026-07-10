"use client";

import { apiFetch } from "../../../lib/api";
import { useEffect, useState } from "react";
import TextEditor from "../../../components/editor/TextEditor";
import { useRouter } from "next/navigation";
import { createSlug, generateSlug } from "../../../lib/slug";

export default function AddEvent() {
  const router = useRouter();

  // ======================
  // STATES
  // ======================
  const [isSlugEdited, setIsSlugEdited] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [existingEvents, setExistingEvents] = useState([]);
  const [eventExists, setEventExists] = useState(false);
  const [slugExists, setSlugExists] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    image: "",
    address: "", // Matches Mongoose model key
    dates: "",   // String type matching model description rule (e.g. "13,14,15,16 April 2025")
    timeWindow: "10:00 to 21:00", // Matches model defaults
    eventType: "Exhibition",      // Matches model defaults
    expectedVisitors: "",
    description: "",
    status: "active",
  });

  // ======================
  // AUTO GENERATE SLUG
  // ======================
  useEffect(() => {
    if (!isSlugEdited) {
      setFormData((prev) => ({
        ...prev,
        slug: generateSlug(prev.title),
      }));
    }
  }, [formData.title, isSlugEdited]);

  // ======================
  // FETCH EXISTING ENTRIES FOR DUPLICATE VALIDATION
  // ======================
  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await apiFetch("/events");
        const data = await response.json();
        setExistingEvents(Array.isArray(data) ? data : data.data || []);
      } catch (error) {
        console.log(error);
      }
    }
    fetchEvents();
  }, []);

  // ======================
  // NATIVE IMAGE UPLOAD HANDLER
  // ======================
async function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const uploadData = new FormData();
    
    // Uses your working "file" key
    uploadData.append("file", file);

    try {
      // Uses your working universal upload API route
      const response = await apiFetch("/upload", {
        method: "POST",
        body: uploadData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Upload server error page:", errorText);
        alert("Failed to process upload on server.");
        return;
      }

      const data = await response.json();

      if (!data.success) {
        alert(data.message);
        return;
      }

      // Maps data.imageUrl cleanly to your event single image state
      setFormData((prev) => ({
        ...prev,
        image: data.imageUrl,
      }));
      
      alert("Image uploaded successfully!");
    } catch (error) {
      console.log("Image upload client-side error:", error);
    } finally {
      setUploading(false);
    }
  }
  // ======================
  // CREATE EVENT ENTRY
  // ======================
  async function handleSubmit(e) {
    e.preventDefault();

    if (eventExists || slugExists) {
      alert("Please fix the errors before submitting.");
      return;
    }

    try {
      const eventResponse = await apiFetch("/events");
      const currentData = await eventResponse.json();
      const freshList = Array.isArray(currentData) ? currentData : currentData.data || [];

      const uniqueSlug = createSlug({
        text: formData.slug,
        items: freshList,
      });

      if (!uniqueSlug) {
        alert("Slug already exists");
        return;
      }

      const updatedFormData = {
        ...formData,
        slug: uniqueSlug,
      };

      const response = await apiFetch("/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedFormData),
      });

      const data = await response.json();

      if (!data.success) {
        alert(data.message || "Failed to save event configuration.");
        return;
      }

      alert("Event Created Successfully");
      router.push("/admin/events");
    } catch (error) {
      console.log(error);
      alert("Event already exists or server error occurred.");
    }
  }

  // ======================
  // UI
  // ======================
  return (
    <div className="min-h-screen bg-[var(--color-section)] p-4 sm:p-6 md:p-10 w-full">
      <div className="max-w-5xl mx-auto bg-[var(--color-card)] rounded-[var(--radius-lg)] md:rounded-[var(--radius-xl)] shadow-[var(--shadow-lg)] p-5 sm:p-8 md:p-10">
        
        {/* Header */}
        <div className="mb-6 md:mb-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--color-text)] break-words">
            Add Event
          </h1>
          <p className="text-[var(--color-text-muted)] mt-2 md:mt-3 text-base md:text-lg">
            Create brand exhibition showcase entry
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
          
          {/* Event Title */}
          <div>
            <label className="block text-base md:text-lg font-semibold text-[var(--color-text)] mb-2 md:mb-3">
              Event Title *
            </label>
            {eventExists && (
              <p className="text-[var(--danger)] text-sm mb-2 font-medium">
                An event with this title already exists
              </p>
            )}
            <input
              required
              type="text"
              pattern=".*[A-Za-z].*"
              title="Title cannot contain only numbers"
              value={formData.title}
              onChange={(e) => {
                const value = e.target.value;
                const exists = existingEvents.some(
                  (item) => item.title?.trim().toLowerCase() === value.trim().toLowerCase()
                );

                setEventExists(exists);
                setFormData({
                  ...formData,
                  title: value,
                  slug: !isSlugEdited ? generateSlug(value) : formData.slug,
                });
              }}
              className="w-full border border-[var(--color-border-strong)] bg-[var(--color-card)] text-[var(--color-text)] p-3 md:p-4 rounded-[var(--radius-md)] outline-none focus:ring-2 focus:ring-[var(--color-accent)] text-sm md:text-base"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-base md:text-lg font-semibold text-[var(--color-text)] mb-2 md:mb-3">
              Slug *
            </label>
            {slugExists && (
              <p className="text-[var(--danger)] text-sm mb-2 font-medium">
                Slug already exists
              </p>
            )}
            <input
              required
              type="text"
              value={formData.slug}
              onChange={(e) => {
                const slugValue = generateSlug(e.target.value);
                const exists = existingEvents.some((item) => item.slug === slugValue);

                setSlugExists(exists);
                setFormData({
                  ...formData,
                  slug: slugValue,
                });
                setIsSlugEdited(slugValue !== "");
              }}
              className="w-full border border-[var(--color-border-strong)] bg-[var(--color-card)] text-[var(--color-text)] p-3 md:p-4 rounded-[var(--radius-md)] outline-none focus:ring-2 focus:ring-[var(--color-accent)] text-sm md:text-base"
            />
          </div>

          {/* 🖼️ Image Upload Panel */}
          <div>
            <label className="block text-base md:text-lg font-semibold text-[var(--color-text)] mb-2 md:mb-3">
              Exhibition Banner Image
            </label>
            <div className="flex items-center gap-4 flex-wrap sm:flex-nowrap border border-[var(--color-border-strong)] p-4 rounded-[var(--radius-md)] bg-[var(--color-section)]">
              <div className="w-24 h-24 rounded-[var(--radius-md)] border border-[var(--color-border-strong)] bg-[var(--color-card)] flex items-center justify-center overflow-hidden flex-shrink-0">
                {formData.image ? (
                  <img 
                    src={formData.image.startsWith("http") ? formData.image : `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "http://localhost:5000"}${formData.image}`} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-3xl opacity-30">🖼️</span>
                )}
              </div>
              <div className="flex flex-col gap-2 w-full">
                <input
                  type="file"
                  accept="image/*"
                  id="event-image-file"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="hidden"
                />
                <label
                  htmlFor="event-image-file"
                  className="w-max bg-[var(--color-accent)] hover:opacity-90 text-[var(--color-white)] text-xs md:text-sm font-semibold px-4 py-2.5 rounded-[var(--radius-md)] cursor-pointer transition select-none shadow-sm disabled:opacity-50"
                >
                  {uploading ? "Uploading..." : "Choose Image File"}
                </label>
                {formData.image && (
                  <span className="text-xs font-mono text-[var(--color-text-muted)] break-all">{formData.image}</span>
                )}
              </div>
            </div>
          </div>

          {/* Event Type & Full Address Destination Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            <div>
              <label className="block text-base md:text-lg font-semibold text-[var(--color-text)] mb-2 md:mb-3">
                Event Type
              </label>
              <input
                type="text"
                value={formData.eventType}
                onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                className="w-full border border-[var(--color-border-strong)] bg-[var(--color-card)] text-[var(--color-text)] p-3 md:p-4 rounded-[var(--radius-md)] outline-none focus:ring-2 focus:ring-[var(--color-accent)] text-sm md:text-base"
              />
            </div>

            <div>
              <label className="block text-base md:text-lg font-semibold text-[var(--color-text)] mb-2 md:mb-3">
                Address *
              </label>
              <input
                required
                type="text"
                value={formData.address}
                placeholder="e.g., Booth No. B-20, Yashobhoomi New Delhi – India"
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full border border-[var(--color-border-strong)] bg-[var(--color-card)] text-[var(--color-text)] p-3 md:p-4 rounded-[var(--radius-md)] outline-none focus:ring-2 focus:ring-[var(--color-accent)] text-sm md:text-base"
              />
            </div>
          </div>  

          {/* Dates & TimeWindow Input Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            <div>
              <label className="block text-base md:text-lg font-semibold text-[var(--color-text)] mb-2 md:mb-3">
                Dates *
              </label>
              <input
                required
                type="text"
                value={formData.dates}
                placeholder="e.g., 13,14,15,16 April 2025"
                onChange={(e) => setFormData({ ...formData, dates: e.target.value })}
                className="w-full border border-[var(--color-border-strong)] bg-[var(--color-card)] text-[var(--color-text)] p-3 md:p-4 rounded-[var(--radius-md)] outline-none focus:ring-2 focus:ring-[var(--color-accent)] text-sm md:text-base"
              />
            </div>

            <div>
              <label className="block text-base md:text-lg font-semibold text-[var(--color-text)] mb-2 md:mb-3">
                Time Window
              </label>
              <input
                type="text"
                value={formData.timeWindow}
                onChange={(e) => setFormData({ ...formData, timeWindow: e.target.value })}
                className="w-full border border-[var(--color-border-strong)] bg-[var(--color-card)] text-[var(--color-text)] p-3 md:p-4 rounded-[var(--radius-md)] outline-none focus:ring-2 focus:ring-[var(--color-accent)] text-sm md:text-base"
              />
            </div>
          </div>

          {/* Metrics Elements (Expected Visitors & Status) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            <div>
              <label className="block text-base md:text-lg font-semibold text-[var(--color-text)] mb-2 md:mb-3">
                Expected Visitors
              </label>
              <input
                type="text"
                value={formData.expectedVisitors}
                placeholder="e.g., 5000+"
                onChange={(e) => setFormData({ ...formData, expectedVisitors: e.target.value })}
                className="w-full border border-[var(--color-border-strong)] bg-[var(--color-card)] text-[var(--color-text)] p-3 md:p-4 rounded-[var(--radius-md)] outline-none focus:ring-2 focus:ring-[var(--color-accent)] text-sm md:text-base"
              />
            </div>

            <div>
              <label className="block text-base md:text-lg font-semibold text-[var(--color-text)] mb-2 md:mb-3">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value,
                  })
                }
                className="w-full border border-[var(--color-border-strong)] bg-[var(--color-card)] text-[var(--color-text)] p-3 md:p-4 rounded-[var(--radius-md)] outline-none focus:ring-2 focus:ring-[var(--color-accent)] text-sm md:text-base"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Content Rich Text Editor Control Using Your Existing Native TextEditor */}
          <div className="text-[var(--color-text)] max-w-full overflow-hidden">
            <label className="block text-base md:text-lg font-semibold text-[var(--color-text)] mb-2 md:mb-3">
              Description *
            </label>
            <div className="w-full overflow-x-auto min-h-[200px]">
              <TextEditor
                value={formData.description}
                onChange={(value) =>
                  setFormData({
                    ...formData,
                    description: value,
                  })
                }
              />
            </div>
          </div>

          {/* Submit/Cancel Controls Row */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
            <button
              type="submit"
              disabled={eventExists || slugExists || uploading}
              className="w-full sm:w-auto bg-[var(--color-primary)] hover:bg-[var(--color-dark-2)] text-[var(--color-white)] px-8 md:px-10 py-3 md:py-4 rounded-[var(--radius-md)] text-base md:text-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed text-center shadow-sm"
            >
              Create Event
            </button>
            <button
              type="button"
              onClick={() => router.push("/admin/events")}
              className="w-full sm:w-auto border border-[var(--color-border-strong)] bg-[var(--color-card)] text-[var(--color-text)] hover:bg-[var(--color-section)] px-8 md:px-10 py-3 md:py-4 rounded-[var(--radius-md)] text-base md:text-lg font-semibold transition text-center"
            >
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}