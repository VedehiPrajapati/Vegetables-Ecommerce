// import { products } from "@/data/products";
// import ProductCard from "./ProductCard";

// type Props = {
//   selectedCategory: string;
// };

// const FeaturedProducts = ({ selectedCategory }: Props) => {
//   const filtered = selectedCategory
//     ? products.filter((p) => p.category === selectedCategory)
//     : products;

//   return (
//     <section className="py-10 md:py-14">
//       <div className="container mx-auto px-4 md:px-6">
//         <h2 className="section-title text-center mb-2">
//           {selectedCategory ? "Category Products" : "Featured Products"}
//         </h2>
//         <p className="text-center text-muted-foreground mb-8">
//           Handpicked fresh produce delivered daily
//         </p>
//         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
//           {filtered.map((product) => (
//             <ProductCard key={product.id} product={product} />
//           ))}
//         </div>
//         {filtered.length === 0 && (
//           <p className="text-center text-muted-foreground py-12">No products found in this category.</p>
//         )}
//       </div>
//     </section>
//   );
// };

// export default FeaturedProducts;


// import { useEffect, useState } from "react";
// import ProductCard, { ProductCardSkeleton } from "./ProductCard";
// import api from "@/services/api";
// import type { Product } from "@/data/products";
// import { useNavigate } from "react-router-dom";

// type Props = {
//   selectedCategory: string;
// };

// const FeaturedProducts = ({ selectedCategory }: Props) => {
//   const [products, setProducts] = useState<Product[]>([]);
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [showAll, setShowAll] = useState(false);

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         setLoading(true);
//         setError("");

//         // Construct URL with optional category filter
//         let url = "/products";
//         if (selectedCategory) {
//           url += `?category=${selectedCategory}`;
//         }

//         const res = await api.get(url);
//         const productsArray = res.data.data ?? [];

//         const mappedProducts: Product[] = productsArray.map((p: any) => ({
//           id: p._id,
//           slug: p.slug,
//           name: p.name,
//           price: p.offerPrice,
//           originalPrice: p.originalPrice,
//           category: p.category?.name,
//           image: p.mainImage?.secure_url,
//           unit: p.unit,
//           description: p.description,
//           organic: true, // Backend doesn't have this yet, defaulting to true for UI
//           rating: 4.5,
//         }));

//         setProducts(mappedProducts);
//       } catch (err: any) {
//         setError(err.response?.data?.message || "Failed to load products");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProducts();
//   }, [selectedCategory]);

//   const ITEMS_PER_ROW = 5;
//   const visibleProducts = showAll
//     ? products
//     : products.slice(0, ITEMS_PER_ROW);

//   if (loading) {
//   return (
//     <section id="products" className="py-10 md:py-14">
//       <div className="container mx-auto px-4 md:px-6">

//         {/* Header Skeleton */}
//         <div className="bg-gray-100 rounded-xl p-4 md:p-5 mb-8 animate-pulse">

//           {/* Top Row */}
//           <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

//             {/* Title Skeleton */}
//             <div className="h-6 w-48 bg-gray-300 rounded"></div>

//             {/* View All Skeleton */}
//             <div className="h-5 w-20 bg-gray-300 rounded"></div>
//           </div>

//           {/* Category Pills Skeleton */}
//           <div className="flex gap-2 mt-4 flex-wrap">
//             {Array.from({ length: 4 }).map((_, i) => (
//               <div
//                 key={i}
//                 className="h-7 w-24 bg-gray-300 rounded-full"
//               ></div>
//             ))}
//           </div>
//         </div>

//         {/* Product Grid Skeleton */}
//         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
//           {Array.from({ length: 5 }).map((_, i) => (
//             <ProductCardSkeleton key={i} />
//           ))}
//         </div>

//       </div>
//     </section>
//   );
// }
//   if (error) {
//     return (
//       <section id="products" className="py-10 text-center text-destructive">
//         {error}
//       </section>
//     );
//   }

//   return (
//     <section id="products" className="py-10 md:py-14">
//       <div className="container mx-auto px-4 md:px-6">
//         <div className="bg-gray-100 rounded-xl p-4 md:p-5 mb-8">

//   {/* Top Row */}
//   <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

//     {/* Title + Accent */}
//     <div className="flex items-start gap-3">
//       <div className="w-1 h-10 bg-primary rounded-full mt-1"></div>

//       <h2 className="text-lg md:text-2xl font-semibold text-gray-800">
//         {selectedCategory ? "Category Products" : "Today's Market Rates"}
//       </h2>
//     </div>

//     {/* View All Button */}
//     <button
//       onClick={() => navigate("/products")}
//       className="text-sm font-semibold text-primary flex items-center gap-1 group"
//     >
//       View All
//       <span className="transition-transform duration-300 group-hover:translate-x-1">
//         →
//       </span>
//     </button>
//   </div>

//   {/* Category Pills */}
//   <div className="flex flex-wrap gap-2 mt-4">

//     {/* All Items */}
//     <button
//       onClick={() => navigate("/products")}
//       className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
//         !selectedCategory
//           ? "bg-primary text-white"
//           : "bg-white text-gray-600 border hover:bg-gray-50"
//       }`}
//     >
//       All Items
//     </button>

//     {/* Dynamic Categories */}
//     {["Daily Staples", "Exotic Veggies", "Fresh Fruits"].map((cat) => (
//       <button
//         key={cat}
//         className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
//           selectedCategory === cat
//             ? "bg-primary text-white"
//             : "bg-white text-gray-600 border hover:bg-gray-50"
//         }`}
//       >
//         {cat}
//       </button>
//     ))}
//   </div>
// </div>

