"use client";

import { apiFetch } from "../../../lib/api";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditRolePage() {
const router = useRouter();
const { id } = useParams();

  const [existingRoles, setExistingRoles] = useState([]);
  const [roleExists, setRoleExists] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    permissions: {
      products: { create: false, edit: false, delete: false },
      categories: { create: false, edit: false, delete: false },
      cms: { create: false, edit: false, delete: false },
    },
  });

  const modules = ["products", "categories", "cms"];

  async function fetchRole() {
    try {
      const [roleRes, rolesRes] = await Promise.all([
        apiFetch(`/roles/${id}`),
        apiFetch("/roles")
      ]);
      const roleData = await roleRes.json();
      const rolesData = await rolesRes.json();

      setExistingRoles(rolesData.roles || []);
      if (roleData.success) {
        setFormData({ name: roleData.role.name, permissions: roleData.role.permissions });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { if (id) fetchRole(); }, [id]);

  function handlePermissionChange(module, action, value) {
    setFormData((prev) => {
      const newPerms = {
        ...prev.permissions,
        [module]: { ...prev.permissions[module], [action]: value },
      };
      // Maintain your specific subcategory logic
      if (module === "categories") {
        newPerms.subcategories = { ...prev.permissions?.subcategories, [action]: value };
      }
      return { ...prev, permissions: newPerms };
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await apiFetch(`/roles/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if ((await response.json()).success) {
        alert("Role Updated Successfully");
        router.push("/admin/roles");
      }
    } catch (error) { console.error(error); }
  }

  if (loading) return <div className="flex items-center justify-center min-h-screen text-2xl font-semibold">Loading...</div>;

  return (
    <div className="min-h-screen bg-[var(--color-section)] p-4 sm:p-8">
      <div className="max-w-4xl mx-auto bg-[var(--color-card)] rounded-[var(--radius-xl)] shadow-[var(--shadow-md)] p-6 sm:p-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-[var(--color-primary)] mb-2">Edit Role</h1>
        <p className="text-[var(--color-text-muted)] mb-8">Update role name and fine-grained permissions.</p>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-lg font-semibold text-[var(--color-text)] mb-2">Role Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => {
                const val = e.target.value;
                setRoleExists(existingRoles.some(r => String(r._id) !== String(id) && r.name?.toLowerCase() === val.trim().toLowerCase()));
                setFormData({ ...formData, name: val });
              }}
              className="w-full border p-4 rounded-[var(--radius-md)] outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
              required
            />
            {roleExists && <p className="text-[var(--danger)] text-sm mt-2">Role name already taken.</p>}
          </div>

          <div className="bg-[var(--color-card)] border rounded-[var(--radius-lg)] overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[500px]">
                <thead className="bg-[var(--color-primary)] text-[var(--color-white)]">
                  <tr>
                    <th className="text-left p-4">Module</th>
                    {["Create", "Edit", "Delete"].map(a => <th key={a} className="p-4">{a}</th>)}
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {modules.map((module) => (
                    <tr key={module} className="hover:bg-[var(--color-section)]">
                      <td className="p-4 font-semibold capitalize">{module}</td>
                      {["create", "edit", "delete"].map((action) => (
                        <td key={action} className="text-center p-4">
                          <input
                            type="checkbox"
                            checked={!!formData.permissions[module]?.[action]}
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
            disabled={roleExists}
            className="w-full sm:w-auto bg-[var(--color-primary)] text-[var(--color-white)] px-8 py-4 rounded-[var(--radius-md)] font-semibold hover:bg-[var(--color-dark-2)] transition disabled:opacity-50"
          >
            Update Role
          </button>
        </form>
      </div>
    </div>
  );
}