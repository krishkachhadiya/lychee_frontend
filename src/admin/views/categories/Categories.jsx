"use client";



import { apiFetch } from "../../../lib/api";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TableHeader from "../../../components/TableHeader";
import { sortData } from "../../../lib/sortdata";

export default function CategoriesPage() {
    const router = useRouter();
    // ======================
    // STATES
    // ======================
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [admin, setAdmin] = useState(null);

    // ======================
    // PAGINATION
    // ======================
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [sortField, setSortField] = useState("createdAt");
    const [sortOrder, setSortOrder] = useState("desc");

    // ======================
    // FETCH CATEGORIES
    // ======================
    async function fetchCategories() {
        try {
            const response = await apiFetch("/categories");
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

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

    // ======================
    // SORTING LOGIC
    // ======================
    const handleSort = (field) => {
        setPage(1);

        if (sortField === field) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortOrder("asc");
        }
    };

    // ======================
    // LOAD DATA
    // ======================
    useEffect(() => {
        fetchCategories();
        fetchPagination();

        const storedAdmin = sessionStorage.getItem("admin");
        if (storedAdmin) {
            setAdmin(JSON.parse(storedAdmin));
        }
    }, []);

    // ======================
    // DELETE CATEGORY (FIXED)
    // ======================
    async function handleDelete(id) {
        const confirmDelete = confirm(
            "Are you sure you want to delete this category?"
        );

        if (!confirmDelete) return;

        try {
            const response = await apiFetch(`/categories/${id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                setCategories((prev) =>
                    prev.filter((item) => String(item._id || item.id) !== String(id))
                );
                fetchCategories();
            } else {
                alert("Failed to delete the category. Please check backend configuration.");
            }
        } catch (error) {
            console.log("Delete operational error:", error);
        }
    }

    // sorting
    const sortedCategories = sortData(categories, sortField, sortOrder);

    // ======================
    // PAGINATION LOGIC
    // ======================
    const start = (page - 1) * limit;
    const end = page * limit;
    const paginatedCategories = sortedCategories.slice(start, end);
    const totalPages = Math.ceil(sortedCategories.length / limit);

    // ======================
    // LOADING
    // ======================
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen text-xl md:text-2xl font-semibold">
                Loading Categories...
            </div>
        );
    }

    // ======================
    // UI
    // ======================
    return (
        <div className="min-h-screen bg-[var(--color-section)] p-4 md:p-8 w-full">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-primary)]">
                        Categories
                    </h1>
                    <p className="text-[var(--color-text-muted)] mt-1 text-sm md:text-base">
                        Manage all categories
                    </p>
                </div>

                {/* Add Category */}
                {(admin?.role === "admin" ||
                    admin?.permissions?.categories?.create) && (
                        <button
                            onClick={() => router.push("/admin/categories/add")}
                            className="w-full sm:w-auto bg-[var(--color-primary)] text-[var(--color-white)] text-center px-5 py-3 rounded-[var(--radius-sm)] hover:bg-[var(--color-dark-2)] transition text-sm md:text-base font-medium"
                        >
                            Add Category
                        </button>
                    )}
            </div>

            {/* Responsive Table Wrapper */}
            <div className="bg-[var(--color-card)] rounded-[var(--radius-lg)] shadow-md overflow-hidden w-full">
                <div className="w-full overflow-x-auto scrollbar-thin">
                    <table className="w-full min-w-[800px] table-auto">

                        {/* Head */}
                        <thead className="bg-[var(--color-primary)] text-[var(--color-white)] whitespace-nowrap">
                            <tr>
                                <TableHeader
                                    label="Title"
                                    field="title"
                                    sortField={sortField}
                                    sortOrder={sortOrder}
                                    onSort={handleSort}
                                />
                                <TableHeader
                                    label="Slug"
                                    field="slug"
                                    sortField={sortField}
                                    sortOrder={sortOrder}
                                    onSort={handleSort}
                                />
                                <TableHeader
                                    label="Parent"
                                    field="parent"
                                    sortField={sortField}
                                    sortOrder={sortOrder}
                                    onSort={handleSort}
                                />
                                <TableHeader
                                    label="Status"
                                    field="status"
                                    sortField={sortField}
                                    sortOrder={sortOrder}
                                    onSort={handleSort}
                                />
                                <TableHeader
                                    label="Created"
                                    field="createdAt"
                                    sortField={sortField}
                                    sortOrder={sortOrder}
                                    onSort={handleSort}
                                />
                                <TableHeader
                                    label="Updated"
                                    field="updatedAt"
                                    sortField={sortField}
                                    sortOrder={sortOrder}
                                    onSort={handleSort}
                                />
                                <th className="text-left p-4 text-sm md:text-base font-semibold">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        {/* Body */}
                        <tbody className="text-sm md:text-base">
                            {paginatedCategories.map((category) => {
                                const currentId = category._id || category.id;
                                return (
                                    <tr
                                        key={currentId}
                                        className="border-b hover:bg-[var(--color-section)] transition"
                                    >
                                        {/* Title */}
                                        <td className="p-4 font-semibold text-[var(--color-primary)] break-words max-w-[200px]">
                                            {category.title}
                                        </td>

                                        {/* Slug */}
                                        <td className="p-4 text-[var(--color-text)] break-all max-w-[200px]">
                                            {category.slug}
                                        </td>

                                        {/* Parent Field */}
                                        <td className="p-4 text-[var(--color-text)]">
                                            {category.parent
                                                ? categories.find(
                                                    (item) =>
                                                        String(item._id || item.id) ===
                                                        String(
                                                            category.parent?._id ||
                                                            category.parent?.id ||
                                                            category.parent
                                                        )
                                                )?.title || "Sub Category"
                                                : "Main Category"}
                                        </td>

                                        {/* Status */}
                                        <td className="p-4 whitespace-nowrap">
                                            <span
                                                className={`px-3 py-1.5 rounded-full text-xs md:text-sm font-medium inline-block text-center min-w-[75px] ${category.status === "active"
                                                        ? "bg-[var(--success-soft)] text-[var(--success)]"
                                                        : "bg-[var(--danger-soft)] text-[var(--danger)]"
                                                    }`}
                                            >
                                                {category.status}
                                            </span>
                                        </td>

                                        {/* Created */}
                                        <td className="p-4 text-[var(--color-secondary)] text-xs md:text-sm whitespace-nowrap">
                                            {category.createdAt
                                                ? new Date(category.createdAt).toLocaleString("en-IN")
                                                : "-"}
                                        </td>

                                        {/* Updated */}
                                        <td className="p-4 text-[var(--color-secondary)] text-xs md:text-sm whitespace-nowrap">
                                            {category.updatedAt
                                                ? new Date(category.updatedAt).toLocaleString("en-IN")
                                                : "-"}
                                        </td>

                                        {/* Actions */}
                                        <td className="p-4 whitespace-nowrap">
                                            <div className="flex gap-2">
                                                {/* Edit Button */}
                                                {(admin?.role === "admin" ||
                                                    admin?.permissions?.categories?.edit) && (
                                                        <button
                                                            onClick={() =>
                                                                router.push(`/admin/categories/edit/${currentId}`)
                                                            }
                                                            className="bg-[var(--color-accent)] hover:bg-[var(--color-accent)] text-[var(--color-white)] px-3 py-1.5 rounded-md text-xs md:text-sm font-medium transition"
                                                        >
                                                            Edit
                                                        </button>
                                                    )}

                                                {/* Delete Button */}
                                                {(admin?.role === "admin" ||
                                                    admin?.permissions?.categories?.delete) && (
                                                        <button
                                                            onClick={() => handleDelete(currentId)}
                                                            className="bg-[var(--danger)] hover:bg-[var(--danger)] text-[var(--color-white)] px-3 py-1.5 rounded-md text-xs md:text-sm font-medium transition"
                                                        >
                                                            Delete
                                                        </button>
                                                    )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                            {paginatedCategories.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center text-[var(--color-text-muted)] font-medium">
                                        No categories found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* SMART PAGINATION CONTROLS */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6 md:mt-8 text-[var(--color-text)] select-none flex-wrap px-2">

                    {/* Prev Button */}
                    <button
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                        className={`px-3 md:px-4 py-2 rounded-[var(--radius-sm)] border font-medium text-xs md:text-sm transition-all duration-200 ${page === 1
                                ? "bg-[var(--color-section)] text-[var(--color-text-muted)] border-[var(--color-border)] cursor-not-allowed"
                                : "bg-[var(--color-card)] text-[var(--color-text)] border-[var(--color-border-strong)] hover:bg-[var(--color-section)] active:scale-95"
                            }`}
                    >
                        Prev
                    </button>

                    {/* Dynamic Window Logic */}
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

                    {/* Next Button */}
                    <button
                        disabled={page === totalPages}
                        onClick={() => setPage(page + 1)}
                        className={`px-3 md:px-4 py-2 rounded-[var(--radius-sm)] border font-medium text-xs md:text-sm transition-all duration-200 ${page === totalPages
                                ? "bg-[var(--color-section)] text-[var(--color-text-muted)] border-[var(--color-border)] cursor-not-allowed"
                                : "bg-[var(--color-card)] text-[var(--color-text)] border-[var(--color-border-strong)] hover:bg-[var(--color-section)] active:scale-95"
                            }`}
                    >
                        Next
                    </button>

                </div>
            )}
        </div>
    );
}