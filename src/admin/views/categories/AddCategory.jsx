"use client";


import { apiFetch } from "../../../lib/api";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createSlug } from "../../../lib/slug";
import CategoryPicker from "../../../components/CategoryPicker";

export default function AddCategoryPage() {
const router = useRouter();

  // ======================
  // STATES
  // ======================
  const [allCategories, setAllCategories] = useState([]);
  const [titleExists, setTitleExists] = useState(false);
  const [slugExists, setSlugExists] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    metaTitle: "",
    metaDescription: "",
    parent: null,
    status: "active",
  });

  // ======================
  // FETCH CATEGORIES
  // ======================
  async function fetchCategories() {
    try {
      const response = await apiFetch("/categories");
      const data = await response.json();
      setAllCategories(data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  // ======================
  // AUTO SLUG
  // ======================
  function generateSlug(text) {
    return text
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");
  }

  // ======================
  // HANDLE TITLE
  // ======================
  function handleTitleChange(value) {
    const exists = allCategories.some(
      (item) =>
        item.title?.trim().toLowerCase() === value.trim().toLowerCase()
    );

    setTitleExists(exists);

    setFormData({
      ...formData,
      title: value,
      slug: generateSlug(value),
    });
  }

  // ======================
  // CREATE CATEGORY
  // ======================
  async function handleSubmit(e) {
    e.preventDefault();


    // Check duplicate slug
    const uniqueSlug = createSlug({
      text: formData.slug,
      items: allCategories,
    });

    if (!uniqueSlug) {
      alert("Slug already exists");
      return;
    }

    // Check duplicate title
    const titleExistsCheck = allCategories.some(
      (item) =>
        item.title?.trim().toLowerCase() === formData.title?.trim().toLowerCase()
    );

    if (titleExistsCheck) {
      alert("Category title already exists");
      return;
    }

    try {
      const response = await apiFetch("/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!data.success) {
        alert(data.message);
        return;
      }

      alert("Category Created Successfully");
      router.push("/admin/categories");
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  }

  // ======================
  // UI
  // ======================
  return (
    <div className="min-h-screen bg-[var(--color-section)] p-4 sm:p-6 md:p-8 w-full">
      <div className="max-w-5xl mx-auto bg-[var(--color-card)] rounded-[var(--radius-lg)] md:rounded-[var(--radius-xl)] shadow-[var(--shadow-lg)] p-5 sm:p-8 md:p-10">
        
        {/* Header */}
        <div className="mb-6 md:mb-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--color-primary)]">
            Add Category
          </h1>
          <p className="text-[var(--color-text-muted)] mt-2 text-base md:text-lg">
            Create category or subcategory
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
          
          {/* Category Title */}
          <div>
            <label className="block text-base md:text-lg font-semibold text-[var(--color-text)] mb-2 md:mb-3">
              Title
            </label>
            <input
              type="text"
              required
              pattern=".*[A-Za-z].*"
              title="Title cannot contain only numbers"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full border border-[var(--color-border-strong)] bg-[var(--color-card)] text-[var(--color-text)] p-3 md:p-4 rounded-[var(--radius-md)] outline-none focus:ring-2 focus:ring-[var(--color-accent)] transition text-sm md:text-base"
            />
            {titleExists && (
              <p className="text-[var(--danger)] text-xs md:text-sm mt-2 font-medium">
                Category already exists
              </p>
            )}
          </div>

          {/* Slug */}
          <div>
            <label className="block text-base md:text-lg font-semibold text-[var(--color-text)] mb-2 md:mb-3">
              Slug
            </label>
            <input
              type="text"
              required
              value={formData.slug}
              onChange={(e) => {
                const slugValue = generateSlug(e.target.value);
                const exists = allCategories.some(
                  (item) => item.slug === slugValue
                );
                setSlugExists(exists);
                setFormData({
                  ...formData,
                  slug: slugValue,
                });
              }}
              className="w-full border border-[var(--color-border-strong)] bg-[var(--color-card)] text-[var(--color-text)] p-3 md:p-4 rounded-[var(--radius-md)] outline-none focus:ring-2 focus:ring-[var(--color-accent)] transition text-sm md:text-base"
            />
            {slugExists && (
              <p className="text-[var(--danger)] text-xs md:text-sm mt-2 font-medium">
                Slug already exists
              </p>
            )}
          </div>

          {/* Parent Category */}
          <div className="text-[var(--color-text)]">
            <label className="block text-base md:text-lg font-semibold text-[var(--color-text)] mb-2 md:mb-3">
              Parent Category
            </label>
            <CategoryPicker
              categories={allCategories}
              value={formData.parent}
              onChange={(id) =>
                setFormData({
                  ...formData,
                  parent: id,
                })
              }
              label="Select Parent Category"
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
              className="w-full border border-[var(--color-border-strong)] bg-[var(--color-card)] text-[var(--color-text)] p-3 md:p-4 rounded-[var(--radius-md)] outline-none focus:ring-2 focus:ring-[var(--color-accent)] transition text-sm md:text-base"
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
              className="w-full border border-[var(--color-border-strong)] bg-[var(--color-card)] text-[var(--color-text)] p-3 md:p-4 rounded-[var(--radius-md)] outline-none focus:ring-2 focus:ring-[var(--color-accent)] transition text-sm md:text-base resize-none"
            />
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
              className="w-full border border-[var(--color-border-strong)] bg-[var(--color-card)] text-[var(--color-text)] p-3 md:p-4 rounded-[var(--radius-md)] outline-none focus:ring-2 focus:ring-[var(--color-accent)] transition text-sm md:text-base"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={titleExists || slugExists}
              className="w-full sm:w-auto bg-[var(--color-primary)] hover:bg-[var(--color-dark-2)] text-[var(--color-white)] px-8 md:px-10 py-3 md:py-4 rounded-[var(--radius-md)] text-base md:text-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              Create Category
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}