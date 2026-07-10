"use client";


import { apiFetch } from "../../../lib/api";
import { useEffect, useState } from "react";
import TextEditor from "../../../components/editor/TextEditor";
import { useRouter } from "next/navigation";
import { createSlug, generateSlug } from "../../../lib/slug";

export default function AddCMSPage() {
const router = useRouter();
  // ======================
  // STATES
  // ======================
  const [isSlugEdited, setIsSlugEdited] = useState(false);
  const [existingCms, setExistingCms] = useState([]);
  const [pageExists, setPageExists] = useState(false);
  const [slugExists, setSlugExists] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    metaTitle: "",
    metaDescription: "",
    content: "",
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

  useEffect(() => {
    async function fetchCms() {
      try {
        const response = await apiFetch("/cms");
        const data = await response.json();
        setExistingCms(data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchCms();
  }, []);

  // ======================
  // CREATE PAGE
  // ======================
  async function handleSubmit(e) {
    e.preventDefault();

    if (pageExists || slugExists) {
      alert("Please fix the errors before submitting.");
      return;
    }

    try {
      const cmsResponse = await apiFetch("/cms");
      const currentExistingCms = await cmsResponse.json();

      const uniqueSlug = createSlug({
        text: formData.slug,
        items: currentExistingCms,
      });

      if (!uniqueSlug) {
        alert("Slug already exists");
        return;
      }

      const updatedFormData = {
        ...formData,
        slug: uniqueSlug,
      };

      const response = await apiFetch("/cms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedFormData),
      });

      const data = await response.json();

      if (!data.success) {
        alert(data.message);
        return;
      }

      alert("CMS Page Created Successfully");
      router.push("/admin/cms");
    } catch (error) {
      console.log(error);
      alert("CMS page already exists or server error occurred.");
    }
  }

  // ======================
  // UI
  // ======================
  return (
    // Fluid responsive page wrapper container
    <div className="min-h-screen bg-[var(--color-section)] p-4 sm:p-6 md:p-10 w-full">
      {/* Content panel auto-scales grid and paddings down for mobile */}
      <div className="max-w-5xl mx-auto bg-[var(--color-card)] rounded-[var(--radius-lg)] md:rounded-[var(--radius-xl)] shadow-[var(--shadow-lg)] p-5 sm:p-8 md:p-10">
        
        {/* Header */}
        <div className="mb-6 md:mb-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--color-text)] break-words">
            Add CMS Page
          </h1>
          <p className="text-[var(--color-text-muted)] mt-2 md:mt-3 text-base md:text-lg">
            Create website page
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
          
          {/* Title */}
          <div>
            <label className="block text-base md:text-lg font-semibold text-[var(--color-text)] mb-2 md:mb-3">
              Page Title *
            </label>
            {pageExists && (
              <p className="text-[var(--danger)] text-sm mb-2 font-medium">
                Page already exists
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
                const exists = existingCms.some(
                  (item) =>
                    item.title?.trim().toLowerCase() === value.trim().toLowerCase()
                );

                setPageExists(exists);
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
                const exists = existingCms.some((item) => item.slug === slugValue);

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

          {/* Meta Title */}
          <div>
            <label className="block text-base md:text-lg font-semibold text-[var(--color-text)] mb-2 md:mb-3">
              Meta Title
            </label>
            <input
              type="text"
              value={formData.metaTitle}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  metaTitle: e.target.value,
                })
              }
              className="w-full border border-[var(--color-border-strong)] bg-[var(--color-card)] text-[var(--color-text)] p-3 md:p-4 rounded-[var(--radius-md)] outline-none focus:ring-2 focus:ring-[var(--color-accent)] text-sm md:text-base"
            />
          </div>

          {/* Meta Description */}
          <div>
            <label className="block text-base md:text-lg font-semibold text-[var(--color-text)] mb-2 md:mb-3">
              Meta Description
            </label>
            <textarea
              rows={5}
              value={formData.metaDescription}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  metaDescription: e.target.value,
                })
              }
              className="w-full border border-[var(--color-border-strong)] bg-[var(--color-card)] text-[var(--color-text)] p-3 md:p-4 rounded-[var(--radius-md)] outline-none focus:ring-2 focus:ring-[var(--color-accent)] text-sm md:text-base resize-none"
            />
          </div>

          {/* Content Editor Layout Control */}
          <div className="text-[var(--color-text)] max-w-full overflow-hidden">
            <label className="block text-base md:text-lg font-semibold text-[var(--color-text)] mb-2 md:mb-3">
              Content
            </label>
            <div className="w-full overflow-x-auto min-h-[200px]">
              <TextEditor
                value={formData.content}
                onChange={(value) =>
                  setFormData({
                    ...formData,
                    content: value,
                  })
                }
              />
            </div>
          </div>

          {/* Status */}
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

          {/* Submit Button Trigger */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={pageExists || slugExists}
              className="w-full sm:w-auto bg-[var(--color-primary)] hover:bg-[var(--color-dark-2)] text-[var(--color-white)] px-8 md:px-10 py-3 md:py-4 rounded-[var(--radius-md)] text-base md:text-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed text-center"
            >
              Create Page
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}