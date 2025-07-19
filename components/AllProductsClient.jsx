"use client";
import ProductCard from "@/components/ProductCard.jsx";
import Navbar from "@/components/Navbar.jsx";
import Footer from "@/components/Footer.jsx";
import { useAppContext } from "@/context/AppContext.jsx";
import { useSearchParams, useRouter } from "next/navigation"; // For App Router
import React, { useState, useEffect } from "react";

const AllProducts = () => {
  const { products } = useAppContext();
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialSearch = searchParams.get("search") ?? "";

  const [search, setSearch] = useState(initialSearch);
  const [filtered, setFiltered] = useState(products);

  // Filter products as search changes
  useEffect(() => {
    const s = search.trim().toLowerCase();
    if (!s) setFiltered(products);
    else {
      setFiltered(
        products.filter((p) =>
          p.name.toLowerCase().includes(s)
        )
      );
    }
  }, [products, search]);

  // Keep search param updated in URL
  useEffect(() => {
    if (search !== initialSearch) {
      // Update only if different
      const sp = new URLSearchParams(Array.from(searchParams.entries()));
      if (search) sp.set("search", search);
      else sp.delete("search");
      router.replace(`/all-products?${sp.toString()}`);
    }
    // eslint-disable-next-line
  }, [search]);

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-start px-6 md:px-16 lg:px-32">
        <div className="flex flex-col items-end pt-12 w-full">
          <p className="text-2xl font-medium">All products</p>
          <div className="w-16 h-0.5 bg-orange-600 rounded-full"></div>
        </div>

        {/* Search box (always visible or conditional) */}
        <div className="w-full flex my-8">
          <input
            className="border px-4 py-2 w-full rounded"
            placeholder="Search products by name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            autoFocus={initialSearch !== ""}
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 flex-col items-center gap-6 pb-14 w-full">
          {filtered.length === 0 ? (
            <div className="col-span-full text-gray-400 py-8">No products found.</div>
          ) : (
            filtered.map((product, index) => (
              <ProductCard key={index} product={product} />
            ))
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AllProducts;
