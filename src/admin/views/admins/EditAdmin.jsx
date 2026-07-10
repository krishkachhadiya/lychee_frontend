"use client";

import { apiFetch } from "../../../lib/api";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditAdminPage() {
const router = useRouter();
const { id } = useParams();

  const [existingUsers, setExistingUsers] = useState([]);
  const [emailExists, setEmailExists] = useState(false);

  // ======================
  // STATES
  // ======================
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState([]);

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
  }, []);

  // ======================
  // FETCH USER
  // ======================
  async function fetchAdmin() {
    try {
      const response = await apiFetch(`/admins/${id}`);
      const data = await response.json();

      if (data.success) {
        setFormData({
          name: data.admin.name,
          email: data.admin.email,
          password: data.admin.password,
          role: data.admin.role,
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (id) {
      fetchAdmin();
      fetchUsers();
    }
  }, [id]);

  // ======================
  // HANDLE UPDATE
  // ======================
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await apiFetch(`/admins/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        alert("User Updated Successfully");
        router.push("/admin/admins");
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
      <div className="flex items-center justify-center min-h-screen text-2xl font-semibold">
        Loading User...
      </div>
    );
  }

  // ======================
  // UI
  // ======================
  return (
    <div className="min-h-screen bg-[var(--color-section)] p-8">
      <div className="max-w-3xl mx-auto bg-[var(--color-card)] rounded-[var(--radius-xl)] shadow-[var(--shadow-lg)] p-10">
        
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-[var(--color-primary)]">Edit User</h1>
          <p className="text-[var(--color-text-muted)] mt-2">Update user details</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Name */}
          <div>
            <label className="block text-lg font-semibold text-[var(--color-text)] mb-3">
              Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  name: e.target.value,
                })
              }
              className="w-full border border-[var(--color-border-strong)] bg-[var(--color-card)] text-[var(--color-text)] p-4 rounded-[var(--radius-md)] outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-lg font-semibold text-[var(--color-text)] mb-3">
              Email *
            </label>
            {emailExists && (
              <p className="text-[var(--danger)] text-sm mt-2">Email already exists</p>
            )}
            <input
              type="email"
              value={formData.email}
              onChange={(e) => {
                const value = e.target.value;
                const exists = existingUsers.some(
                  (item) =>
                    String(item._id) !== String(id) &&
                    item.email?.trim().toLowerCase() === value.trim().toLowerCase()
                );
                setEmailExists(exists);
                setFormData({
                  ...formData,
                  email: value,
                });
              }}
              className="w-full border border-[var(--color-border-strong)] bg-[var(--color-card)] text-[var(--color-text)] p-4 rounded-[var(--radius-md)] outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-lg font-semibold text-[var(--color-text)] mb-3">
              Password *
            </label>
            <input
              type="password"
              pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
              title="Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character"
              value={formData.password}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  password: e.target.value,
                })
              }
              className="w-full border border-[var(--color-border-strong)] bg-[var(--color-card)] text-[var(--color-text)] p-4 rounded-[var(--radius-md)] outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-lg font-semibold text-[var(--color-text)] mb-3">
              Role *
            </label>
            <select
              value={formData.role}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  role: e.target.value,
                })
              }
              className="w-full border border-[var(--color-border-strong)] bg-[var(--color-card)] text-[var(--color-text)] p-4 rounded-[var(--radius-md)] outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
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

          {/* Submit */}
          <button
            disabled={emailExists}
            className="bg-[var(--color-primary)] hover:bg-[var(--color-dark-2)] text-[var(--color-white)] px-8 py-4 rounded-[var(--radius-md)] text-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Update User
          </button>
        </form>

      </div>
    </div>
  );
}