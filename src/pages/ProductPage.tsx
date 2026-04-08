import { useState, useEffect, useMemo } from "react";
import ProductCard, { ProductCardSkeleton } from "@/components/ProductCard";
import api from "@/services/api";
import Header from "@/components/Header";
import { Product } from "@/data/products";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "";

const ProductsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [catLoading, setCatLoading] = useState(true);
  const [showSidebar, setShowSidebar] = useState(false);

  // ✅ FILTER STATES
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [quality, setQuality] = useState<string[]>([]);
  const [moq, setMoq] = useState("Any Quantity");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/categories");
        setCategories(res.data?.data || []);
      } catch (err) {
        console.error("Category fetch error:", err);
      } finally {
        setCatLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const res = await api.get("/products");

      const formatted: Product[] = (res.data?.data || []).map((p: any) => {
        let image = "/placeholder.png";

        if (p.mainImage?.secure_url) {
          image = p.mainImage.secure_url;
        } else if (p.image) {
          image = p.image.startsWith("http")
            ? p.image
            : `${BACKEND_URL}${p.image.startsWith("/") ? "" : "/"}${p.image}`;
        }

        const price =
          typeof p.offerPrice === "number"
            ? p.offerPrice
            : parseFloat(p.offerPrice) || 0;

        return {
          id: p._id,
          name: p.name || "No Name",
          slug: p.slug || "",
          price,
          image,
          category: p.category?.name || "general",
          unit: p.unit || "kg",
          organic: p.organic ?? false,
          rating: p.rating ?? 0,
          description: p.description || "",
        };
      });

      setProducts(formatted);
    } catch (err) {
      console.error("Products fetch error:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // 🔥 FULL FILTER LOGIC (NO UI CHANGE)
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // CATEGORY
      if (selectedCategory) {
        const catName = categories.find(c => c._id === selectedCategory)?.name;
        if (p.category !== catName) return false;
      }

      // PRICE
      if (priceMin && p.price < Number(priceMin)) return false;
      if (priceMax && p.price > Number(priceMax)) return false;

      // QUALITY (demo logic)
      if (quality.length > 0) {
        const isPremium = p.price >= 50;
        if (quality.includes("Grade A (Premium)") && !isPremium) return false;
        if (quality.includes("Grade B (Standard)") && isPremium) return false;
      }

      // MOQ (demo logic)
      if (moq !== "Any Quantity") {
        if (moq === "Under 25 kg" && p.price > 25) return false;
        if (moq === "25 kg - 100 kg" && (p.price < 25 || p.price > 100)) return false;
        if (moq === "Over 100 kg" && p.price < 100) return false;
      }

      return true;
    });
  }, [products, selectedCategory, priceMin, priceMax, quality, moq, categories]);

  // 🔥 CLEAR ALL
  const clearFilters = () => {
    setSelectedCategory("");
    setPriceMin("");
    setPriceMax("");
    setQuality([]);
    setMoq("Any Quantity");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      {/* MOBILE CATEGORY BAR */}
      <div className="md:hidden bg-white border-b sticky top-0 z-20">
        <div className="flex overflow-x-auto px-2 py-2 gap-2">
          {catLoading ? (
            <div className="text-sm text-gray-500">Loading...</div>
          ) : (
            categories.map((cat) => {
              const active = selectedCategory === cat._id;
              return (
                <button
                  key={cat._id}
                  onClick={() => setSelectedCategory(cat._id)}
                  className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs border ${
                    active
                      ? "bg-green-500 text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {cat.name}
                </button>
              );
            })
          )}
        </div>
      </div>

      <div className="flex">
        {/* FILTER BUTTON */}
        <button
          onClick={() => setShowSidebar(!showSidebar)}
          className="hidden md:block lg:hidden fixed bottom-4 left-4 z-30 bg-green-500 text-white px-4 py-2 rounded-full shadow"
        >
          Filters
        </button>

        {/* SIDEBAR (UNCHANGED UI) */}
        <div
          className={`
            fixed md:static z-40 bg-white border-r
            w-72 h-full md:h-auto
            transition-transform duration-300
            ${showSidebar ? "translate-x-0" : "-translate-x-full"}
            md:translate-x-0
            hidden md:block
          `}
        >
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="font-semibold text-gray-800">Filters</h2>
            <button onClick={clearFilters} className="text-sm text-green-600">
              Clear All
            </button>
          </div>

          <div className="p-4 space-y-6 overflow-y-auto max-h-[85vh]">
            {/* Categories */}
            <div>
              <h3 className="font-medium text-gray-800 mb-3">Categories</h3>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <label key={cat._id} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={selectedCategory === cat._id}
                      onChange={() => setSelectedCategory(cat._id)}
                      className="accent-green-600"
                    />
                    {cat.name}
                  </label>
                ))}
              </div>
            </div>

            {/* MOQ */}
            <div>
              <h3 className="font-medium text-gray-800 mb-3">Minimum Order (MOQ)</h3>
              <div className="space-y-2 text-sm">
                {["Any Quantity", "Under 25 kg", "25 kg - 100 kg", "Over 100 kg"].map(
                  (item, i) => (
                    <label key={i} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="moq"
                        checked={moq === item}
                        onChange={() => setMoq(item)}
                        className="accent-green-600"
                      />
                      {item}
                    </label>
                  )
                )}
              </div>
            </div>

            {/* Price */}
            <div>
              <h3 className="font-medium text-gray-800 mb-3">Price Range (per kg)</h3>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={priceMin}
                  onChange={(e) => setPriceMin(e.target.value)}
                  placeholder="₹ 0"
                  className="w-full border rounded px-2 py-1 text-sm"
                />
                <input
                  type="number"
                  value={priceMax}
                  onChange={(e) => setPriceMax(e.target.value)}
                  placeholder="₹ 500"
                  className="w-full border rounded px-2 py-1 text-sm"
                />
              </div>
            </div>

            {/* Quality */}
            <div>
              <h3 className="font-medium text-gray-800 mb-3">Quality Grade</h3>
              <div className="space-y-2 text-sm">
                {["Grade A (Premium)", "Grade B (Standard)"].map((q) => (
                  <label key={q} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={quality.includes(q)}
                      onChange={() => {
                        setQuality((prev) =>
                          prev.includes(q)
                            ? prev.filter((i) => i !== q)
                            : [...prev, q]
                        );
                      }}
                      className="accent-green-600"
                    />
                    {q}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* PRODUCTS */}
        <div className="flex-1 p-3 sm:p-4 md:p-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">
            {selectedCategory ? "Filtered Products" : "All Products"}
          </h2>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center text-gray-500 mt-10">
              No products found
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;