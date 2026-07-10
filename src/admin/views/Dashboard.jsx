"use client";

import { apiFetch } from "../../lib/api";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  // ======================
  // FETCH DATA
  // ======================

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // ======================
  // PRODUCTS
  // ======================

  async function fetchProducts() {
    try {
      const response = await apiFetch("/products");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.log(error);
    }
  }

  // ======================
  // CATEGORIES
  // ======================

  async function fetchCategories() {
    try {
      const response = await apiFetch("/categories");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.log(error);
    }
  }

  // ======================
  // COUNTS
  // ======================

  const activeProducts = products.filter(
    (item) => item.status === "active"
  );

  const inactiveProducts = products.filter(
    (item) => item.status === "inactive"
  );

  const mainCategories = categories.filter(
    (item) => item.parent === null
  );

  // ======================
  // UI
  // ======================

  return (
    <div className="w-full">
      {/* HEADER */}
      <div className="mb-6 sm:mb-8 lg:mb-10">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--color-primary)]">
          Dashboard
        </h1>
        <p className="text-[var(--color-text-muted)] mt-2 sm:mt-3 text-sm sm:text-base lg:text-lg">
          Welcome to Admin Panel
        </p>
      </div>

      {/* STATS GRID - 1 col on mobile, 2 on tablet, 4 on desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* TOTAL PRODUCTS */}
        <div className="bg-[var(--color-card)] rounded-[var(--radius-lg)] sm:rounded-[var(--radius-xl)] shadow-md hover:shadow-[var(--shadow-md)] transition p-5 sm:p-6 lg:p-8">
          <h2 className="text-[var(--color-text-muted)] text-sm sm:text-base lg:text-lg">
            Total Products
          </h2>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-3 sm:mt-4 text-[var(--color-text)]">
            {products.length}
          </h1>
        </div>

        {/* ACTIVE PRODUCTS */}
        <div className="bg-[var(--color-card)] rounded-[var(--radius-lg)] sm:rounded-[var(--radius-xl)] shadow-md hover:shadow-[var(--shadow-md)] transition p-5 sm:p-6 lg:p-8">
          <h2 className="text-[var(--color-text-muted)] text-sm sm:text-base lg:text-lg">
            Active Products
          </h2>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-3 sm:mt-4 text-[var(--success)]">
            {activeProducts.length}
          </h1>
        </div>

        {/* INACTIVE PRODUCTS */}
        <div className="bg-[var(--color-card)] rounded-[var(--radius-lg)] sm:rounded-[var(--radius-xl)] shadow-md hover:shadow-[var(--shadow-md)] transition p-5 sm:p-6 lg:p-8">
          <h2 className="text-[var(--color-text-muted)] text-sm sm:text-base lg:text-lg">
            Inactive Products
          </h2>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-3 sm:mt-4 text-[var(--danger)]">
            {inactiveProducts.length}
          </h1>
        </div>

        {/* TOTAL CATEGORIES */}
        <div className="bg-[var(--color-card)] rounded-[var(--radius-lg)] sm:rounded-[var(--radius-xl)] shadow-md hover:shadow-[var(--shadow-md)] transition p-5 sm:p-6 lg:p-8">
          <h2 className="text-[var(--color-text-muted)] text-sm sm:text-base lg:text-lg">
            Total Categories
          </h2>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-3 sm:mt-4 text-[var(--color-text)]">
            {mainCategories.length}
          </h1>
        </div>

      </div>
    </div>
  );
}