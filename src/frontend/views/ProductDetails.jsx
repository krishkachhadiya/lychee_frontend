"use client";

import { useParams } from "next/navigation";

import ProductDetailsContent from "../components/products/ProductDetailsContent";

export default function ProductDetails() {
  const { slug } = useParams();

  return (
    <>
      <ProductDetailsContent slug={slug} />
    </>
  );
}