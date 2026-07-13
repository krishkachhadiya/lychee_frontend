"use client";


import { useState, useMemo } from "react";
import CategoryTreeNode from "./CategoryTreeNode";
import { buildTree, getCategoryPath } from "../lib/category-tree";

export default function CategoryPicker({
  categories,
  value,
  onChange,
  label = "Select Category",
}) {
  const [open, setOpen] = useState(false);

  const tree = useMemo(() => buildTree(categories), [categories]);

  const selectedPath = value
    ? getCategoryPath(categories, value)
    : "Main Category";

  return (
    <>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full border border-[var(--color-border-strong)] rounded-[var(--radius-md)] p-4 text-left bg-[var(--color-card)] hover:border-[var(--color-primary)]"
      >
        {selectedPath}
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 bg-[var(--color-overlay)] z-50 flex items-center justify-center">
          <div className="bg-[var(--color-card)] rounded-[var(--radius-xl)] w-full max-w-2xl p-6 max-h-[80vh] overflow-y-auto">
            
            {/* Header */}
            <div className="flex justify-between items-center mb-4 text-[var(--color-text)]">
              <h2 className="text-xl font-bold">{label}</h2>
              <button onClick={() => setOpen(false)}>✕</button>
            </div>

            {/* Root */}
            <div
              onClick={() => {
                onChange(null);
                setOpen(false);
              }}
              className="p-3 rounded-[var(--radius-md)] border cursor-pointer hover:bg-[var(--color-section)] mb-3 text-[var(--color-text)]"
            >
              Main Category
            </div>

            {/* Tree */}
            {tree.map((node) => (
              <CategoryTreeNode
                key={node._id}
                node={node}
                selectedId={value}
                onSelect={(id) => {
                  onChange(id);
                  setOpen(false);
                }}
              />
            ))}

          </div>
        </div>
      )}
    </>
  );
}