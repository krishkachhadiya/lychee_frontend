"use client";


import { apiFetch } from "../../../lib/api";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AddAdminPage() {
    const router = useRouter();

    // ======================
    // STATES
    // ======================
    const [existingUsers, setExistingUsers] = useState([]);
    const [emailExists, setEmailExists] = useState(false);
    const [roles, setRoles] = useState([]);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "", // If your backend needs the ID, we can change this to role._id
    });

    // ======================
    // FETCH USERS
    // ======================
    async function fetchUsers() {
        try {
            const response = await apiFetch("/admins");
            const data = await response.json();
            setExistingUsers(data.admins || []);
        } catch (error) {
            console.log(error);
        }
    }

    // ======================
    // FETCH ROLES
    // ======================
    async function fetchRoles() {
        try {
            const response = await apiFetch("/roles");
            const data = await response.json();
            setRoles(data.roles || []);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchRoles();
        fetchUsers();
    }, []);

    // ======================
    // HANDLE SUBMIT (Added back)
    // ======================
    async function handleSubmit(e) {
        e.preventDefault();

        if (emailExists) {
            alert("Please use a unique email address.");
            return;
        }

        try {
            const response = await apiFetch("/admins", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            // ERROR HANDLING
            if (!data.success) {
                alert(data.message || "Failed to add user");
                return;
            }

            // SUCCESS HANDLING
            alert("User Added Successfully");
            router.push("/admin/admins");
        } catch (error) {
            console.log("Submit Error:", error);
            alert("An error occurred while adding the user.");
        }
    }

    // ======================
    // UI
    // ======================
    return (
        <div className="min-h-screen bg-[var(--color-section)] p-4 sm:p-8">
            <div className="max-w-3xl mx-auto bg-[var(--color-card)] rounded-[var(--radius-xl)] shadow-[var(--shadow-lg)] p-6 sm:p-10">

                {/* Header */}
                <div className="mb-8 sm:mb-10">
                    <h1 className="text-3xl sm:text-4xl font-bold text-[var(--color-primary)]">
                        Add User
                    </h1>
                    <p className="text-[var(--color-text-muted)] mt-2">
                        Create new user
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">

                    {/* Name */}
                    <div>
                        <label className="block text-lg font-semibold text-[var(--color-text)] mb-2 sm:mb-3">
                            Name *
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    name: e.target.value,
                                })
                            }
                            className="w-full border border-[var(--color-border-strong)] bg-[var(--color-card)] text-[var(--color-text)] p-3 sm:p-4 rounded-[var(--radius-md)] outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                            required
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-lg font-semibold text-[var(--color-text)] mb-2 sm:mb-3">
                            Email *
                        </label>
                        {emailExists && (
                            <p className="text-[var(--danger)] text-sm mb-2 font-medium">
                                Email already exists
                            </p>
                        )}
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={(e) => {
                                const value = e.target.value;
                                const exists = existingUsers.some(
                                    (item) =>
                                        item.email?.trim().toLowerCase() === value.trim().toLowerCase()
                                );
                                setEmailExists(exists);
                                setFormData({
                                    ...formData,
                                    email: value,
                                });
                            }}
                            className={`w-full border bg-[var(--color-card)] text-[var(--color-text)] p-3 sm:p-4 rounded-[var(--radius-md)] outline-none focus:ring-2 focus:ring-[var(--color-accent)] ${emailExists ? "border-[var(--danger)] focus:ring-[var(--danger)]" : "border-[var(--color-border-strong)]"
                                }`}
                            required
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-lg font-semibold text-[var(--color-text)] mb-2 sm:mb-3">
                            Password *
                        </label>
                        <input
                            type="password"
                            name="password"
                            required
                            pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
                            title="Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character"
                            value={formData.password}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    password: e.target.value,
                                })
                            }
                            className="w-full border border-[var(--color-border-strong)] bg-[var(--color-card)] text-[var(--color-text)] p-3 sm:p-4 rounded-[var(--radius-md)] outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                        />
                    </div>

                    {/* Role */}
                    <div>
                        <label className="block text-lg font-semibold text-[var(--color-text)] mb-2 sm:mb-3">
                            Role *
                        </label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    role: e.target.value,
                                })
                            }
                            className="w-full border border-[var(--color-border-strong)] bg-[var(--color-card)] text-[var(--color-text)] p-3 sm:p-4 rounded-[var(--radius-md)] outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                            required
                        >
                            <option value="">Select Role</option>
                            {roles.map((role) => (
                                <option key={role._id} value={role.name}>
                                    {role.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={emailExists}
                            className="w-full sm:w-auto bg-[var(--color-primary)] hover:bg-[var(--color-dark-2)] text-[var(--color-white)] px-8 py-4 rounded-[var(--radius-md)] text-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Add User
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}