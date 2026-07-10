"use client";



import { apiFetch } from "../../../lib/api";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import CategoryPicker from "../../../components/CategoryPicker";
import { createSlug } from "../../../lib/slug";

export default function EditCategoryPage() {
  const { id } = useParams();
  const router = useRouter();

  // ======================
  // STATES
  // ======================
  const [loading, setLoading] = useState(true);
  const [allCategories, setAllCategories] = useState([]);
  const [titleExists, setTitleExists] = useState(false);
  const [slugExists, setSlugExists] = useState(false);
  const [subcategories, setSubcategories] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    metaTitle: "",
    metaDescription: "",
    parent: null,
    status: "active",
  });

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
  // FETCH CATEGORY
  // ======================
  async function fetchCategory() {
    try {
      const response = await apiFetch("/categories");
      const data = await response.json();
      setAllCategories(data);

      const category = data.find(
        (item) => String(item._id || item.id) === String(id)
      );
      if (category) {
        setFormData({
          ...category,
          parent: category.parent ? category.parent : null,
        });

        const filteredSubcategories = data.filter((item) => {
          return (
            item.parent !== null &&
            String(item.parent?._id || item.parent?.id || item.parent) === String(id)
          );
        });

        setSubcategories(filteredSubcategories);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCategory();
  }, []);
  if (slugExists) {
    alert("Slug already exists");
    return;
  }
  // ======================
  // UPDATE CATEGORY
  // ======================
  async function handleSubmit(e) {
    e.preventDefault();

    // Textarea numeric regex fallback validation constraint
    const lettersRegex = /[A-Za-z]/;
    if (formData.metaDescription && !lettersRegex.test(formData.metaDescription)) {
      alert("Description cannot contain only numbers");
      return;
    }

    const titleExistsCheck = allCategories.some(
      (item) =>
        item.title?.trim().toLowerCase() === formData.title?.trim().toLowerCase() &&
        item._id !== formData._id
    );

    if (titleExistsCheck) {
      alert("Category title already exists");
      return;
    }


    try {
      const response = await apiFetch(`/categories/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        alert("Category Updated Successfully");
        router.push("/admin/categories");
      }
    } catch (error) {

      console.log(error);
    }
  }


  // ======================
  // DELETE SUBCATEGORY
  // ======================
  async function handleDelete(id) {
    const confirmDelete = confirm("Delete subcategory?");
    if (!confirmDelete) return;

    try {
      const response = await apiFetch(`/categories/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        fetchCategory();
      }
    } catch (error) {
      console.log(error);
    }
  }

  // ======================
  // LOADING
  // ======================
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-xl md:text-2xl font-semibold">
        Loading Category...
      </div>
    );
  }

  // ======================
  // UI
  // ======================
  return (
    <div className="min-h-screen bg-[var(--color-section)] p-4 sm:p-6 md:p-8 w-full">
      <div className="max-w-6xl mx-auto bg-[var(--color-card)] rounded-[var(--radius-lg)] md:rounded-[var(--radius-xl)] shadow-[var(--shadow-lg)] p-5 sm:p-8 md:p-10">

        {/* Header */}
        <div className="mb-6 md:mb-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--color-primary)]">
            Edit Category
          </h1>
          <p className="text-[var(--color-text-muted)] mt-2 text-base md:text-lg">
            Update category details
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">

          {/* Title */}
          <div>
            <label className="block text-base md:text-lg font-semibold text-[var(--color-text)] mb-2 md:mb-3">
              Title
            </label>
            <input
              required
              pattern=".*[A-Za-z].*"
              title="Title cannot contain only numbers"
              type="text"
              value={formData.title}
              onChange={(e) => {
                const value = e.target.value;
                const exists = allCategories.some(
                  (item) =>
                    String(item._id || item.id) !== String(id) &&
                    item.title?.trim().toLowerCase() === value.trim().toLowerCase()
                );
                setTitleExists(exists);
                setFormData({
                  ...formData,
                  title: value,
                  slug: generateSlug(value),
                });
              }}
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
                  (item) => String(item._id || item.id) !== String(id) && item.slug === slugValue
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

          {/* Parent */}
          <div className="text-[var(--color-text)]">
            <label className="block text-base md:text-lg font-semibold text-[var(--color-text)] mb-2 md:mb-3">
              Parent Category
            </label>
            <CategoryPicker
              categories={allCategories.filter((item) => item._id !== formData._id)}
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
              value={formData.metaTitle || ""}
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
              value={formData.metaDescription || ""}
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

          {/* SUBCATEGORY TABLE */}
          {formData.parent === null && (
            <div className="text-[var(--color-text)] pt-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
                <h2 className="text-xl md:text-2xl font-bold text-[var(--color-text)]">
                  Subcategories
                </h2>
                <button
                  type="button"
                  onClick={() => router.push("/admin/categories/add")}
                  className="w-full sm:w-auto bg-[var(--color-primary)] text-[var(--color-white)] text-center px-5 py-2.5 rounded-[var(--radius-md)] text-sm md:text-base font-medium transition hover:bg-[var(--color-dark-2)] shadow-sm"
                >
                  Add Subcategory
                </button>
              </div>

              {/* Responsive Outer Containment Block */}
              <div className="overflow-x-auto border border-[var(--color-border)] rounded-[var(--radius-lg)] bg-[var(--color-card)] w-full scrollbar-thin">
                <table className="w-full min-w-[600px] table-auto">
                  <thead className="bg-[var(--color-primary)] text-[var(--color-white)] whitespace-nowrap">
                    <tr>
                      <th className="text-left p-4 text-sm font-semibold">Title</th>
                      <th className="text-left p-4 text-sm font-semibold">Slug</th>
                      <th className="text-left p-4 text-sm font-semibold">Status</th>
                      <th className="text-left p-4 text-sm font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm text-[var(--color-text)]">
                    {subcategories.length > 0 ? (
                      subcategories.map((subcategory) => (
                        <tr
                          key={subcategory._id || subcategory.id}
                          className="border-b hover:bg-[var(--color-section)] transition"
                        >
                          <td className="p-4 font-medium max-w-[180px] break-words">
                            {subcategory.title}
                          </td>
                          <td className="p-4 max-w-[180px] break-all">
                            {subcategory.slug}
                          </td>
                          <td className="p-4 whitespace-nowrap">
                            <span
                              className={`px-2.5 py-1 rounded-full text-xs font-medium inline-block min-w-[70px] text-center ${subcategory.status === "active"
                                ? "bg-[var(--success-soft)] text-[var(--success)]"
                                : "bg-[var(--danger-soft)] text-[var(--danger)]"
                                }`}
                            >
                              {subcategory.status}
                            </span>
                          </td>
                          <td className="p-4 whitespace-nowrap">
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  router.push(
                                    `/admin/categories/edit/${subcategory._id || subcategory.id}`
                                  )
                                }
                                className="bg-[var(--color-accent)] hover:bg-[var(--color-accent)] text-[var(--color-white)] px-3 py-1.5 rounded-[var(--radius-sm)] text-xs font-medium transition"
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDelete(subcategory._id || subcategory.id)}
                                className="bg-[var(--danger)] hover:bg-[var(--danger)] text-[var(--color-white)] px-3 py-1.5 rounded-[var(--radius-sm)] text-xs font-medium transition"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="text-center p-8 text-[var(--color-text-muted)] font-medium">
                          No Subcategories Found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Submit Main Form Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={titleExists || slugExists}
              className="w-full sm:w-auto bg-[var(--color-primary)] hover:bg-[var(--color-dark-2)] text-[var(--color-white)] px-8 md:px-10 py-3 md:py-4 rounded-[var(--radius-md)] text-base md:text-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              Update Category
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}