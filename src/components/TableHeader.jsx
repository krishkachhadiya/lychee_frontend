"use client";

export default function TableHeader({
  label,
  field,
  sortField,
  sortOrder,
  onSort,
  className = "",
}) {
  return (
    <th
      onClick={() => onSort(field)}
      className={`px-4 py-3 text-left font-semibold cursor-pointer select-none hover:bg-[var(--color-dark-2)] transition ${className}`}
    >
      <div className="flex items-center gap-2">
        <span>{label}</span>

        {sortField === field ? (
          sortOrder === "asc" ? (
            <span>↑</span>
          ) : (
            <span>↓</span>
          )
        ) : (
          <span className="text-[var(--color-text-muted)]">↕</span>
        )}
      </div>
    </th>
  );
}