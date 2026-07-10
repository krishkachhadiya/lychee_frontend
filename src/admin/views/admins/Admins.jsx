"use client";

import { apiFetch } from "../../../lib/api";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TableHeader from "../../../components/TableHeader";
import { sortData } from "../../../lib/sortdata";

export default function AdminsPage() {
    const router = useRouter();

    // ======================
    // STATES
    // ======================
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);

    // ======================
    // PAGINATION
    // ======================
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [sortField, setSortField] = useState("name");
    const [sortOrder, setSortOrder] = useState("asc");

    // ======================
    // FETCH USERS
    // ======================
    async function fetchAdmins() {
        try {
            setLoading(true);
            const response = await apiFetch("/admins");
            const data = await response.json();

            // REMOVE ADMIN
            const filteredUsers = (data.admins || []).filter(
                (user) => user.role !== "admin"
            );

            setAdmins(filteredUsers);
        } catch (error) {
            console.log(error);
            setAdmins([]);
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
            setLimit(result.data.users || 10);
        } catch (error) {
            console.log(error);
        }
    }

    // ======================
    // LOAD DATA
    // ======================
    useEffect(() => {
        fetchAdmins();
        fetchPagination();
    }, []);

    // ======================
    // DELETE USER
    // ======================
    async function handleDelete(id) {
        const confirmDelete = confirm("Delete this user?");
        if (!confirmDelete) return;

        try {
            const response = await apiFetch(`/admins/${id}`, {
                method: "DELETE",
            });
            const data = await response.json();
            if (data.success) {
                fetchAdmins();
            }
        } catch (error) {
            console.log(error);
        }
    }

    // sorting
    const handleSort = (field) => {
        setPage(1);
        if (sortField === field) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortOrder("asc");
        }
    };

    const sortedAdmins = sortData(admins, sortField, sortOrder);

    // ======================
    // PAGINATION LOGIC
    // ======================
    const start = (page - 1) * limit;
    const end = page * limit;
    const paginatedAdmins = sortedAdmins.slice(start, end);
    const totalPages = Math.ceil(sortedAdmins.length / limit);

    // ======================
    // LOADING
    // ======================
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen text-2xl font-semibold">
                Loading Users...
            </div>
        );
    }

    // ======================
    // UI
    // ======================
    return (
        <div className="min-h-screen bg-[var(--color-section)] p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-4xl font-bold text-[var(--color-primary)]">Users</h1>
                    <p className="text-[var(--color-text-muted)] mt-1">Manage users</p>
                </div>

                <button
                    onClick={() => router.push("/admin/admins/add")}
                    className="bg-[var(--color-primary)] text-[var(--color-white)] px-5 py-3 rounded-[var(--radius-md)] hover:bg-[var(--color-dark-2)] transition"
                >
                    Add User
                </button>
            </div>

            {/* Table */}
            <div className="bg-[var(--color-card)] rounded-[var(--radius-lg)] shadow-md overflow-hidden overflow-x-auto">
                <table className="w-full">
                    {/* Head */}
                    <thead className="bg-[var(--color-primary)] text-[var(--color-white)]">
                        <tr>
                            <TableHeader
                                label="Name"
                                field="name"
                                sortField={sortField}
                                sortOrder={sortOrder}
                                onSort={handleSort}
                            />
                            <TableHeader
                                label="Email"
                                field="email"
                                sortField={sortField}
                                sortOrder={sortOrder}
                                onSort={handleSort}
                            />
                            <TableHeader
                                label="Role"
                                field="role"
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
                            <th className="text-left p-4">Actions</th>
                        </tr>
                    </thead>

                    {/* Body */}
                    <tbody>
                        {paginatedAdmins.length > 0 ? (
                            paginatedAdmins.map((admin) => (
                                <tr
                                    key={admin._id}
                                    className="border-b hover:bg-[var(--color-section)] transition"
                                >
                                    {/* Name */}
                                    <td className="p-4">
                                        <h2 className="font-semibold text-lg text-[var(--color-primary)]">
                                            {admin.name}
                                        </h2>
                                    </td>

                                    {/* Email */}
                                    <td className="p-4 text-[var(--color-secondary)]">{admin.email}</td>

                                    {/* Role */}
                                    <td className="p-4">
                                        <span className="bg-[var(--info-soft)] text-[var(--info)] px-4 py-2 rounded-full text-sm font-medium">
                                            {admin.role}
                                        </span>
                                    </td>

                                    {/* Created */}
                                    <td className="p-4 text-[var(--color-secondary)] text-sm">
                                        {new Date(admin.createdAt).toLocaleString("en-IN")}
                                    </td>

                                    {/* Updated */}
                                    <td className="p-4 text-[var(--color-secondary)] text-sm">
                                        {admin.updatedAt
                                            ? new Date(admin.updatedAt).toLocaleString("en-IN")
                                            : "-"}
                                    </td>

                                    {/* Actions */}
                                    <td className="p-4">
                                        <div className="flex gap-3">
                                            {/* Edit */}
                                            <button
                                                onClick={() =>
                                                    router.push(`/admin/admins/edit/${admin._id}`)
                                                }
                                                className="bg-[var(--color-accent)] hover:bg-[var(--color-accent)] text-[var(--color-white)] px-4 py-2 rounded-[var(--radius-sm)] text-sm"
                                            >
                                                Edit
                                            </button>
                                            {/* Delete */}
                                            <button
                                                onClick={() => handleDelete(admin._id)}
                                                className="bg-[var(--danger)] hover:bg-[var(--danger)] text-[var(--color-white)] px-4 py-2 rounded-[var(--radius-sm)] text-sm"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center p-6 text-[var(--color-text-muted)]">
                                    No Users Found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* SMART PAGINATION CONTROLS */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8 text-[var(--color-text)] select-none flex-wrap">
                    {/* Prev Button */}
                    <button
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                        className={`px-4 py-2 rounded-[var(--radius-sm)] border font-medium text-sm transition-all duration-200 ${page === 1
                                ? "bg-[var(--color-section)] text-[var(--color-text-muted)] border-[var(--color-border)] cursor-not-allowed"
                                : "bg-[var(--color-card)] text-[var(--color-text)] border-[var(--color-border-strong)] hover:bg-[var(--color-section)] active:scale-95"
                            }`}
                    >
                        Prev
                    </button>

                    {/* Dynamic Window Page Generation */}
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
                                        className="px-2 text-[var(--color-text-muted)] font-medium"
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
                                    className={`w-10 h-10 rounded-[var(--radius-sm)] border text-sm font-semibold transition-all duration-200 active:scale-95 ${isActive
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
                        className={`px-4 py-2 rounded-[var(--radius-sm)] border font-medium text-sm transition-all duration-200 ${page === totalPages
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