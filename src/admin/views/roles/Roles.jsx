"use client";

import { apiFetch } from "../../../lib/api";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function RolesPage() {
const router = useRouter();
  // ======================
  // STATES
  // ======================
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState("");

  // ======================
  // PAGINATION
  // ======================
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);

  // ======================
  // MODULES
  // ======================
  const modules = ["products", "categories", "cms"];

  // ======================
  // FETCH ROLES
  // ======================
  async function fetchRoles() {
    try {
      const response = await apiFetch("/roles");
      const data = await response.json();
      
      const rolesArray = data.roles || data.data || data || [];
      setRoles(rolesArray);

      if (rolesArray.length > 0) {
        const initialId = rolesArray[0]._id || rolesArray[0].id || "";
        setSelectedRole(String(initialId));
      }
    } catch (error) {
      console.log("Error fetching roles data:", error);
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
      
      if (result?.data?.roles) {
        setLimit(result.data.roles);
      }
    } catch (error) {
      console.log("Error fetching pagination limit:", error);
    }
  }

  // ======================
  // LOAD DATA
  // ======================
  useEffect(() => {
    fetchRoles();
    fetchPagination();
  }, []);

  // ======================
  // DELETE ROLE
  // ======================
  async function handleDelete(id) {
    if (!id) return;
    const confirmDelete = confirm("Are you absolutely sure you want to delete this entire role?");
    if (!confirmDelete) return;

    try {
      const response = await apiFetch(`/roles/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (data.success || response.ok) {
        fetchRoles();
      }
    } catch (error) {
      console.log("Deletion interaction broken:", error);
    }
  }

  // ======================
  // SELECTED ROLE EXTRACTOR
  // ======================
  const selectedRoleData = roles.find(
    (role) => String(role._id || role.id) === String(selectedRole)
  );

  // ======================
  // PAGINATION LOGIC
  // ======================
  const start = (page - 1) * limit;
  const end = page * limit;
  const paginatedModules = modules.slice(start, end);
  const totalPages = Math.ceil(modules.length / limit);

  // ======================
  // LOADING STATE UI
  // ======================
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <h1 className="text-2xl font-semibold">Loading Roles...</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-section)] p-4 sm:p-6 lg:p-8 text-[var(--color-text)]">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[var(--color-primary)]">Roles</h1>
          <p className="text-[var(--color-text-muted)] mt-2">Manage system roles & fine-grained permissions</p>
        </div>

        <button
          onClick={() => router.push("/admin/roles/add")}
          className="bg-[var(--color-primary)] text-[var(--color-white)] px-5 py-3 rounded-[var(--radius-md)] hover:bg-[var(--color-dark-2)] transition font-medium self-start sm:self-auto shadow-sm"
        >
          Add Role
        </button>
      </div>

      {/* ROLE CONTROLS TOOLBAR */}
      <div className="bg-[var(--color-card)] p-4 rounded-[var(--radius-lg)] shadow-sm mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1.5 w-full sm:w-auto">
          <label className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">Selected Active Role</label>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="border bg-[var(--color-card)] px-4 py-2.5 rounded-[var(--radius-md)] outline-none min-w-[260px] font-medium border-[var(--color-border-strong)] focus:ring-2 focus:ring-[var(--color-accent)]"
          >
            {roles.map((role) => {
              const roleId = role._id || role.id;
              return (
                <option key={roleId} value={roleId}>
                  {role.name}
                </option>
              );
            })}
          </select>
        </div>

        {/* Global actions tied cleanly to the active selected role container */}
        <div className="flex items-center gap-3 w-full sm:w-auto sm:mt-auto">
          <button
            onClick={() => router.push(`/admin/roles/edit/${selectedRole}`)}
            className="flex-1 sm:flex-initial bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-[var(--color-white)] px-5 py-2.5 rounded-[var(--radius-md)] text-sm font-medium transition shadow-sm"
          >
            Edit Role Name
          </button>
          <button
            onClick={() => handleDelete(selectedRole)}
            className="flex-1 sm:flex-initial bg-[var(--danger)] hover:bg-[var(--danger)] text-[var(--color-white)] px-5 py-2.5 rounded-[var(--radius-md)] text-sm font-medium transition shadow-sm"
          >
            Delete Role
          </button>
        </div>
      </div>

      {/* PERMISSIONS TABLE */}
      <div className="bg-[var(--color-card)] rounded-[var(--radius-lg)] shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] border-collapse">
            <thead className="bg-[var(--color-primary)] text-[var(--color-white)]">
              <tr>
                <th className="text-left p-5 w-1/3">Module Name</th>
                <th className="text-left p-5 w-2/3">Active Matrix Permissions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[var(--color-border)]">
              {paginatedModules.map((module) => {
                return (
                  <tr key={module} className="hover:bg-[var(--color-section)]/70 transition">
                    
                    {/* MODULE TITLE */}
                    <td className="p-5 font-semibold capitalize text-[var(--color-primary)] align-middle">
                      {module}
                    </td>

                    {/* DYNAMIC PERMISSION BADGES */}
                    <td className="p-5 align-middle">
                      <div className="flex flex-wrap gap-2">
                        {(() => {
                          const rolePermissions = selectedRoleData?.permissions || {};
                          
                          const matchKey = Object.keys(rolePermissions).find(
                            (key) => key.toLowerCase() === module.toLowerCase()
                          );
                          
                          const modulePerms = matchKey ? rolePermissions[matchKey] : null;

                          if (!modulePerms || (!modulePerms.create && !modulePerms.edit && !modulePerms.delete)) {
                            return <span className="text-[var(--color-text-muted)] text-sm italic">No Permissions Assigned</span>;
                          }

                          return (
                            <>
                              {modulePerms.create && (
                                <span className="bg-[var(--success-soft)] text-[var(--success)] border border-[var(--success)] px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                                  Create
                                </span>
                              )}
                              {modulePerms.edit && (
                                <span className="bg-[var(--info-soft)] text-[var(--info)] border border-[var(--info)] px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                                  Edit
                                </span>
                              )}
                              {modulePerms.delete && (
                                <span className="bg-[var(--danger-soft)] text-[var(--danger)] border border-[var(--danger)] px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                                  Delete
                                </span>
                              )}
                            </>
                          );
                        })()}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* PAGINATION CONTROLS */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8 select-none">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className={`px-4 py-2 rounded-[var(--radius-sm)] border text-sm font-medium transition ${
              page === 1 
                ? "bg-[var(--color-section)] text-[var(--color-text-muted)] border-[var(--color-border)] cursor-not-allowed" 
                : "bg-[var(--color-card)] hover:bg-[var(--color-section)] text-[var(--color-text)] border-[var(--color-border-strong)]"
            }`}
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => setPage(index + 1)}
              className={`w-10 h-10 rounded-[var(--radius-sm)] border text-sm font-semibold transition ${
                page === index + 1 
                  ? "bg-[var(--color-primary)] text-[var(--color-white)] border-[var(--color-primary)] shadow-sm" 
                  : "bg-[var(--color-card)] text-[var(--color-text)] border-[var(--color-border-strong)] hover:bg-[var(--color-section)]"
              }`}
            >
              {index + 1}
            </button>
          ))}

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className={`px-4 py-2 rounded-[var(--radius-sm)] border text-sm font-medium transition ${
              page === totalPages 
                ? "bg-[var(--color-section)] text-[var(--color-text-muted)] border-[var(--color-border)] cursor-not-allowed" 
                : "bg-[var(--color-card)] hover:bg-[var(--color-section)] text-[var(--color-text)] border-[var(--color-border-strong)]"
            }`}
          >
            Next
          </button>
        </div>
      )}

    </div>
  );
}