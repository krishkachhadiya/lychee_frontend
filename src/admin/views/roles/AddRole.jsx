"use client";

import { apiFetch } from "../../../lib/api";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AddRolePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    permissions: {
      products: { create: false, edit: false, delete: false },
      categories: { create: false, edit: false, delete: false },
      cms: { create: false, edit: false, delete: false },
    },
  });
  const [existingRoles, setExistingRoles] = useState([]);
  const [roleExists, setRoleExists] = useState(false);

  // Dynamically derive modules from state keys
  const modules = Object.keys(formData.permissions);

  useEffect(() => {
    fetchRoles();
  }, []);

  async function fetchRoles() {
    try {
      const response = await apiFetch("/roles");
      const data = await response.json();
      setExistingRoles(data.roles || []);
    } catch (error) {
      console.log(error);
    }
  }

  function handlePermissionChange(module, action, value) {
    setFormData({
      ...formData,
      permissions: {
        ...formData.permissions,
        [module]: {
          ...formData.permissions[module],
          [action]: value,
        },
      },
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await apiFetch("/roles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!data.success) {
        alert(data.message);
        return;
      }
      alert("Role Added Successfully");
      router.push("/admin/roles");
    } catch (error) {
      console.log(error);
      alert("Role already exists");
    }
  }

  return (
    // Reduced padding on mobile (p-4) vs desktop (p-8)
    <div className="min-h-screen bg-[var(--color-section)] p-4 sm:p-8">
      {/* Increased max-width to allow more room */}
      <div className="max-w-4xl mx-auto bg-[var(--color-card)] rounded-[var(--radius-xl)] shadow-[var(--shadow-lg)] p-6 sm:p-10">
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-[var(--color-primary)]">Add Role</h1>
          <p className="text-[var(--color-text-muted)] mt-2">Create role & assign permissions</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          <div>
            <label className="block text-lg font-semibold text-[var(--color-text)] mb-3">Role Name</label>
            {roleExists && <p className="text-[var(--danger)] text-sm mb-2">Role already exists</p>}
            <input
              required
              type="text"
              value={formData.name}
              onChange={(e) => {
                const value = e.target.value;
                const exists = existingRoles.some((item) => item.name?.trim().toLowerCase() === value.trim().toLowerCase());
                setRoleExists(exists);
                setFormData({ ...formData, name: value });
              }}
              className="w-full border border-[var(--color-border-strong)] bg-[var(--color-card)] text-[var(--color-text)] p-4 rounded-[var(--radius-md)] outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
            />
          </div>

          {/* RESPONSIVE TABLE WRAPPER */}
          <div className="bg-[var(--color-card)] border rounded-[var(--radius-lg)] overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[400px]">
                <thead className="bg-[var(--color-primary)] text-[var(--color-white)]">
                  <tr>
                    <th className="text-left p-4 sm:p-5 text-base sm:text-lg">Module</th>
                    <th className="text-center p-4 sm:p-5 text-base sm:text-lg">Create</th>
                    <th className="text-center p-4 sm:p-5 text-base sm:text-lg">Edit</th>
                    <th className="text-center p-4 sm:p-5 text-base sm:text-lg">Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {modules.map((module) => (
                    <tr key={module} className="border-b hover:bg-[var(--color-section)] transition">
                      <td className="p-4 sm:p-5 font-semibold text-[var(--color-primary)] capitalize">{module}</td>
                      {["create", "edit", "delete"].map((action) => (
                        <td key={action} className="text-center p-4 sm:p-5">
                          <input
                            type="checkbox"
                            checked={formData.permissions[module]?.[action] || false}
                            onChange={(e) => handlePermissionChange(module, action, e.target.checked)}
                            className="w-5 h-5 accent-[var(--color-accent)] cursor-pointer"
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <button
            disabled={roleExists || !formData.name}
            className="w-full sm:w-auto bg-[var(--color-primary)] hover:bg-[var(--color-dark-2)] text-[var(--color-white)] px-8 py-4 rounded-[var(--radius-md)] text-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Role
          </button>
        </form>
      </div>
    </div>
  );
}