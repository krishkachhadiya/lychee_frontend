"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

// Fully bulletproofed recursive tree lookup handler
function belongsToMainCategory(productCategoryId, mainCategoryId, allCategoriesPool) {
    if (!productCategoryId || !mainCategoryId || !allCategoriesPool?.length) return false;

    const targetMainId = String(mainCategoryId);
    const startingCategoryId = String(productCategoryId);

    let current = allCategoriesPool.find(
        (c) => String(c._id || c.id) === startingCategoryId
    );

    while (current) {
        const currentId = String(current._id || current.id);

        if (currentId === targetMainId) {
            return true;
        }

        if (!current.parent) break;

        const parentId = typeof current.parent === 'object'
            ? String(current.parent._id || current.parent.id)
            : String(current.parent);

        current = allCategoriesPool.find(
            (c) => String(c._id || c.id) === parentId
        );
    }

    return false;
}

export default function ProductsContent() {
    const searchParams = useSearchParams();
    const categoryUrlSlug = searchParams.get("category"); // Reads '?category=slug' from header link

    const [products, setProducts] = useState([]);
    const [allCategories, setAllCategories] = useState([]); 
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [productsPerPage, setProductsPerPage] = useState(8);
    const [currentPage, setCurrentPage] = useState(1);

    const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "http://localhost:5000";

    const getProductImageUrl = (imagePath) => {
        if (!imagePath || typeof imagePath !== "string" || imagePath.trim() === "") {
            return "/no-image.jpg";
        }
        if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
            return imagePath;
        }
        const cleanPath = imagePath.replace(/^\/+/, "").replace(/^uploads\/+/i, "");
        return `${BACKEND_BASE_URL}/uploads/${cleanPath}`;
    };

    // Load data from APIs
    useEffect(() => {
        async function fetchData() {
            try {
                const productsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/products`);
                const productsData = await productsRes.json();

                const categoriesRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/categories`);
                const categoriesData = await categoriesRes.json();

                const paginationRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/settings`);
                const paginationData = await paginationRes.json();

                const rawProducts = Array.isArray(productsData) ? productsData : productsData.data || [];
                const rawCategories = Array.isArray(categoriesData) ? categoriesData : categoriesData.data || [];

                setProducts(rawProducts.filter((item) => item.status === "active"));
                setProductsPerPage(Number(paginationData.data?.pagination) || 8);
                setAllCategories(rawCategories);
            } catch (error) {
                console.error("Error loading catalogue dependencies:", error);
            }
        }

        fetchData();
    }, []);

    // Sync state with header url changes
    useEffect(() => {
        if (categoryUrlSlug && allCategories.length > 0) {
            const matchingCat = allCategories.find(
                (c) => String(c.slug) === String(categoryUrlSlug) || String(c._id || c.id) === String(categoryUrlSlug)
            );

            if (matchingCat) {
                setSelectedCategory(matchingCat._id || matchingCat.id);
            } else {
                setSelectedCategory("all");
            }
        } else {
            setSelectedCategory("all");
        }
        setCurrentPage(1); // Reset pagination on category shift
    }, [categoryUrlSlug, allCategories]);

    // Simple Filter Logic (Only Category Matching)
    const filteredProducts = products.filter((product) => {
        const productCategoryId = product.category && typeof product.category === 'object'
            ? (product.category._id || product.category.id)
            : product.category;

        if (selectedCategory === "all") return true;

        const isDirectMatch = String(productCategoryId) === String(selectedCategory);
        const isRecursiveChildMatch = belongsToMainCategory(productCategoryId, selectedCategory, allCategories);
        
        return isDirectMatch || isRecursiveChildMatch;
    });

    // Pagination Calculation
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    const startIndex = (currentPage - 1) * productsPerPage;
    const paginatedProducts = filteredProducts.slice(startIndex, startIndex + productsPerPage);

    // Dynamic Header Title Strategy based on selected route category
    const currentCategoryObj = allCategories.find(c => String(c._id || c.id) === String(selectedCategory));
    const titleText = currentCategoryObj ? currentCategoryObj.title : "All Products";

    return (
        <section className="py-10 bg-[var(--color-card)]">
            <div className="max-w-7xl mx-auto px-4 lg:px-8">

                {/* Simplified Dynamic Title Banner */}
                <div className="flex justify-between items-center border-b border-[var(--color-border)] pb-5 mb-8">
                    <h2 className="text-2xl font-bold text-[var(--color-primary)]">
                        {titleText}
                    </h2>
                    <div className="px-4 py-2 rounded-full bg-[var(--color-accent-soft)] text-[var(--color-accent)] font-medium text-sm">
                        {filteredProducts.length} Products Found
                    </div>
                </div>

                {/* Catalog Card Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {paginatedProducts.map((product, index) => {
                        const prodId = product._id || product.id;
                        return (
                            <Link
                                key={prodId || index}
                                href={`/products/${product.slug}`}
                                className="block bg-[var(--color-card)] border border-[var(--color-border)] rounded-[var(--radius-xl)] overflow-hidden group hover:-translate-y-2 hover:shadow-[var(--shadow-lg)] transition-all duration-300 cursor-pointer"
                            >
                                <div className="relative h-64 overflow-hidden">
                                    <img
                                        src={getProductImageUrl(product.images?.[0])}
                                        alt={product.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>

                                <div className="p-5">
                                    <h3 className="text-lg font-semibold text-[var(--color-primary)] line-clamp-2 group-hover:text-[var(--color-accent)] transition-colors duration-200">
                                        {product.title}
                                    </h3>
                                    <p className="mt-3 text-sm text-[var(--color-secondary)] line-clamp-2">
                                        {product.metaDescription || "Premium quality product"}
                                    </p>
                                    <div className="inline-block mt-4 text-[var(--color-accent)] font-medium">
                                        <span className="inline-flex items-center gap-2 text-[var(--color-accent)] font-semibold">
                                            View Details &rarr;
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/* Empty Fallback Block */}
                {filteredProducts.length === 0 && (
                    <div className="text-center py-20">
                        <h3 className="text-2xl font-semibold text-[var(--color-primary)]">No Products Listed</h3>
                        <p className="mt-3 text-[var(--color-text-muted)]">No products found inside this collection yet.</p>
                    </div>
                )}

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-12 flex-wrap select-none text-[var(--color-text)]">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(currentPage - 1)}
                            className={`flex items-center gap-1 px-4 py-2 rounded-[var(--radius-md)] border text-sm font-medium transition-all duration-200 ${currentPage === 1
                                ? "bg-[var(--color-section)] text-[var(--color-text-muted)] border-[var(--color-border)] cursor-not-allowed"
                                : "bg-[var(--color-card)] text-[var(--color-primary)] border-[var(--color-border-strong)] hover:bg-[var(--color-accent)] hover:text-[var(--color-white)] shadow-sm"
                                }`}
                        >
                            &larr; Prev
                        </button>

                        {(() => {
                            const pageNumbers = [];
                            const maxVisiblePages = 5;

                            if (totalPages <= maxVisiblePages) {
                                for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
                            } else {
                                pageNumbers.push(1);
                                let startRange = Math.max(2, currentPage - 1);
                                let endRange = Math.min(totalPages - 1, currentPage + 1);

                                if (currentPage <= 2) {
                                    endRange = 4;
                                } else if (currentPage >= totalPages - 1) {
                                    startRange = totalPages - 3;
                                }

                                if (startRange > 2) pageNumbers.push("ellipsis-left");
                                for (let i = startRange; i <= endRange; i++) pageNumbers.push(i);
                                if (endRange < totalPages - 1) pageNumbers.push("ellipsis-right");
                                pageNumbers.push(totalPages);
                            }

                            return pageNumbers.map((item, index) => {
                                if (item === "ellipsis-left" || item === "ellipsis-right") {
                                    return (
                                        <span key={`ellipse-${index}`} className="px-2 text-[var(--color-text-muted)] font-medium">
                                            ...
                                        </span>
                                    );
                                }

                                const isActive = currentPage === item;
                                return (
                                    <button
                                        key={`page-${item}`}
                                        onClick={() => setCurrentPage(item)}
                                        className={`w-10 h-10 rounded-[var(--radius-md)] border text-sm font-semibold transition-all duration-200 ${isActive
                                            ? "bg-[var(--color-accent)] text-[var(--color-white)] border-[var(--color-accent)] shadow-md"
                                            : "bg-[var(--color-card)] text-[var(--color-primary)] border-[var(--color-border-strong)] hover:bg-[var(--color-section)]"
                                            }`}
                                    >
                                        {item}
                                    </button>
                                );
                            });
                        })()}

                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(currentPage + 1)}
                            className={`flex items-center gap-1 px-4 py-2 rounded-[var(--radius-md)] border text-sm font-medium transition-all duration-200 ${currentPage === totalPages
                                ? "bg-[var(--color-section)] text-[var(--color-text-muted)] border-[var(--color-border)] cursor-not-allowed"
                                : "bg-[var(--color-card)] text-[var(--color-primary)] border-[var(--color-border-strong)] hover:bg-[var(--color-accent)] hover:text-[var(--color-white)] shadow-sm"
                                }`}
                        >
                            Next &rarr;
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}