//         {products.length === 0 ? (
//           <p className="text-center text-muted-foreground py-12">
//             No products found in this category.
//           </p>
//         ) : (
//           <>
//             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
//               {visibleProducts.map((product) => (
//                 <ProductCard key={product.id} product={product} />
//               ))}
//             </div>

//             {products.length > ITEMS_PER_ROW && (
//               <div className="flex justify-center mt-10">
//                 <button
//                   onClick={() => setShowAll((prev) => !prev)}
//                   className="px-8 py-2.5 rounded-full bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
//                 >
//                   {showAll ? "View Less" : "View More"}
//                 </button>
//               </div>
//             )}
//           </>
//         )}
//       </div>
//     </section>
//   );
// };

// export default FeaturedProducts;


import { useEffect, useState } from "react";
import ProductCard, { ProductCardSkeleton } from "./ProductCard";
import api from "@/services/api";
import type { Product } from "@/data/products";
import { useNavigate } from "react-router-dom";

type Category = { _id: string; name: string };

const FeaturedProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const ITEMS_LIMIT = 5;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/categories");
        setCategories(res.data.data ?? []);
      } catch (err) {
        console.error("Failed to load categories");
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");
        const url = selectedCategory
          ? `/products?category=${selectedCategory._id}`
          : `/products`;
        const res = await api.get(url);
        const productsArray = res.data.data ?? [];
        const mappedProducts: Product[] = productsArray.map((p: any) => ({
          id: p._id,
          slug: p.slug,
          name: p.name,
          price: p.offerPrice,
          originalPrice: p.originalPrice,
          category: p.category?.name,
          image: p.mainImage?.secure_url,
          unit: p.unit,
          description: p.description,
          organic: true,
          rating: 4.5,
        }));
        setProducts(mappedProducts.slice(0, ITEMS_LIMIT));
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [selectedCategory]);

  if (loading) {
    return (
      <section id="products" className="py-6 md:py-14">
        <div className="container mx-auto px-3 md:px-6">
          {/* Skeleton Header */}
          <div className="bg-gray-100 rounded-xl p-3 md:p-5 mb-5 md:mb-8 animate-pulse">
            <div className="flex items-center justify-between gap-3">
              <div className="h-5 w-36 md:h-6 md:w-48 bg-gray-300 rounded" />
              <div className="h-7 w-20 bg-gray-300 rounded-full" />
            </div>
            <div className="flex gap-2 mt-3 flex-nowrap overflow-hidden">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-7 w-20 flex-shrink-0 bg-gray-300 rounded-full" />
              ))}
            </div>
          </div>
          {/* Skeleton Grid — 2 cols on mobile, 5 on large */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 md:gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="products" className="py-8 text-center text-destructive text-sm px-4">
        {error}
      </section>
    );
  }

  return (
    <section id="products" className="py-6 md:py-14">
      <div className="container mx-auto px-3 md:px-6">

        {/* Header Card */}
        <div className="bg-gray-100 rounded-xl pl-1 pr-3 py-3 md:pl-2 md:pr-5 md:py-5 mb-5 md:mb-8">

          {/* Title Row */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-1 h-7 md:h-10 bg-primary rounded-full flex-shrink-0" />
              <h2 className="text-base md:text-2xl font-semibold text-gray-800 truncate leading-tight">
                {selectedCategory ? selectedCategory.name : "Today's Market Rates"}
              </h2>
            </div>

            {/* View All button — compact on mobile */}
            <button
              onClick={() =>
                navigate(
                  selectedCategory
                    ? `/products?category=${selectedCategory._id}`
                    : "/products"
                )
              }
              className="group flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-primary/30 bg-white hover:bg-primary hover:border-primary transition-all duration-200 shadow-sm"
            >
              <span className="text-xs md:text-sm font-medium text-primary group-hover:text-white transition-colors duration-200 whitespace-nowrap">
                View All
              </span>
              <span className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-primary/10 group-hover:bg-white/20 flex items-center justify-center transition-all duration-200 group-hover:translate-x-0.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-3 h-3 md:w-3.5 md:h-3.5 text-primary group-hover:text-white transition-colors duration-200"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </button>
          </div>

          {/* Category Pills — horizontally scrollable on mobile, wrapping on desktop */}
          <div className="flex gap-1.5 md:gap-2 mt-3 md:mt-4 overflow-x-auto md:flex-wrap pb-0.5 md:pb-0 scrollbar-hide -mx-3 px-3 md:mx-0 md:px-0">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`flex-shrink-0 px-3 py-1 md:px-3 md:py-1.5 rounded-full text-xs font-medium transition whitespace-nowrap ${
                !selectedCategory
                  ? "bg-primary text-white"
                  : "bg-white text-gray-600 border hover:bg-gray-50"
              }`}
            >
              All Items
            </button>

            {categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => setSelectedCategory(cat)}
                className={`flex-shrink-0 px-3 py-1 md:px-3 md:py-1.5 rounded-full text-xs font-medium transition whitespace-nowrap ${
                  selectedCategory?._id === cat._id
                    ? "bg-primary text-white"
                    : "bg-white text-gray-600 border hover:bg-gray-50"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <p className="text-center text-muted-foreground text-sm py-10">
            No products found in this category.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 md:gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;