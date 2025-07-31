"use client";
import ProductCard from "@/components/ProductCard.jsx";
import Navbar from "@/components/Navbar.jsx";
import Footer from "@/components/Footer.jsx";
import { useAppContext } from "@/context/AppContext.jsx";
import { useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";

const AllProducts = () => {
  const { products, setProducts, isSeller } = useAppContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [deleteMode, setDeleteMode] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const params = useSearchParams();

  useEffect(() => {
    const categoryFromURL = params.get("category");
    if (categoryFromURL) {
      setSelectedCategory(categoryFromURL);
    }
  }, [params]);

//   const handleDeleteSelected = async () => {
//   try {
//     for (const id of selectedProducts) {
//       const res = await fetch(`/api/products/delete/${id}`, {
//         method: "DELETE", // ✅ Correct method
//       });

//       if (!res.ok) {
//         console.error("Failed to delete:", id);
//       }
//     }

//     setDeleteMode(false);
//     setSelectedProducts([]);
//     router.refresh(); // ✅ Refresh product list
//   } catch (err) {
//     console.error("Error deleting products:", err);
//   }
// };
const handleDeleteSelected = async () => {
  try {
    for (const id of selectedProducts) {
      const res = await fetch(`/api/products/delete/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        console.error("Failed to delete:", id);
      }
    }

    // ✅ Update local UI state
    filtered((prev) => prev.filter(p => !selectedProducts.includes(p._id)));

    setDeleteMode(false);
    setSelectedProducts([]);
  } catch (err) {
    console.error("Error deleting products:", err);
  }
};


  const handleCheckboxToggle = (id) => {
    setSelectedProducts((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  };

  const filtered = products.filter((product) => {
    const matchesCategory = selectedCategory
      ? product.category === selectedCategory
      : true;
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center mt-8 px-4">
        <div className="mb-4 flex flex-col sm:flex-row gap-4 w-full max-w-5xl justify-between items-center">
          <input
            type="text"
            placeholder="Search products..."
            className="border border-gray-300 rounded px-4 py-2 w-full sm:w-1/2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {isSeller && (
            <>
              {!deleteMode ? (
                <button
                  onClick={() => setDeleteMode(true)}
                  className="bg-red-500 text-white px-4 py-2 rounded text-sm"
                >
                  Select & Delete
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleDeleteSelected}
                    disabled={selectedProducts.length === 0}
                    className="bg-red-600 text-white px-3 py-2 rounded text-sm disabled:opacity-50"
                  >
                    Delete Selected ({selectedProducts.length})
                  </button>
                  <button
                    onClick={() => {
                      setDeleteMode(false);
                      setSelectedProducts([]);
                    }}
                    className="bg-gray-300 text-black px-3 py-2 rounded text-sm"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 pb-14 w-full">
          {filtered.length === 0 ? (
            <div className="col-span-full text-gray-400 py-8">
              No products found.
            </div>
          ) : (
            filtered.map((product, index) => (
              <div key={index} className="relative">
                <ProductCard product={product} />

                {deleteMode && isSeller && (
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(product._id)}
                    onChange={() => handleCheckboxToggle(product._id)}
                    className="absolute top-2 left-2 w-4 h-4"
                  />
                )}
              </div>
            ))
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AllProducts;
