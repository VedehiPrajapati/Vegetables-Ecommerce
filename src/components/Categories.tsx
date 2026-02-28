// import { categories } from "@/data/products";
// import { motion } from "framer-motion";

// type Props = {
//   selected: string;
//   onSelect: (id: string) => void;
// };

// const Categories = ({ selected, onSelect }: Props) => {
//   return (
//     <section className="py-10 md:py-14">
//       <div className="container mx-auto px-4 md:px-6">
//         <h2 className="section-title text-center mb-8">Shop by Category</h2>
//         <div className="grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-4">
//           {categories.map((cat, i) => (
//             <motion.button
//               key={cat.id}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: i * 0.08 }}
//               onClick={() => onSelect(selected === cat.id ? "" : cat.id)}
//               className={`flex flex-col items-center gap-2 p-4 md:p-6 rounded-2xl transition-all duration-300 border-2 ${
//                 selected === cat.id
//                   ? "border-primary bg-primary/10 shadow-lg"
//                   : "border-transparent bg-gradient-to-b " + cat.color + " hover:border-primary/30 hover:shadow-md"
//               }`}
//             >
//               <span className="text-3xl md:text-4xl">{cat.emoji}</span>
//               <span className="text-sm font-semibold text-foreground">{cat.name}</span>
//             </motion.button>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Categories;
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import api from "@/services/api";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
  selected: string;
  onSelect: (id: string) => void;
};

// Map backend names to emojis/colors (optional fallback)
const categoryMeta: Record<string, { emoji: string; color: string }> = {
  "Vegetables": { emoji: "🥦", color: "from-green-50 to-emerald-50" },
  "Fruits": { emoji: "🍎", color: "from-red-50 to-orange-50" },
  "Leafy Greens": { emoji: "🥬", color: "from-green-50 to-teal-50" },
  "Exotic": { emoji: "🥑", color: "from-emerald-50 to-green-50" },
  "Root Vegetables": { emoji: "🥔", color: "from-orange-50 to-yellow-50" },
  "Organic": { emoji: "🌿", color: "from-green-50 to-green-100" },
};

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.9 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 120, damping: 14 },
  },
};

const Categories = ({ selected, onSelect }: Props) => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/categories");
        setCategories(response.data.data);
      } catch (error) {
        console.error("Fetch categories error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <section className="py-10 md:py-14">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="section-title text-center mb-8">Shop by Category</h2>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center justify-center gap-3 p-4 md:p-6 rounded-2xl border-2 border-transparent bg-secondary/20 animate-pulse">
                <Skeleton className="w-10 h-10 rounded-full" />
                <Skeleton className="w-16 h-4 rounded-md" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-10 md:py-14">
      <div className="container mx-auto px-4 md:px-6">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="section-title text-center mb-8"
        >
          Shop by Category
        </motion.h2>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-4"
        >
          {categories.map((cat) => {
            const isSelected = selected === cat._id;
            const meta = categoryMeta[cat.name] || { emoji: "🥗", color: "from-gray-50 to-white" };

            return (
              <motion.button
                key={cat._id}
                variants={itemVariants}
                layout
                whileHover={{ y: -6, rotate: -1, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={isSelected ? { scale: 1.1, boxShadow: "0px 15px 35px rgba(0,0,0,0.15)" } : { scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                onClick={() => onSelect(isSelected ? "" : cat._id)}
                className={`relative flex flex-col items-center gap-2 p-4 md:p-6 rounded-2xl border-2 transition-colors ${isSelected
                  ? "border-primary bg-primary/10"
                  : "border-transparent bg-gradient-to-b " + meta.color + " hover:border-primary/30"
                  }`}
              >
                <motion.span
                  animate={{ rotate: isSelected ? 360 : 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-3xl md:text-4xl"
                >
                  {meta.emoji}
                </motion.span>

                <span className="text-sm font-semibold text-foreground">
                  {cat.name}
                </span>

                {isSelected && (
                  <motion.div
                    layoutId="categoryGlow"
                    className="absolute inset-0 rounded-2xl ring-2 ring-primary/40"
                  />
                )}
              </motion.button>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default Categories;
