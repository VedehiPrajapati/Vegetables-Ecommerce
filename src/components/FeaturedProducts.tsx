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

import { useEffect, useState } from "react";
import ProductCard, { ProductCardSkeleton } from "./ProductCard";
import api from "@/services/api";
import type { Product } from "@/data/products";

type Props = {
  selectedCategory: string;
};

const FeaturedProducts = ({ selectedCategory }: Props) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        // Construct URL with optional category filter
        let url = "/products";
        if (selectedCategory) {
          url += `?category=${selectedCategory}`;
        }

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
          organic: true, // Backend doesn't have this yet, defaulting to true for UI
          rating: 4.5,
        }));

        setProducts(mappedProducts);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory]);

  const ITEMS_PER_ROW = 5;
  const visibleProducts = showAll
    ? products
    : products.slice(0, ITEMS_PER_ROW);

  if (loading) {
    return (
      <section className="py-10 md:py-14">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="section-title text-center mb-2">
            {selectedCategory ? "Category Products" : "Featured Products"}
          </h2>
          <p className="text-center text-muted-foreground mb-8">
            Loading fresh produce...
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
            {Array.from({ length: ITEMS_PER_ROW }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-10 text-center text-destructive">
        {error}
      </section>
    );
  }

  return (
    <section className="py-10 md:py-14">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="section-title text-center mb-2">
          {selectedCategory ? "Category Products" : "Featured Products"}
        </h2>

        <p className="text-center text-muted-foreground mb-8">
          Handpicked fresh produce delivered daily
        </p>

        {products.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">
            No products found in this category.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
              {visibleProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {products.length > ITEMS_PER_ROW && (
              <div className="flex justify-center mt-10">
                <button
                  onClick={() => setShowAll((prev) => !prev)}
                  className="px-8 py-2.5 rounded-full bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
                >
                  {showAll ? "View Less" : "View More"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;
