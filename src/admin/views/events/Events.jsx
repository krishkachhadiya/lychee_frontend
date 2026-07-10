"use client";

import { apiFetch } from "../../../lib/api";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TableHeader from "../../../components/TableHeader";
import { sortData } from "../../../lib/sortdata";

export default function ManageEvents() {
  const router = useRouter();

  // ======================
  // STATES
  // ======================
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [admin, setAdmin] = useState(null);

  // ======================
  // PAGINATION & SORTING
  // ======================
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortField, setSortField] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  // ======================
  // FETCH EVENTS
  // ======================
  async function fetchEvents() {
    try {
      const response = await apiFetch("/events");
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  // ======================
  // FETCH PAGINATION LIMIT
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

  // Sorting logic handler 
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
  // LOAD SYSTEM DATA
  // ======================
  useEffect(() => {
    fetchEvents();
    fetchPagination();

    const storedAdmin = sessionStorage.getItem("admin");
    if (storedAdmin) {
      setAdmin(JSON.parse(storedAdmin));
    }
  }, []);

  // ======================
  // DELETE EVENT
  // ======================
  async function handleDelete(id) {
    const confirmDelete = confirm("Delete this event permanently?");
    if (!confirmDelete) return;

    try {
      const response = await apiFetch(`/events/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setEvents((prev) =>
          prev.filter((e) => String(e._id || e.id) !== String(id))
        );
        fetchEvents();
      } else {
        alert("Failed to delete the event. Server error.");
      }
    } catch (error) {
      console.log("Delete request failed:", error);
    }
  }

  // ======================
  // TOGGLE STATUS
  // ======================
  async function toggleStatus(eventData) {
    const targetId = eventData._id || eventData.id;
    const nextStatus = eventData.status === "active" ? "inactive" : "active";

    try {
      const response = await apiFetch(`/events/${targetId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...eventData,
          status: nextStatus,
        }),
      });

      if (response.ok) {
        setEvents((prev) =>
          prev.map((e) =>
            String(e._id || e.id) === String(targetId) ? { ...e, status: nextStatus } : e
          )
        );
        fetchEvents();
      }
    } catch (error) {
      console.log(error);
    }
  }

  // ======================
  // FILTER & SORT COMPUTATION
  // ======================
  const filteredEvents = events.filter((e) =>
    e.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.eventType?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedEvents = sortData(filteredEvents, sortField, sortOrder);

  // ======================
  // PAGINATION CALCULATIONS
  // ======================
  const start = (page - 1) * limit;
  const end = page * limit;
  const paginatedEvents = sortedEvents.slice(start, end);
  const totalPages = Math.ceil(sortedEvents.length / limit);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold">Loading Events Dashboard...</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-section)] p-4 sm:p-6 md:p-8 w-full">

      {/* Header Layout Container */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 md:mb-10">
        <div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--color-text)]">Events</h1>
          <p className="text-[var(--color-text-muted)] mt-1 md:mt-2 text-sm md:text-base">Manage exhibition entries and locations</p>
        </div>

        {/* Action Button Trigger mapped via precise permissions */}
        {(admin?.role === "admin" || admin?.permissions?.events?.create) && (
          <button
            onClick={() => router.push("/admin/events/create")}
            className="w-full sm:w-auto text-center bg-[var(--color-primary)] hover:bg-[var(--color-dark-2)] text-[var(--color-white)] px-5 md:px-6 py-2.5 md:py-3 rounded-[var(--radius-md)] md:rounded-[var(--radius-lg)] font-semibold text-sm md:text-base transition"
          >
            Add Event
          </button>
        )}
      </div>

      {/* 🔍 Search Input Controller */}
      <div className="mb-6 max-w-xs">
        <input
          type="text"
          placeholder="Search items..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setPage(1);
          }}
          className="w-full border px-3 py-2 text-sm rounded-[var(--radius-sm)] bg-[var(--color-card)] text-[var(--color-text)] border-[var(--color-border-strong)] focus:outline-none focus:border-[var(--color-primary)]"
        />
      </div>

      {/* Responsive Table Data Canvas */}
      <div className="bg-[var(--color-card)] rounded-[var(--radius-lg)] md:rounded-[var(--radius-xl)] shadow-[var(--shadow-md)] overflow-hidden w-full overflow-x-auto">
        <table className="w-full min-w-[900px] border-collapse">
          <thead className="bg-[var(--color-primary)] text-[var(--color-white)]">
            <tr>
              <TableHeader label="Title" field="title" sortField={sortField} sortOrder={sortOrder} onSort={handleSort} />
              <TableHeader label="Location" field="eventType" sortField={sortField} sortOrder={sortOrder} onSort={handleSort} />
              <TableHeader label="Date" field="dates" sortField={sortField} sortOrder={sortOrder} onSort={handleSort} />
              <TableHeader label="Time" field="timeWindow" sortField={sortField} sortOrder={sortOrder} onSort={handleSort} />
              <TableHeader label="Visitors" field="expectedVisitors" sortField={sortField} sortOrder={sortOrder} onSort={handleSort} />
              <TableHeader label="Status" field="status" sortField={sortField} sortOrder={sortOrder} onSort={handleSort} />
              <th className="text-center p-4 md:p-5 text-sm md:text-base">Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginatedEvents.length > 0 ? (
              paginatedEvents.map((eventData, index) => {
                const currentId = eventData._id || eventData.id;
                return (
                  <tr key={currentId || index} className="border-b hover:bg-[var(--color-section)] transition">
                    

                    {/* Title */}
                    <td className="p-4 md:p-5">
                      <h2 className="font-bold text-base md:text-lg text-[var(--color-text)] line-clamp-1">{eventData.title}</h2>
                    </td>

                    {/* Location Tag */}
                    <td className="p-4 md:p-5 text-[var(--color-secondary)] text-sm md:text-base">
                      {eventData.eventType || eventData.address || "-"}
                    </td>

                    {/* Date Details */}
                    <td className="p-4 text-[var(--color-secondary)] text-xs md:text-sm whitespace-nowrap">
                      {eventData.dates || "-"}
                    </td>

                    {/* Time Strings */}
                    <td className="p-4 text-[var(--color-secondary)] text-xs md:text-sm whitespace-nowrap">
                      {eventData.timeWindow || "10:00 to 21:00"}
                    </td>

                    {/* Visitors Metatag */}
                    <td className="p-4 text-[var(--color-secondary)] text-xs md:text-sm font-semibold">
                      {eventData.expectedVisitors || "-"}
                    </td>

                    {/* Status Active/Inactive Trigger Button */}
                    <td className="p-4 md:p-5 text-center">
                      {(admin?.role === "admin" || admin?.permissions?.events?.edit) ? (
                        <button
                          onClick={() => toggleStatus(eventData)}
                          className={`px-4 md:px-5 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-semibold transition opacity-90 hover:opacity-100 whitespace-nowrap ${
                            eventData.status === "active"
                              ? "bg-[var(--success-soft)] text-[var(--success)]"
                              : "bg-[var(--danger-soft)] text-[var(--danger)]"
                          }`}
                        >
                          {eventData.status}
                        </button>
                      ) : (
                        <span
                          className={`px-4 md:px-5 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-semibold whitespace-nowrap ${
                            eventData.status === "active"
                              ? "bg-[var(--success-soft)] text-[var(--success)]"
                              : "bg-[var(--danger-soft)] text-[var(--danger)]"
                          }`}
                        >
                          {eventData.status}
                        </span>
                      )}
                    </td>

                    {/* Modification & Operation Actions Row Link */}
                    <td className="p-4 md:p-5">
                      <div className="flex justify-center gap-2 md:gap-3">
                        {(admin?.role === "admin" || admin?.permissions?.events?.edit) && (
                          <button
                            onClick={() => router.push(`/admin/events/edit/${currentId}`)}
                            className="bg-[var(--color-accent)] hover:opacity-90 text-[var(--color-white)] px-4 md:px-5 py-1.5 md:py-2 rounded-[var(--radius-sm)] md:rounded-[var(--radius-md)] text-xs md:text-sm font-medium whitespace-nowrap"
                          >
                            Edit
                          </button>
                        )}

                        {(admin?.role === "admin" || admin?.permissions?.events?.delete) && (
                          <button
                            onClick={() => handleDelete(currentId)}
                            className="bg-[var(--danger)] hover:opacity-90 text-[var(--color-white)] px-4 md:px-5 py-1.5 md:py-2 rounded-[var(--radius-sm)] md:rounded-[var(--radius-md)] text-xs md:text-sm font-medium whitespace-nowrap"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="8" className="text-center p-10 text-[var(--color-text-muted)] text-sm md:text-base">
                  No Exhibition Events Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Dynamic Native System Pagination Grid Footers */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6 md:mt-8 text-[var(--color-text)] select-none flex-wrap">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className={`px-3 md:px-4 py-1.5 md:py-2 rounded-[var(--radius-sm)] border font-medium text-xs md:text-sm transition-all duration-200 ${
              page === 1
                ? "bg-[var(--color-section)] text-[var(--color-text-muted)] border-[var(--color-border)] cursor-not-allowed"
                : "bg-[var(--color-card)] text-[var(--color-text)] border-[var(--color-border-strong)] hover:bg-[var(--color-section)] active:scale-95"
            }`}
          >
            Prev
          </button>

          {(() => {
            const pageNumbers = [];
            const maxVisiblePages = 5;

            if (totalPages <= maxVisiblePages) {
              for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
            } else {
              pageNumbers.push(1);
              let startRange = Math.max(2, page - 1);
              let endRange = Math.min(totalPages - 1, page + 1);

              if (page <= 2) endRange = 4;
              else if (page >= totalPages - 1) startRange = totalPages - 3;

              if (startRange > 2) pageNumbers.push("ellipsis-left");
              for (let i = startRange; i <= endRange; i++) pageNumbers.push(i);
              if (endRange < totalPages - 1) pageNumbers.push("ellipsis-right");
              pageNumbers.push(totalPages);
            }

            return pageNumbers.map((item, index) => {
              if (item === "ellipsis-left" || item === "ellipsis-right") {
                return (
                  <span key={`ellipse-${index}`} className="px-1 md:px-2 text-[var(--color-text-muted)] font-medium text-xs md:text-sm">
                    ...
                  </span>
                );
              }

              const isActive = page === item;
              return (
                <button
                  key={`page-${item}`}
                  onClick={() => setPage(item)}
                  className={`w-8 h-8 md:w-10 md:h-10 rounded-[var(--radius-sm)] border text-xs md:text-sm font-semibold transition-all duration-200 active:scale-95 ${
                    isActive
                      ? "bg-[var(--color-primary)] text-[var(--color-white)] border-[var(--color-primary)] shadow-md"
                      : "bg-[var(--color-card)] text-[var(--color-text)] border-[var(--color-border-strong)] hover:bg-[var(--color-section)]"
                  }`}
                >
                  {item}
                </button>
              );
            });
          })()}

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className={`px-3 md:px-4 py-1.5 md:py-2 rounded-[var(--radius-sm)] border font-medium text-xs md:text-sm transition-all duration-200 ${
              page === totalPages
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