"use client";

import { apiFetch } from "../../../lib/api";
import { useEffect, useState } from "react";

export default function SettingsPage() {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Define backend base domain url string
  const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:5000";
  // Helper function to dynamically check and format image URLs
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "";
    // If it's already a full absolute URL, return it directly
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      return imagePath;
    }
    // Handle cases where path starts with standard uploads paths
    if (imagePath.startsWith("/uploads")) {
      return `${BACKEND_URL}${imagePath}`;
    }
    if (imagePath.startsWith("uploads/")) {
      return `${BACKEND_URL}/${imagePath}`;
    }
    // Fallback default format check string wrapper
    return `${BACKEND_URL}/uploads/${imagePath}`;
  };

  // ======================
  // PAGINATION
  // ======================
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const fields = [
    { key: "companyName", label: "Company Name", type: "text" },
    { key: "websiteTitle", label: "Website Title", type: "text" },
    { key: "phone", label: "Phone", type: "text" },
    { key: "email", label: "Email", type: "email" },
    { key: "address", label: "Address", type: "text" },
    { key: "facebook", label: "Facebook", type: "text" },
    { key: "instagram", label: "Instagram", type: "text" },
    { key: "linkedin", label: "LinkedIn", type: "text" },
    { key: "metaTitle", label: "Meta Title", type: "text" },
    { key: "metaDescription", label: "Meta Description", type: "textarea" },
    { key: "copyright", label: "Copyright", type: "text" },
    { key: "logo", label: "Logo", type: "file" },
    { key: "favicon", label: "Favicon", type: "file" },
    { key: "aboutImage", label: "About Us Image", type: "file" },
    { key: "whyChooseUsImage", label: "Why Choose Us Image", type: "file" },
    { key: "pagination", label: "Pagination Limit", type: "number" },
    { key: "ogImage", label: "OG Image", type: "file" }
  ];

  // ======================
  // FETCH PAGINATION
  // ======================
  async function fetchPagination() {
    try {
      const response = await apiFetch("/settings");
      const result = await response.json();
      setLimit(result.data.pagination || 10);
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchSettings() {
    try {
      const response = await apiFetch("/settings");
      const result = await response.json();
      if (result.success) {
        setSettings(result.data || {});
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSettings();
    fetchPagination();
  }, []);

  function handleChange(key, value) {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  async function handleImageUpload(file, key) {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await apiFetch("/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setSettings((prev) => ({
          ...prev,
          [key]: result.imageUrl,
        }));
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.log(error);
      alert("Upload Failed");
    }
  }

  async function handleSave() {
    try {
      setSaving(true);
      const response = await apiFetch("/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      });

      const result = await response.json();

      if (!result.success) {
        alert(result.message);
        return;
      }

      alert("Settings Saved Successfully");
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  // ======================
  // PAGINATION LOGIC
  // ======================
  const start = (page - 1) * limit;
  const end = page * limit;
  const paginatedFields = fields.slice(start, end);
  const totalPages = Math.ceil(fields.length / limit);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold">Loading...</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-section)] p-4 sm:p-6 md:p-8 w-full">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-[var(--color-text)]">
            Global Settings
          </h1>
          <p className="text-sm md:text-base text-[var(--color-text-muted)] mt-1 md:mt-2">
            Manage website settings
          </p>
        </div>

        {/* Form Container Panel */}
        <div className="bg-[var(--color-card)] rounded-[var(--radius-lg)] md:rounded-[var(--radius-xl)] shadow-[var(--shadow-md)] overflow-hidden text-[var(--color-text)] w-full">
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[600px] border-collapse">
              <thead className="bg-[var(--color-primary)] text-[var(--color-white)]">
                <tr>
                  <th className="p-4 md:p-5 text-left text-sm md:text-base w-1/3">
                    Setting Name
                  </th>
                  <th className="p-4 md:p-5 text-left text-sm md:text-base w-2/3">
                    Value
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedFields.map((field) => (
                  <tr
                    key={field.key}
                    className="border-b hover:bg-[var(--color-section)] transition"
                  >
                    <td className="p-4 md:p-5 font-semibold text-sm md:text-base align-middle">
                      {field.label}
                    </td>
                    <td className="p-4 md:p-5 align-middle">
                      {field.type === "file" ? (
                        <div className="space-y-3 max-w-full">
                          {settings[field.key] && (
                            <img
                              src={getImageUrl(settings[field.key])} // CHANGED: Added image parser wrapper link logic here
                              alt={field.label}
                              className="h-12 md:h-16 max-w-full object-contain rounded-[var(--radius-sm)] border bg-[var(--color-section)] p-1"
                            />
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleImageUpload(file, field.key);
                              }
                            }}
                            className="w-full border border-[var(--color-border-strong)] rounded-[var(--radius-md)] px-3 py-2 md:px-4 md:py-3 text-xs md:text-sm bg-[var(--color-card)] file:mr-4 file:py-1.5 file:px-3 file:rounded-[var(--radius-sm)] file:border-0 file:text-xs file:font-semibold file:bg-[var(--color-section)] file:text-[var(--color-text)] hover:file:bg-[var(--color-border)]"
                          />
                        </div>
                      ) : field.type === "textarea" ? (
                        <textarea
                          rows={4}
                          value={settings[field.key] || ""}
                          onChange={(e) =>
                            handleChange(field.key, e.target.value)
                          }
                          className="w-full border border-[var(--color-border-strong)] rounded-[var(--radius-md)] px-3 py-2 md:px-4 md:py-3 text-sm outline-none focus:ring-2 focus:ring-[var(--color-accent)] resize-y"
                        />
                      ) : (
                        <input
                          type={field.type}
                          value={settings[field.key] || ""}
                          onChange={(e) =>
                            handleChange(field.key, e.target.value)
                          }
                          className="w-full border border-[var(--color-border-strong)] rounded-[var(--radius-md)] px-3 py-2 md:px-4 md:py-3 text-sm outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                        />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Save Button Footer Panel */}
          <div className="p-4 md:p-6 border-t bg-[var(--color-section)]/50">
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full sm:w-auto bg-[var(--color-primary)] hover:bg-[var(--color-dark-2)] text-[var(--color-white)] px-6 md:px-8 py-2.5 md:py-3 rounded-[var(--radius-md)] text-sm md:text-base font-semibold transition disabled:opacity-50 text-center"
            >
              {saving ? "Saving..." : "Save Settings"}
            </button>
          </div>
        </div>

        {/* Pagination Block Controls */}
        <div className="flex items-center justify-center w-full">
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-1.5 md:gap-2 mt-6 md:mt-8 text-[var(--color-text)] select-none flex-wrap">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className={`px-3 md:px-4 py-1.5 md:py-2 rounded-[var(--radius-sm)] border font-medium text-xs md:text-sm transition-all duration-200 ${page === 1
                    ? "bg-[var(--color-section)] text-[var(--color-text-muted)] border-[var(--color-border)] cursor-not-allowed"
                    : "bg-[var(--color-card)] text-[var(--color-text)] border-[var(--color-border-strong)] hover:bg-[var(--color-section)] active:scale-95"
                  }`}
              >
                Prev
              </button>

              {(() => {
                const pageNumbers = [];
                const maxVisiblePages = 5;

                if (totalPages <= maxVisiblePages) {
                  for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
                } else {
                  pageNumbers.push(1);
                  let startRange = Math.max(2, page - 1);
                  let endRange = Math.min(totalPages - 1, page + 1);

                  if (page <= 2) {
                    endRange = 4;
                  } else if (page >= totalPages - 1) {
                    startRange = totalPages - 3;
                  }

                  if (startRange > 2) {
                    pageNumbers.push("ellipsis-left");
                  }

                  for (let i = startRange; i <= endRange; i++) {
                    pageNumbers.push(i);
                  }

                  if (endRange < totalPages - 1) {
                    pageNumbers.push("ellipsis-right");
                  }

                  pageNumbers.push(totalPages);
                }

                return pageNumbers.map((item, index) => {
                  if (item === "ellipsis-left" || item === "ellipsis-right") {
                    return (
                      <span
                        key={`ellipse-${index}`}
                        className="px-1 text-[var(--color-text-muted)] font-medium text-xs md:text-sm"
                      >
                        ...
                      </span>
                    );
                  }

                  const isActive = page === item;
                  return (
                    <button
                      key={`page-${item}`}
                      onClick={() => setPage(item)}
                      className={`w-8 h-8 md:w-10 md:h-10 rounded-[var(--radius-sm)] border text-xs md:text-sm font-semibold transition-all duration-200 active:scale-95 ${isActive
                          ? "bg-[var(--color-primary)] text-[var(--color-white)] border-[var(--color-primary)] shadow-md"
                          : "bg-[var(--color-card)] text-[var(--color-text)] border-[var(--color-border-strong)] hover:bg-[var(--color-section)]"
                        }`}
                    >
                      {item}
                    </button>
                  );
                });
              })()}

              <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className={`px-3 md:px-4 py-1.5 md:py-2 rounded-[var(--radius-sm)] border font-medium text-xs md:text-sm transition-all duration-200 ${page === totalPages
                    ? "bg-[var(--color-section)] text-[var(--color-text-muted)] border-[var(--color-border)] cursor-not-allowed"
                    : "bg-[var(--color-card)] text-[var(--color-text)] border-[var(--color-border-strong)] hover:bg-[var(--color-section)] active:scale-95"
                  }`}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}