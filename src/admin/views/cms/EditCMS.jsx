"use client";


import { apiFetch } from "../../../lib/api";
import TextEditor from "../../../components/editor/TextEditor";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { createSlug, generateSlug } from "../../../lib/slug";

export default function EditCMSPage() {
    const router = useRouter();
    const { id } = useParams();

    // ======================
    // STATES
    // ======================
    const [loading, setLoading] = useState(true);
    const [isSlugEdited, setIsSlugEdited] = useState(false);
    const [existingCms, setExistingCms] = useState([]);
    const [pageExists, setPageExists] = useState(false);
    const [slugExists, setSlugExists] = useState(false);

    const [formData, setFormData] = useState({
        id: "",
        title: "",
        slug: "",
        metaTitle: "",
        metaDescription: "",
        content: "",
        status: "active",
    });

    // ======================
    // FETCH PAGE DATA
    // ======================

    async function fetchPage() {
        try {
            const response = await apiFetch(`/cms/${id}`);
            const rawJson = await response.json();

            console.log("📦 RAW SERVER RESPONSE DATA:", rawJson);

            // ✅ TARGET THE CORRECT 'page' KEY RETURNED BY THE SERVER
            const data = rawJson.page ? rawJson.page : rawJson;

            // Handle the global existing cms documents list
            const cmsResponse = await apiFetch("/cms");
            const cmsData = await cmsResponse.json();
            // Handle fallback if the list endpoint wraps its array in .data or .cms
            setExistingCms(cmsData.data ? cmsData.data : (cmsData.cms ? cmsData.cms : cmsData));

            const currentId = data._id || data.id || id || "";

            setFormData({
                id: currentId,
                title: data.title || "",
                slug: data.slug || "",
                metaTitle: data.metaTitle || "",
                metaDescription: data.metaDescription || "",
                content: data.content || "",
                status: data.status || "active",
            });

            setIsSlugEdited(
                !!(data.slug && data.slug !== generateSlug(data.title || ""))
            );
        } catch (error) {
            console.error("❌ Connection or Parsing Failure inside fetchPage():", error);
        } finally {
            setLoading(false);
        }
    }
    // Load Initial Dataset
    useEffect(() => {
        if (id) {
            fetchPage();
        }
    }, [id]);

    // ======================
    // AUTO GENERATE SLUG
    // ======================
    useEffect(() => {
        if (!isSlugEdited && formData.title) {
            setFormData((prev) => ({
                ...prev,
                slug: generateSlug(prev.title),
            }));
        }
    }, [formData.title, isSlugEdited]);

    // ======================
    // UPDATE SUBMIT ASSIGNMENT
    // ======================
    // ======================
    // UPDATE SUBMIT ASSIGNMENT (FIXED)
    // ======================
    async function handleSubmit(e) {
        e.preventDefault();

        try {
            const cmsResponse = await apiFetch("/cms");
            const rawCmsData = await cmsResponse.json();

            // ✅ UNPACK ARRAY ROUTE: Check if data is inside .page, .cms, or .data wrappers
            const currentCmsList = Array.isArray(rawCmsData)
                ? rawCmsData
                : (rawCmsData.page || rawCmsData.cms || rawCmsData.data || []);

            const currentId = formData.id || id;

            // Unique Slug Validation Check
            const uniqueSlug = createSlug({
                text: formData.slug,
                items: currentCmsList,
                currentId: currentId,
            });

            // Unified Title Duplicate Evaluation
            const titleExists = currentCmsList.some(
                (item) =>
                    item.title?.trim().toLowerCase() === formData.title?.trim().toLowerCase() &&
                    String(item._id || item.id) !== String(currentId)
            );

            if (titleExists) {
                alert("CMS title already exists on another page.");
                return;
            }

            // ✅ SECONDARY FALLBACK: Manual Bypass check if createSlug returns false on original slug
            const slugBelongsToAnotherPage = currentCmsList.some(
                (item) =>
                    item.slug === formData.slug &&
                    String(item._id || item.id) !== String(currentId)
            );

            if (slugBelongsToAnotherPage) {
                alert("Slug matches another active document link.");
                return;
            }

            // Use uniqueSlug if it generated an alternate, otherwise keep standard formData.slug
            const finalSlug = uniqueSlug || formData.slug;

            const updatedFormData = {
                ...formData,
                slug: finalSlug,
            };

            const response = await apiFetch(`/cms/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedFormData),
            });

            const data = await response.json();

            if (response.ok || data.success) {
                alert("CMS Page Updated Successfully");
                router.push("/admin/cms");
            } else {
                alert(data.message || "Failed to update record data content.");
            }
        } catch (error) {
            console.log("Network mutation submission failed:", error);
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[var(--color-section)]">
                <h1 className="text-2xl font-bold">Loading...</h1>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--color-section)] p-10">
            <div className="max-w-5xl mx-auto bg-[var(--color-card)] rounded-[var(--radius-xl)] shadow-[var(--shadow-lg)] p-10">

                {/* Header Titles */}
                <div className="mb-10">
                    <h1 className="text-5xl font-bold text-[var(--color-text)]">Edit CMS Page</h1>
                    <p className="text-[var(--color-text-muted)] mt-3 text-lg">Update website page properties</p>
                </div>

                {/* Input Interactive Forms */}
                <form onSubmit={handleSubmit} className="space-y-8">

                    {/* Page Title Element */}
                    <div>
                        <label className="block text-lg font-semibold text-[var(--color-text)] mb-3">
                            Page Title *
                        </label>
                        <input
                            type="text"
                            required
                            pattern=".*[A-Za-z].*"
                            title="Title cannot contain only numbers"
                            value={formData.title}
                            onChange={(e) => {
                                const value = e.target.value;
                                const currentId = formData.id;

                                const exists = existingCms.some(
                                    (item) =>
                                        String(item._id || item.id) !== String(currentId) &&
                                        item.title?.trim().toLowerCase() === value.trim().toLowerCase()
                                );

                                setPageExists(exists);
                                setFormData({
                                    ...formData,
                                    title: value,
                                    slug: !isSlugEdited ? generateSlug(value) : formData.slug,
                                });
                            }}
                            className="w-full border border-[var(--color-border-strong)] bg-[var(--color-card)] text-[var(--color-text)] p-4 rounded-[var(--radius-md)] outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                        />
                        {pageExists && (
                            <p className="text-[var(--danger)] text-sm mt-2">Another page already uses this title.</p>
                        )}
                    </div>

                    {/* Slug Element */}
                    <div>
                        <label className="block text-lg font-semibold text-[var(--color-text)] mb-3">
                            Slug *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.slug}
                            onChange={(e) => {
                                const slugValue = generateSlug(e.target.value);
                                const currentId = formData.id;

                                const exists = existingCms.some(
                                    (item) =>
                                        String(item._id || item.id) !== String(currentId) &&
                                        item.slug === slugValue
                                );

                                setSlugExists(exists);
                                setFormData({
                                    ...formData,
                                    slug: slugValue,
                                });
                                setIsSlugEdited(slugValue !== "");
                            }}
                            className="w-full border border-[var(--color-border-strong)] bg-[var(--color-card)] text-[var(--color-text)] p-4 rounded-[var(--radius-md)] outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                        />
                        {slugExists && (
                            <p className="text-[var(--danger)] text-sm mt-2">This clean link path is already occupied.</p>
                        )}
                    </div>

                    {/* Meta Title Element */}
                    <div>
                        <label className="block text-lg font-semibold text-[var(--color-text)] mb-3">
                            Meta Title
                        </label>
                        <input
                            type="text"
                            value={formData.metaTitle}
                            onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                            className="w-full border border-[var(--color-border-strong)] bg-[var(--color-card)] text-[var(--color-text)] p-4 rounded-[var(--radius-md)] outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                        />
                    </div>

                    {/* Meta Description Element */}
                    <div>
                        <label className="block text-lg font-semibold text-[var(--color-text)] mb-3">
                            Meta Description
                        </label>
                        <textarea
                            value={formData.metaDescription}
                            onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                            className="w-full h-40 border border-[var(--color-border-strong)] bg-[var(--color-card)] text-[var(--color-text)] p-4 rounded-[var(--radius-md)] outline-none focus:ring-2 focus:ring-[var(--color-accent)] resize-none"
                        />
                    </div>

                    {/* Content Block Editor Container */}
                    <div className="text-[var(--color-text)]">
                        <label className="block text-lg font-semibold text-[var(--color-text)] mb-3">
                            Content
                        </label>
                        <TextEditor
                            value={formData.content}
                            onChange={(value) => setFormData({ ...formData, content: value })}
                        />
                    </div>

                    {/* Status Select Element */}
                    <div>
                        <label className="block text-lg font-semibold text-[var(--color-text)] mb-3">
                            Status
                        </label>
                        <select
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            className="w-full border border-[var(--color-border-strong)] bg-[var(--color-card)] text-[var(--color-text)] p-4 rounded-[var(--radius-md)] outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                        >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>

                    {/* Form Action Controls */}
                    <button
                        type="submit"
                        disabled={pageExists || slugExists}
                        className="bg-[var(--color-primary)] hover:bg-[var(--color-dark-2)] text-[var(--color-white)] px-10 py-4 rounded-[var(--radius-md)] text-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Update Page
                    </button>
                </form>
            </div>
        </div>
    );
}